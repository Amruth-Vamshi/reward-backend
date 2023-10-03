// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import {
//   BUSINESS_RULE_LEVELS
// } from "../../../src/modules/common/constants/constants"
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//   createauthorg,
//   createnewbusinessrule,
//   createnewbusinessrule1,
//   createneworg1,
//   createnewrule,
//   createnewrule1,
//   createnewrule2,
//   createnewrule3
// } from "../../utils/functions"
// import {
//   randomBRuleType,
//   randomBRuleValue

// } from "../../utils/index";
// jest.setTimeout(120000);
// let orgId;
// describe('createBusinessRule', () => {
//   test('createBusinessRule with randomValues with level as organization', async () => {
//     const brule = await createnewbusinessrule(BUSINESS_RULE_LEVELS.ORGANIZATION, randomBRuleType, randomBRuleValue);
//     expect(brule.data.createBusinessRule.id).toBeTruthy();
//     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//   });
//   test('createBusinessRule with randomValues with level as STORE', async () => {
//     const BRuleType = Math.random().toString(36).substr(2, 14);
//     const brule = await createnewbusinessrule(BUSINESS_RULE_LEVELS.STORE, BRuleType, randomBRuleValue);
//     expect(brule.data.createBusinessRule.id).toBeTruthy();
//     expect(brule.data.createBusinessRule.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.STORE);
//     // console.log(brule);
//     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//   });
//   test('createBusinessRule with randomValues with level as APPLICATION', async () => {
//     const BRuleType = Math.random().toString(36).substr(2, 14);
//     const brule = await createnewbusinessrule(BUSINESS_RULE_LEVELS.APPLICATION, BRuleType, randomBRuleValue);
//     expect(brule.data.createBusinessRule.id).toBeTruthy();
//     expect(brule.data.createBusinessRule.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.APPLICATION);
//     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//   });
//   test('createBusinessRule with randomValues with level as ORGANIZATION and type as empty ', async () => {
//     const BRuleType = "";
//     const brule = await createnewbusinessrule(BUSINESS_RULE_LEVELS.APPLICATION, BRuleType, randomBRuleValue);
//     expect(brule.errors[0].message).toEqual("Business rule already exists.");
//     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//   });
//   test('createBusinessRule with randomValues with level as ORGANIZATION and type which already exists', async () => {
//     // const BRuleType = "";
//     const brule = await createnewbusinessrule(BUSINESS_RULE_LEVELS.APPLICATION, randomBRuleType, randomBRuleValue);
//     expect(brule.data.createBusinessRule.id).toBeTruthy();
//     // console.log(brule);
//     //  expect(brule.data.createBusinessRule.name).toBeTruthy();
//   });

// });
// describe('Update BusinessRule', () => {
//   let bruleId;
//   beforeEach(async () => {
//     const brule = await createnewbusinessrule1();
//     bruleId = brule.data.createBusinessRule.id;
//   })
//   test('Update BusinessRules using name and set the level same as which already exists', async () => {
//     const ruleType = "helloworld";
//     const ruleDefaultValue = Math.random().toString(36).substr(2, 14);
//     const operation = {
//       query: gql`mutation {
//                 updateBusinessRule(
//                   id: "${bruleId}"
//                   input: { ruleLevel: ${BUSINESS_RULE_LEVELS.ORGANIZATION}, ruleType: "${ruleType}", ruleDefaultValue: "${ruleDefaultValue}" }
//                 )
//                 {
//                   id
//                   ruleLevel
//                   ruleType
//                   ruleDefaultValue
//                 }
//               }

//            `
//     };
//     const updatebrule = await makePromise(execute(link, operation));
//     expect(updatebrule.data.updateBusinessRule.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.ORGANIZATION);
//   });
//   test('Update BusinessRules using name and set the level to APPLICATION', async () => {
//     const ruleType = Math.random().toString(36).substr(2, 14);
//     const ruleDefaultValue = Math.random().toString(36).substr(2, 14);
//     const operation = {
//       query: gql`mutation {
//                 updateBusinessRule(
//                   id: "${bruleId}"
//                   input: { ruleLevel: ${BUSINESS_RULE_LEVELS.APPLICATION}, ruleType: "${ruleType}", ruleDefaultValue: "${ruleDefaultValue}" }
//                 )
//                 {
//                   id
//                   ruleLevel
//                   ruleType
//                   ruleDefaultValue
//                 }
//               }

//            `
//     };
//     const updatebrule = await makePromise(execute(link, operation));
//     expect(updatebrule.data.updateBusinessRule.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.APPLICATION);
//   });
//   test('Update BusinessRules using name and set the level to STORE', async () => {
//     const ruleType = Math.random().toString(36).substr(2, 14);
//     const ruleDefaultValue = Math.random().toString(36).substr(2, 14);
//     const operation = {
//       query: gql`mutation {
//                 updateBusinessRule(
//                   id: "${bruleId}"
//                   input: { ruleLevel: ${BUSINESS_RULE_LEVELS.STORE}, ruleType: "${ruleType}", ruleDefaultValue: "${ruleDefaultValue}" }
//                 )
//                 {
//                   id
//                   ruleLevel
//                   ruleType
//                   ruleDefaultValue
//                 }
//               }

//            `
//     };
//     const updatebrule = await makePromise(execute(link, operation));
//     expect(updatebrule.data.updateBusinessRule.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.STORE);
//   });
//   test('Update BusinessRules using name and set the type to empty', async () => {
//     const ruleType = "";
//     const ruleDefaultValue = Math.random().toString(36).substr(2, 14);
//     const operation = {
//       query: gql`mutation {
//                 updateBusinessRule(
//                   id: "${bruleId}"
//                   input: { ruleType: "${ruleType}", ruleDefaultValue: "${ruleDefaultValue}" }
//                 )
//                 {
//                   id
//                   ruleLevel
//                   ruleType
//                   ruleDefaultValue
//                 }
//               }

//            `
//     };
//     const updatebrule = await makePromise(execute(link, operation));
//     console.log(updatebrule);
//   });
//   test('Update BusinessRules using name and set the type to which already exists', async () => {
//     const ruleType = "helloworld";
//     const ruleDefaultValue = Math.random().toString(36).substr(2, 14);
//     const operation = {
//       query: gql`mutation {
//                 updateBusinessRule(
//                   id: "${bruleId}"
//                   input: { ruleType: "${ruleType}", ruleDefaultValue: "${ruleDefaultValue}" }
//                 )
//                 {
//                   id
//                   ruleLevel
//                   ruleType
//                   ruleDefaultValue
//                 }
//               }

//            `
//     };
//     const updatebrule = await makePromise(execute(link, operation));
//     // expect(updatebrule.data.updateBusinessRule.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.);
//   });
//   test('Update BusinessRules using id as empty', async () => {
//     const bruleid = "";
//     const ruleType = Math.random().toString(36).substr(2, 14);
//     const ruleDefaultValue = Math.random().toString(36).substr(2, 14);
//     const operation = {
//       query: gql`mutation {
//                 updateBusinessRule(
//                   id: "${bruleid}"
//                   input: { ruleType: "${ruleType}", ruleDefaultValue: "${ruleDefaultValue}" }
//                 )
//                 {
//                   id
//                   ruleLevel
//                   ruleType
//                   ruleDefaultValue
//                 }
//               }

//            `
//     };
//     const updatebrule = await makePromise(execute(link, operation));
//     expect(updatebrule.errrors[0].message).toEqual("Business rule Id is Invalid or Does not exist");
//   });
//   test('Update BusinessRules using id as invalid', async () => {
//     const bruleid = "helloworld";
//     const ruleType = Math.random().toString(36).substr(2, 14);
//     const ruleDefaultValue = Math.random().toString(36).substr(2, 14);
//     const operation = {
//       query: gql`mutation {
//                 updateBusinessRule(
//                   id: "${bruleid}"
//                   input: { ruleType: "${ruleType}", ruleDefaultValue: "${ruleDefaultValue}" }
//                 )
//                 {
//                   id
//                   ruleLevel
//                   ruleType
//                   ruleDefaultValue
//                 }
//               }

//            `
//     };
//     const updatebrule = await makePromise(execute(link, operation));
//     expect(updatebrule.errrors[0].message).toEqual("Business rule Id is Invalid or Does not exist");
//   });

// });
// describe('DeleteBusinessRule', () => {
//   let bruleId;
//   beforeEach(async () => {
//     const brule = await createnewbusinessrule1();
//     bruleId = brule.data.createBusinessRule.id;
//   })
//   test('Delete BusinessRules using id', async () => {
//     const operation = {
//       query: gql`mutation {
//                 deleteBusinessRule(id: "${bruleId}") {
//                   ruleDefaultValue
//                   ruleType
//                   ruleLevel
//                   id
//                 }
//               }

//            `
//     };
//     const deletebrule = await makePromise(execute(link, operation));
//     expect(deletebrule.data.deleteBusinessRule.id).toEqual(bruleId);
//   });
//   test('Delete BusinessRules using empty rule id', async () => {
//     const bruleid = "";
//     const operation = {
//       query: gql`mutation {
//                 deleteBusinessRule(id: "${bruleid}") {
//                   ruleDefaultValue
//                   ruleType
//                   ruleLevel
//                   id
//                 }
//               }

//            `
//     };
//     const deletebrule = await makePromise(execute(link, operation));
//     expect(deletebrule.errors[0].message).toEqual("Business rule Id is Invalid or Does not exist");
//   });
//   test('Delete BusinessRules using invalid rule id', async () => {
//     const bruleid = "helloworld";
//     const operation = {
//       query: gql`mutation {
//                 deleteBusinessRule(id: "${bruleid}") {
//                   ruleDefaultValue
//                   ruleType
//                   ruleLevel
//                   id
//                 }
//               }

//            `
//     };
//     const deletebrule = await makePromise(execute(link, operation));
//     expect(deletebrule.errors[0].message).toEqual("Business rule Id is Invalid or Does not exist");
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   // console.log(authorg);
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
// })
