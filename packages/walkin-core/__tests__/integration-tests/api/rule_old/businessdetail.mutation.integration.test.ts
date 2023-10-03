// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import {
//     BUSINESS_RULE_LEVELS
// } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//     randomBRuleType,
//     randomBRuleValue

// } from "../../utils/index";
// let orgId;
// import {
//     createauthorg,
//     createnewbusinessrule,
//     createnewbusinessrule1,
//     createnewbusinessruledetail,
//     createnewbusinessruledetail1,
//     createneworg1,
//     createnewrule,
//     createnewrule1,
//     createnewrule2,
//     createnewrule3
// } from "../../utils/functions"
// jest.setTimeout(120000);
// describe('create BusinessRules', () => {
//     let bruleId;
//     let bruleLevel;
//     let bruleType;
//     let bruleValue;
//     beforeEach(async () => {
//         const brule = await createnewbusinessrule1();
//         bruleId = brule.data.createBusinessRule.id;
//         bruleLevel = brule.data.createBusinessRule.ruleLevel;
//         bruleType = brule.data.createBusinessRule.ruleType;
//         bruleValue = brule.data.createBusinessRule.ruleDefaultValue;
//     })
//     test('create business rule detail with random values', async () => {
//         const bruledetail = await createnewbusinessruledetail(bruleLevel, bruleId, bruleType, bruleValue);
//         console.log(bruledetail);
//         expect(bruledetail.data.createBusinessRuleDetail.id).toBeTruthy();
//         expect(bruledetail.data.createBusinessRuleDetail.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.ORGANIZATION);

//         //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//     });
//     test('create business rule detail with random values and level as APPLICATION', async () => {
//         const BRuleType = Math.random().toString(36).substr(2, 14);
//         const bruledetail = await createnewbusinessruledetail(bruleLevel, bruleId, bruleType, bruleValue);
//         console.log(bruledetail);
//         expect(bruledetail.data.createBusinessRuleDetail.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.ORGANIZATION);

//         //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//     });
//     // test('create business rule detail with random values and level as STORE', async () => {
//     //     const BRuleType = Math.random().toString(36).substr(2, 14);
//     //     const bruledetail = await createnewbusinessruledetail(BUSINESS_RULE_LEVELS.STORE, bruleId, BRuleType, randomBRuleValue);
//     //     console.log(bruledetail);
//     //     expect(bruledetail.data.createBusinessRuleDetail.id).toBeTruthy();
//     //     expect(bruledetail.data.createBusinessRuleDetail.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.STORE);

//     //     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//     // });
//     // test('create business rule detail with random values and level as STORE', async () => {
//     //     const BRuleType = Math.random().toString(36).substr(2, 14);
//     //     const bruledetail = await createnewbusinessruledetail(BUSINESS_RULE_LEVELS.STORE, bruleId, BRuleType, randomBRuleValue);
//     //     console.log(bruledetail);
//     //     expect(bruledetail.data.createBusinessRuleDetail.id).toBeTruthy();
//     //     expect(bruledetail.data.createBusinessRuleDetail.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.STORE);

//     //     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//     // });
//     // test('create business rule detail with empty bruletype', async () => {
//     //     const BRuleType = "";
//     //     const bruledetail = await createnewbusinessruledetail(BUSINESS_RULE_LEVELS.STORE, bruleId, BRuleType, randomBRuleValue);
//     //     console.log(bruledetail);
//     //     expect(bruledetail.data.createBusinessRuleDetail.id).toBeTruthy();
//     //     expect(bruledetail.data.createBusinessRuleDetail.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.STORE);

//     //     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//     // });
//     // test('create business rule detail with bruletype which already exists', async () => {
//     //     //const BRuleType = "";
//     //     const bruledetail = await createnewbusinessruledetail(BUSINESS_RULE_LEVELS.STORE, bruleId, randomBRuleType, randomBRuleValue);
//     //     console.log(bruledetail);
//     //     expect(bruledetail.data.createBusinessRuleDetail.id).toBeTruthy();
//     //     expect(bruledetail.data.createBusinessRuleDetail.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.STORE);

//     //     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//     // });
//     // test('create business rule detail with empty bruleid', async () => {
//     //     const bruleid = "";
//     //     const BRuleType = Math.random().toString(36).substr(2, 14);
//     //     const bruledetail = await createnewbusinessruledetail(BUSINESS_RULE_LEVELS.STORE, bruleid, BRuleType, randomBRuleValue);
//     //     console.log(bruledetail);
//     //     expect(bruledetail.data.createBusinessRuleDetail.id).toBeTruthy();
//     //     expect(bruledetail.data.createBusinessRuleDetail.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.STORE);

//     //     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//     // });
//     // test('create business rule detail with invalid bruleid', async () => {
//     //     const bruleid = "helloworld";
//     //     const BRuleType = Math.random().toString(36).substr(2, 14);
//     //     const bruledetail = await createnewbusinessruledetail(BUSINESS_RULE_LEVELS.STORE, bruleid, BRuleType, randomBRuleValue);
//     //     console.log(bruledetail);
//     //     expect(bruledetail.data.createBusinessRuleDetail.id).toBeTruthy();
//     //     expect(bruledetail.data.createBusinessRuleDetail.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.STORE);

//     //     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//     // });
// });

// beforeAll(async () => {
//     const authorg = await createauthorg();
//     console.log(authorg);
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
// })
