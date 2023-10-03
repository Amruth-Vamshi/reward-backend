import { EntityManager } from "typeorm";
import { Injectable, Injector } from "@graphql-modules/di";
import { CustomerLoyalty, LoyaltyCard } from "../../entity";
import { Organization } from "@walkinserver/walkin-core/src/entity/Organization";
import { REWARDX_ERRORS } from "../common/constants/errors";
import { validationDecorator } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import {
  updateEntity,
  addPaginateInfo
} from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { LoyaltyProgram } from "../../entity/loyalty-program";
import { RuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/rule.provider";
import { WalkinError } from "@walkinserver/walkin-core/src/modules/common/exceptions/walkin-platform-error";
import { CampaignProvider } from "../campaigns/campaign.providers";
import moment = require("moment");
import { resolvers } from "../campaigns/campaign.resolvers";
import { CampaignModule } from "../campaigns/campaign.module";
import { validateRule } from "../common/utils/CommonUtils";
import { RULE_TYPE } from "@walkinserver/walkin-core/src/modules/common/constants/constants";

@Injectable()
export class LoyaltyProgramProvider {
  public async getLoyaltyProgramsByCode(
    entityManager: EntityManager,
    injector,
    loyaltyProgram
  ): Promise<Object> {
    let loyaltyProgramCode = loyaltyProgram.loyaltyCode;
    let loyaltyCardCode = loyaltyProgram.loyaltyCardCode;
    let receivedOrganizationId = loyaltyProgram.organizationId;

    // Otherwise, picks up the default wallet.
    let loyaltyCard;
    if (loyaltyCardCode) {
      loyaltyCard = await injector
        .get(LoyaltyCardProvider)
        .getLoyaltyCardByCode(entityManager, loyaltyCardCode, receivedOrganizationId);
    }
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }

    return await this.loyaltyProgramsByLoyaltyCodeAndLoyaltyCardCode(
      entityManager,
      loyaltyProgramCode,
      loyaltyCardCode,
      receivedOrganizationId
    );
  }

  /**
   * retrive the  customer loyalty.
   * @param {mobileNumber}
   * @param {loyaltyCardCode}
   * @returns {{
   *	id: number,
   *	customer: Customer,
   *	loyaltyCard: LoyaltyCard,
   * }}
   */
  public async loyaltyProgramsByLoyaltyCodeAndLoyaltyCardCode(
    entityManager,
    loyaltyProgramCode,
    loyaltyCardCode,
    receivedOrganizationId
  ): Promise<LoyaltyProgram> {
    let loyaltyProgram = await entityManager.findOne(LoyaltyProgram, {
      join: {
        alias: "loyaltyProgram",
        innerJoin: { loyaltyCard: "loyaltyProgram.loyaltyCard" }
      },
      where: (lc: any) => {
        lc.where({
          code: loyaltyProgramCode,
          organization: receivedOrganizationId
        }).andWhere("loyaltyCard.code = :loyaltyCardCode", { loyaltyCardCode });
      },
      relations: [
        "loyaltyEarnRule",
        "loyaltyBurnRule",
        "loyaltyExpiryRule",
        "campaign"
      ]
    });

    if (loyaltyProgram) {
      loyaltyProgram.loyaltyCode = loyaltyProgramCode;
      loyaltyProgram.loyaltyCardCode = loyaltyCardCode;
    } else {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_PROGRAM_NOT_FOUND);
    }

    return loyaltyProgram;
  }

  public async createLoyaltyProgram(
    entityManager: EntityManager,
    injector,
    loyaltyProgram,
    user,
    application,
    info
  ): Promise<Object> {
    let loyaltyProgramCode = loyaltyProgram.loyaltyCode;
    let loyaltyCardCode = loyaltyProgram.loyaltyCardCode;
    let organizationId = loyaltyProgram.organizationId;
    let expiryRuleConfiguration = loyaltyProgram.expiryRuleConfiguration;
    let validationPromises = [];
    let currentDate = moment().format("YYYY-MM-DD");
    let organization = await entityManager.findOne(Organization, {
      id: organizationId
    });
    //Validating organization
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    } else {
      validationPromises.push(
        Organization.availableById(entityManager, organizationId)
      );
    }
    //LoyaltyCardCode
    let loyaltyCard;
    if (loyaltyCardCode) {
      loyaltyCard = await injector
        .get(LoyaltyCardProvider)
        .getLoyaltyCardByCode(entityManager, loyaltyCardCode, organizationId);
    } else {
      loyaltyCard = await injector
        .get(LoyaltyCardProvider)
        .getDefaultLoyaltycard(entityManager);
    }
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }

    let createLoyaltyProgramAction = async () => {
      let organization = await entityManager.create(Organization, {
        id: organizationId
      });
      loyaltyProgram.campaign.organization = organization;
      let input = { input: loyaltyProgram.campaign };

      let campaign = await resolvers.Mutation.createCampaign(
        { user, application },
        input,
        { injector: CampaignModule.injector },
        info
      );
      let loyaltyProgramPromise = await entityManager.create(LoyaltyProgram, {
        ...loyaltyProgram,
        code: loyaltyProgramCode,
        loyaltyCard,
        organization,
        campaign
      });
      let earnRuleData = loyaltyProgram.earnRuleData;
      let earnRuleValidation = loyaltyProgram.earnRuleValidation;
      let burnRuleData = loyaltyProgram.burnRuleData;
      let burnRuleValidation = loyaltyProgram.burnRuleValidation;
      if (earnRuleData) {
        let earnRuleConfiguration: any = {};
        let earnRuleExpression = await injector
          .get(RuleProvider)
          .processNestedRules(
            entityManager,
            earnRuleData.ruleConfiguration,
            organization
          );
        console.log("earnRuleExpression ", earnRuleExpression);
        if (earnRuleExpression) {
          let earnRuleResult = await validateRule(
            entityManager,
            earnRuleValidation
          );
          earnRuleExpression = earnRuleExpression + "?" + earnRuleResult;
        }
        console.log("earnRuleExpression after result", earnRuleExpression);
        earnRuleConfiguration.type = RULE_TYPE.CUSTOM;
        earnRuleConfiguration.ruleExpression = earnRuleExpression;
        let savedRule = await injector
          .get(RuleProvider)
          .createRule(entityManager, injector, {
            ...earnRuleConfiguration,
            organizationId,
            name:
              "EARN_RULE_" +
              loyaltyProgramCode +
              "_" +
              loyaltyCardCode +
              "_" +
              currentDate
          });
        loyaltyProgramPromise.loyaltyEarnRule = savedRule;
      }
      if (burnRuleData) {
        let burnRuleConfiguration: any = {};
        let burnRuleExpression = await injector
          .get(RuleProvider)
          .processNestedRules(
            entityManager,
            burnRuleData.ruleConfiguration,
            organization
          );
        console.log("burnRuleExpression ", burnRuleExpression);
        if (burnRuleExpression) {
          let burnRuleResult = await validateRule(
            entityManager,
            burnRuleValidation
          );
          burnRuleExpression = burnRuleExpression + "?" + burnRuleResult;
        }
        console.log("burnRuleExpression after result ", burnRuleExpression);
        burnRuleConfiguration.type = RULE_TYPE.CUSTOM;
        burnRuleConfiguration.ruleExpression = burnRuleExpression;
        let savedRule = await injector
          .get(RuleProvider)
          .createRule(entityManager, injector, {
            ...burnRuleConfiguration,
            organizationId,
            name:
              "BURN_RULE_" +
              loyaltyProgramCode +
              "_" +
              loyaltyCardCode +
              "_" +
              currentDate
          });
        loyaltyProgramPromise.loyaltyBurnRule = savedRule;
      }
      if (expiryRuleConfiguration) {
        let savedRule = await injector
          .get(RuleProvider)
          .createRule(entityManager, injector, {
            ...expiryRuleConfiguration,
            organizationId,
            name:
              "EXPIRY_RULE_" +
              loyaltyProgramCode +
              "_" +
              loyaltyCardCode +
              "_" +
              currentDate
          });
        loyaltyProgramPromise.loyaltyExpiryRule = savedRule;
      }

      let cancelTranscationRules = loyaltyProgram.cancelTransactionRules;
      if (!cancelTranscationRules) {
        cancelTranscationRules = {
          allowCancellation: true,
          allowCancelForCompleted: true,
          trackNegativePoints: true
        };
      }
      loyaltyProgramPromise.cancelTransactionRules = cancelTranscationRules;

      let savedLoyaltyProgram = await entityManager.save(loyaltyProgramPromise);
      savedLoyaltyProgram["loyaltyCode"] = savedLoyaltyProgram.code;
      savedLoyaltyProgram["loyaltyCardCode"] = loyaltyCardCode;

      return savedLoyaltyProgram;
    };
    return validationDecorator(createLoyaltyProgramAction, validationPromises);
  }

  @addPaginateInfo
  public async getPageWiseLoyaltyPrograms(
    entityManager: EntityManager,
    pageOptions,
    sortOptions,
    injector,
    organizationId,
    loyaltyCardCode,
    loyaltyCode
  ) {
    //console.log("customer loyalty is:-", customerLoyalty);
    let loyaltyCard = await entityManager.findOne(LoyaltyCard, {
      where: { code: loyaltyCardCode }
    });
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }
    let options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    options.relations = [
      "campaign",
      "loyaltyCard",
      "organization",
      "loyaltyEarnRule",
      "loyaltyBurnRule",
      "loyaltyExpiryRule",
      "loyaltyCard.currency"
    ];
    options.where = {
      organization: organizationId,
      loyaltyCard: loyaltyCard
    };
    // To consider only if loyaltyCode defined
    if (loyaltyCode) {
      options.where["code"] = loyaltyCode;
    }
    let loyaltyPrograms = await entityManager.findAndCount(
      LoyaltyProgram,
      options
    );
    console.log("loayltyPrograms ", loyaltyPrograms);
    return loyaltyPrograms;
  }

  public async updateLoyaltyProgram(
    entityManager: EntityManager,
    injector,
    loyaltyProgram
  ): Promise<Object> {
    let loyaltyProgramCode = loyaltyProgram.loyaltyCode;
    let loyaltyCardCode = loyaltyProgram.loyaltyCardCode;
    let organizationId = loyaltyProgram.organizationId;
    let expiryRuleConfiguration = loyaltyProgram.expiryRuleConfiguration;
    let validationPromises = [];
    let currentDate = moment().format("YYYY-MM-DD");
    let organization = await entityManager.findOne(Organization, {
      id: organizationId
    });
    console.log("organization ", organization);
    //Validating organization
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    let existedLoyaltyProgram = await entityManager.findOne(LoyaltyProgram, {
      where: {
        id: loyaltyProgram.id
      },
      relations: [
        "campaign",
        "loyaltyEarnRule",
        "loyaltyBurnRule",
        "loyaltyExpiryRule"
      ]
    });
    console.log("existedLoyaltyProgram ", existedLoyaltyProgram);
    if (!existedLoyaltyProgram) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_PROGRAM_NOT_FOUND);
    }
    if (loyaltyProgram.campaign) {
      let existedCampaign = existedLoyaltyProgram.campaign;
      let campaign = await injector
        .get(CampaignProvider)
        .updateCampaign(
          entityManager,
          String(existedCampaign.id),
          loyaltyProgram.campaign
        );
      loyaltyProgram.campaign = campaign;
    }
    //LoyaltyCardCode
    let loyaltyCard;
    if (loyaltyCardCode) {
      loyaltyCard = await injector
        .get(LoyaltyCardProvider)
        .getLoyaltyCardByCode(entityManager, loyaltyCardCode, organizationId);
    } else {
      let loyaltyCards = await injector
        .get(LoyaltyCardProvider)
        .getLoyaltyCards(entityManager);
      if (loyaltyCards && loyaltyCards.length >= 1) {
        loyaltyCard = loyaltyCards[0];
      }
    }
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }
    let earnRuleData = loyaltyProgram.earnRuleData;
    let earnRuleValidation = loyaltyProgram.earnRuleValidation;
    let burnRuleData = loyaltyProgram.burnRuleData;
    let burnRuleValidation = loyaltyProgram.burnRuleValidation;
    if (earnRuleData) {
      let earnRuleConfiguration: any = {};
      let earnRuleExpression = await injector
        .get(RuleProvider)
        .processNestedRules(
          entityManager,
          earnRuleData.ruleConfiguration,
          organization
        );
      console.log("earnRuleExpression ", earnRuleExpression);
      if (earnRuleExpression) {
        let earnRuleResult = await validateRule(
          entityManager,
          earnRuleValidation
        );
        earnRuleExpression = earnRuleExpression + "?" + earnRuleResult;
      }
      console.log("earnRuleExpression after result", earnRuleExpression);
      earnRuleConfiguration.type = RULE_TYPE.CUSTOM;
      earnRuleConfiguration.ruleExpression = earnRuleExpression;
      let loyaltyEarnRule = existedLoyaltyProgram.loyaltyEarnRule;
      let savedRule = await injector
        .get(RuleProvider)
        .updateRule(entityManager, loyaltyEarnRule.id, {
          ...earnRuleConfiguration,
          organizationId,
          name:
            "EARN_RULE_" +
            loyaltyProgramCode +
            "_" +
            loyaltyCardCode +
            "_" +
            currentDate
        });
      existedLoyaltyProgram.loyaltyEarnRule = savedRule;
    }
    if (burnRuleData) {
      let burnRuleConfiguration: any = {};
      let burnRuleExpression = await injector
        .get(RuleProvider)
        .processNestedRules(
          entityManager,
          burnRuleData.ruleConfiguration,
          organization
        );
      console.log("burnRuleExpression ", burnRuleExpression);
      if (burnRuleExpression) {
        let burnRuleResult = await validateRule(
          entityManager,
          burnRuleValidation
        );
        burnRuleExpression = burnRuleExpression + "?" + burnRuleResult;
      }
      console.log("burnRuleExpression after result ", burnRuleExpression);
      burnRuleConfiguration.type = RULE_TYPE.CUSTOM;
      burnRuleConfiguration.ruleExpression = burnRuleExpression;
      let loyaltyBurnRule = existedLoyaltyProgram.loyaltyBurnRule;
      let savedRule = await injector
        .get(RuleProvider)
        .updateRule(entityManager, loyaltyBurnRule.id, {
          ...burnRuleConfiguration,
          organizationId,
          name:
            "BURN_RULE_" +
            loyaltyProgramCode +
            "_" +
            loyaltyCardCode +
            "_" +
            currentDate
        });
      existedLoyaltyProgram.loyaltyBurnRule = savedRule;
    }
    if (expiryRuleConfiguration) {
      let loyaltyExpiryRule = existedLoyaltyProgram.loyaltyExpiryRule;
      let savedRule = await injector
        .get(RuleProvider)
        .updateRule(entityManager, loyaltyExpiryRule.id, {
          ...expiryRuleConfiguration,
          organizationId,
          name:
            "EXPIRY_RULE_" +
            loyaltyProgramCode +
            "_" +
            loyaltyCardCode +
            "_" +
            currentDate
        });
      existedLoyaltyProgram.loyaltyExpiryRule = savedRule;
    }
    updateEntity(existedLoyaltyProgram, loyaltyProgram);
    let savedLoyaltyProgram = await entityManager.save(existedLoyaltyProgram);
    savedLoyaltyProgram["loyaltyCode"] = savedLoyaltyProgram.code;
    savedLoyaltyProgram["loyaltyCardCode"] = loyaltyCardCode;
    return savedLoyaltyProgram;
  }
}
