import { getManager, getConnection, EntityManager } from "typeorm";
import * as CoreEntities from "../../../../../walkin-core/src/entity";
import { ApplicationModule } from "../../../../../walkin-core/src/modules/account/application/application.module";
import { ApplicationProvider } from "../../../../../walkin-core/src/modules/account/application/application.providers";
import { segmentModule } from "../../../../../walkin-core/src/modules/segment/segment.module";
import { SegmentProvider } from "../../../../../walkin-core/src/modules/segment/segment.providers";
import { ruleModule } from "../../../../../walkin-core/src/modules/rule/rule.module";
import { RuleProvider } from "../../../../../walkin-core/src/modules/rule/providers/rule.provider";
import { RuleEntityProvider } from "../../../../../walkin-core/src/modules/rule/providers/rule-entity.provider";
import { RuleAttributeProvider } from "../../../../../walkin-core/src/modules/rule/providers/rule-attribute.provider";
import { audienceModule } from "../../../../../walkin-core/src/modules/audience/audience.module";
import { AudienceProvider } from "../../../../../walkin-core/src/modules/audience/audience.providers";
import { CampaignModule } from "../../campaigns/campaign.module";
import { CampaignProvider } from "../../../../../walkin-core/src/modules/campaigns/campaign.providers";
import { CurrencyProvider } from "../../currency/currency.provider";
import { CurrencyModule } from "../../currency/currency.module";
import { LoyaltyCardProvider } from "../../loyalty-card/loyalty-card.provider";
import { LoyaltyCardModule } from "../../loyalty-card/loyalty-card.module";
import * as RewardxEntities from "../../../entity";
import { LoyaltyTransactionProvider } from "../../loyalty-transaction/loyalty-transaction.provider";
import Chance from "chance";
import moment from "moment";
import { validateCustomerLoyaltyData } from "../../common/utils/CustomerLoyaltyUtils";
import { CustomerLoyaltyProvider } from "../../customer-loyalty/customer-loyalty.provider";

import { LoyaltyProgramProvider } from "../../loyalty-program/loyalty-program.provider";
import { LoyaltyProgramModule } from "../../loyalty-program/loyalty-program.module";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../walkin-core/__tests__/utils/unit";
import { RewardXModule } from "../../..";
import { from } from "zen-observable";
import {
  STATUS,
  VALUE_TYPE,
  SEGMENT_TYPE,
  CAMPAIGN_TYPE,
  CAMPAIGN_TRIGGER_TYPE,
  RULE_TYPE
} from "@walkinserver/walkin-core/src/modules/common/constants";
import { ExpiryUnit } from "../../common/constants/constant";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { REWARDX_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
let user: CoreEntities.User;
let application: CoreEntities.Application;
let segment: CoreEntities.Segment;
let rule: CoreEntities.Rule;
let ruleAttribute: CoreEntities.RuleAttribute;
let totalAmountRuleAttribute: CoreEntities.RuleAttribute;
let orderTypeRuleAttribute: CoreEntities.RuleAttribute;
let ruleEntity: CoreEntities.RuleEntity;
let audience: CoreEntities.Audience;
let campaign: RewardxEntities.Campaign;
let loyaltyProgram: RewardxEntities.LoyaltyProgram;
let currency: RewardxEntities.Currency;
let loyaltyCard: RewardxEntities.LoyaltyCard;
var chance = new Chance();

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);

const segmentService: SegmentProvider = segmentModule.injector.get(
  SegmentProvider
);

const ruleService: RuleProvider = ruleModule.injector.get(RuleProvider);

const ruleAttributeService: RuleAttributeProvider = ruleModule.injector.get(
  RuleAttributeProvider
);

const ruleEntityService: RuleEntityProvider = ruleModule.injector.get(
  RuleEntityProvider
);

const audienceService: AudienceProvider = audienceModule.injector.get(
  AudienceProvider
);

const campaignService: CampaignProvider = CampaignModule.injector.get(
  CampaignProvider
);

const loyaltyProgramService: LoyaltyProgramProvider = LoyaltyProgramModule.injector.get(
  LoyaltyProgramProvider
);
const currencyService: CurrencyProvider = CurrencyModule.injector.get(
  CurrencyProvider
);
const loyaltyCardService: LoyaltyCardProvider = LoyaltyCardModule.injector.get(
  LoyaltyCardProvider
);
let loyaltyTransactionService: LoyaltyTransactionProvider = RewardXModule.injector.get(
  LoyaltyTransactionProvider
);
let customerLoyaltyService: CustomerLoyaltyProvider = RewardXModule.injector.get(
  CustomerLoyaltyProvider
);
const injector = RewardXModule.injector;

const loyaltyProgramInjector = LoyaltyProgramModule.injector;

beforeAll(async () => {
  await createUnitTestConnection({ ...CoreEntities, ...RewardxEntities });
  ({ user } = await getAdminUser(getConnection()));
  let manager = getManager();
  application = await applicationService.createApplication(
    manager,
    user.organization.id,
    {
      name: chance.string({ length: 5 })
    }
  );

  // console.log("applications is:-", application);

  let ruleEntityInput = {
    entityName: "Loyalty",
    entityCode: "Loyalty",
    status: STATUS.ACTIVE,
    organizationId: user.organization.id
  };

  let loyaltyRuleEntity = await ruleEntityService.createRuleEntity(
    manager,
    ruleEntityInput
  );
  // console.log('loyaltyRuleEntity ', loyaltyRuleEntity)

  let loyaltyRuleEntities = await ruleEntityService.ruleEntities(manager, {
    entityName: "Loyalty"
  });
  loyaltyRuleEntity = loyaltyRuleEntities[0];

  let totalAmountRuleAttributeInput = {
    attributeName: "totalAmount",
    description: "Attribute is for totalAmount",
    status: STATUS.ACTIVE,
    attributeValueType: VALUE_TYPE.NUMBER,
    ruleEntityId: loyaltyRuleEntity.id,
    organizationId: user.organization.id
  };

  let totalAmountRuleAttributes = await ruleAttributeService.createRuleAttribute(
    manager,
    totalAmountRuleAttributeInput
  );

  let totalAmountAttributes = await ruleAttributeService.ruleAttributes(
    manager,
    {
      attributeName: "totalAmount"
    }
  );
  totalAmountRuleAttribute = totalAmountAttributes[0];

  let orderTypeRuleAttributeInput = {
    attributeName: "orderType",
    description: "Attribute is for orderType",
    status: STATUS.ACTIVE,
    attributeValueType: VALUE_TYPE.STRING,
    ruleEntityId: loyaltyRuleEntity.id,
    organizationId: user.organization.id
  };

  let orderTypeRuleAttributes = await ruleAttributeService.createRuleAttribute(
    manager,
    orderTypeRuleAttributeInput
  );

  let orderTypeAttributes = await ruleAttributeService.ruleAttributes(manager, {
    attributeName: "orderType"
  });
  orderTypeRuleAttribute = orderTypeAttributes[0];

  let ruleEntities = await ruleEntityService.ruleEntities(manager, {
    entityName: "Customer"
  });
  ruleEntity = ruleEntities[0];

  let ruleAttributeInput = {
    attributeName: "gender",
    description: "Attribute is for gender",
    status: STATUS.ACTIVE,
    attributeValueType: VALUE_TYPE.STRING,
    ruleEntityId: ruleEntity.id,
    organizationId: user.organization.id
  };

  let ruleAttributes = await ruleAttributeService.ruleAttributes(manager, {
    attributeName: "gender"
  });
  ruleAttribute = ruleAttributes[0];

  let ruleInput = {
    name: "test rule",
    description: "test rule description.",
    type: "SIMPLE",
    status: "ACTIVE",
    ruleConfiguration: {
      combinator: "and",
      rules: [
        {
          ruleAttributeId: ruleAttribute.id,
          expressionType: "EQUALS",
          attributeValue: "MALE",
          attributeEntityName: ruleEntity.entityName,
          attributeName: ruleAttribute.attributeName
        }
      ]
    },
    ruleExpression: { test: "sample" },
    organizationId: user.organization.id
  };

  rule = await ruleService.createRule(manager, ruleModule.injector, ruleInput);
  // console.log("rule is:-", rule);

  segment = await segmentService.createSegment(
    manager,
    chance.string({ length: 5 }),
    chance.string({ length: 100 }),
    SEGMENT_TYPE.CUSTOM,
    user.organization,
    application,
    rule.id,
    STATUS.ACTIVE
  );

  // console.log("segment is:-", segment);

  let currencyInput = {
    code: chance.string({ length: 5 }),
    conversionRatio: 1,
    name: chance.string({ length: 50 })
  };
  currency = await currencyService.createCurrency(manager, currencyInput);
  // console.log("currency is:-", currency);

  let loyaltyCardInput = {
    code: chance.string({ length: 5 }),
    currencyCode: currency.code,
    description: chance.string({ length: 100 }),
    name: chance.string({ length: 10 }),
    organizationId: user.organization.id
  };

  loyaltyCard = await loyaltyCardService.createLoyaltyCard(
    manager,
    loyaltyCardInput
  );
  // console.log("loyalty card is:-", loyaltyCard);
});
describe("Testing the sample loyalty program with campaign", () => {
  test("create a loyalty program", async () => {
    let manager = getManager();
    let campaignName = chance.string({ length: 10 });
    let campaignDescription = chance.string({ length: 100 });

    let campaignInput = {
      name: campaignName,
      description: campaignDescription,
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      priority: chance.integer({ min: 2, max: 10 }),
      campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
      triggerRule: rule.id,
      isCampaignControlEnabled: true,
      campaignControlPercent: chance.integer({ max: 80, min: 20 }),
      isGlobalControlEnabled: true,
      startTime: moment(),
      endTime: moment().add(5, "day"),
      audienceFilterRule: rule.id,
      organization_id: user.organization.id,
      application_id: application.id,
      organization: user.organization
    };

    let loyaltyName = chance.string({ length: 5 });
    let loyaltyCode = chance.string({ length: 5 });
    let expiryUnit = ExpiryUnit.HOUR;
    let expiryValue = chance.integer({ min: 10, max: 100 });

    let loyaltyProgramInput = {
      name: loyaltyName,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCard.code,
      organizationId: user.organization.id,
      expiryUnit,
      expiryValue,
      earnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "1100"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Square-Square"
            }
          ]
        }
      },
      earnRuleValidation: {
        type: "PERCENTAGE_OF_TOTAL_AMOUNT",
        value: 10
      },
      burnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "110"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Squre-Square"
            }
          ]
        }
      },
      burnRuleValidation: {
        type: "CASHBACK",
        value: 20
      },
      // earnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      // burnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      expiryRuleConfiguration: {
        type: RULE_TYPE.CUSTOM,
        ruleConfiguration: {},
        ruleExpression:
          "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      },
      campaign: campaignInput
    };
    let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
      manager,
      loyaltyProgramInjector,
      loyaltyProgramInput,
      user,
      application,
      CampaignModule.context
);
    // let audiences = await audienceService.createAudience(manager, user.organization, application, loyaltyProgram['campaign'], [segment], STATUS.ACTIVE);

    expect(loyaltyProgram.name).toBe(loyaltyName);
    expect(loyaltyProgram.code).toBe(loyaltyCode);
    expect(loyaltyProgram.loyaltyCard.code).toBe(loyaltyCard.code);
    expect(loyaltyProgram.expiryUnit).toBe(expiryUnit);
    expect(loyaltyProgram.expiryValue).toBe(expiryValue);
    expect(loyaltyProgram.campaign.name).toBe(campaignName);
    expect(loyaltyProgram.campaign.description).toBe(campaignDescription);
  });
  test("throws error while creating if no loyalty card exists", async () => {
    let manager = getManager();
    let campaignName = chance.string({ length: 10 });
    let campaignDescription = chance.string({ length: 100 });

    let campaignInput = {
      name: campaignName,
      description: campaignDescription,
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      priority: chance.integer({ min: 2, max: 10 }),
      campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
      triggerRule: rule.id,
      isCampaignControlEnabled: true,
      campaignControlPercent: chance.integer({ max: 80, min: 20 }),
      isGlobalControlEnabled: true,
      startTime: moment(),
      endTime: moment().add(5, "day"),
      audienceFilterRule: rule.id,
      organization_id: user.organization.id,
      application_id: application.id,
      organization: user.organization
    };

    let loyaltyName = chance.string({ length: 5 });
    let loyaltyCode = chance.string({ length: 5 });
    let expiryUnit = ExpiryUnit.HOUR;
    let expiryValue = chance.integer({ min: 10, max: 100 });

    let loyaltyProgramInput = {
      name: loyaltyName,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: "DUMMY_VALUE", //dummy loyalty card
      organizationId: user.organization.id,
      expiryUnit,
      expiryValue,
      earnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "1100"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Square-Square"
            }
          ]
        }
      },
      earnRuleValidation: {
        type: "PERCENTAGE_OF_TOTAL_AMOUNT",
        value: 10
      },
      burnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "110"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Squre-Square"
            }
          ]
        }
      },
      burnRuleValidation: {
        type: "CASHBACK",
        value: 20
      },
      // earnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      // burnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      expiryRuleConfiguration: {
        type: RULE_TYPE.CUSTOM,
        ruleConfiguration: {},
        ruleExpression:
          "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      },
      campaign: campaignInput
    };
    let loyaltyProgramPromise: any = loyaltyProgramService.createLoyaltyProgram(
      manager,
      loyaltyProgramInjector,
      loyaltyProgramInput,
      user,
      null,
      CampaignModule.context
);
    // let audiences = await audienceService.createAudience(manager, user.organization, application, loyaltyProgram['campaign'], [segment], STATUS.ACTIVE);

    await expect(loyaltyProgramPromise).rejects.toThrowError(
      new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND)
    );
  });
  test("picks default loyalty card if only one loyalty card exists", async () => {
    let manager = getManager();
    let campaignName = chance.string({ length: 10 });
    let campaignDescription = chance.string({ length: 100 });

    let campaignInput = {
      name: campaignName,
      description: campaignDescription,
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      priority: chance.integer({ min: 2, max: 10 }),
      campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
      triggerRule: rule.id,
      isCampaignControlEnabled: true,
      campaignControlPercent: chance.integer({ max: 80, min: 20 }),
      isGlobalControlEnabled: true,
      startTime: moment(),
      endTime: moment().add(5, "day"),
      audienceFilterRule: rule.id,
      organization_id: user.organization.id,
      application_id: application.id,
      organization: user.organization
    };

    let loyaltyName = chance.string({ length: 5 });
    let loyaltyCode = chance.string({ length: 5 });
    let expiryUnit = ExpiryUnit.HOUR;
    let expiryValue = chance.integer({ min: 10, max: 100 });

    let loyaltyProgramInput = {
      name: loyaltyName,
      loyaltyCode: loyaltyCode,
      organizationId: user.organization.id,
      expiryUnit,
      expiryValue,
      earnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "1100"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Square-Square"
            }
          ]
        }
      },
      earnRuleValidation: {
        type: "PERCENTAGE_OF_TOTAL_AMOUNT",
        value: 10
      },
      burnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "110"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Squre-Square"
            }
          ]
        }
      },
      burnRuleValidation: {
        type: "CASHBACK",
        value: 20
      },
      // earnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      // burnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      expiryRuleConfiguration: {
        type: RULE_TYPE.CUSTOM,
        ruleConfiguration: {},
        ruleExpression:
          "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      },
      campaign: campaignInput
    };

    let loyaltyCards = await loyaltyCardService.getLoyaltyCards(manager);

    expect(loyaltyCards.length).toBe(1);

    let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
      manager,
      loyaltyProgramInjector,
      loyaltyProgramInput,
      user,
      application,
      CampaignModule.context
);
    console.log("loyaltyProgram testing ", loyaltyProgram);

    expect(loyaltyProgram.name).toBe(loyaltyName);
    expect(loyaltyProgram.code).toBe(loyaltyCode);
    expect(loyaltyProgram.loyaltyCard.code).toBe(loyaltyCards[0].code);
    expect(loyaltyProgram.expiryUnit).toBe(expiryUnit);
    expect(loyaltyProgram.expiryValue).toBe(expiryValue);
    expect(loyaltyProgram.campaign.name).toBe(campaignName);
    expect(loyaltyProgram.campaign.description).toBe(campaignDescription);
  });
  test("fetching loyalty programs by a loyalty program code", async () => {
    let manager = getManager();
    let campaignName = chance.string({ length: 10 });
    let campaignDescription = chance.string({ length: 100 });

    let campaignInput = {
      name: campaignName,
      description: campaignDescription,
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      priority: chance.integer({ min: 2, max: 10 }),
      campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
      triggerRule: rule.id,
      isCampaignControlEnabled: true,
      campaignControlPercent: chance.integer({ max: 80, min: 20 }),
      isGlobalControlEnabled: true,
      startTime: moment(),
      endTime: moment().add(5, "day"),
      audienceFilterRule: rule.id,
      organization_id: user.organization.id,
      application_id: application.id,
      organization: user.organization
    };

    let loyaltyName = chance.string({ length: 5 });
    let loyaltyCode = chance.string({ length: 5 });
    let expiryUnit = ExpiryUnit.HOUR;
    let expiryValue = chance.integer({ min: 10, max: 100 });

    let loyaltyProgramInput = {
      name: loyaltyName,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCard.code,
      organizationId: user.organization.id,
      expiryUnit,
      expiryValue,
      earnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "1100"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Square-Square"
            }
          ]
        }
      },
      earnRuleValidation: {
        type: "PERCENTAGE_OF_TOTAL_AMOUNT",
        value: 10
      },
      burnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "110"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Squre-Square"
            }
          ]
        }
      },
      burnRuleValidation: {
        type: "CASHBACK",
        value: 20
      },
      // earnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      // burnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      expiryRuleConfiguration: {
        type: RULE_TYPE.CUSTOM,
        ruleConfiguration: {},
        ruleExpression:
          "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      },
      campaign: campaignInput
    };
    let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
      manager,
      loyaltyProgramInjector,
      loyaltyProgramInput,
      user,
      application,
      CampaignModule.context
);
    // let audiences = await audienceService.createAudience(manager, user.organization, application, loyaltyProgram['campaign'], [segment], STATUS.ACTIVE);

    expect(loyaltyProgram.name).toBe(loyaltyName);
    expect(loyaltyProgram.code).toBe(loyaltyCode);
    expect(loyaltyProgram.loyaltyCard.code).toBe(loyaltyCard.code);
    expect(loyaltyProgram.expiryUnit).toBe(expiryUnit);
    expect(loyaltyProgram.expiryValue).toBe(expiryValue);
    expect(loyaltyProgram.campaign.name).toBe(campaignName);
    expect(loyaltyProgram.campaign.description).toBe(campaignDescription);

    let loyaltyProgramsBycode: any = await loyaltyProgramService.getLoyaltyProgramsByCode(
      manager,
      loyaltyProgramInjector,
      {
        loyaltyCode: loyaltyProgram.code,
        loyaltyCardCode: loyaltyCard.code
      }
    );

    // console.log("loyalty programs by code:-", loyaltyProgramsBycode);
    expect(loyaltyProgram.code).toBe(loyaltyProgramsBycode.code);
  });
  test("fetching loyalty programs by a loyalty program code and currency code", async () => {
    let manager = getManager();
    let campaignName = chance.string({ length: 10 });
    let campaignDescription = chance.string({ length: 100 });

    let campaignInput = {
      name: campaignName,
      description: campaignDescription,
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      priority: chance.integer({ min: 2, max: 10 }),
      campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
      triggerRule: rule.id,
      isCampaignControlEnabled: true,
      campaignControlPercent: chance.integer({ max: 80, min: 20 }),
      isGlobalControlEnabled: true,
      startTime: moment(),
      endTime: moment().add(5, "day"),
      audienceFilterRule: rule.id,
      organization_id: user.organization.id,
      application_id: application.id,
      organization: user.organization
    };

    let loyaltyName = chance.string({ length: 5 });
    let loyaltyCode = chance.string({ length: 5 });
    let expiryUnit = ExpiryUnit.HOUR;
    let expiryValue = chance.integer({ min: 10, max: 100 });

    let loyaltyProgramInput = {
      name: loyaltyName,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCard.code,
      organizationId: user.organization.id,
      expiryUnit,
      expiryValue,
      earnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "1100"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Square-Square"
            }
          ]
        }
      },
      earnRuleValidation: {
        type: "PERCENTAGE_OF_TOTAL_AMOUNT",
        value: 10
      },
      burnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "110"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Squre-Square"
            }
          ]
        }
      },
      burnRuleValidation: {
        type: "CASHBACK",
        value: 20
      },
      // earnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      // burnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      expiryRuleConfiguration: {
        type: RULE_TYPE.CUSTOM,
        ruleConfiguration: {},
        ruleExpression:
          "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      },
      campaign: campaignInput
    };
    let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
      manager,
      loyaltyProgramInjector,
      loyaltyProgramInput,
      user,
      null,
      CampaignModule.context
);
    // let audiences = await audienceService.createAudience(manager, user.organization, application, loyaltyProgram['campaign'], [segment], STATUS.ACTIVE);

    expect(loyaltyProgram.name).toBe(loyaltyName);
    expect(loyaltyProgram.code).toBe(loyaltyCode);
    expect(loyaltyProgram.loyaltyCard.code).toBe(loyaltyCard.code);
    expect(loyaltyProgram.expiryUnit).toBe(expiryUnit);
    expect(loyaltyProgram.expiryValue).toBe(expiryValue);
    expect(loyaltyProgram.campaign.name).toBe(campaignName);
    expect(loyaltyProgram.campaign.description).toBe(campaignDescription);

    let receivedOrganizationId = user.organization.id;
    let loyaltyProgramsBycode: any = await loyaltyProgramService.loyaltyProgramsByLoyaltyCodeAndLoyaltyCardCode(
      manager,
      loyaltyProgram.code,
      loyaltyCard.code,
      receivedOrganizationId
    );

    // console.log("loyalty programs by code:-", loyaltyProgramsBycode);
    expect(loyaltyProgram.code).toBe(loyaltyProgramsBycode.code);
    expect(loyaltyCard.code).toBe(loyaltyProgramsBycode.loyaltyCard.code);
  });
  test("should throw error when there are multiple loyalty cards available and loyalty card is not sent in input", async () => {
    //Skipping this test (as this would fail)
    //We will have to attach loyalty card to organization before enabling this test

    let manager = getManager();
    let campaignName = chance.string({ length: 10 });
    let campaignDescription = chance.string({ length: 100 });

    let campaignInput = {
      name: campaignName,
      description: campaignDescription,
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      priority: chance.integer({ min: 2, max: 10 }),
      campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
      triggerRule: rule.id,
      isCampaignControlEnabled: true,
      campaignControlPercent: chance.integer({ max: 80, min: 20 }),
      isGlobalControlEnabled: true,
      startTime: moment(),
      endTime: moment().add(5, "day"),
      audienceFilterRule: rule.id,
      organization_id: user.organization.id,
      application_id: application.id,
      organization: user.organization
    };

    let loyaltyName = chance.string({ length: 5 });
    let loyaltyCode = chance.string({ length: 5 });
    let expiryUnit = ExpiryUnit.HOUR;
    let expiryValue = chance.integer({ min: 10, max: 100 });

    let loyaltyProgramInput = {
      name: loyaltyName,
      loyaltyCode: loyaltyCode,
      organizationId: user.organization.id,
      expiryUnit,
      expiryValue,
      earnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "1100"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Square-Square"
            }
          ]
        }
      },
      earnRuleValidation: {
        type: "PERCENTAGE_OF_TOTAL_AMOUNT",
        value: 10
      },
      burnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "110"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Squre-Square"
            }
          ]
        }
      },
      burnRuleValidation: {
        type: "CASHBACK",
        value: 20
      },
      // earnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      // burnRuleConfiguration: {
      //   type: RULE_TYPE.CUSTOM,
      //   ruleConfiguration: {},
      //   ruleExpression:
      //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      // },
      expiryRuleConfiguration: {
        type: RULE_TYPE.CUSTOM,
        ruleConfiguration: {},
        ruleExpression:
          "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      },
      campaign: campaignInput
    };

    let loyaltyCards = await loyaltyCardService.getLoyaltyCards(manager);

    expect(loyaltyCards.length).toBe(1);

    let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
      manager,
      loyaltyProgramInjector,
      loyaltyProgramInput,
      user,
      null,
      CampaignModule.context
);

    expect(loyaltyProgram.name).toBe(loyaltyName);
    expect(loyaltyProgram.code).toBe(loyaltyCode);
    expect(loyaltyProgram.loyaltyCard.code).toBe(loyaltyCards[0].code);
    expect(loyaltyProgram.expiryUnit).toBe(expiryUnit);
    expect(loyaltyProgram.expiryValue).toBe(expiryValue);
    expect(loyaltyProgram.campaign.name).toBe(campaignName);
    expect(loyaltyProgram.campaign.description).toBe(campaignDescription);
  });
  test("creating loyalty programs and verifying earn and burn rule expressions", async () => {
    let burnRuleExpression1 = `{"expressions":["( Loyalty['totalAmount'] >= 110 && Loyalty['orderType'] == 'Square')?20:0"]}`;
    let earnRuleExpression1 = `{"expressions":["( Loyalty['totalAmount'] >= 1100 && Loyalty['orderType'] == 'Square')?0.1*(Loyalty['totalAmount']):0"]}`;
    let manager = getManager();
    let campaignName = chance.string({ length: 10 });
    let campaignDescription = chance.string({ length: 100 });

    let campaignInput = {
      name: campaignName,
      description: campaignDescription,
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      priority: chance.integer({ min: 2, max: 10 }),
      campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
      triggerRule: rule.id,
      isCampaignControlEnabled: true,
      campaignControlPercent: chance.integer({ max: 80, min: 20 }),
      isGlobalControlEnabled: true,
      startTime: moment(),
      endTime: moment().add(5, "day"),
      audienceFilterRule: rule.id,
      organization_id: user.organization.id,
      application_id: application.id,
      organization: user.organization
    };

    let loyaltyName = chance.string({ length: 5 });
    let loyaltyCode = chance.string({ length: 5 });
    let expiryUnit = ExpiryUnit.HOUR;
    let expiryValue = chance.integer({ min: 10, max: 100 });

    let loyaltyProgramInput = {
      name: loyaltyName,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCard.code,
      organizationId: user.organization.id,
      expiryUnit,
      expiryValue,
      earnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "GREATER_THAN_OR_EQUAL",
              attributeValue: "1100"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Square"
            }
          ]
        }
      },
      earnRuleValidation: {
        type: "PERCENTAGE_OF_TOTAL_AMOUNT",
        value: 10
      },
      burnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "GREATER_THAN_OR_EQUAL",
              attributeValue: "110"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Square"
            }
          ]
        }
      },
      burnRuleValidation: {
        type: "CASHBACK",
        value: 20
      },
      expiryRuleConfiguration: {
        type: RULE_TYPE.CUSTOM,
        ruleConfiguration: {},
        ruleExpression:
          "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      },
      campaign: campaignInput
    };
    let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
      manager,
      loyaltyProgramInjector,
      loyaltyProgramInput,
      user,
      application,
      CampaignModule.context
);
    let lpEarnExp: String = loyaltyProgram.loyaltyEarnRule.ruleExpression;
    lpEarnExp = JSON.stringify(lpEarnExp).replace(/\"/g, "");
    let lpBurnExp: String = loyaltyProgram.loyaltyBurnRule.ruleExpression;
    lpBurnExp = JSON.stringify(lpBurnExp).replace(/\"/g, "");
    // let audiences = await audienceService.createAudience(manager, user.organization, application, loyaltyProgram['campaign'], [segment], STATUS.ACTIVE);
    expect(loyaltyProgram.name).toBe(loyaltyName);
    expect(loyaltyProgram.code).toBe(loyaltyCode);
    expect(lpEarnExp).toBe(earnRuleExpression1.replace(/\"/g, ""));
    expect(lpBurnExp).toBe(burnRuleExpression1.replace(/\"/g, ""));
  });
  test("creating loyalty program and retreieve loyalty program by loyaltycode from loyalty Programs API", async () => {
    let manager = getManager();
    let campaignName = chance.string({ length: 10 });
    let campaignDescription = chance.string({ length: 100 });

    let campaignInput = {
      name: campaignName,
      description: campaignDescription,
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      priority: chance.integer({ min: 2, max: 10 }),
      campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
      triggerRule: rule.id,
      isCampaignControlEnabled: true,
      campaignControlPercent: chance.integer({ max: 80, min: 20 }),
      isGlobalControlEnabled: true,
      startTime: moment(),
      endTime: moment().add(5, "day"),
      audienceFilterRule: rule.id,
      organization_id: user.organization.id,
      application_id: application.id,
      organization: user.organization
    };

    let loyaltyName = chance.string({ length: 5 });
    let loyaltyCode = "TRANSACTION";
    let expiryUnit = ExpiryUnit.HOUR;
    let expiryValue = chance.integer({ min: 10, max: 100 });

    let loyaltyProgramInput = {
      name: loyaltyName,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCard.code,
      organizationId: user.organization.id,
      expiryUnit,
      expiryValue,
      earnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "1100"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Square-Square"
            }
          ]
        }
      },
      earnRuleValidation: {
        type: "PERCENTAGE_OF_TOTAL_AMOUNT",
        value: 10
      },
      burnRuleData: {
        ruleConfiguration: {
          combinator: "and",
          rules: [
            {
              ruleAttributeId: totalAmountRuleAttribute.id,
              attributeName: "totalAmount",
              expressionType: "EQUALS",
              attributeValue: "110"
            },
            {
              ruleAttributeId: orderTypeRuleAttribute.id,
              attributeName: "orderType",
              expressionType: "EQUALS",
              attributeValue: "Squre-Square"
            }
          ]
        }
      },
      burnRuleValidation: {
        type: "CASHBACK",
        value: 20
      },
      expiryRuleConfiguration: {
        type: RULE_TYPE.CUSTOM,
        ruleConfiguration: {},
        ruleExpression:
          "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
      },
      campaign: campaignInput
    };
    let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
      manager,
      loyaltyProgramInjector,
      loyaltyProgramInput,
      user,
      null,
      CampaignModule.context
);
    // let audiences = await audienceService.createAudience(manager, user.organization, application, loyaltyProgram['campaign'], [segment], STATUS.ACTIVE);

    expect(loyaltyProgram.name).toBe(loyaltyName);
    expect(loyaltyProgram.code).toBe(loyaltyCode);
    expect(loyaltyProgram.loyaltyCard.code).toBe(loyaltyCard.code);
    expect(loyaltyProgram.expiryUnit).toBe(expiryUnit);
    expect(loyaltyProgram.expiryValue).toBe(expiryValue);
    expect(loyaltyProgram.campaign.name).toBe(campaignName);
    expect(loyaltyProgram.campaign.description).toBe(campaignDescription);

    let loyaltyProgramsBycodeAndCardCode: any = await loyaltyProgramService.getPageWiseLoyaltyPrograms(
      manager,
      {
        page: 1,
        pageSize: 10
      },
      {
        sortBy: "id",
        sortOrder: "ASC"
      },
      injector,
      user.organization.id,
      loyaltyCard.code,
      loyaltyCode
    );
    console.log(
      "loyaltyProgramsBycodeAndCardCode ",
      loyaltyProgramsBycodeAndCardCode
    );
    let loyaltyProgramdata = loyaltyProgramsBycodeAndCardCode.data;
    let resultantProgram = loyaltyProgramdata[0];
    expect(resultantProgram.name).toBe(loyaltyName);
    expect(resultantProgram.code).toBe(loyaltyCode);
    expect(resultantProgram.loyaltyCard.code).toBe(loyaltyCard.code);
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
