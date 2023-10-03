import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { BusinessRule, BusinessRuleDetail } from "../../../entity";
import { getBusinessRuleConfiguration } from "../utils/BusinessRuleUtils";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
@Injectable()
export class BusinessRuleProvider {
  public async createBusinessRule(
    transactionalEntityManager: EntityManager,
    ruleInput: any
  ): Promise<BusinessRule> {
    const entityManager = transactionalEntityManager;
    try {
      const ruleLevel = ruleInput.ruleLevel;
      const ruleType = ruleInput.ruleType;
      const businessRuleExists = await entityManager.findOne(BusinessRule, {
        where: {
          ruleLevel,
          ruleType
        }
      });
      if (businessRuleExists) {
        throw new Error("Business rule already exists.");
      }
      const businessRule = entityManager.create(BusinessRule, ruleInput);
      const savedRule = await entityManager.save(businessRule);
      return savedRule;
    } catch (err) {
      throw err;
    }
  }

  public async createBusinessRuleDetail(
    transactionalEntityManager: EntityManager,
    ruleInput: any
  ): Promise<BusinessRuleDetail> {
    const entityManager = transactionalEntityManager;
    try {
      const ruleLevel = ruleInput.ruleLevel;
      const ruleLevelId = ruleInput.ruleLevelId;
      const ruleType = ruleInput.ruleType;
      const businessRuleExists = await entityManager.findOne(BusinessRule, {
        where: {
          ruleLevel,
          ruleType
        }
      });
      if (!businessRuleExists) {
        throw new Error(
          `Business rule with ${ruleLevel} and ${ruleType} does not exists.`
        );
      }
      const businessRuleDetailExists = await entityManager.findOne(
        BusinessRuleDetail,
        {
          where: {
            ruleLevel,
            ruleType
          }
        }
      );
      if (businessRuleDetailExists) {
        throw new Error(
          `Business rule detail with ${ruleLevel}, ${ruleLevelId} and ${ruleType} already exists.`
        );
      }
      ruleInput.organization = ruleInput.organizationId;
      const businessRuleDetail = await entityManager.create(
        BusinessRuleDetail,
        ruleInput
      );
      const savedRuleDetail = await entityManager.save(businessRuleDetail);
      return savedRuleDetail;
    } catch (err) {
      throw err;
    }
  }

  public async updateBusinessRule(
    transactionalEntityManager: EntityManager,
    id: string,
    ruleInput: any
  ): Promise<BusinessRule> {
    const entityManager = transactionalEntityManager;
    try {
      const businessRules = await entityManager.findOne(BusinessRule, id);
      if (businessRules) {
        businessRules.ruleDefaultValue = ruleInput.ruleDefaultValue
          ? ruleInput.ruleDefaultValue
          : businessRules.ruleDefaultValue;
        const savedRule = await entityManager.save(businessRules);
        return savedRule;
      } else {
        throw new Error("Business rule Id is Invalid or Does not exist");
      }
    } catch (err) {
      throw err;
    }
  }

  public async updateBusinessRuleDetail(
    transactionalEntityManager: EntityManager,
    id: string,
    ruleInput: any
  ): Promise<BusinessRuleDetail> {
    const entityManager = transactionalEntityManager;
    try {
      const businessRuleDetails = await entityManager.findOne(
        BusinessRuleDetail,
        id
      );
      if (businessRuleDetails) {
        businessRuleDetails.ruleLevel = ruleInput.ruleLevel
          ? ruleInput.ruleLevel
          : businessRuleDetails.ruleLevel;
        businessRuleDetails.ruleLevelId = ruleInput.ruleLevelId
          ? ruleInput.ruleLevelId
          : businessRuleDetails.ruleLevelId;
        businessRuleDetails.ruleType = ruleInput.ruleType
          ? ruleInput.ruleType
          : businessRuleDetails.ruleType;
        businessRuleDetails.ruleValue = ruleInput.ruleValue
          ? ruleInput.ruleValue
          : businessRuleDetails.ruleValue;
        const savedRuleDetail = await entityManager.save(businessRuleDetails);
        return savedRuleDetail;
      } else {
        throw new Error("Business rule detail Id is Invalid or Does not exist");
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteBusinessRule(
    transactionalEntityManager: EntityManager,
    id: string
  ): Promise<BusinessRule> {
    const entityManager = transactionalEntityManager;
    try {
      const businessRule = await entityManager.findOne(BusinessRule, id);
      if (businessRule) {
        const savedRule = await entityManager.delete(BusinessRule, id);
        return businessRule;
      } else {
        throw new Error("Business rule Id is Invalid or Does not exist");
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteBusinessRuleDetail(
    transactionalEntityManager: EntityManager,
    id: string
  ): Promise<BusinessRuleDetail> {
    const entityManager = transactionalEntityManager;
    try {
      const businessRuleDetail = await entityManager.findOne(
        BusinessRuleDetail,
        id
      );
      if (businessRuleDetail) {
        const savedRuleDetail = await entityManager.delete(
          BusinessRuleDetail,
          id
        );
        return businessRuleDetail;
      } else {
        throw new Error("Business rule detail Id is Invalid or Does not exist");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getRules(
    transactionalEntityManager: EntityManager,
    ruleSearchInput: any
  ): Promise<BusinessRule[]> {
    const entityManager = transactionalEntityManager;
    try {
      const businessRules = await entityManager.find(BusinessRule, {
        ...ruleSearchInput
      });
      return businessRules;
    } catch (err) {
      throw err;
    }
  }

  public async getRule(transactionalEntityManager: EntityManager, id: string) {
    const entityManager = transactionalEntityManager;
    try {
      const businessRule = await entityManager.findOne(BusinessRule, id);
      if (businessRule) {
        return businessRule;
      } else {
        throw new Error("Business rule Id is Invalid or Does not exist");
      }
    } catch (err) {
      throw err;
    }
  }
  public async getRuleDetails(
    transactionalEntityManager: EntityManager,
    ruleSearchInput: any
  ): Promise<BusinessRuleDetail[]> {
    const entityManager = transactionalEntityManager;
    try {
      const businessRuleDetails = await entityManager.find(BusinessRuleDetail, {
        ...ruleSearchInput
      });
      return businessRuleDetails;
    } catch (err) {
      throw err;
    }
  }

  public async businessRuleConfiguration(
    transactionalEntityManager: EntityManager,
    ruleConfigInput: any
  ): Promise<string> {
    const entityManager = transactionalEntityManager;
    try {
      return await getBusinessRuleConfiguration(
        ruleConfigInput.ruleLevel,
        ruleConfigInput.ruleType,
        ruleConfigInput.organizationId
      );
    } catch (err) {
      throw err;
    }
  }

  public async getRuleDetail(
    transactionalEntityManager: EntityManager,
    id: string
  ): Promise<BusinessRuleDetail> {
    const entityManager = transactionalEntityManager;
    try {
      const businessRuleDetail = await entityManager.findOne(
        BusinessRuleDetail,
        id
      );
      if (businessRuleDetail) {
        return businessRuleDetail;
      } else {
        throw new Error("Business rule detail Id is Invalid or Does not exist");
      }
    } catch (err) {
      throw err;
    }
  }

  public async updateBusinessRuleByRuleType(
    transactionalEntityManager: EntityManager,
    ruleInput: any
  ): Promise<BusinessRule> {
    const ruleLevel = ruleInput.ruleLevel;
    const ruleType = ruleInput.ruleType;
    const existedBusinessRule = await transactionalEntityManager.findOne(
      BusinessRule,
      {
        where: {
          ruleLevel,
          ruleType
        }
      }
    );
    if (!existedBusinessRule) {
      throw new WCoreError(WCORE_ERRORS.BUSINESS_RULE_NOT_FOUND);
    }
    let updatedBusinessRule = updateEntity(existedBusinessRule, ruleInput);
    return transactionalEntityManager.save(updatedBusinessRule);
  }
}
