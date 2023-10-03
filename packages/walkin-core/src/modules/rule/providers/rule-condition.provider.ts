import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { Organization, RuleEntity } from "../../../entity";
import { RuleAttribute } from "../../../entity";
import { RuleCondition } from "../../../entity/Condition";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { isValidString } from "../../common/utils/utils";
import { validationDecorator } from "../../common/validations/Validations";
import { duplicateTransforms, validateTransforms } from "@walkinserver/walkin-rewardx/src/modules/common/utils/RuleUtils";
import { ENTITY_NAME } from "../../common/constants";

@Injectable()
export class RuleConditionProvider {
  public async createRuleCondition(
    entityManager: EntityManager,
    input: any
  ): Promise<RuleCondition> {
    const organizationId = input.organizationId;
    const conditionName = input.name;
    const ruleEntityId = input.ruleEntityId;
    const ruleAttributeId = input.ruleAttributeId;
   
    let transforms = input.transforms;
    const validationPromises = [];
    validationPromises.push(
      Organization.availableById(entityManager, organizationId)
    );

    if( transforms )
    {
      await validateTransforms(transforms);
      /*
        Replacing single quotes (') with 2 single quotes ('') so that we can enter the 
        string into the db 
      */
      transforms=JSON.stringify(transforms).replace(/'/g, "''");
    }



    if( !isValidString(conditionName) ) {
      throw new WCoreError(WCORE_ERRORS.RULE_CONDITION_NAME_NOT_VALID)
    }

    if ((!ruleEntityId || !ruleAttributeId) && input.type!='CUSTOM_EXPRESSION') {
      throw new WCoreError(
        WCORE_ERRORS.RULE_ENTITY_AND_RULE_ATTRIBUTE_NOT_FOUND
      );
    }
    if (ruleEntityId)
      validationPromises.push(
        RuleEntity.availableByIdForOrganization(entityManager, ruleEntityId, organizationId)
      );
    if (ruleAttributeId)
      validationPromises.push(
        RuleAttribute.availableByIdForOrganization(entityManager, ruleAttributeId,  organizationId)
      );
    if (conditionName) {
      validationPromises.push(
        (async (entityManager, name) => {
          const queryRunner = await entityManager.connection.createQueryRunner();
          const result = await queryRunner.manager.query(
            `select * from rule_condition where name='${name}' and organization_id="${organizationId}" `
          );
          queryRunner.release();
          if (result.length) {
            return {
              HTTP_CODE: 500,
              MESSAGE: `Rule condition ${name} already exists`,
              CODE: "RCAE"
            };
          }
          return true;
        })(entityManager, conditionName)
      );
    }

    const createRuleConditonPromise = async () => {
      const queryRunner = await entityManager.connection.createQueryRunner();
      const isInsertedData = await queryRunner.manager.query(
        `INSERT INTO rule_condition (
          name,
          description,
          organization_id,
          type,
          value_type,
          rule_entity_id,
          rule_attribute_id,
          value,
          transforms
      ) VALUES (
          '${conditionName}',
          ${input.description ? `'${input.description}'` : null},
          '${organizationId}',
          ${input.type ? `'${input.type}'` : null},
          ${input.valueType ? `'${input.valueType}'` : null},
          ${ruleEntityId ? `${ruleEntityId}` : null},
          ${ruleAttributeId ? `${ruleAttributeId}` : null},
          ${input.value ? `"${input.value}"`: null},
          ${transforms ? `'${transforms}'` : null}
      );`
      );
      queryRunner.release();
      if (isInsertedData) {
        let res = await RuleCondition.findOne({
          where: { id: isInsertedData.insertId , organization:{ id:organizationId} },
          relations: ["organization", "ruleEntity", "ruleAttribute"]
        });
        return res;
      }
    };
    return validationDecorator(createRuleConditonPromise, validationPromises);
  }

  public async updateRuleCondition(
    entityManager: EntityManager,
    injector,
    input: any
  ): Promise<RuleCondition> {
    const organizationId = input.organizationId;
    const conditionName = input.name;
    const ruleConditionId = input.ruleConditionId;
    let transforms = input.transforms;

    const validationPromises = [];
    validationPromises.push(
      Organization.availableById(entityManager, organizationId)
    );

    if( (Object.prototype.hasOwnProperty.call(input,"name")) && !isValidString(conditionName) ) {
      throw new WCoreError(WCORE_ERRORS.RULE_CONDITION_NAME_NOT_VALID)
    }

    if (input.ruleEntityId)
      validationPromises.push(
        RuleEntity.availableByIdForOrganization(entityManager, input.ruleEntityId, organizationId)
    );
    if (input.ruleAttributeId)
      validationPromises.push(
        RuleAttribute.availableByIdForOrganization(entityManager, input.ruleAttributeId,  organizationId)
      );
      
    if( transforms )
    {
      await validateTransforms(transforms);
      
      const inputObject = {};
      inputObject["id"] = ruleConditionId;
      inputObject["transforms"] = transforms;
      inputObject["entityName"] = ENTITY_NAME.RULE_CONDITION;

      const duplicateTransformResult =await duplicateTransforms(inputObject, entityManager,  injector);
      if(!(duplicateTransformResult.hasDuplicates))
      {
        // If there is no duplicate transforms provided
        transforms = Object.assign(duplicateTransformResult.retrievedTransforms,{...transforms});  
      }
      
      transforms=JSON.stringify(transforms).replace(/'/g, "''");
    }

       

    if (ruleConditionId) {
      validationPromises.push(
        (async (entityManager, name) => {
          const queryRunner = await entityManager.connection.createQueryRunner();
          const result = await queryRunner.manager.query(
            `select * from rule_condition where id='${ruleConditionId}' and organization_id='${organizationId}' `
          );

          queryRunner.release();
          if (result && result.length > 0) {
            return true;
          } else {
            return {
              HTTP_CODE: 500,
              MESSAGE: `Rule condition ${ruleConditionId} does not exists`,
              CODE: "RCAE"
            };
          }
        })(entityManager, conditionName)
      );
    } else {
      throw new WCoreError(WCORE_ERRORS.RULE_CONDITION_ID_NOT_FOUND);
    }

    const updateRuleConditonPromise = async () => {
      const queryRunner = await entityManager.connection.createQueryRunner();
      const isInsertedData = await queryRunner.manager.query(
        `update rule_condition set ${
          ruleConditionId ? `id = '${ruleConditionId}'` : ""
        }${input.name ? `,name = '${input.name}'` : ""}${
          input.description ? `,description = '${input.description}'` : ""
        }${input.type ? `,type = '${input.type}'` : ""}${
          input.valueType ? `,value_type = '${input.valueType}'` : ""
        }${input.value ? `,value = "${input.value}"` : ""}${
          input.ruleEntityId ? `,rule_entity_id = ${input.ruleEntityId}` : ""
        }${transforms ? `,transforms = '${transforms}'` : ""}
        ${
          input.ruleAttributeId
            ? `,rule_attribute_id = ${input.ruleAttributeId}`
            : ""
        } where id = ${ruleConditionId};`
      );
      queryRunner.release();
      if (isInsertedData) {
        let res = await RuleCondition.findOne({
          where: { id: ruleConditionId , organization:{
            id: organizationId
          }},
          relations: ["organization", "ruleEntity", "ruleAttribute"]
        });
        return res;
      }
    };
    return validationDecorator(updateRuleConditonPromise, validationPromises);
  }

  public async getRuleConditions(entityManager: EntityManager, input: any) {
    try {

      const whereCondition = { ...input };
      
      whereCondition.organization={
        id: input.organizationId
      }
      
      if(input.ruleAttributeId)
      {
        whereCondition.ruleAttribute = {
          id: input.ruleAttributeId,
          organization: {
            id: input.organizationId
          }
        }
      }
      if(input.ruleEntityId)
      {
        whereCondition.ruleEntity = {
          id: input.ruleEntityId,
          organization: {
            id: input.organizationId
          }
        }
      }

      const ruleConditions = await entityManager.find(RuleCondition, {
        where: whereCondition,
        relations: ["organization", "ruleEntity", "ruleAttribute"]
      });
      return ruleConditions;
    } catch (err) {
      throw err;
    }
  }

  public async getRuleConditionById(entityManager: EntityManager, id: any) {
    try {
      //@ts-ignore
      const ruleCondition = await entityManager.findOne(RuleCondition, id);
      return ruleCondition;
    } catch (err) {
      throw err;
    }
  }

  public async getRuleConditionByIdAndOrganization(entityManager: EntityManager, id: any, organizationId) {
    
    const ruleCondition = await entityManager.findOne(RuleCondition, {
      where:{
        id,
        organization:{
          id: organizationId
        }
      }
    });
    return ruleCondition;

  }

  public async deleteRuleCondition(
    entityManager: EntityManager,
    { ruleConditionId ,organizationId}
  ) {
    const queryRunner = await entityManager.connection.createQueryRunner();
    const result = await queryRunner.manager.query(
      `DELETE FROM rule_condition WHERE id=${ruleConditionId} AND organization_id="${organizationId}";`
    );    
    queryRunner.release();
    if (result && result.affectedRows == 1) {
      return true;
    }
    return false;
  }

  public async getTransformsFromRuleCondition(  
    entityManager: EntityManager,
    ruleConditionId
  ){
    const queryRunner = await entityManager.connection.createQueryRunner();
    const result = await queryRunner.manager.query(
      `select transforms FROM rule_condition WHERE id=${ruleConditionId};`
    ); 
    return result;
  }
}
