import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { Organization, Rule } from "../../../../src/entity";
import { RuleEntity } from "../../../entity";
import { STATUS } from "../../common/constants";
import { isValidString } from "../../common/utils/utils";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
@Injectable()
export class RuleEntityProvider {
  public async createRuleEntity(
    transactionalEntityManager: EntityManager,
    ruleEntityDetails: any
  ): Promise<RuleEntity> {
    const entityManager = transactionalEntityManager;

    if (!isValidString(ruleEntityDetails.entityName))
    {
      throw new WCoreError(WCORE_ERRORS.RULE_ENTITY_NAME_NOT_VALID)  
    }

    const organization = await entityManager.findOne(Organization, {
      where: { id: ruleEntityDetails.organizationId , status : "ACTIVE"}
    });
    if (!organization) {
      throw new Error("Invalid OrganizationId provided.");
    }
    ruleEntityDetails.organization = organization;
    const ruleEntityExists = await entityManager.findOne(RuleEntity, {
      where: {
        entityName: ruleEntityDetails.entityName,
        organization:{
          id:ruleEntityDetails.organizationId
        }
      }
    });
    if (ruleEntityExists) {
      throw new Error("Rule Entity Already exists");
    }
    const ruleEntity = await entityManager.create(
      RuleEntity,
      ruleEntityDetails
    );
    const savedRuleEntity = await entityManager.save(RuleEntity, ruleEntity);
    return savedRuleEntity;
  }

  public async disableRuleEntity(
    transactionalEntityManager: EntityManager,
    { id, organizationId }
  ): Promise<RuleEntity> {
    const entityManager = transactionalEntityManager;
    const ruleEntity = await transactionalEntityManager.findOne(RuleEntity, 
      {
        where: {
          id,
          organization_id: organizationId
        }
      });

    if (ruleEntity && ruleEntity.status === STATUS.ACTIVE) {
  
      const updatedRuleEntity = await transactionalEntityManager.update(
        RuleEntity,
        { id: ruleEntity.id },
        { status: STATUS.INACTIVE }
      );
      return await this.ruleEntity(transactionalEntityManager, { id, organizationId});
    } else if (ruleEntity && ruleEntity.status === STATUS.INACTIVE) {
      throw new Error("ruleEntity is already inactive.");
    } else {
      throw new Error("ruleEntity not found");
    }
  }
  public async ruleEntities(
    transactionalEntityManager: EntityManager,
    ruleEntitySearchObject: any
  ): Promise<RuleEntity[]> {
    const entityManager = transactionalEntityManager;
    const ruleEntityObj: any = {};
    if (ruleEntitySearchObject.entityName) {
      ruleEntityObj.entityName = ruleEntitySearchObject.entityName
    }
    if (ruleEntitySearchObject.entityCode) {
      ruleEntityObj.entityCode = ruleEntitySearchObject.entityCode
    }
    if (ruleEntitySearchObject.organizationId) {
      ruleEntityObj.organization = ruleEntitySearchObject.organizationId
    }
    if (ruleEntitySearchObject.status){
      ruleEntityObj.status = ruleEntitySearchObject.status
    }
    else{
      ruleEntityObj.status = "ACTIVE";
    }
    
    const rules = await entityManager.find(RuleEntity, {
      where: { ...ruleEntityObj },
      relations: ["organization"]
    });
    return rules;
  }

  public async ruleEntity(
    transactionalEntityManager: EntityManager,
    { id, organizationId }
  ): Promise<RuleEntity> {
    const entityManager = transactionalEntityManager;
    const rule = await entityManager.findOne(RuleEntity,{
      where:{id, organization:organizationId},
      relations: ["organization"]
    });
    return rule;
  }
}
