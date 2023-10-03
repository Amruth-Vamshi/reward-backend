import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { Organization, RuleEffect, RuleEntity } from "../../../../src/entity";
import { RuleAttribute } from "../../../entity";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { isValidString } from "../../common/utils/utils";
import { validationDecorator } from "../../common/validations/Validations";
import { duplicateTransforms, validateTransforms } from "@walkinserver/walkin-rewardx/src/modules/common/utils/RuleUtils";
import { ENTITY_NAME } from "../../common/constants";

@Injectable()
export class RuleEffectProvider {
  public async createRuleEffect(
    entityManager: EntityManager,
    input: any
  ): Promise<RuleEffect> {
    const organizationId = input.organizationId;
    const effectName = input.name;
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
    
    if( !isValidString(effectName) ) {
      throw new WCoreError(WCORE_ERRORS.RULE_EFFECT_NAME_NOT_VALID)
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
        RuleAttribute.availableByIdForOrganization(entityManager, ruleAttributeId, organizationId)
      );
    if (effectName) {
      validationPromises.push(
        (async (entityManager, name) => {
          const queryRunner = await entityManager.connection.createQueryRunner();
          const result = await queryRunner.manager.query(
            `select * from rule_effect where name='${name}' and organization_id="${organizationId}"  `
          );
          queryRunner.release();
          if (result.length) {
            return {
              HTTP_CODE: 500,
              MESSAGE: `Rule effect ${name} already exists`,
              CODE: "RCAE"
            };
          }
          return true;
        })(entityManager, effectName)
      );
    }

    const createRuleEffectPromise = async () => {
      const queryRunner = await entityManager.connection.createQueryRunner();
      const isInsertedData = await queryRunner.manager.query(
        `INSERT INTO rule_effect (
                name,
                description,
                organization_id,
                type,
                rule_entity_id,
                rule_attribute_id,
                value,
                transforms
            ) VALUES (
                '${effectName}',
                ${input.description ? `'${input.description}'` : null},
                '${organizationId}',
                ${input.type ? `'${input.type}'` : null},
                ${ruleEntityId ? `${ruleEntityId}` : null},
                ${ruleAttributeId ? `${ruleAttributeId}` : null},
                ${input.value ? `"${input.value}"`: null},
                ${transforms ? `'${transforms}'` : null}
            );`
      );
      queryRunner.release();
      if (isInsertedData) {
        let res = await RuleEffect.findOne({
          where: { id: isInsertedData.insertId ,organization:{
            id:organizationId
          }},
          relations: ["organization", "ruleEntity", "ruleAttribute"]
        });
        return res;
      }
    };
    return validationDecorator(createRuleEffectPromise, validationPromises);
  }

  public async updateRuleEffect(
    entityManager: EntityManager,
    injector,
    input: any
  ): Promise<RuleEffect> {
    const organizationId = input.organizationId;
    const effectName = input.name;
    const ruleEffectId = input.ruleEffectId;
    let transforms = input.transforms;


    const validationPromises = [];
    validationPromises.push(
      Organization.availableById(entityManager, organizationId)
    );
    
    if((Object.prototype.hasOwnProperty.call(input,"name")) &&  !isValidString(effectName) ) {
      throw new WCoreError(WCORE_ERRORS.RULE_EFFECT_NAME_NOT_VALID)
    }

    if (input.ruleEntityId)
      validationPromises.push(
        RuleEntity.availableByIdForOrganization(entityManager, input.ruleEntityId, organizationId)
      );
    if (input.ruleAttributeId)
      validationPromises.push(
        RuleAttribute.availableByIdForOrganization(entityManager, input.ruleAttributeId, organizationId)
      );

    if( transforms )
    {
      await validateTransforms(transforms);

      const inputObject = {};
      inputObject["id"] = ruleEffectId;
      inputObject["transforms"] = transforms;
      inputObject["entityName"] = ENTITY_NAME.RULE_EFFECT;

      const duplicateTransformResult =await duplicateTransforms(inputObject, entityManager,  injector);
      if(!(duplicateTransformResult.hasDuplicates))
      {
        // If there is no duplicate transforms provided
        transforms = Object.assign(duplicateTransformResult.retrievedTransforms,{...transforms});  
      }
      transforms=JSON.stringify(transforms).replace(/'/g, "''");
    }

    if (ruleEffectId) {
      validationPromises.push(
        (async entityManager => {
          const queryRunner = await entityManager.connection.createQueryRunner();
          const result = await queryRunner.manager.query(
            `select * from rule_effect where id='${ruleEffectId}' and organization_id="${organizationId}" `
          );
          queryRunner.release();
          if (result) {
            return true;
          } else {
            return {
              HTTP_CODE: 500,
              MESSAGE: `Rule effect does not exists with id: ${ruleEffectId}`,
              CODE: "RCAE"
            };
          }
        })(entityManager)
      );
    } else {
      throw new WCoreError(WCORE_ERRORS.RULE_EFFECT_NOT_VALID);
    }

    const updateRuleEffectPromise = async () => {
      const queryRunner = await entityManager.connection.createQueryRunner();
      const isInsertedData = await queryRunner.manager.query(
        `update rule_effect set id = ${ruleEffectId} ${
          input.name ? `,name = '${input.name}'` : ""
        }${input.description ? `,description = '${input.description}'` : ""}${
          input.type ? `,type = '${input.type}'` : ""
        }${input.value ? `,value = "${input.value}"` : ""}${
          input.ruleEntityId ? `,rule_entity_id = ${input.ruleEntityId}` : ""
        }${transforms ? `,transforms = '${transforms}'` : ""}
        ${
          input.ruleAttributeId
            ? `,rule_attribute_id = ${input.ruleAttributeId}`
            : ""
        } where id = ${ruleEffectId};`
      );
      queryRunner.release();
      if (isInsertedData) {
        let res = await RuleEffect.findOne({
          where: { id: ruleEffectId , organization:{
            id: organizationId
          }},
          relations: ["organization", "ruleEntity", "ruleAttribute"]
        });
        return res;
      }
    };
    return validationDecorator(updateRuleEffectPromise, validationPromises);
  }

  public async getRuleEffects(entityManager: EntityManager, input: any) {
    try {

      const whereCondition = { ...input };
      
      whereCondition.organization={
        id: input.organizationId
      }
      
      if(input.ruleAttributeId)
      {
        whereCondition.ruleAttribute = {
          id: input.ruleAttributeId
        }
      }
      if(input.ruleEntityId)
      {
        whereCondition.ruleEntity = {
          id: input.ruleEntityId
        }
      }


      const ruleEffects = await entityManager.find(RuleEffect, {
        where:whereCondition,
        relations: ["organization", "ruleEntity", "ruleAttribute"]
      });
      return ruleEffects;
    } catch (err) {
      throw err;
    }
  }

  public async getRuleEffectById(entityManager: EntityManager, id: any) {
    try {
      const ruleEffect = await entityManager.findOne(RuleEffect, id);
      return ruleEffect;
    } catch (err) {
      throw err;
    }
  }

  public async getRuleEffectByIdAndOrganization(entityManager: EntityManager, id: any, organizationId) {
    
    const ruleEffect = await entityManager.findOne(RuleEffect, {
      where:{
        id,
        organization:{
          id: organizationId
        }
      }
    });
    
    return ruleEffect;
  }


  public async deleteRuleEffect(
    entityManager: EntityManager,
    { ruleEffectId, organizationId }: any
  ) {
    const queryRunner = await entityManager.connection.createQueryRunner();
    const result = await queryRunner.manager.query(
      `delete from rule_effect where id=${ruleEffectId} and organization_id="${organizationId}" `
    );
    queryRunner.release();
    if (result && result.affectedRows == 1) {
      return true;
    }
    return false;
  }

  public async getTransformsFromRuleEffect(  
    entityManager: EntityManager,
    ruleEffectId
  ){
    const queryRunner = await entityManager.connection.createQueryRunner();
    const result = await queryRunner.manager.query(
      `select transforms FROM rule_effect WHERE id=${ruleEffectId};`
    ); 
    return result;
  }
  
}
