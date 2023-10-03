//NOTE: Since the test cases were skipped. I am commenting them completely @thejeshgn
//And adding a very simple test case and skipping it to keep this going

describe.skip("loyaltyResolvers.spec.ts  unit tests", () => {
  test.skip("loyaltyResolvers.spec.ts test", () => { });
});

// // import { getConnection } from "typeorm";
// import { getManager, getConnection, EntityManager } from "typeorm";
// import { ApplicationModule } from "@walkinserver/walkin-core/src/modules/account/application/application.module";
// import { ApplicationProvider } from "@walkinserver/walkin-core/src/modules/account/application/application.providers";
// import { segmentModule } from "@walkinserver/walkin-core/src/modules/segment/segment.module";
// import { SegmentProvider } from "@walkinserver/walkin-core/src/modules/segment/segment.providers";
// import { ruleModule } from "@walkinserver/walkin-core/src/modules/rule/rule.module";
// import { RuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/rule.provider";
// import { RuleEntityProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/rule-entity.provider";
// import { RuleAttributeProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/rule-attribute.provider";
// import { audienceModule } from "@walkinserver/walkin-core/src/modules/audience/audience.module";
// import { AudienceProvider } from "@walkinserver/walkin-core/src/modules/audience/audience.providers";
// import { campaignModule } from "@walkinserver/walkin-core/src/modules/campaigns/campaign.module";
// import { CampaignProvider } from "@walkinserver/walkin-core/src/modules/campaigns/campaign.providers";
// import { LoyaltyTransactionProvider } from "../loyalty-transaction.provider";
// import { LoyaltyTransactionModule } from "../loyalty-transaction.module";
// import * as CoreEntities from "@walkinserver/walkin-core/src/entity";
// import * as RewardxEntities from "../../../entity";
// import Chance from "chance";
// import moment from "moment";
// import { validateCustomerLoyaltyData } from "../../common/utils/CustomerLoyaltyUtils";
// import { CustomerLoyaltyProvider } from "../../customer-loyalty/customer-loyalty.provider";
// import { LoyaltyCardProvider } from "../../loyalty-card/loyalty-card.provider";
// import { CurrencyProvider } from "../../currency/currency.provider";
// import { LoyaltyProgramProvider } from "../../loyalty-program/loyalty-program.provider";
// import { CustomerProvider } from "@walkinserver/walkin-core/src/modules/customer/customer.providers";
// import { customerModule } from "@walkinserver/walkin-core/src/modules/customer/customer.module";
// import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
// // import { REWARDX_ERRORS } from "../../../../../walkin-core/src/modules/common/constants/errors";
// import { REWARDX_ERRORS } from "../../common/constants/errors";
// import { Stores } from "@walkinserver/walkin-core/src/modules/account/store/store.providers";
// import { StoreModule } from "@walkinserver/walkin-core/src/modules/account/store/store.module";
// import { StoreFormatModule } from "@walkinserver/walkin-core/src/modules/productcatalog/storeformat/storeFormat.module";
// import { TaxTypeModule } from "@walkinserver/walkin-core/src/modules/productcatalog/taxtype/taxtype.module";
// import { ChannelModule } from "@walkinserver/walkin-core/src/modules/productcatalog/channel/channel.module";
// import { CatalogModule } from "@walkinserver/walkin-core/src/modules/productcatalog/catalog/catalog.module";
// import { BusinessRuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/business_rule.provider";
// import { resolvers } from "../loyalty-transaction.resolvers";

// // packages/walkin-core/src/modules/customer/customer.providers.ts
// import {
//   createUnitTestConnection,
//   getAdminUser,
//   closeUnitTestConnection
// } from "@walkinserver/walkin-core/__tests__/utils/unit";
// import { RewardXModule } from "../../..";
// import { from } from "zen-observable";
// import {
//   STATUS,
//   VALUE_TYPE,
//   SEGMENT_TYPE,
//   CAMPAIGN_TYPE,
//   CAMPAIGN_TRIGGER_TYPE,
//   RULE_TYPE
// } from "@walkinserver/walkin-core/src/modules/common/constants";
// import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
// import { TaxTypeProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/taxtype/taxtype.providers";
// import { StoreFormatProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/storeformat/storeFormat.providers";
// import { ChannelProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/channel/channel.providers";
// import { CatalogProvider } from "../../../../../walkin-core/src/modules/productcatalog/catalog/catalog.providers";
// // packages/walkin-core/src/entity/index.ts
// let application: CoreEntities.Application;
// let segment: CoreEntities.Segment;
// let rule: CoreEntities.Rule;
// let ruleAttribute: CoreEntities.RuleAttribute;
// let ruleEntity: CoreEntities.RuleEntity;
// let audience: CoreEntities.Audience;
// let campaign: CoreEntities.Campaign;
// let loyaltyProgram: RewardxEntities.LoyaltyProgram;
// let currency: RewardxEntities.Currency;
// let loyaltyCard: RewardxEntities.LoyaltyCard;
// let user: CoreEntities.User;
// let referenceId: "ORD872105";
// let loyaltyReferenceId1: "ORD872106";
// let customerLoyalty: RewardxEntities.CustomerLoyalty;
// let customer = CoreEntities.Customer;
// // let loyaltyTransaction: RewardxEntities.LoyaltyTransaction;
// var chance = new Chance();

// let externalCustomerId = "9999999999"; //`+91${chance.phone({ formatted: false })}`;
// let externalCustomerId2 = "9999999998";
// let loyaltyCardCode = "RED001";
// let loyaltyCode = "PAYMENT";

// jest.mock("i18n");

// let evaluateRuleInput = {
//   ruleName: "sample",
//   organizationId: "20",
//   data: {
//     name: "test rule",
//     product: {
//       name: "sample",
//       price: 50
//     }
//   },
//   ruleId: "1"
// };

// const applicationService: ApplicationProvider = ApplicationModule.injector.get(
//   ApplicationProvider
// );

// const segmentService: SegmentProvider = segmentModule.injector.get(
//   SegmentProvider
// );

// const ruleService: RuleProvider = ruleModule.injector.get(RuleProvider);

// const ruleAttributeService: RuleAttributeProvider = ruleModule.injector.get(
//   RuleAttributeProvider
// );

// const ruleEntityService: RuleEntityProvider = ruleModule.injector.get(
//   RuleEntityProvider
// );

// const audienceService: AudienceProvider = audienceModule.injector.get(
//   AudienceProvider
// );

// const campaignService: CampaignProvider = campaignModule.injector.get(
//   CampaignProvider
// );
// const customerService: CustomerProvider = customerModule.injector.get(
//   CustomerProvider
// );
// const loyaltyTransactionService: LoyaltyTransactionProvider = RewardXModule.injector.get(
//   LoyaltyTransactionProvider
// );
// const customerLoyaltyService: CustomerLoyaltyProvider = RewardXModule.injector.get(
//   CustomerLoyaltyProvider
// );
// const loyaltyCardService: LoyaltyCardProvider = RewardXModule.injector.get(
//   LoyaltyCardProvider
// );
// const currencyService: CurrencyProvider = RewardXModule.injector.get(
//   CurrencyProvider
// );
// const loyaltyProgramService: LoyaltyProgramProvider = RewardXModule.injector.get(
//   LoyaltyProgramProvider
// );
// const storeService: Stores = StoreModule.injector.get(Stores);
// const businessRuleservice: BusinessRuleProvider = ruleModule.injector.get(
//   BusinessRuleProvider
// );
// const storeFormatProvider = StoreFormatModule.injector.get(StoreFormatProvider);
// const taxTypeProvider = TaxTypeModule.injector.get(TaxTypeProvider);
// const channelProvider = ChannelModule.injector.get(ChannelProvider);
// const catalogProvider = CatalogModule.injector.get(CatalogProvider);
// const injector = RewardXModule.injector;
// // console.log("Injector is:-", injector);

// beforeAll(async () => {
//   await createUnitTestConnection({ ...CoreEntities, ...RewardxEntities });
//   ({ user } = await getAdminUser(getConnection()));
//   const manager = getManager();

//   // console.log("user 1..", user);

//   application = await applicationService.createApplication(
//     manager,
//     user.organization.id,
//     {
//       name: chance.string({ length: 5 })
//     }
//   );
//   // console.log("application 1...", application);

//   let currencyInput = {
//     code: chance.string({ length: 5 }), //   code: "RUPEE",
//     conversionRatio: 1,
//     name: chance.string({ length: 20 }) //   name: "Indian Rupee"
//   };
//   let currency = await currencyService.createCurrency(manager, currencyInput);
//   // console.log("currency", currency)

//   let loyaltyCardInput = {
//     code: loyaltyCardCode, //"RED001",
//     currencyCode: currency.code, //   currencyCode: "RUPEE"
//     description: chance.string({ length: 50 }), //   description: "Red Wallet "
//     name: chance.string({ length: 20 }), //   name: "RED_WALLET
//     organizationId: user.organization.id
//   };
//   let loyaltyCard = await loyaltyCardService.createLoyaltyCard(
//     manager,
//     loyaltyCardInput
//   );
//   // console.log("loyaltyCard", loyaltyCard)

//   let statusInput1 = { statusId: 101, statusCode: "INITIATED" };
//   let statusInput2 = { statusId: 201, statusCode: "PROCESSED" };
//   let statusInput3 = { statusId: 301, statusCode: "COMPLETED" };
//   let statusInput4 = { statusId: 401, statusCode: "CANCELLED" };

//   let createStatusCode1 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
//     manager,
//     injector,
//     statusInput1
//   );
//   // console.log("status code 1..", createStatusCode1)
//   expect(createStatusCode1.statusId).toBe(101);
//   let createStatusCode2 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
//     manager,
//     injector,
//     statusInput2
//   );
//   expect(createStatusCode2.statusId).toBe(201);
//   let createStatusCode3 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
//     manager,
//     injector,
//     statusInput3
//   );
//   expect(createStatusCode3.statusId).toBe(301);
//   let createStatusCode4 = await loyaltyTransactionService.createLoyaltyTransactionStatusCodes(
//     manager,
//     injector,
//     statusInput4
//   );
//   expect(createStatusCode4.statusId).toBe(401);

//   let createCustomerInput = {
//     firstName: chance.string({ length: 10 }),
//     lastName: chance.string({ length: 10 }),
//     email: "pavani@getwalk.in",
//     phoneNumber: externalCustomerId,
//     gender: "FEMALE",
//     dateOfBirth: "",
//     externalCustomerId: externalCustomerId,
//     customerIdentifier: externalCustomerId,
//     //onboard_source: "",
//     //extend: "",
//     organization: user.organization.id,
//     status: "ACTIVE"
//   };
//   let customer = await customerService.createOrUpdateCustomer(
//     manager,
//     createCustomerInput
//   );
//   // console.log("customer...", customer)

//   let customerLoyaltyInput = {
//     externalCustomerId: customer.externalCustomerId,
//     organizationId: user.organization.id,
//     loyaltyCardCode: loyaltyCardCode //"RED001"
//     // loyaltyCard.code  //   code: "RED001
//   };

//   let createCustomerLoyalty: any = await customerLoyaltyService.createCustomerLoyalty(
//     manager,
//     injector,
//     customerLoyaltyInput
//   );
//   // console.log("createCustomerLoyalty..", createCustomerLoyalty)

//   let ruleEntities = await ruleEntityService.ruleEntities(manager, {
//     entityName: "Customer"
//   });
//   ruleEntity = ruleEntities[0];
//   // console.log("ruleEntity is:-", ruleEntity);
//   let ruleAttributeInput = {
//     attributeName: "gender",
//     description: "Attribute is for gender",
//     status: STATUS.ACTIVE,
//     attributeValueType: VALUE_TYPE.STRING,
//     ruleEntityId: ruleEntity.id,
//     organizationId: user.organization.id
//   };

//   let ruleAttributes = await ruleAttributeService.ruleAttributes(manager, {
//     attributeName: "gender"
//   });
//   ruleAttribute = ruleAttributes[0];
//   // console.log("ruleAttribute is:-", ruleAttribute);

//   let ruleInput = {
//     name: "test rule",
//     description: "test",
//     type: "CUSTOM",
//     status: "ACTIVE",
//     ruleConfiguration: "",
//     ruleExpression: "(Customer['gender'] == 'FEMALE')",
//     // "(Customer['externalCustomerId'] == '9999999999')",
//     organizationId: user.organization.id

//     // SIMPLE RULE(type: "SIMPLE" ) & INVALID RULE (Customer gender )
//     // type: "SIMPLE",
//     // status: "ACTIVE",
//     //  ruleConfiguration: { "combinator": "and", "rules": [{ "ruleAttributeId": ruleAttribute.id, "expressionType": "EQUALS", "attributeValue": "FEMALE", "attributeEntityName": ruleEntity.entityName, "attributeName": ruleAttribute.attributeName }] },
//     // ruleExpression: { test: "sample" },
//     // organizationId: user.organization.id
//   };
//   rule = await ruleService.createRule(manager, ruleInput);
//   // console.log("rule is:-", rule);

//   let loyaltyProgramInput = {
//     name: chance.string({ length: 5 }),
//     loyaltyCode: loyaltyCode,
//     loyaltyCardCode: loyaltyCardCode, //"RED001",
//     // loyaltyCard.code,
//     organizationId: user.organization.id,
//     expiryUnit: "DAY",
//     expiryValue: 1,
//     // chance.integer({ min: 10, max: 100 }),
//     campaign: {
//       name: "Campaign1",
//       campaignType: CAMPAIGN_TYPE.LOYALTY,
//       startTime: moment()
//         .subtract(1, "days")
//         .format(),
//       endTime: moment()
//         .add(10, "days")
//         .format(),
//       organization_id: user.organization.id
//     },
//     earnRuleConfiguration: {
//       type: "CUSTOM",
//       ruleConfiguration: {},
//       ruleExpression:
//         "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
//     },
//     burnRuleConfiguration: {
//       type: "CUSTOM",
//       ruleConfiguration: {},
//       ruleExpression:
//         "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
//     },
//     expiryRuleConfiguration: {
//       type: "CUSTOM",
//       ruleConfiguration: {},
//       ruleExpression:
//         "(Loyalty['totalAmount'] == 100 && Loyalty['orderType'] == 'Square'?12:10)"
//     }
//     // campaign: campaignInput
//   };

//   let loyaltyProgram: any = await loyaltyProgramService.createLoyaltyProgram(
//     manager,
//     injector,
//     loyaltyProgramInput,
//     null
//   );
//   // console.log("loyaltyProgram..", loyaltyProgram)

//   segment = await segmentService.createSegment(
//     manager,
//     chance.string({ length: 5 }),
//     chance.string({ length: 100 }),
//     SEGMENT_TYPE.CUSTOM,
//     user.organization,
//     application,
//     rule.id,
//     STATUS.ACTIVE
//   );

//   // console.log("segment is:-", segment);

//   let audiences = await audienceService.createAudience(
//     manager,
//     user.organization,
//     application,
//     loyaltyProgram["campaign"],
//     [segment],
//     STATUS.ACTIVE
//   );
//   // console.log("audiences is:-", audiences);

//   const channelInput = {
//     name: chance.string({ length: 5 }),
//     channelCode: chance.string({ length: 5 })
//   };

//   const channel = await channelProvider.createChannel(
//     manager,
//     channelInput,
//     user.organization.id
//   );

//   const catalogInput = {
//     name: chance.string({ length: 5 }),
//     description: chance.string({ length: 5 }),
//     catalogCode: chance.string({ length: 5 }),
//     organizationId: user.organization.id,
//     usage: {
//       purpose: chance.string({ length: 10 })
//     }
//   };

//   const catalog = await catalogProvider.createCatalog(manager, catalogInput);

//   const taxTypeInput = {
//     name: chance.string({ length: 5 }),
//     taxTypeCode: chance.string({ length: 5 }),
//     description: "",
//     status: STATUS.ACTIVE,
//     organizationId: user.organization.id
//   };

//   const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

//   const storeFormatInput = {
//     name: chance.company(),
//     description: chance.string({ length: 5 }),
//     storeFormatCode: chance.string({ length: 5 }),
//     status: STATUS.ACTIVE,
//     organizationId: user.organization.id,
//     taxTypeCodes: [taxType.taxTypeCode]
//   };

//   const storeFormat = await storeFormatProvider.createStoreFormat(
//     manager,
//     storeFormatInput
//   );

//   const storeInput = {
//     name: "Store1",
//     STATUS: "ACTIVE",
//     code: "66640",
//     externalStoreId: "66640",
//     parentOrganizationId: user.organization.id,
//     storeFormats: [storeFormat],
//     catalog,
//     channels: [channel]
//   };
//   const createStore = await storeService.createStore(manager, storeInput);
//   expect(createStore.externalStoreId).toBe("66640");

//   const businessRuleInputEarn1 = {
//     ruleLevel: "LOYALTY",
//     ruleType: "TRANSACTION_EARN_ORDER_CHANNEL",
//     ruleDefaultValue: '["MOBILE_APP"]'
//   };
//   const createBusinessRule = await businessRuleservice.createBusinessRule(
//     manager,
//     businessRuleInputEarn1
//   );
//   const businessRuleInputEarn2 = {
//     ruleLevel: "LOYALTY",
//     ruleType: "TRANSACTION_EARN_ORDER_TYPE",
//     ruleDefaultValue:
//       '["DELIVERY_ORDER","ADVANCED_ORDER","BULK_ORDER","TAKE_AWAY"]'
//   };
//   const createBusinessRule1 = await businessRuleservice.createBusinessRule(
//     manager,
//     businessRuleInputEarn2
//   );

//   const businessRuleInputBurn1 = {
//     ruleLevel: "LOYALTY",
//     ruleType: "TRANSACTION_BURN_ORDER_CHANNEL",
//     ruleDefaultValue: '["MOBILE_APP"]'
//   };
//   const createBusinessRule2 = await businessRuleservice.createBusinessRule(
//     manager,
//     businessRuleInputBurn1
//   );

//   const businessRuleInputBurn2 = {
//     ruleLevel: "LOYALTY",
//     ruleType: "TRANSACTION_BURN_ORDER_TYPE",
//     ruleDefaultValue:
//       '["DELIVERY_ORDER","DELIVERY_ORDER","ADVANCED_ORDER","BULK_ORDER","TAKE_AWAY"]'
//   };
//   const createBusinessRule3 = await businessRuleservice.createBusinessRule(
//     manager,
//     businessRuleInputBurn2
//   );

//   const businessRuleInputEarn = {
//     ruleLevel: "LOYALTY",
//     ruleType: "TRANSACTION_EARN_LIMIT",
//     ruleDefaultValue: "50"
//   };
//   const createBusinessRuleEarnAction = await businessRuleservice.createBusinessRule(
//     manager,
//     businessRuleInputEarn
//   );

//   const businessRuleInputBurn = {
//     ruleLevel: "LOYALTY",
//     ruleType: "TRANSACTION_BURN_LIMIT",
//     ruleDefaultValue: "50"
//   };
//   const createBusinessRuleBurnAction = await businessRuleservice.createBusinessRule(
//     manager,
//     businessRuleInputBurn
//   );
// });

// describe("RWX-jubilant loyalty transaction", () => {
//   test.skip("Issuance,Reduce (Actual issue points is 60, But business rule limit is 50.So issueing 50 points)", async () => {
//     const manager = getManager();
//     const processLoyaltyIssuanceInput = {
//       externalCustomerId: externalCustomerId,
//       loyaltyReferenceId: chance.string({ length: 10 }),
//       loyaltyType: "PAYMENT",
//       organizationId: user.organization.id,
//       data: {
//         order: {
//           externalStoreId: "66640",
//           externalOrderId: 101,
//           totalAmount: "2000",
//           orderType: "DELIVERY_ORDER",
//           fulfillmentDate: "2020-01-09T00:00:00+05:30",
//           couponCode: "",
//           orderChannel: "MOBILE_APP",
//           orderDate: "2020-01-27T00:00:00+05:30",
//           payments: [],
//           products: [
//             {
//               productCode: "PIZZ001133",
//               name: "Non-Veg Supreme - Medium",
//               productType: "PIZZA",
//               isEDVOApplied: false,
//               pricePerQty: 30,
//               quantity: 10
//             },
//             {
//               productCode: "PIZZ001133",
//               name: "Non-Veg Supreme - Medium",
//               productType: "PIZZA",
//               isEDVOApplied: false,
//               pricePerQty: 250,
//               quantity: 1
//             },
//             {
//               productCode: "ADDON001133",
//               name: "Tomato",
//               productType: "PIZZA_MANIA",
//               isEDVOApplied: false,
//               pricePerQty: 50.5,
//               quantity: 1
//             }
//           ]
//         }
//       }
//     };
//     const processLoyaltyIssuance = await resolvers.Mutation.processLoyaltyIssuance(
//       { application, user },
//       processLoyaltyIssuanceInput,
//       { injector }
//     );
//     expect(processLoyaltyIssuance.earnedPoints).toBe(50);
//     let getCustomer: any = await customerLoyaltyService.getCustomerLoyalty(
//       manager,
//       injector,
//       {
//         externalCustomerId: externalCustomerId,
//         organizationId: user.organization.id
//       }
//     );
//     expect(getCustomer.overallPoints).toBe(50);
//     const processLoyaltyRedemptionInput = {
//       externalCustomerId: externalCustomerId,
//       loyaltyReferenceId: chance.string({ length: 10 }),
//       loyaltyType: "PAYMENT",
//       organizationId: user.organization.id,
//       pointsToRedeem: 60,
//       data: {
//         burnFromWallet: true,
//         order: {
//           externalStoreId: "66640",
//           externalOrderId: 101,
//           totalAmount: "2000",
//           orderType: "DELIVERY_ORDER",
//           fulfillmentDate: "2020-01-09T00:00:00+05:30",
//           couponCode: "",
//           orderChannel: "MOBILE_APP",
//           orderDate: "2020-01-27T00:00:00+05:30",
//           payments: [],
//           products: [
//             {
//               productCode: "PIZZ001133",
//               name: "Non-Veg Supreme - Medium",
//               productType: "PIZZA",
//               isEDVOApplied: false,
//               pricePerQty: 30,
//               quantity: 10
//             },
//             {
//               productCode: "PIZZ001133",
//               name: "Non-Veg Supreme - Medium",
//               productType: "PIZZA",
//               isEDVOApplied: false,
//               pricePerQty: 250,
//               quantity: 1
//             },
//             {
//               productCode: "ADDON001133",
//               name: "Tomato",
//               productType: "PIZZA_MANIA",
//               isEDVOApplied: false,
//               pricePerQty: 50.5,
//               quantity: 1
//             }
//           ]
//         }
//       }
//     };
//     const processLoyaltyRedemption = await resolvers.Mutation.processLoyaltyRedemption(
//       { application, user },
//       processLoyaltyRedemptionInput,
//       { injector }
//     );
//     expect(processLoyaltyRedemption.burnedPoints).toBe(50);
//     let getCustomer2: any = await customerLoyaltyService.getCustomerLoyalty(
//       manager,
//       injector,
//       {
//         externalCustomerId: externalCustomerId,
//         organizationId: user.organization.id
//       }
//     );
//     expect(getCustomer2.overallPoints).toBe(0);
//   });
//   test.skip("Issuance(Invalid store code-- Issues 0 points insted of 60),", async () => {
//     const manager = getManager();
//     const processLoyaltyIssuanceInput = {
//       externalCustomerId: externalCustomerId,
//       loyaltyReferenceId: chance.string({ length: 10 }),
//       loyaltyType: "PAYMENT",
//       organizationId: user.organization.id,
//       data: {
//         order: {
//           externalStoreId: "66630",
//           externalOrderId: 101,
//           totalAmount: "2000",
//           orderType: "DELIVERY_ORDER",
//           fulfillmentDate: "2020-01-09T00:00:00+05:30",
//           couponCode: "",
//           orderChannel: "MOBILE_APP",
//           orderDate: "2020-01-27T00:00:00+05:30",
//           payments: [],
//           products: [
//             {
//               productCode: "PIZZ001133",
//               name: "Non-Veg Supreme - Medium",
//               productType: "PIZZA",
//               isEDVOApplied: false,
//               pricePerQty: 30,
//               quantity: 10
//             },
//             {
//               productCode: "PIZZ001133",
//               name: "Non-Veg Supreme - Medium",
//               productType: "PIZZA",
//               isEDVOApplied: false,
//               pricePerQty: 250,
//               quantity: 1
//             },
//             {
//               productCode: "ADDON001133",
//               name: "Tomato",
//               productType: "PIZZA_MANIA",
//               isEDVOApplied: false,
//               pricePerQty: 50.5,
//               quantity: 1
//             }
//           ]
//         }
//       }
//     };
//     const processLoyaltyIssuance = await resolvers.Mutation.processLoyaltyIssuance(
//       { application, user },
//       processLoyaltyIssuanceInput,
//       { injector }
//     );
//     expect(processLoyaltyIssuance.earnedPoints).toBe(0);
//   });
// });

// describe("Rewardx-jfl loyalty transaction redemption", () => {
//     test.skip("Redemption (Trying to reduce 10 points -- Insufficient balance)", async () => {
//       const manager = getManager();
//       const processLoyaltyRedemptionInput = {
//         externalCustomerId: externalCustomerId,
//         loyaltyReferenceId: chance.string({ length: 10 }),
//         loyaltyType: "PAYMENT",
//         organizationId: user.organization.id,
//         pointsToRedeem: 10,
//         data: {
//           burnFromWallet: true,
//           order: {
//             externalStoreId: "66640",
//             externalOrderId: 101,
//             totalAmount: "2000",
//             orderType: "DELIVERY_ORDER",
//             fulfillmentDate: "2020-01-09T00:00:00+05:30",
//             couponCode: "",
//             orderChannel: "MOBILE_APP",
//             orderDate: "2020-01-27T00:00:00+05:30",
//             payments: [],
//             products: [
//               {
//                 productCode: "PIZZ001133",
//                 name: "Non-Veg Supreme - Medium",
//                 productType: "PIZZA",
//                 isEDVOApplied: false,
//                 pricePerQty: 30,
//                 quantity: 10
//               },
//               {
//                 productCode: "PIZZ001133",
//                 name: "Non-Veg Supreme - Medium",
//                 productType: "PIZZA",
//                 isEDVOApplied: false,
//                 pricePerQty: 250,
//                 quantity: 1
//               },
//               {
//                 productCode: "ADDON001133",
//                 name: "Tomato",
//                 productType: "PIZZA_MANIA",
//                 isEDVOApplied: false,
//                 pricePerQty: 50.5,
//                 quantity: 1
//               }
//             ]
//           }
//         }
//       };
//       const processLoyaltyRedemption: any = resolvers.Mutation.processLoyaltyRedemption(
//         { application, user },
//         processLoyaltyRedemptionInput,
//         { injector }
//       );
//       console.log("processLoyaltyRedemption..", processLoyaltyRedemption);
//       await expect(processLoyaltyRedemption).rejects.toThrow(
//         new WCoreError(REWARDX_ERRORS.INSUFFICIENT_BALANCE)
//       );
//       // await expect(processLoyaltyRedemption).rejects.toThrow("Insufficient balance")
//     });
//     test.skip("Redemption (Trying to reduce 0 points-- Reduce points should be > ZERO)", async () => {
//       const manager = getManager();
//       const processLoyaltyRedemptionInput = {
//         externalCustomerId: externalCustomerId,
//         loyaltyReferenceId: chance.string({ length: 10 }),
//         loyaltyType: "PAYMENT",
//         organizationId: user.organization.id,
//         pointsToRedeem: 0,
//         data: {
//           burnFromWallet: true,
//           order: {
//             externalStoreId: "66640",
//             externalOrderId: 101,
//             totalAmount: "2000",
//             orderType: "DELIVERY_ORDER",
//             fulfillmentDate: "2020-01-09T00:00:00+05:30",
//             couponCode: "",
//             orderChannel: "MOBILE_APP",
//             orderDate: "2020-01-27T00:00:00+05:30",
//             payments: [],
//             products: [
//               {
//                 productCode: "PIZZ001133",
//                 name: "Non-Veg Supreme - Medium",
//                 productType: "PIZZA",
//                 isEDVOApplied: false,
//                 pricePerQty: 30,
//                 quantity: 10
//               },
//               {
//                 productCode: "PIZZ001133",
//                 name: "Non-Veg Supreme - Medium",
//                 productType: "PIZZA",
//                 isEDVOApplied: false,
//                 pricePerQty: 250,
//                 quantity: 1
//               },
//               {
//                 productCode: "ADDON001133",
//                 name: "Tomato",
//                 productType: "PIZZA_MANIA",
//                 isEDVOApplied: false,
//                 pricePerQty: 50.5,
//                 quantity: 1
//               }
//             ]
//           }
//         }
//       };
//       const processLoyaltyRedemption: any = resolvers.Mutation.processLoyaltyRedemption(
//         { application, user },
//         processLoyaltyRedemptionInput,
//         { injector }
//       );
//       await expect(processLoyaltyRedemption).rejects.toThrow(
//         new WCoreError(REWARDX_ERRORS.REDUCE_POINTS_SHOULD_BE_GT_ZERO)
//       );
//     });
//     test.skip("Redemption (Trying to reduce 10 points to new customer--Throw customer not found error)", async () => {
//       const manager = getManager();
//       const processLoyaltyRedemptionInput = {
//         externalCustomerId: externalCustomerId2,
//         loyaltyReferenceId: chance.string({ length: 10 }),
//         loyaltyType: "PAYMENT",
//         organizationId: user.organization.id,
//         pointsToRedeem: 10,
//         data: {
//           burnFromWallet: true,
//           order: {
//             externalStoreId: "66640",
//             externalOrderId: 101,
//             totalAmount: "2000",
//             orderType: "DELIVERY_ORDER",
//             fulfillmentDate: "2020-01-09T00:00:00+05:30",
//             couponCode: "",
//             orderChannel: "MOBILE_APP",
//             orderDate: "2020-01-27T00:00:00+05:30",
//             payments: [],
//             products: [
//               {
//                 productCode: "PIZZ001133",
//                 name: "Non-Veg Supreme - Medium",
//                 productType: "PIZZA",
//                 isEDVOApplied: false,
//                 pricePerQty: 30,
//                 quantity: 10
//               },
//               {
//                 productCode: "PIZZ001133",
//                 name: "Non-Veg Supreme - Medium",
//                 productType: "PIZZA",
//                 isEDVOApplied: false,
//                 pricePerQty: 250,
//                 quantity: 1
//               },
//               {
//                 productCode: "ADDON001133",
//                 name: "Tomato",
//                 productType: "PIZZA_MANIA",
//                 isEDVOApplied: false,
//                 pricePerQty: 50.5,
//                 quantity: 1
//               }
//             ]
//           }
//         }
//       };
//       const processLoyaltyRedemption: any = resolvers.Mutation.processLoyaltyRedemption(
//         { application, user },
//         processLoyaltyRedemptionInput,
//         { injector }
//       );
//       await expect(processLoyaltyRedemption).rejects.toThrow(
//         new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND)
//       );
//     });
// });
// afterAll(async () => {
//   await closeUnitTestConnection();
// });
