import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { Organization, RuleEntity } from "../../../../src/entity";
import { RuleSet } from "../../../entity/RuleSet";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import {
  addDistinctRulesToRuleSets,
  retrievePaginationValues,
  formWhereConditionForArrayMatch,
  hasSqlInjectionCharacters,
  isValidString
} from "../../common/utils/utils";
import { validationDecorator } from "../../common/validations/Validations";
import { COMPARISON_TYPE, ENTITY_NAME } from "../../common/constants";

import { validateRules, validateRulesFromRuleset } from "@walkinserver/walkin-rewardx/src/modules/common/utils/RuleUtils";


@Injectable()
export class RuleSetProvider {
  public async createRuleSet(
    entityManager: EntityManager,
    injector,
    input: any
  ): Promise<RuleSet> {
    const organizationId = input.organizationId;
    const name = input.name;
    const rules = input.rules;

    if(!isValidString(name)) {
      throw new WCoreError(WCORE_ERRORS.RULE_SET_NAME_NOT_VALID)
    }

    const validationPromises = [];
    validationPromises.push(
      Organization.availableById(entityManager, organizationId)
    );
    if (name) {
      validationPromises.push(
        (async (entityManager, name) => {
          const queryRunner = await entityManager.connection.createQueryRunner();
          const result = await queryRunner.manager.query(
            `select * from rule_set where name='${name}'`
          );
          queryRunner.release();
          if (result.length) {
            return {
              HTTP_CODE: 500,
              MESSAGE: `Rule set ${name} already exists`,
              CODE: "RCAE"
            };
          }
          return true;
        })(entityManager, name)
      );
    }
    //We are checking whether the rules that we are trying to add actually exist and part of the organization
    if(rules && rules.length>=1)
    {
      validationPromises.push(
        (async (entityManager, rules) => {
          return await validateRules(entityManager, injector, rules, organizationId);
        }
        )(entityManager,rules)
      );
    }

    const createRuleSetPromise = async () => {
      const queryRunner = await entityManager.connection.createQueryRunner();
      const isInsertedData = await queryRunner.manager.query(
        `INSERT INTO rule_set (
                name,
                description,
                organization_id,
                rules
            ) VALUES (
                '${name}',
                ${input.description ? `'${input.description}'` : null},
                '${organizationId}',
                ${input.rules ? `"${JSON.stringify(input.rules)}"` : null}
            );`
      );
      queryRunner.release();
      if (isInsertedData) {
        let res = await RuleSet.findOne({
          where: { id: isInsertedData.insertId },
          relations: ["organization"]
        });
        return res;
      }
    };
    return validationDecorator(createRuleSetPromise, validationPromises);
  }

  public async updateRuleSet(
    entityManager: EntityManager,
    injector,
    input: any
  ): Promise<RuleSet> {
    const organizationId = input.organizationId;
    const name = input.name;
    const ruleSetId = input.id;
    const addRules = input.addRules;
    const removeRules = input.removeRules;

    let currentRules = [];

    const validationPromises = [];
    validationPromises.push(
      Organization.availableById(entityManager, organizationId)
    );
    
    // General validation whether the rule ids passed are actually existing and belongs to the organization logged in.
    if((addRules && addRules.length>=1)||(removeRules && removeRules.length>=1))
    {
      let rules = [];
      rules = rules.concat(addRules || [], removeRules || []);

      validationPromises.push(
        (async (entityManager, rules) => {
          return await validateRules(entityManager, injector, rules, organizationId);
        }
        )(entityManager,rules)
      );
    }

    // passed ids should actually be part of this ruleSet
    if(removeRules && removeRules.length>=1)
    {
      let rules = [];
      rules = removeRules;

      validationPromises.push(
        (async (entityManager, rules) => {
         return await validateRulesFromRuleset(entityManager, injector, rules, ruleSetId);

        }
        )(entityManager,rules)
      );
    }

    if((Object.prototype.hasOwnProperty.call(input,"name")) && !isValidString(name)) {
      throw new WCoreError(WCORE_ERRORS.RULE_SET_NAME_NOT_VALID)
    }

    if (ruleSetId) {
      const queryRunner = await entityManager.connection.createQueryRunner();
      const result = await queryRunner.manager.query(
        `select * from rule_set where id='${ruleSetId}'`
      );
      queryRunner.release();
      if (result && result.length) {
        currentRules = JSON.parse(result[0].rules);
      } else {
        throw new WCoreError({
          HTTP_CODE: 500,
          MESSAGE: `Rule set ${name} does not exists`,
          CODE: "RCAE"
        });
      }
    } else {
      throw new WCoreError(WCORE_ERRORS.RULE_SET_ID_NOT_FOUND);
    }
    if (input.addRules && input.addRules.length) {
      for (let i = 0; i < input.addRules.length; i++) {
        const ruleId = input.addRules[i];
        if (currentRules.indexOf(ruleId) == -1) {
          currentRules.push(ruleId);
        }
      }
    }
    if (input.removeRules && input.removeRules.length) {
      for (let i = 0; i < input.removeRules.length; i++) {
        const ruleId = input.removeRules[i];
        const indexToRemove = currentRules.indexOf(ruleId);
        if (indexToRemove != -1) {
          currentRules.splice(indexToRemove, 1);
        }
      }
    }
    const createRuleConditonPromise = async () => {
      const queryRunner = await entityManager.connection.createQueryRunner();
      
      const updateFields = [];
      
      if (input.name) {
        updateFields.push(`name = "${input.name}"`);
      }
      
      if (input.description) {
        updateFields.push(`description = "${input.description}"`);
      }
      
      if ((input.addRules && currentRules?.length)|| ( input.removeRules)) {
        
        updateFields.push(`rules = "${JSON.stringify(currentRules)}"`);
      }

      if(updateFields.length == 0)
      {
        throw new WCoreError(WCORE_ERRORS.RULE_SET_NO_FIELDS);
      }
      
      const updateQuery = `
        UPDATE rule_set SET ${updateFields.join(', ')} WHERE id = ${ruleSetId};
      `;
      
      const isInsertedData = await queryRunner.manager.query(updateQuery);

      queryRunner.release();
      if (isInsertedData) {
        let res = await RuleSet.findOne({
          where: { id: ruleSetId },
          relations: ["organization"]
        });
        return res;
      }
    };
    return validationDecorator(createRuleConditonPromise, validationPromises);
  }

  public async getRuleSetById(entityManager: EntityManager, input: any) {
    const ruleSet = await entityManager
      .getRepository(RuleSet)
      .createQueryBuilder("ruleSet")
      .select("ruleSet.id")
      .addSelect("ruleSet.rules")
      .where("ruleSet.id =:id", { id: input.id })
      .getOne();
    return ruleSet;
  }

  public async getRuleSets(entityManager: EntityManager, input: any) {
    try {
      const ruleSets = await entityManager.find(RuleSet, {
        where: { ...input },
        relations: ["organization"]
      });
      return ruleSets;
    } catch (err) {
      throw err;
    }
  }

  public async getRuleSetsForOrganization(
    entityManager: EntityManager,
    input: any
  ) {
    if (!input.organizationId) {
      throw new WCoreError(WCORE_ERRORS.RULE_SET_ORGANIZATION_ID_NOT_FOUND);
    }

    let whereCondition = `where organization_id="${input.organizationId}" `;

    if (input.name) {
      if (
        !isValidString(input.name) ||
        hasSqlInjectionCharacters(
          ENTITY_NAME.RULE_SET,
          COMPARISON_TYPE.EQUAL_TO,
          input.name
        )
      ) {
        throw new WCoreError(WCORE_ERRORS.RULE_SET_NAME_PROVIDED_IS_WRONG);
      } else {
        whereCondition += ` and name="${input.name}" `;
      }
    }

    if (input.includedRules) {
      const includedRulesArray =
        typeof input.includedRules == "string"
          ? input.includedRules.split(",")
          : input.includedRules;
      if (includedRulesArray.length >= 1) {
        whereCondition += formWhereConditionForArrayMatch(includedRulesArray);
      }
    }

    if (input.ruleSetIds) {
      let ruleSetIdArray =
        typeof input.ruleSetIds == "string"
          ? input.ruleSetIds.split(",")
          : input.ruleSetIds;
      if (ruleSetIdArray.length >= 1) {
        ruleSetIdArray = "(" + ruleSetIdArray.join(",") + ")";

        whereCondition += ` and id IN ${ruleSetIdArray} `;
      }
    }

    const { skip, take } = retrievePaginationValues(input);

    const joinCondition = `FIND_IN_SET(r.id , REPLACE(REPLACE(rs.rules, '[', ''), ']', '')) > 0 and r.organization_id = "${input.organizationId}"`;
    const ruleSetColumns = `rs.id ,rs.name ,rs.description ,rs.organization_id `;
    const ruleColumns = `JSON_OBJECT('id', r.id,'name', r.name,'description',r.description ) as rules`;
    const paginationValues = `LIMIT ${take} OFFSET ${skip}`;

    const queryRunner = await entityManager.connection.createQueryRunner();

    const subQuery = `SELECT id, name, description,organization_id,rules from rule_set ${whereCondition} ${paginationValues} `;

    const ruleSets = await queryRunner.manager.query(
      `SELECT ${ruleSetColumns},${ruleColumns} FROM ( ${subQuery} )AS rs left JOIN rule AS r ON ${joinCondition} `
    );

    // We are combining the distinct rules to respective ruleSet objects
    const results = addDistinctRulesToRuleSets(ruleSets);
    queryRunner.release();

    return results;
  }

  public async deleteRuleSet(entityManager: EntityManager, { ruleSetId , organizationId}: any) {
    const queryRunner = await entityManager.connection.createQueryRunner();
    const result = await queryRunner.manager.query(
      `delete from rule_set where id=${ruleSetId} and organization_id="${organizationId}"`
    );
    queryRunner.release();
    if (result && result.affectedRows == 1) {
      return true;
    }
    return false;
  }

  public async getRulesFromRuleSet(entityManager, ruleSetId: string)
  {
    const queryRunner = await entityManager.connection.createQueryRunner();

    const result = await queryRunner.manager.query(
      `SELECT rules FROM rule_set where id = ${ruleSetId} ` 
    );
    
    return result;
  }

}
