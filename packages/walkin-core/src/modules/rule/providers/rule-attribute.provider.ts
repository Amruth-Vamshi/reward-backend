import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { Organization, RuleEntity } from "../../../../src/entity";
import { RuleAttribute } from "../../../entity";
import { STATUS } from "../../common/constants";
import { isValidString } from "../../common/utils/utils";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";

@Injectable()
export class RuleAttributeProvider {
  public async createRuleAttribute(
    transactionalEntityManager: EntityManager,
    ruleAttributeDetails: any
  ): Promise<RuleAttribute> {
    const entityManager = transactionalEntityManager;

    if(!isValidString(ruleAttributeDetails.attributeName))
    {
      throw new WCoreError(WCORE_ERRORS.RULE_ATTRIBUTE_NAME_NOT_PROVIDED)
    }

    const organization = await entityManager.findOne(Organization, {
      where: { id: ruleAttributeDetails.organizationId, status:"ACTIVE"}
    });
    if (!organization) {
      throw new Error("Invalid OrganizationId provided.");
    }
    ruleAttributeDetails.organization = organization;
    const ruleEntity = await entityManager.findOne(RuleEntity, {
      where: { id: ruleAttributeDetails.ruleEntityId, organization:{id:ruleAttributeDetails.organizationId},status:"ACTIVE"}
    });
    if (!ruleEntity) {
      throw new Error("Invalid Rule Entity provided.");
    }
    ruleAttributeDetails.ruleEntity = ruleEntity;
    const ruleAttributeExists = await entityManager.findOne(RuleAttribute, {
      where: {
        attributeName: ruleAttributeDetails.attributeName,
        ruleEntity,
        organization
      }
    });
    if (ruleAttributeExists) {
      throw new Error("Rule Attribuite Already exists");
    }
    const ruleAttribute = await entityManager.create(
      RuleAttribute,
      ruleAttributeDetails
    );
    const savedRuleAttribute = await entityManager.save(
      RuleAttribute,
      ruleAttribute
    );

    return await this.ruleAttribute(
      transactionalEntityManager,{id:savedRuleAttribute.id,organizationId:ruleAttributeDetails.organizationId}
    );
  }

  public async disableRuleAttribute(
    transactionalEntityManager: EntityManager,
    {id, organizationId}
  ): Promise<RuleAttribute> {
    const entityManager = transactionalEntityManager;

    const ruleAttribute = await entityManager.findOne(RuleAttribute, {
      where: {
        id,
        organization:{
          id:organizationId
        }
      }
      }
    );

    if (ruleAttribute && ruleAttribute.status === STATUS.ACTIVE) {
      const updatedrRuleAttribute = await entityManager.update(
        RuleAttribute,
        { id: ruleAttribute.id },
        { status: STATUS.INACTIVE }
      );
      const updatedRuleAttribute = await entityManager.findOne(
        RuleAttribute,
        id
      );
      return updatedRuleAttribute;
    } else if (ruleAttribute && ruleAttribute.status === STATUS.INACTIVE) {
      throw new Error("ruleAttribute is already inactive.");
    } else {
      throw new Error("ruleAttribute not found");
    }
  }
  public async ruleAttributes(
    transactionalEntityManager: EntityManager,
    ruleAttributeSearchObject: any
  ): Promise<RuleAttribute[]> {
    const entityManager = transactionalEntityManager;

    // If status filter is not specified the default status is ACTIVE
    if(!ruleAttributeSearchObject.status) {
      ruleAttributeSearchObject.status = "ACTIVE";
    }

    const rules = await entityManager.find(RuleAttribute, {
      where: { ...ruleAttributeSearchObject },
      relations: ["organization", "ruleEntity"]
    });
    return rules;
  }

  public async ruleAttribute(
    transactionalEntityManager: EntityManager,
    {id, organizationId}
  ): Promise<RuleAttribute> {
    const entityManager = transactionalEntityManager;

    const rule = await entityManager.findOne(RuleAttribute,{
      where:{
        id,
        organization:{
          id: organizationId
        },
        status:"ACTIVE"
      },
      relations: ["organization", "ruleEntity"]
    });
    return rule;
  }
}
