import { getManager, getConnection, EntityManager } from "typeorm";
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
import { LoyaltyTransactionProvider } from "../loyalty-transaction.provider";
import { LoyaltyTransactionModule } from "../loyalty-transaction.module";
import * as CoreEntities from "../../../../../walkin-core/src/entity";
import * as RewardxEntities from "../../../entity";
import Chance from "chance";
import moment from "moment";
import {
  validateCustomerLoyaltyData,
  getLoyaltyTransactionByLoyaltyReferenceId
} from "../../common/utils/CustomerLoyaltyUtils";
import { CustomerLoyaltyProvider } from "../../customer-loyalty/customer-loyalty.provider";
import { LoyaltyCardProvider } from "../../loyalty-card/loyalty-card.provider";
import { CurrencyProvider } from "../../currency/currency.provider";
import { LoyaltyProgramProvider } from "../../loyalty-program/loyalty-program.provider";
import { CustomerProvider } from "../../../../../walkin-core/src/modules/customer/customer.providers";
import { customerModule } from "../../../../../walkin-core/src/modules/customer/customer.module";
import { WCoreError } from "../../../../../walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../../common/constants/errors";
import { BusinessRuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/business_rule.provider";
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
let application: CoreEntities.Application;
let segment: CoreEntities.Segment;
let rule: CoreEntities.Rule;
let ruleAttribute: CoreEntities.RuleAttribute;
let ruleEntity: CoreEntities.RuleEntity;
let totalAmountRuleAttribute: CoreEntities.RuleAttribute;
let orderTypeRuleAttribute: CoreEntities.RuleAttribute;
let audience: CoreEntities.Audience;
let campaign: RewardxEntities.Campaign;
let loyaltyProgram: RewardxEntities.LoyaltyProgram;
let currency: RewardxEntities.Currency;
let loyaltyCard: RewardxEntities.LoyaltyCard;
let user: CoreEntities.User;
let referenceId: "ORD872105";
let loyaltyReferenceId1: "ORD872106";
let customerLoyalty: RewardxEntities.CustomerLoyalty;
let customer = CoreEntities.Customer;
let loyaltyTransaction: RewardxEntities.LoyaltyTransaction;
var chance = new Chance();

let externalCustomerId = "+919999999999";
let loyaltyCardCode = "RED001";
let loyaltyCode = "TRANSACTION";

jest.mock("i18n");

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
let customerService: CustomerProvider = customerModule.injector.get(
  CustomerProvider
);
let loyaltyTransactionService: LoyaltyTransactionProvider = RewardXModule.injector.get(
  LoyaltyTransactionProvider
);
let customerLoyaltyService: CustomerLoyaltyProvider = RewardXModule.injector.get(
  CustomerLoyaltyProvider
);
let loyaltyCardService: LoyaltyCardProvider = RewardXModule.injector.get(
  LoyaltyCardProvider
);
let currencyService: CurrencyProvider = RewardXModule.injector.get(
  CurrencyProvider
);
let loyaltyProgramService: LoyaltyProgramProvider = RewardXModule.injector.get(
  LoyaltyProgramProvider
);
const businessRuleservice: BusinessRuleProvider = ruleModule.injector.get(
  BusinessRuleProvider
);
const injector = RewardXModule.injector;

let issuePointsInputGlobal = {
  externalCustomerId: externalCustomerId,
  loyaltyCode: loyaltyCode,
  loyaltyCardCode: loyaltyCardCode,
  statusCode: "101",
  externalTransationId: "",
  loyaltyReferenceId: chance.string({ length: 8 }),
  burnFromLoyaltyCard: true,
  // organizationId: user.organization.id,
  transactionData: {
    transactionType: "DELIVERY_ORDER",
    transactionDate: "2019-08-10",
    transactionChannel: "MOBILE_APP",
    totalAmount: 100,
    externalStoreId: "6858R"
  },
  orderData: {
    loyalty: {
      loyaltyType: "PAYMENT"
    },
    burnFromWallet: true,
    order: {
      externalStoreId: "1",
      externalOrderId: 101,
      totalAmount: "2000",
      orderType: "DELIVERY_ORDER",
      fulfillmentDate: "2019-09-09T00:00:00+05:30",
      couponCode: "",
      orderChannel: "MOBILE_APP",
      orderDate: "2017-05-08T00:00:00+05:30",
      payments: [],
      products: [
        {
          productCode: "PIZZ001133",
          name: "Non-Veg Supreme - Medium",
          productType: "PIZZA",
          isEDVOApplied: false,
          pricePerQty: 570,
          quantity: 1
        },
        {
          productCode: "ADDON001133",
          name: "Tomato",
          productType: "PIZZA_MANIA",
          isEDVOApplied: false,
          pricePerQty: 59,
          quantity: 1
        },
        {
          productCode: "GBR001133",
          name: "Garlic Breadsticks",
          productType: "SIDES",
          isEDVOApplied: false,
          pricePerQty: 99,
          quantity: 1
        }
      ]
    }
  }
};

beforeAll(async () => {
  await createUnitTestConnection({ ...CoreEntities, ...RewardxEntities });
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();
  let currencyInput = {
    code: chance.string({ length: 5 }),
    conversionRatio: 1,
    name: chance.string({ length: 20 })
  };
  let currency = await currencyService.createCurrency(manager, currencyInput);

  let loyaltyCardInput = {
    code: loyaltyCardCode,
    currencyCode: currency.code,
    description: chance.string({ length: 50 }),
    name: chance.string({ length: 20 }),
    organizationId: user.organization.id
  };
  let loyaltyCard = await loyaltyCardService.createLoyaltyCard(
    manager,
    loyaltyCardInput
  );

  let statusInput1 = { statusId: 101, statusCode: "INITIATED" };
  let statusInput2 = { statusId: 201, statusCode: "PROCESSED" };
  let statusInput3 = { statusId: 301, statusCode: "COMPLETED" };
  let statusInput4 = { statusId: 401, statusCode: "CANCELLED" };
  let statusInput5 = { statusId: 104, statusCode: "CALCULATE" };

  let createStatusCode1 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
    manager,
    injector,
    statusInput1
  );
  expect(createStatusCode1.statusId).toBe(101);
  let createStatusCode2 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
    manager,
    injector,
    statusInput2
  );
  expect(createStatusCode2.statusId).toBe(201);
  let createStatusCode3 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
    manager,
    injector,
    statusInput3
  );
  expect(createStatusCode3.statusId).toBe(301);
  let createStatusCode4 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
    manager,
    injector,
    statusInput4
  );
  expect(createStatusCode4.statusId).toBe(401);
  let createStatusCode5 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
    manager,
    injector,
    statusInput5
  );
  expect(createStatusCode5.statusId).toBe(104);

  let customerLoyaltyInput = {
    externalCustomerId: externalCustomerId,
    organizationId: user.organization.id,
    loyaltyCardCode: loyaltyCardCode,
    createCustomerIfNotExist: true
  };

  let createCustomerLoyalty: any = await customerLoyaltyService.createCustomerLoyalty(
    manager,
    injector,
    customerLoyaltyInput
  );

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
    description: "test",
    type: "CUSTOM",
    status: "ACTIVE",
    ruleConfiguration: "",
    ruleExpression: "(Customer['gender'] == 'FEMALE')",
    organizationId: user.organization.id
  };
  rule = await ruleService.createRule(manager, ruleModule.injector, ruleInput);

  let loyaltyProgramInput = {
    name: chance.string({ length: 5 }),
    loyaltyCode: loyaltyCode,
    loyaltyCardCode: loyaltyCardCode,
    organizationId: user.organization.id,
    expiryUnit: "DAY",
    expiryValue: 0,
    campaign: {
      name: "Campaign1",
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      startTime: moment()
        .subtract(1, "days")
        .format(),
      endTime: moment()
        .add(10, "days")
        .format(),
      organization_id: user.organization.id
    },
    earnRuleData: {
      ruleConfiguration: {
        combinator: "and",
        rules: [
          {
            ruleAttributeId: totalAmountRuleAttribute.id,
            attributeName: "totalAmount",
            expressionType: "GREATER_THAN_OR_EQUAL",
            attributeValue: "100"
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
            attributeValue: "100"
          }
        ]
      }
    },
    burnRuleValidation: {
      type: "PERCENTAGE_OF_TOTAL_AMOUNT",
      value: 10
    },
    expiryRuleConfiguration: {
      type: "CUSTOM",
      ruleConfiguration: {},
      ruleExpression:
        "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
    },
    cancelTransactionRules: {
      allowCancellation: true,
      allowCancelForCompleted: true,
      trackNegativePoints: true
    }
  };

  let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
    manager,
    injector,
    loyaltyProgramInput,
    user,
    null,
    CampaignModule.context
  );

  const businessRuleInputEarn1 = {
    ruleLevel: "LOYALTY",
    ruleType: "TRANSACTION_EARN_ORDER_CHANNEL",
    ruleDefaultValue: '["MOBILE_APP"]'
  };
  const createBusinessRule = await businessRuleservice.createBusinessRule(
    manager,
    businessRuleInputEarn1
  );
  const businessRuleInputEarn2 = {
    ruleLevel: "LOYALTY",
    ruleType: "TRANSACTION_EARN_ORDER_TYPE",
    ruleDefaultValue:
      '["DELIVERY_ORDER","ADVANCED_ORDER","BULK_ORDER","TAKE_AWAY"]'
  };
  const createBusinessRule1 = await businessRuleservice.createBusinessRule(
    manager,
    businessRuleInputEarn2
  );

  const businessRuleInputBurn1 = {
    ruleLevel: "LOYALTY",
    ruleType: "TRANSACTION_BURN_ORDER_CHANNEL",
    ruleDefaultValue: '["MOBILE_APP"]'
  };
  const createBusinessRule2 = await businessRuleservice.createBusinessRule(
    manager,
    businessRuleInputBurn1
  );

  const businessRuleInputBurn2 = {
    ruleLevel: "LOYALTY",
    ruleType: "TRANSACTION_BURN_ORDER_TYPE",
    ruleDefaultValue:
      '["DELIVERY_ORDER","DELIVERY_ORDER","ADVANCED_ORDER","BULK_ORDER","TAKE_AWAY"]'
  };
  const createBusinessRule3 = await businessRuleservice.createBusinessRule(
    manager,
    businessRuleInputBurn2
  );

  const businessRuleInputEarn = {
    ruleLevel: "LOYALTY",
    ruleType: "TRANSACTION_EARN_LIMIT",
    ruleDefaultValue: "50"
  };
  const createBusinessRuleEarnAction = await businessRuleservice.createBusinessRule(
    manager,
    businessRuleInputEarn
  );

  const businessRuleInputBurn = {
    ruleLevel: "LOYALTY",
    ruleType: "TRANSACTION_BURN_LIMIT",
    ruleDefaultValue: "50"
  };
  const createBusinessRuleBurnAction = await businessRuleservice.createBusinessRule(
    manager,
    businessRuleInputBurn
  );
});

describe("Cancel loyalty transaction", () => {
  let issuePointsInput5 = {
    externalCustomerId: externalCustomerId,
    loyaltyCode: loyaltyCode,
    loyaltyCardCode: loyaltyCardCode,
    statusCode: "COMPLETED",
    externalTransationId: "",
    loyaltyReferenceId: chance.string({ length: 8 }),
    burnFromLoyaltyCard: true,
    transactionData: {
      transactionType: "DELIVERY_ORDER",
      transactionDate: "2019-08-10",
      transactionChannel: "MOBILE_APP",
      totalAmount: 728,
      externalStoreId: "6858R"
    },
    orderData: {
      loyalty: {
        loyaltyType: "PAYMENT"
      },
      burnFromWallet: true,
      order: {
        externalStoreId: "1",
        externalOrderId: 101,
        totalAmount: "728",
        orderType: "DELIVERY_ORDER",
        fulfillmentDate: "2019-09-09T00:00:00+05:30",
        couponCode: "",
        orderChannel: "MOBILE_APP",
        orderDate: "2017-05-08T00:00:00+05:30",
        payments: [],
        products: [
          {
            productCode: "PIZZ001133",
            name: "Non-Veg Supreme - Medium",
            productType: "PIZZA",
            isEDVOApplied: false,
            pricePerQty: 570,
            quantity: 1
          },
          {
            productCode: "ADDON001133",
            name: "Tomato",
            productType: "PIZZA_MANIA",
            isEDVOApplied: false,
            pricePerQty: 59,
            quantity: 1
          },
          {
            productCode: "GBR001133",
            name: "Garlic Breadsticks",
            productType: "SIDES",
            isEDVOApplied: false,
            pricePerQty: 99,
            quantity: 1
          }
        ]
      }
    }
  };
  let issuePointsInput6 = {
    externalCustomerId: externalCustomerId,
    loyaltyCode: loyaltyCode,
    loyaltyCardCode: loyaltyCardCode,
    statusCode: "COMPLETED",
    externalTransationId: "",
    loyaltyReferenceId: chance.string({ length: 8 }),
    burnFromLoyaltyCard: true,
    transactionData: {
      transactionType: "DELIVERY_ORDER",
      transactionDate: "2019-08-10",
      transactionChannel: "MOBILE_APP",
      totalAmount: 100,
      externalStoreId: "6858R"
    },
    orderData: {
      loyalty: {
        loyaltyType: "PAYMENT"
      },
      burnFromWallet: true,
      order: {
        externalStoreId: "1",
        externalOrderId: 101,
        totalAmount: "2000",
        orderType: "DELIVERY_ORDER",
        fulfillmentDate: "2019-09-09T00:00:00+05:30",
        couponCode: "",
        orderChannel: "MOBILE_APP",
        orderDate: "2017-05-08T00:00:00+05:30",
        payments: [],
        products: [
          {
            productCode: "PIZZ001133",
            name: "Non-Veg Supreme - Medium",
            productType: "PIZZA",
            isEDVOApplied: false,
            pricePerQty: 600,
            quantity: 1
          },
          {
            productCode: "ADDON001133",
            name: "Tomato",
            productType: "PIZZA_MANIA",
            isEDVOApplied: false,
            pricePerQty: 59,
            quantity: 1
          },
          {
            productCode: "GBR001133",
            name: "Garlic Breadsticks",
            productType: "SIDES",
            isEDVOApplied: false,
            pricePerQty: 99,
            quantity: 1
          }
        ]
      }
    }
  };
  test("Cancel loyalty(Issue,Issue, cancel)", async () => {
    const manager = getManager();
    let issuePoints: any = await loyaltyTransactionService.issuePoints(
      manager,
      injector,
      {
        ...issuePointsInput5,
        organizationId: user.organization.id
      }
    );
    expect(issuePoints.earnedPoints).toBe(50);
    let customerLoyaltyInput = {
      externalCustomerId: externalCustomerId,
      organizationId: user.organization.id,
      loyaltyCardCode: loyaltyCardCode
    };
    let getCustomer: any = await customerLoyaltyService.getCustomerLoyalty(
      manager,
      injector,
      { ...customerLoyaltyInput, organizationId: user.organization.id }
    );
    expect(getCustomer.overallPoints).toBe(50);

    let issuePoints2: any = await loyaltyTransactionService.issuePoints(
      manager,
      injector,
      {
        ...issuePointsInput6,
        organizationId: user.organization.id
      }
    );
    expect(issuePoints2.earnedPoints).toBe(50);
    console.log("got 50 points!", issuePoints2.status);
    let refernecId = issuePointsInput5.loyaltyReferenceId;
    let customerId = externalCustomerId;

    let cancelLoyaltyTransactionInput = {
      loyaltyReferenceId: refernecId,
      externalCustomerId: customerId,
      loyaltyType: loyaltyCode,
      completeEarn: true,
      completeBurn: true,
      organizationId: user.organization.id
    };

    let cancelTransaction = await loyaltyTransactionService.cancelLoyaltyTransaction(
      manager,
      injector,
      cancelLoyaltyTransactionInput
    );
    expect(cancelTransaction.status).toBe("CANCELLED");
    let getTranasctionObject = await loyaltyTransactionService.getLoyaltyTransaction(
      manager,
      injector,
      issuePointsInput5.externalCustomerId,
      issuePointsInput5.loyaltyCardCode
    );

    let getTransactionLedgerRecords: any = await loyaltyTransactionService.getLedgerRecordsWithReferenceId(
      manager,
      getTranasctionObject[0].id
    );
    expect(getTransactionLedgerRecords[0].details).toEqual({ "1": 50 });
  });
  test("Cancel loyalty(Issue,Burn,cancel)", async () => {
    let lri1 = chance.string({ length: 8 });
    let lri2 = chance.string({ length: 8 });
    const manager = getManager();
    let issuePoints: any = await loyaltyTransactionService.issuePoints(
      manager,
      injector,
      {
        ...issuePointsInput5,
        organizationId: user.organization.id,
        loyaltyReferenceId: lri1
      }
    );
    expect(issuePoints.earnedPoints).toBe(50);

    let burnPointsInput = {
      externalCustomerId: externalCustomerId,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCardCode,
      statusCode: "101",
      pointsToRedeem: 50,
      externalTransationId: "",
      loyaltyReferenceId: issuePointsInput6.loyaltyReferenceId,
      burnFromLoyaltyCard: true,
      organizationId: user.organization.id,
      transactionData: {
        transactionType: "DELIVERY_ORDER",
        transactionDate: "2019-11-21",
        transactionChannel: "MOBILE_APP",
        totalAmount: 100,
        externalStoreId: "6858R"
      },
      orderData: {
        loyalty: {
          loyaltyType: "PAYMENT"
        },
        burnFromWallet: true,
        order: {
          externalStoreId: "1",
          externalOrderId: 101,
          totalAmount: "2000",
          orderType: "DELIVERY_ORDER",
          fulfillmentDate: "2019-09-09T00:00:00+05:30",
          couponCode: "",
          orderChannel: "MOBILE_APP",
          orderDate: "2017-05-08T00:00:00+05:30",
          payments: [],
          products: [
            {
              productCode: "PIZZ001133",
              name: "Non-Veg Supreme - Medium",
              productType: "PIZZA",
              isEDVOApplied: false,
              pricePerQty: 570,
              quantity: 1
            },
            {
              productCode: "ADDON001133",
              name: "Tomato",
              productType: "PIZZA_MANIA",
              isEDVOApplied: false,
              pricePerQty: 59,
              quantity: 1
            },
            {
              productCode: "GBR001133",
              name: "Garlic Breadsticks",
              productType: "SIDES",
              isEDVOApplied: false,
              pricePerQty: 99,
              quantity: 1
            }
          ]
        }
      }
    };
    console.log("burning points////////////////////////////////");
    let burnPoints: any = await loyaltyTransactionService.burnPoints(
      manager,
      injector,
      {
        ...burnPointsInput,
        loyaltyReferenceId: lri2
      }
    );
    console.log("burnPoints..", burnPoints);
    console.log(user.organization.id);
    expect(burnPoints.burnedPoints).toBe(50);
    let beforeTransaction = await getLoyaltyTransactionByLoyaltyReferenceId(
      manager,
      lri2
    );
    console.log("before transaction", beforeTransaction);
    let cancelLoyaltyTransactionInput = {
      externalCustomerId: externalCustomerId,
      loyaltyReferenceId: lri2,
      loyaltyType: loyaltyCode,
      completeEarn: true,
      completeBurn: true,
      organizationId: user.organization.id
    };

    let cancelTransaction = await loyaltyTransactionService.cancelLoyaltyTransaction(
      manager,
      injector,
      cancelLoyaltyTransactionInput
    );

    expect(cancelTransaction.status).toBe("CANCELLED");
    console.log("got Cancelled!!");

    let getTranasctionObject = await loyaltyTransactionService.getLoyaltyTransaction(
      manager,
      injector,
      issuePointsInput6.externalCustomerId,
      issuePoints.loyaltyCardCode
    );
    //   // console.log("get trans obj..", getTranasctionObject)

    let getTransactionLedgerRecords = await loyaltyTransactionService.getLedgerRecordsWithReferenceId(
      manager,
      getTranasctionObject[0].id
    );
    // console.log("...", getTransactionLedgerRecords)
    // expect(getTransactionLedgerRecords.details).toBe({ "1": 10 });
    expect(getTransactionLedgerRecords[0].details).toEqual({ "1": 50 });
  });
  // test("Cancel loyalty(Issue,Burn,Complete,cancel)", async () => {
  //   const manager = getManager();
  //   let issuePoints: any = await loyaltyTransactionService.issuePoints(
  //     manager,
  //     injector,
  //     {
  //       ...issuePointsInputGlobal,
  //       organizationId: user.organization.id
  //     }
  //   );
  //   expect(issuePoints.earnedPoints).toBe(50);

  //   let burnPointsInput = {
  //     externalCustomerId: externalCustomerId,
  //     loyaltyCode: loyaltyCode,
  //     loyaltyCardCode: loyaltyCardCode,
  //     statusCode: "101",
  //     externalTransationId: "",
  //     loyaltyReferenceId: issuePoints.loyaltyReferenceId,
  //     burnFromLoyaltyCard: true,
  //     organizationId: user.organization.id,
  //     transactionData: {
  //       transactionType: "DELIVERY_ORDER",
  //       transactionDate: "2019-11-21",
  //       transactionChannel: "MOBILE_APP",
  //       totalAmount: 100,
  //       externalStoreId: "6858R"
  //     },
  //     orderData: {
  //       loyalty: {
  //         loyaltyType: "PAYMENT"
  //       },
  //       burnFromWallet: true,
  //       order: {
  //         externalStoreId: "1",
  //         externalOrderId: 101,
  //         totalAmount: "2000",
  //         orderType: "DELIVERY_ORDER",
  //         fulfillmentDate: "2019-09-09T00:00:00+05:30",
  //         couponCode: "",
  //         orderChannel: "MOBILE_APP",
  //         orderDate: "2017-05-08T00:00:00+05:30",
  //         payments: [],
  //         products: [
  //           {
  //             productCode: "PIZZ001133",
  //             name: "Non-Veg Supreme - Medium",
  //             productType: "PIZZA",
  //             isEDVOApplied: false,
  //             pricePerQty: 570,
  //             quantity: 1
  //           },
  //           {
  //             productCode: "ADDON001133",
  //             name: "Tomato",
  //             productType: "PIZZA_MANIA",
  //             isEDVOApplied: false,
  //             pricePerQty: 59,
  //             quantity: 1
  //           },
  //           {
  //             productCode: "GBR001133",
  //             name: "Garlic Breadsticks",
  //             productType: "SIDES",
  //             isEDVOApplied: false,
  //             pricePerQty: 99,
  //             quantity: 1
  //           }
  //         ]
  //       }
  //     }
  //   };
  //   let burnPoints: any = await loyaltyTransactionService.burnPoints(
  //     manager,
  //     injector,
  //     { ...burnPointsInput, organization: user.organization.id }
  //   );
  //   console.log("burnPoints..", burnPoints);
  //   expect(burnPoints.burnedPoints).toBe(50);

  //   let loyaltyCompleted = await loyaltyTransactionService.loyaltyTransactionCompleted(
  //     manager,
  //     injector,
  //     issuePoints.loyaltyReferenceId
  //   );
  //   // console.log("loyaltyCompleted..", loyaltyCompleted)
  //   expect(loyaltyCompleted.statusCode).toBe(301);
  //   console.log("Is Completed!!");

  //   let cancelLoyaltyTransactionInput = {
  //     externalCustomerId: externalCustomerId,
  //     loyaltyReferenceId: issuePoints.loyaltyReferenceId,
  //     organizationId: user.organization.id
  //   };
  //   let cancelTransaction = loyaltyTransactionService.cancelLoyaltyTransaction(
  //     manager,
  //     injector,
  //     cancelLoyaltyTransactionInput
  //   );
  //   await expect(cancelTransaction).rejects.toThrow(
  //     new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_ALREADY_COMPLETED)
  //   );
  // });

  // test("Cancel loyalty(Issue,Burn,cancel,cancel)", async () => {
  //   const manager = getManager();
  //   let issuePointsInputIICC = {
  //     externalCustomerId: externalCustomerId,
  //     loyaltyCode: loyaltyCode,
  //     loyaltyCardCode: loyaltyCardCode,
  //     statusCode: "101",
  //     externalTransationId: "",
  //     loyaltyReferenceId: chance.string({ length: 8 }),
  //     burnFromLoyaltyCard: true,
  //     // organizationId: user.organization.id,
  //     transactionData: {
  //       transactionType: "DELIVERY_ORDER",
  //       transactionDate: "2019-08-10",
  //       transactionChannel: "MOBILE_APP",
  //       totalAmount: 100,
  //       externalStoreId: "6858R"
  //     },
  //     orderData: {
  //       loyalty: {
  //         loyaltyType: "PAYMENT"
  //       },
  //       burnFromWallet: true,
  //       order: {
  //         externalStoreId: "1",
  //         externalOrderId: 101,
  //         totalAmount: "2000",
  //         orderType: "DELIVERY_ORDER",
  //         fulfillmentDate: "2019-09-09T00:00:00+05:30",
  //         couponCode: "",
  //         orderChannel: "MOBILE_APP",
  //         orderDate: "2017-05-08T00:00:00+05:30",
  //         payments: [],
  //         products: [
  //           {
  //             productCode: "PIZZ001133",
  //             name: "Non-Veg Supreme - Medium",
  //             productType: "PIZZA",
  //             isEDVOApplied: false,
  //             pricePerQty: 570,
  //             quantity: 1
  //           },
  //           {
  //             productCode: "ADDON001133",
  //             name: "Tomato",
  //             productType: "PIZZA_MANIA",
  //             isEDVOApplied: false,
  //             pricePerQty: 59,
  //             quantity: 1
  //           },
  //           {
  //             productCode: "GBR001133",
  //             name: "Garlic Breadsticks",
  //             productType: "SIDES",
  //             isEDVOApplied: false,
  //             pricePerQty: 99,
  //             quantity: 1
  //           }
  //         ]
  //       }
  //     }
  //   };
  //   let issuePoints: any = await loyaltyTransactionService.issuePoints(
  //     manager,
  //     injector,
  //     {
  //       ...issuePointsInputIICC,
  //       organizationId: user.organization.id
  //     }
  //   );
  //   expect(issuePoints.earnedPoints).toBe(50);
  //   let burnPointsInput = {
  //     externalCustomerId: externalCustomerId,
  //     loyaltyCode: loyaltyCode,
  //     loyaltyCardCode: loyaltyCardCode,
  //     statusCode: "101",
  //     externalTransationId: "",
  //     loyaltyReferenceId: issuePointsInputIICC.loyaltyReferenceId,
  //     burnFromLoyaltyCard: true,
  //     organizationId: user.organization.id,
  //     transactionData: {
  //       transactionType: "DELIVERY_ORDER",
  //       transactionDate: "2019-11-21",
  //       transactionChannel: "MOBILE_APP",
  //       totalAmount: 100,
  //       externalStoreId: "6858R"
  //     },
  //     orderData: {
  //       loyalty: {
  //         loyaltyType: "PAYMENT"
  //       },
  //       burnFromWallet: true,
  //       order: {
  //         externalStoreId: "1",
  //         externalOrderId: 101,
  //         totalAmount: "2000",
  //         orderType: "DELIVERY_ORDER",
  //         fulfillmentDate: "2019-09-09T00:00:00+05:30",
  //         couponCode: "",
  //         orderChannel: "MOBILE_APP",
  //         orderDate: "2017-05-08T00:00:00+05:30",
  //         payments: [],
  //         products: [
  //           {
  //             productCode: "PIZZ001133",
  //             name: "Non-Veg Supreme - Medium",
  //             productType: "PIZZA",
  //             isEDVOApplied: false,
  //             pricePerQty: 570,
  //             quantity: 1
  //           },
  //           {
  //             productCode: "ADDON001133",
  //             name: "Tomato",
  //             productType: "PIZZA_MANIA",
  //             isEDVOApplied: false,
  //             pricePerQty: 59,
  //             quantity: 1
  //           },
  //           {
  //             productCode: "GBR001133",
  //             name: "Garlic Breadsticks",
  //             productType: "SIDES",
  //             isEDVOApplied: false,
  //             pricePerQty: 99,
  //             quantity: 1
  //           }
  //         ]
  //       }
  //     }
  //   };
  //   let burnPoints: any = await loyaltyTransactionService.burnPoints(
  //     manager,
  //     injector,
  //     { ...burnPointsInput, organization: user.organization.id }
  //   );
  //   expect(burnPoints.burnedPoints).toBe(50);

  //   let cancelLoyaltyTransactionInput1 = {
  //     externalCustomerId: externalCustomerId,
  //     loyaltyReferenceId: issuePointsInputIICC.loyaltyReferenceId,
  //     organizationId: user.organization.id
  //   };

  //   let cancelTransaction = await loyaltyTransactionService.cancelLoyaltyTransaction(
  //     manager,
  //     injector,
  //     cancelLoyaltyTransactionInput1
  //   );
  //   expect(cancelTransaction.status).toBe("CANCELLED");
  //   console.log("Got Cancelled!!");

  //   let cancelLoyaltyTransactionInput2 = {
  //     externalCustomerId: externalCustomerId,
  //     loyaltyReferenceId: issuePointsInputIICC.loyaltyReferenceId,
  //     organizationId: user.organization.id
  //   };

  //   let cancelTransaction2 = loyaltyTransactionService.cancelLoyaltyTransaction(
  //     manager,
  //     injector,
  //     cancelLoyaltyTransactionInput2
  //   );
  //   await expect(cancelTransaction2).rejects.toThrowError(
  //     new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_CANCELLED)
  //   );
  // });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
