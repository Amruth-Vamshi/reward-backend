// import { getConnection } from "typeorm";

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
import { validateCustomerLoyaltyData } from "../../common/utils/CustomerLoyaltyUtils";
import { CustomerLoyaltyProvider } from "../../customer-loyalty/customer-loyalty.provider";
import { LoyaltyCardProvider } from "../../loyalty-card/loyalty-card.provider";
import { CurrencyProvider } from "../../currency/currency.provider";
import { LoyaltyProgramProvider } from "../../loyalty-program/loyalty-program.provider";
import { CustomerProvider } from "../../../../../walkin-core/src/modules/customer/customer.providers";
import { customerModule } from "../../../../../walkin-core/src/modules/customer/customer.module";
import { WCoreError } from "../../../../../walkin-core/src/modules/common/exceptions";
// import { REWARDX_ERRORS } from "../../../../../walkin-core/src/modules/common/constants/errors";
import { REWARDX_ERRORS } from "../../common/constants/errors";

// packages/walkin-core/src/modules/customer/customer.providers.ts
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
// packages/walkin-core/src/entity/index.ts
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
// let loyaltyTransaction: RewardxEntities.LoyaltyTransaction;
var chance = new Chance();

let externalCustomerId = "+919999999999"; //`+91${chance.phone({ formatted: false })}`;
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
const injector = RewardXModule.injector;
// console.log("Injector is:-", injector);

beforeAll(async () => {
  await createUnitTestConnection({ ...CoreEntities, ...RewardxEntities });
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();

  application = await applicationService.createApplication(
    manager,
    user.organization.id,
    {
      name: chance.string({ length: 5 })
    }
  );

  let currencyInput = {
    code: chance.string({ length: 5 }), //   code: "RUPEE",
    conversionRatio: 1,
    name: chance.string({ length: 20 }) //   name: "Indian Rupee"
  };
  let currency = await currencyService.createCurrency(manager, currencyInput);
  // console.log("currency", currency)

  let loyaltyCardInput = {
    // code: chance.string({ length: 5 }), //
    code: loyaltyCardCode, //"RED001",
    currencyCode: currency.code, //   currencyCode: "RUPEE"
    description: chance.string({ length: 50 }), //   description: "Red Wallet "
    name: chance.string({ length: 20 }), //   name: "RED_WALLET
    organizationId: user.organization.id
  };
  let loyaltyCard = await loyaltyCardService.createLoyaltyCard(
    manager,
    loyaltyCardInput
  );
  // console.log("loyaltyCard", loyaltyCard)

  let statusInput1 = { statusId: 101, statusCode: "INITIATED" };
  let statusInput2 = { statusId: 201, statusCode: "PROCESSED" };
  let statusInput3 = { statusId: 301, statusCode: "COMPLETED" };
  let statusInput4 = { statusId: 401, statusCode: "CANCELLED" };

  let createStatusCode1 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
    manager,
    injector,
    statusInput1
  );
  // console.log("status code 1..", createStatusCode1)
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

  let createCustomerInput = {
    firstName: chance.string({ length: 10 }),
    lastName: chance.string({ length: 10 }),
    email: "pavani@getwalk.in",
    phoneNumber: externalCustomerId,
    gender: "FEMALE",
    dateOfBirth: "",
    externalCustomerId: externalCustomerId,
    customerIdentifier: externalCustomerId,
    //onboard_source: "",
    //extend: "",
    organization: user.organization.id,
    status: "ACTIVE"
  };
  let customer = await customerService.createOrUpdateCustomer(
    manager,
    createCustomerInput
  );
  // console.log("customer...", customer)

  let customerLoyaltyInput = {
    externalCustomerId: customer.externalCustomerId,
    organizationId: user.organization.id,
    loyaltyCardCode: loyaltyCardCode //"RED001"
    // loyaltyCard.code  //   code: "RED001
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

  // console.log("createCustomerLoyalty..", createCustomerLoyalty)
  let loyaltyRuleEntities = await ruleEntityService.ruleEntities(manager, {
    entityName: "Loyalty"
  });
  loyaltyRuleEntity = loyaltyRuleEntities[0];

  console.log("loyaltyRuleEntity ", loyaltyRuleEntity);

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

  console.log("orderTypeRuleAttribute ", orderTypeRuleAttribute);

  // console.log("createCustomerLoyalty..", createCustomerLoyalty)

  let ruleEntities = await ruleEntityService.ruleEntities(manager, {
    entityName: "Customer"
  });
  ruleEntity = ruleEntities[0];
  // console.log("ruleEntity is:-", ruleEntity);
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
  // console.log("ruleAttribute is:-", ruleAttribute);

  let ruleInput = {
    name: "test rule",
    description: "test",
    type: "CUSTOM",
    status: "ACTIVE",
    ruleConfiguration: "",
    ruleExpression: "(Customer['gender'] == 'FEMALE')",
    // "(Customer['externalCustomerId'] == '9999999999')",
    organizationId: user.organization.id

    //SIMPLE RULE(type: "SIMPLE" ) & INVALID RULE (Customer gender )
    // type: "SIMPLE",
    // status: "ACTIVE",
    //  ruleConfiguration: { "combinator": "and", "rules": [{ "ruleAttributeId": ruleAttribute.id, "expressionType": "EQUALS", "attributeValue": "FEMALE", "attributeEntityName": ruleEntity.entityName, "attributeName": ruleAttribute.attributeName }] },
    // ruleExpression: { test: "sample" },
    // organizationId: user.organization.id
  };
  rule = await ruleService.createRule(manager, ruleModule.injector, ruleInput);
  // console.log("rule is:-", rule);

  let loyaltyProgramInput = {
    name: chance.string({ length: 5 }),
    loyaltyCode: loyaltyCode,
    loyaltyCardCode: loyaltyCardCode, //"RED001",
    // loyaltyCard.code,
    organizationId: user.organization.id,
    expiryUnit: "DAY",
    expiryValue: 1,
    // chance.integer({ min: 10, max: 100 }),
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
    // earnRuleConfiguration: {
    //   type: "CUSTOM",
    //   ruleConfiguration: {},
    //   ruleExpression:
    //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
    // },
    // burnRuleConfiguration: {
    //   type: "CUSTOM",
    //   ruleConfiguration: {},
    //   ruleExpression:
    //     "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
    // },
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
    }
    // campaign: campaignInput
  };

  let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
    manager,
    injector,
    loyaltyProgramInput,
    user,
    null,
    CampaignModule.context
  );
  // console.log("loyaltyProgram..", loyaltyProgram)

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

  let audiences = await audienceService.createAudience(
    manager,
    user.organization,
    application,
    loyaltyProgram["campaign"],
    [segment],
    STATUS.ACTIVE
  );
  // console.log("audiences is:-", audiences);
});

describe("Block loyalty transaction", () => {
  let customerLoyaltyInput = {
    externalCustomerId: externalCustomerId,
    loyaltyCardCode: loyaltyCardCode //"RED001"
  };
  test("Block", async () => {
    const manager = getManager();
    let blockPointsInput = {
      externalCustomerId: externalCustomerId,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCardCode,
      statusCode: "101",
      externalTransationId: "harish",
      loyaltyReferenceId: chance.string({ length: 8 }),
      //issuePoints3.loyaltyReferenceId,
      burnFromLoyaltyCard: true,
      organizationId: user.organization.id,
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
    const blockPoints: any = await loyaltyTransactionService.blockPoints(
      manager,
      injector,
      blockPointsInput
    );
    expect(blockPoints.blockedPoints).toBe(10);
    let getCustomer: any = await customerLoyaltyService.getCustomerLoyalty(
      manager,
      injector,
      { ...customerLoyaltyInput, organizationId: user.organization.id }
    );
    expect(getCustomer.blockedPoints).toBe(10);

    let getTranasctionObject: any = await loyaltyTransactionService.getLoyaltyTransaction(
      manager,
      injector,
      blockPointsInput.externalCustomerId,
      blockPointsInput.loyaltyCardCode
    );
    expect(getTranasctionObject[0].pointsBlocked).toBe(10);

    let getTransactionLedgerRecords: any = await loyaltyTransactionService.getLedgerRecordsWithReferenceId(
      manager,
      getTranasctionObject[0].id
    );
    expect(getTransactionLedgerRecords[0].type).toBe("BLOCK");
    expect(getTransactionLedgerRecords[0].points).toBe(10);
  });
  test("Issue, Block", async () => {
    const manager = getManager();
    let issuePointsInputGlobal = {
      externalCustomerId: externalCustomerId,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCardCode,
      statusCode: "101",
      externalTransationId: "",
      loyaltyReferenceId: chance.string({ length: 8 }),
      burnFromLoyaltyCard: true,
      organizationId: user.organization.id,
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
    let issuePoints: any = await loyaltyTransactionService.issuePoints(
      manager,
      injector,
      issuePointsInputGlobal
    );
    expect(issuePoints.earnedPoints).toBe(10);

    let blockPointsInput = {
      externalCustomerId: externalCustomerId,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCardCode,
      statusCode: "101",
      externalTransationId: "harish",
      loyaltyReferenceId: issuePoints.loyaltyReferenceId,
      burnFromLoyaltyCard: true,
      organizationId: user.organization.id,
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
    const blockPoints: any = await loyaltyTransactionService.blockPoints(
      manager,
      injector,
      blockPointsInput
    );
    expect(blockPoints.blockedPoints).toBe(10);
  });
  test("Block, apply", async () => {
    const manager = getManager();
    let blockPointsInput = {
      externalCustomerId: externalCustomerId,
      loyaltyCode: loyaltyCode,
      loyaltyCardCode: loyaltyCardCode,
      statusCode: "101",
      externalTransationId: "harish",
      loyaltyReferenceId: chance.string({ length: 8 }),
      //issuePoints3.loyaltyReferenceId,
      burnFromLoyaltyCard: true,
      organizationId: user.organization.id,
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
    const blockPoints: any = await loyaltyTransactionService.blockPoints(
      manager,
      injector,
      blockPointsInput
    );
    expect(blockPoints.blockedPoints).toBe(10);
    let getCustomer: any = await customerLoyaltyService.getCustomerLoyalty(
      manager,
      injector,
      { ...customerLoyaltyInput, organizationId: user.organization.id }
    );
    expect(getCustomer.blockedPoints).toBe(30);

    let getTranasctionObject: any = await loyaltyTransactionService.getLoyaltyTransaction(
      manager,
      injector,
      blockPointsInput.externalCustomerId,
      blockPointsInput.loyaltyCardCode
    );
    expect(getTranasctionObject[0].pointsBlocked).toBe(10);

    let getTransactionLedgerRecords: any = await loyaltyTransactionService.getLedgerRecordsWithReferenceId(
      manager,
      getTranasctionObject[0].id
    );
    expect(getTransactionLedgerRecords[0].type).toBe("BLOCK");
    expect(getTransactionLedgerRecords[0].points).toBe(10);

    let applyBlockInput = {
      loyaltyReferenceId: blockPointsInput.loyaltyReferenceId
    };
    // console.log("loyaltyReferenceId..", applyBlockInput);

    let applyBlockResponse = await loyaltyTransactionService.applyBlock(
      manager,
      injector,
      applyBlockInput.loyaltyReferenceId
    );
    let getCustomer1: any = await customerLoyaltyService.getCustomerLoyalty(
      manager,
      injector,
      { ...customerLoyaltyInput, organizationId: user.organization.id }
    );
    expect(getCustomer1.blockedPoints).toBe(20);

    //Need to get transaction objects here
    // let getTranasctionObject1: any = await loyaltyTransactionService.getLoyaltyTransaction(
    //   manager,
    //   injector,
    //   blockPointsInput.externalCustomerId,
    //   blockPointsInput.loyaltyCardCode
    // );
    // console.log("getTranasctionObject1..", getTranasctionObject1)
    // // expect(getTranasctionObject1[0].pointsBlocked).toBe(0);

    // let getTransactionLedgerRecords1: any = await loyaltyTransactionService.getLedgerRecordsWithReferenceId(
    //   manager,
    //   getTranasctionObject[0].id
    // );
    // console.log("getTransactionLedgerRecords1..", getTransactionLedgerRecords1)
    // expect(getTransactionLedgerRecords1[3].type).toBe("UNBLOCK");
    // expect(getTransactionLedgerRecords1[3].points).toBe(10);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
