/* eslint-disable indent */
import { Injectable, Injector } from "@graphql-modules/di";
import checkTypes from "check-types";
import jexl from "jexl";
import { EntityManager } from "typeorm";
import { Organization, Application } from "../../../../src/entity";
import { Rule, RuleAttribute } from "../../../entity";
import {
  ALLOWED_EXPRESSIONS,
  MATHEMATICAL_EXPRESSIONS,
  RULE_TYPE,
  STATUS,
  VALUE_TYPE,
  StatusEnum,
  RULE_TYPEEnum,
  CACHING_KEYS,
  EXPIRY_MODE,
  CACHING_PERIOD
} from "../../common/constants";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { frameDynamicSQLFromJexl, isValidString } from "../../common/utils/utils";
import { WCoreError } from "../../common/exceptions";
import { WalkinPlatformError } from "../../common/exceptions/walkin-platform-error";
import { RuleConditionProvider } from "./rule-condition.provider";
import { RuleEffectProvider } from "./rule-effect.provider";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
@Injectable()
export class RuleProvider {
  public async getSQLFromRule(rule: Rule) {
    const condition = await frameDynamicSQLFromJexl(rule.ruleConfiguration);
    return {
      SQL: condition
    };
  }

  public async processNestedRules(
    transactionalEntityManager: EntityManager,
    nestedRules: any,
    organization: Organization
  ): Promise<any> {
    const entityManager = transactionalEntityManager;
    let ruleExpression = "( ";
    if (typeof nestedRules === "string") {
      nestedRules = JSON.parse(nestedRules);
    }
    for (let i = 0; nestedRules.rules && i < nestedRules.rules.length; i++) {
      if ("rules" in nestedRules.rules[i]) {
        ruleExpression =
          ruleExpression +
          (await this.processNestedRules(
            entityManager,
            nestedRules.rules[i],
            organization
          ));
      } else {
        const eachConfiguration = nestedRules.rules[i];
        let ruleAtrribute = null;
        if (eachConfiguration.ruleAttributeId) {
          ruleAtrribute = await entityManager.findOne(RuleAttribute, {
            where: {
              id: eachConfiguration.ruleAttributeId,
              organization
            },
            relations: ["ruleEntity"]
          });
        } else if (eachConfiguration.attributeName) {
          ruleAtrribute = await entityManager.findOne(RuleAttribute, {
            where: {
              attributeName: eachConfiguration.attributeName,
              organization
            },
            relations: ["ruleEntity"]
          });
        }
        if (!ruleAtrribute || ruleAtrribute.status !== STATUS.ACTIVE) {
          throw new Error("Invalid ruleAttributeId provided.");
        }

        // TODO: Is this test required? It shouldn't matter as of now
        // as its an added test
        const ruleEntity = ruleAtrribute.ruleEntity;
        if (!ruleEntity || ruleEntity.status !== STATUS.ACTIVE) {
          throw new Error("Invalid Rule Entity provided.");
        }

        if (ruleAtrribute && ruleAtrribute.status === STATUS.ACTIVE) {
          let value;
          switch (ruleAtrribute.attributeValueType) {
            case VALUE_TYPE.NUMBER:
              value = Number(eachConfiguration.attributeValue);
              const isNumber = checkTypes.number(value);
              if (!isNumber) {
                throw new Error("Invalid type. number required.");
              }
              break;
            case VALUE_TYPE.STRING:
              value = eachConfiguration.attributeValue;
              const isString = checkTypes.string(value);
              if (!isString) {
                throw new Error("Invalid type. String required.");
              }
              break;
            case VALUE_TYPE.BOOLEAN:
              if (eachConfiguration.attributeValue.toLowerCase() === "true") {
                value = true;
              } else if (
                eachConfiguration.attributeValue.toLowerCase() === "false"
              ) {
                value = false;
              } else {
                throw new Error("Invalid type. boolean required.");
              }
              break;
            case VALUE_TYPE.OBJECT:
              value = eachConfiguration.attributeValue;
              const isObject = checkTypes.object(
                eachConfiguration.attributeValue
              );
              if (!isObject) {
                throw new Error("Invalid type. Object required.");
              }
              break;
            case VALUE_TYPE.ARRAY:
              value = eachConfiguration.attributeValue;
              const isArray = checkTypes.array(
                eachConfiguration.attributeValue
              );
              if (!isArray) {
                throw new Error("Invalid type. Array required.");
              }
              break;
            default:
              throw new Error("Invalid type. value required.");
          }
          eachConfiguration.attributeValue = value;
          eachConfiguration.attributeEntityName = ruleEntity.entityName;
          eachConfiguration.attributeName = ruleAtrribute.attributeName;
          // tslint:disable-next-line:no-shadowed-variable
          const jexl = await this.giveValidJEXLExpression(
            entityManager,
            eachConfiguration,
            ruleAtrribute.attributeValueType
          );

          if (nestedRules.combinator.toLowerCase() === "and") {
            // tslint:disable-next-line:prefer-conditional-expression
            if (i === nestedRules.rules.length - 1) {
              ruleExpression = ruleExpression + jexl;
            } else {
              ruleExpression = ruleExpression + jexl + " && ";
            }
          } else if (nestedRules.combinator.toLowerCase() === "or") {
            // tslint:disable-next-line:prefer-conditional-expression
            if (i === nestedRules.rules.length - 1) {
              ruleExpression = ruleExpression + jexl;
            } else {
              ruleExpression = ruleExpression + jexl + " || ";
            }
          } else {
            throw new WalkinPlatformError(
              "IVA",
              "AE",
              {
                attributeName: eachConfiguration.attributeName
              },
              400
            );
          }
        } else if (ruleAtrribute && ruleAtrribute.status === STATUS.INACTIVE) {
          throw new WalkinPlatformError(
            "Invalid_COMBINATOR",
            "combinator",
            {
              attributeName: eachConfiguration.attributeName
            },
            400
          );
        } else {
          throw new Error("AttributeNot found.");
        }
      }
    }
    return ruleExpression + ")";
  }
  public async createRule(
    transactionalEntityManager: EntityManager,
    injector: Injector,
    ruleDetails: any
  ): Promise<Rule> {
    const entityManager = transactionalEntityManager;
    const organization = await entityManager.findOne(Organization, {
      where: { id: ruleDetails.organizationId }
    });
    if (organization === undefined || organization.status === STATUS.INACTIVE) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }

    if(!isValidString(ruleDetails.name))
    {
      throw new WCoreError(WCORE_ERRORS.RULE_NAME_NOT_VALID)
    }

    const rulename = await entityManager.findOne(Rule, {
      where: {
        name: ruleDetails.name,
        organization: ruleDetails.organizationId
      }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    if (rulename && organization) {
      throw new WCoreError(WCORE_ERRORS.RULE_EXIST_WITH_ORGANIZATION);
    }
    ruleDetails.organization = organization;

    const ruleExpression = {
      expressions: []
    };
    ruleDetails.type = ruleDetails.type ? ruleDetails.type : RULE_TYPE.SIMPLE;
    if (ruleDetails.type === RULE_TYPE.SIMPLE) {
      if (!ruleDetails.ruleConfiguration) {
        // throw new WCoreError(WCORE_ERRORS.RULE_CONFIGURATION_NOT_FOUND);
        const finalExpression = await this.processNestedRules(
          entityManager,
          ruleDetails.ruleConfiguration,
          organization
        );
        ruleExpression.expressions.push(finalExpression);
      }
    } else {
      ruleDetails.type = RULE_TYPE.CUSTOM;
      ruleDetails.ruleConfiguration = "";
      if (!ruleDetails.ruleExpression) {
        // throw new WCoreError(WCORE_ERRORS.RULE_EXPRESSION_NOT_FOUND);
        ruleExpression.expressions.push(ruleDetails.ruleExpression);
      }
      // FIXME: We need to validate the expression to be a valid JEXL expression
    }
    if (
      ruleExpression &&
      ruleExpression.expressions &&
      ruleExpression.expressions.length
    )
      ruleDetails.ruleExpression = ruleExpression;

    if (ruleDetails.ruleConditionIds && ruleDetails.ruleConditionIds.length) {
      ruleDetails.conditions = [];
      for (let i = 0; i < ruleDetails.ruleConditionIds.length; i++) {
        let condition = await injector
          .get(RuleConditionProvider)
          .getRuleConditionByIdAndOrganization(entityManager, ruleDetails.ruleConditionIds[i], ruleDetails.organizationId);
        
        if(!condition){
          throw new WCoreError(WCORE_ERRORS.RULE_CONDITION_NOT_VALID);
        }
          ruleDetails.conditions.push(condition);
      }
    }
    if (ruleDetails.ruleEffectIds && ruleDetails.ruleEffectIds.length) {
      ruleDetails.effects = [];
      for (let i = 0; i < ruleDetails.ruleEffectIds.length; i++) {
        let effect = await injector
          .get(RuleEffectProvider)
          .getRuleEffectByIdAndOrganization(entityManager, ruleDetails.ruleEffectIds[i],  ruleDetails.organizationId);
        
        if(!effect){
          throw new WCoreError(WCORE_ERRORS.RULE_EFFECT_NOT_VALID);
        }
          ruleDetails.effects.push(effect);
      }
    }
    const rule = await entityManager.create(Rule, ruleDetails);
    const savedRule: any = await entityManager.save(rule);
    const key = `${CACHING_KEYS.RULE}_${savedRule.id}`;
    await setValueToCache(
      key,
      savedRule,
      EXPIRY_MODE.EXPIRE,
      CACHING_PERIOD.MEDIUM_CACHING_PERIOD
    );
    return savedRule;
  }

  public async updateRule(
    transactionalEntityManager: EntityManager,
    injector: Injector,
    id: string,
    ruleDetails: any
  ): Promise<Rule> {
    const entityManager = transactionalEntityManager;
    const rule = await entityManager.findOne(Rule, {
      where: { id },
      relations: ["organization"]
    });

    if (!rule) {
      throw new Error("Invalid ruleId provided.");
    }
    const ruleExpression = {
      expressions: []
    };

    if(( Object.prototype.hasOwnProperty.call(ruleDetails,'name') ) && !isValidString(ruleDetails.name))
    {
      throw new WCoreError(WCORE_ERRORS.RULE_NAME_NOT_VALID)
    }

    rule.name = ruleDetails.name ? ruleDetails.name : rule.name;
    rule.description = ruleDetails.description
      ? ruleDetails.description
      : rule.description;
    rule.type = ruleDetails.type ? ruleDetails.type : rule.type;
    rule.ruleConfiguration = ruleDetails.ruleConfiguration
      ? ruleDetails.ruleConfiguration
      : rule.ruleConfiguration;

    let finalExpression;
    if (rule.type === RULE_TYPE.SIMPLE) {
      if (ruleDetails.ruleConfiguration) {
        finalExpression = await this.processNestedRules(
          entityManager,
          ruleDetails.ruleConfiguration,
          rule.organization
        );
        ruleExpression.expressions.push(finalExpression);
        rule.ruleExpression = ruleExpression;
      }
    } else {
      rule.ruleConfiguration = "";
      if (ruleDetails.ruleExpression) {
        ruleExpression.expressions.push(ruleDetails.ruleExpression);
        rule.ruleExpression = ruleExpression;
      }
    }

    if (ruleDetails.ruleConditionIds && ruleDetails.ruleConditionIds.length) {
      ruleDetails.conditions = [];
      for (let i = 0; i < ruleDetails.ruleConditionIds.length; i++) {
        let condition = await injector
          .get(RuleConditionProvider)
          .getRuleConditionByIdAndOrganization(entityManager, ruleDetails.ruleConditionIds[i], ruleDetails.organizationId);

        if(!condition){
          throw new WCoreError(WCORE_ERRORS.RULE_CONDITION_NOT_VALID);
        }
          ruleDetails.conditions.push(condition);
      }
      rule.conditions = ruleDetails.conditions;
    }
    if (ruleDetails.ruleEffectIds && ruleDetails.ruleEffectIds.length) {
      ruleDetails.effects = [];
      for (let i = 0; i < ruleDetails.ruleEffectIds.length; i++) {
        let effect = await injector
          .get(RuleEffectProvider)
          .getRuleEffectByIdAndOrganization(entityManager, ruleDetails.ruleEffectIds[i], ruleDetails.organizationId);
          
        if(!effect){
          throw new WCoreError(WCORE_ERRORS.RULE_EFFECT_NOT_VALID);
        }
        
          ruleDetails.effects.push(effect);
      }
      rule.effects = ruleDetails.effects;
    }
    const savedRule = await entityManager.save(rule);
    const keys = [`${CACHING_KEYS.RULE}_${savedRule.id}`];
    await removeValueFromCache(keys);
    return savedRule;
  }

  public async giveValidJEXLExpression(
    transactionalEntityManager: EntityManager,
    ruleConfiguration: any,
    attributeValueType: any
  ): Promise<any> {
    const {
      expressionType,
      attributeValue,
      attributeName,
      attributeEntityName
    } = ruleConfiguration;
    switch (attributeValueType) {
      case VALUE_TYPE.NUMBER:
        if (ALLOWED_EXPRESSIONS.NUMBER.indexOf(expressionType) === -1) {
          throw new Error(
            `Allowed expressions for ${attributeValueType} ara ${Object.values(
              ALLOWED_EXPRESSIONS.NUMBER
            )}`
          );
        }

        break;
      case VALUE_TYPE.STRING:
        if (ALLOWED_EXPRESSIONS.STRING.indexOf(expressionType) === -1) {
          throw new Error(
            `Allowed expressions for ${attributeValueType} ara ${Object.values(
              ALLOWED_EXPRESSIONS.STRING
            )}`
          );
        }
        break;
      case VALUE_TYPE.BOOLEAN:
        if (ALLOWED_EXPRESSIONS.BOOLEAN.indexOf(expressionType) === -1) {
          throw new Error(
            `Allowed expressions for ${attributeValueType} ara ${Object.values(
              ALLOWED_EXPRESSIONS.BOOLEAN
            )}`
          );
        }
        break;
      case VALUE_TYPE.OBJECT:
        if (ALLOWED_EXPRESSIONS.OBJECT.indexOf(expressionType) === -1) {
          throw new Error(
            `Allowed expressions for ${attributeValueType} ara ${Object.values(
              ALLOWED_EXPRESSIONS.OBJECT
            )}`
          );
        }
        break;
      case VALUE_TYPE.ARRAY:
        if (ALLOWED_EXPRESSIONS.ARRAY.indexOf(expressionType) === -1) {
          throw new Error(
            `Allowed expressions for ${attributeValueType} ara ${Object.values(
              ALLOWED_EXPRESSIONS.ARRAY
            )}`
          );
        }
        break;
      default:
        throw new Error("Invalid type. value required.");
    }
    const newAttributeValue =
      attributeValueType === VALUE_TYPE.STRING
        ? "'" + attributeValue + "'"
        : attributeValue;

    const expression =
      MATHEMATICAL_EXPRESSIONS[expressionType] === "IN"
        ? `${attributeEntityName}['${attributeName}'] ${MATHEMATICAL_EXPRESSIONS[expressionType]} ( ${newAttributeValue} )`
        : `${attributeEntityName}['${attributeName}'] ${MATHEMATICAL_EXPRESSIONS[expressionType]} ${newAttributeValue}`;

    return expression;
  }

  public async disableRule(
    transactionalEntityManager: EntityManager,
    id: string
  ): Promise<Rule> {
    const entityManager = transactionalEntityManager;
    const rule = await entityManager.findOne(Rule, id);

    if (rule && rule.status === STATUS.ACTIVE) {
      const updatedrRuleAttribute = await entityManager.update(
        Rule,
        {
          id: rule.id
        },
        {
          status: StatusEnum.INACTIVE
        }
      );
      const updatedResult = await entityManager.findOne(Rule, id);
      const keys = [`${CACHING_KEYS.RULE}_${updatedResult.id}`];
      await removeValueFromCache(keys);
      return updatedResult;
    } else if (rule && rule.status === STATUS.INACTIVE) {
      throw new Error("Rule is already inactive.");
    } else {
      throw new Error("Rule not found");
    }
  }

  public async rules(
    transactionalEntityManager: EntityManager,
    status: string,
    organizationId: string
  ): Promise<Rule[]> {
    const entityManager = transactionalEntityManager;

    if(!status){
      status = STATUS.ACTIVE
    }
    
    const rules = await entityManager.find(Rule, {
      where: {
        status: status,
        organization: organizationId
      },
      relations: ["organization", "conditions", "effects"]
    });
    return rules;
  }

  public async rule(
    entityManager: EntityManager,
    id: string,
    organizationId?: string
  ): Promise<Rule> {
    if (!id) {
      throw new WCoreError(WCORE_ERRORS.RULE_ID_NOT_PASSED);
    }

    const key = `${CACHING_KEYS.RULE}_${id}`;
    let rule: any = await getValueFromCache(key);
    if (!rule) {
      let whereCondition = "rule.id =:id";
      let whereConditionVariables = {
        id
      };

      if (organizationId) {
        whereCondition += " AND rule.organization =:organizationId";
        whereConditionVariables["organizationId"] = organizationId;
      }

      rule = await entityManager
        .getRepository(Rule)
        .createQueryBuilder("rule")
        .leftJoin("rule.conditions", "conditions")
        .leftJoin("rule.effects", "effects")
        .leftJoin("conditions.ruleEntity", "conditionRuleEntity")
        .leftJoin("conditions.ruleAttribute", "conditionRuleAttribute")
        // .leftJoin("effects.ruleEntity", "effectRuleEntity")
        // .leftJoin("effects.ruleAttribute", "effectRuleAttribute")
        .select([
          "rule.id",
          "rule.name",
          "rule.description",
          "rule.status",
          "conditions.id",
          "conditions.name",
          "conditions.type",
          "conditions.valueType",
          "conditions.value",
          "conditions.transforms",
          "conditionRuleAttribute.attributeName",
          "conditionRuleEntity.entityCode",
          "effects.id",
          "effects.description",
          "effects.type",
          "effects.value",
          "effects.transforms"
        ])
        .where(whereCondition, whereConditionVariables)
        .getOne();

      if (rule) {
        await setValueToCache(
          key,
          rule,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.MEDIUM_CACHING_PERIOD
        );
        console.log(
          "Fetched rule from Database and added to Cache with key :",
          key
        );
      }
    } else {
      console.log("Fetched rule from Cache with key :", key);
    }
    return rule;
  }

  public async ruleByName(
    transactionalEntityManager: EntityManager,
    name: string,
    organizationId: string
  ): Promise<Rule> {
    const entityManager = transactionalEntityManager;
    const rule = await entityManager.findOne(Rule, {
      where: {
        name: name,
        organization: organizationId
      },
      relations: [
        "organization",
        "conditions",
        "effects",
        "conditions.ruleEntity",
        "conditions.ruleAttribute",
        "effects.ruleEntity",
        "effects.ruleAttribute"
      ]
    });
    return rule;
  }

  public async evaluateRule(
    transactionalEntityManager: EntityManager,
    { data, organizationId, ruleId, ruleName }: IEvalRuleInput
  ): Promise<{
    id: string;
    name?: string;
    description?: string;
    status?: StatusEnum;
    type?: RULE_TYPEEnum;
    ruleConfiguration?: object;
    ruleExpression?: object;
    evaluationResult?: object;
    organization?: Organization;
  }> {
    const entityManager = transactionalEntityManager;

    try {
      let rule: Rule;
      if (ruleId) {
        rule = await entityManager.findOneOrFail(Rule, ruleId, {
          relations: ["organization"],
          cache: true
        });
      } else {
        rule = await entityManager.findOneOrFail(Rule, {
          where: { name: ruleName, organization: organizationId },
          relations: ["organization"],
          cache: true
        });
      }

      if (rule && rule.status === STATUS.ACTIVE) {
        const expressions = rule.ruleExpression.expressions; // "Organization['isActive']==='true'"

        const input = typeof data === "string" ? JSON.parse(data) : data;

        jexl.addTransform("toUpperCase", val => val.toUpperCase());
        jexl.addTransform("toLowerCase", val => val.toLowerCase());
        jexl.addTransform("floor", async val => Math.floor(val));
        jexl.addTransform("length", val => val.length);
        jexl.addTransform("filter", async (children, expression) => {
          const filteredChildren = [];
          for (const child of children) {
            await jexl.eval(expression, child).then(res => {
              if (res === true) {
                filteredChildren.push(child);
              }
            });
          }
          return filteredChildren;
        });
        jexl.addTransform("total", async (children, expression) => {
          let total = 0;
          for (const child of children) {
            const i = await jexl.eval(expression, child);
            total += i;
          }
          return total;
        });
        const evaluationResult = await jexl.eval(expressions[0], input);
        const {
          id,
          organization,
          description,
          name,
          ruleConfiguration,
          ruleExpression,
          status,
          type
        } = rule;
        return {
          id,
          description,
          evaluationResult,
          name,
          organization,
          ruleConfiguration,
          ruleExpression,
          status,
          type
        };
      } else {
        throw new Error(
          "Rule with given name " + ruleName + " not found or inactive."
        );
      }
    } catch (err) {
      throw err;
    }
  }

  public async getRulesFromList(entityManager,  rules,  organizationId){
    const queryRunner = await entityManager.connection.createQueryRunner();

    const rulesArray = "(" + rules.join(",") + ")";
    const result = await queryRunner.manager.query(
      `select id from rule where id in ${rulesArray} and organization_id = '${organizationId}'`
    );

    return result;
  }
}
/**
 * Use either the rulename and organizationId combination
 * or
 * use the ruleId
 */
interface IEvalRuleInput {
  /**
   * Use either the rulename and organizationId combination
   * or
   * use the ruleId
   */
  ruleName?: string;
  organizationId?: string;
  data: any;
  /**
   * Use either the rulename and organizationId combination
   * or
   * use the ruleId
   */
  ruleId?: string;
}
