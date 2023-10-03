// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import {
//     RULE_TYPE, STATUS
// } from "../../../src/modules/common/constants/constants"
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//     createauthorg,
//     createneworg1,
//     createnewrule,
//     createnewrule1,
//     createnewrule2,
//     createnewrule3
// } from "../../utils/functions"
// import {
//     randomRuleDescription,
//     randomRuleName,
//     randomRuleStatus,
//     randomRuleType,
//     UpdateRuleDescription,
//     UpdateRuleName,
//     UpdateRuleStatus,
//     UpdateRuleType
// } from "../../utils/index";
// jest.setTimeout(120000);
// let orgId;
// describe('createRule', () => {
//     test('createRule with randomValues and type as simple with rule configuration', async () => {
//         const status = STATUS.ACTIVE;
//         const type = RULE_TYPE.SIMPLE;
//         // createtheorganization in ACTIVE status then only it will work
//         const rule = await createnewrule(randomRuleName, randomRuleDescription, type, status, orgId);
//     }, 60000);
//     test('createRule with randomValues and type as complex with rule expression', async () => {
//         const status = STATUS.ACTIVE;
//         const type = RULE_TYPE.CUSTOM;
//         const RuleName = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const rule = await createnewrule1(RuleName, randomRuleDescription, type, status, orgId);
//     }, 60000);
//     test('createRule with randomValues and type as simple with rule configuration and status as INACTIVE', async () => {
//         const status = STATUS.INACTIVE;
//         const type = RULE_TYPE.SIMPLE;
//         const RuleName = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const rule = await createnewrule(RuleName, randomRuleDescription, type, status, orgId);

//     }, 60000);
//     test('createRule with randomValues and type as complex with rule expression and status as INACTIVE', async () => {
//         const status = STATUS.INACTIVE;
//         const type = RULE_TYPE.CUSTOM;
//         const RuleName = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const rule = await createnewrule1(RuleName, randomRuleDescription, type, status, orgId);
//     }, 60000);
//     test('createRule with randomValues and type as simple with rule configuration and name as empty', async () => {
//         const status = STATUS.ACTIVE;
//         const type = RULE_TYPE.SIMPLE;
//         const RuleName = "";
//         // createtheorganization in ACTIVE status then only it will work
//         const rule = await createnewrule(RuleName, randomRuleDescription, type, status, orgId);
//         expect(rule.errors[0].message).toEqual("name cannot be null");
//     }, 60000);
//     test('createRule with randomValues and type as complex with rule expression and name as which already exists', async () => {
//         const status = STATUS.ACTIVE;
//         const type = RULE_TYPE.CUSTOM;
//         // createtheorganization in ACTIVE status then only it will work
//         const rule = await createnewrule1(randomRuleName, randomRuleDescription, type, status, orgId);
//         expect(rule.errors[0].message).toEqual("Rule already exists");
//     }, 60000);
//     test('createRule with randomValues and type as empty', async () => {
//         const status =STATUS.ACTIVE;
//         const RuleName = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const rule = await createnewrule2(RuleName, randomRuleDescription, status, orgId);
//         expect(rule.errors[0].message).toEqual("type cannot be null");
//     }, 60000);
//     test('createRule with randomValues and type as INVALID', async () => {
//         const status = STATUS.ACTIVE;
//         const type = "INVALID";
//         const RuleName = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const rule = await createnewrule1(RuleName, randomRuleDescription, type, status, orgId);
//     }, 60000);

// });
// describe('UpdateRule', () => {
//     let ruleId;
//     beforeEach(async () => {
//         const rule = await createnewrule3(orgId);
//         ruleId = rule.data.createRule.id;
//     })
//     test('UpdateRule with randomValues and type as simple with rule configuration', async () => {
//         const operation = {
//             query: gql`mutation{
//                 updateRule(id:"${ruleId}",input:{
//                   name:"${UpdateRuleName}"
//                   description:"${UpdateRuleDescription}"
//                   type:${RULE_TYPE.SIMPLE}
//                  ruleConfiguration:{
//                             name:"value"
//                          }
//                 })
//                 {
//                   id
//                   name
//                   description
//                   status
//                   type
//                   ruleConfiguration
//                  ruleConfiguration
//                   organization{
//                       id
//                   }
//                 }
//               }
//            `
//         };
//         const updaterule = await makePromise(execute(link, operation));
//     }, 60000);
//     test('UpdateRule with randomValues and change type to rule expression with type as CUSTOM', async () => {
//         const operation = {
//             query: gql`mutation{
//                 updateRule(id:"${ruleId}",input:{
//                   name:"${UpdateRuleName}"
//                   description:"${UpdateRuleDescription}"
//                   type:${RULE_TYPE.CUSTOM}
//                   ruleExpression:{
//                     name:"values"
//                    }
//                 })
//                 {
//                   id
//                   name
//                   description
//                   status
//                   type
//                   ruleConfiguration
//                  ruleConfiguration
//                   organization{
//                       id
//                   }
//                 }
//               }
//            `
//         };
//         const updaterule = await makePromise(execute(link, operation));
//     }, 60000);
//     // test('createRule with randomValues and type as complex with rule expression and status as INACTIVE', async () => {
//     //     const status = "INACTIVE";
//     //     const type = "CUSTOM";
//     //     const RuleName = Math.random().toString(36).substr(2, 14);
//     //     //createtheorganization in ACTIVE status then only it will work
//     //     const rule = await createnewrule1(RuleName, randomRuleDescription, type, status, orgId);
//     // }, 60000);
//     // test('createRule with randomValues and type as simple with rule configuration and name as empty', async () => {
//     //     const status = "ACTIVE";
//     //     const type = "SIMPLE";
//     //     const RuleName = "";
//     //     //createtheorganization in ACTIVE status then only it will work
//     //     const rule = await createnewrule(RuleName, randomRuleDescription, type, status, orgId);
//     //     expect(rule.errors[0].message).toEqual("name cannot be null");
//     // }, 60000);
//     // test('createRule with randomValues and type as complex with rule expression and name as which already exists', async () => {
//     //     const status = "ACTIVE";
//     //     const type = "CUSTOM";
//     //     //createtheorganization in ACTIVE status then only it will work
//     //     const rule = await createnewrule1(randomRuleName, randomRuleDescription, type, status, orgId);
//     //     expect(rule.errors[0].message).toEqual("Rule already exists");
//     // }, 60000);
//     // test('createRule with randomValues and type as empty', async () => {
//     //     const status = "ACTIVE";
//     //     const RuleName = Math.random().toString(36).substr(2, 14);
//     //     //createtheorganization in ACTIVE status then only it will work
//     //     const rule = await createnewrule2(RuleName, randomRuleDescription, status, orgId);
//     //     console.log(rule);
//     // }, 60000);
//     // test('createRule with randomValues and type as INVALID', async () => {
//     //     const status = "ACTIVE";
//     //     const type = "INVALID";
//     //     const RuleName = Math.random().toString(36).substr(2, 14);
//     //     //createtheorganization in ACTIVE status then only it will work
//     //     const rule = await createnewrule1(RuleName, randomRuleDescription, type, status, orgId);
//     // }, 60000);
// });
// describe('DisableRule', () => {
//     let ruleId;
//     beforeEach(async () => {
//         const rule = await createnewrule3(orgId);
//         ruleId = rule.data.createRule.id;
//     })
//     test('DisableRule', async () => {
//         const operation = {
//             query: gql`mutation
//             {
//               disableRule(id:"${ruleId}")
//               {
//                 id
//                 name
//               }
//             }
//            `
//         };
//         const disablerule = await makePromise(execute(link, operation));
//     }, 60000);
//     test('DisableRule which is already disabled', async () => {
//         const operation = {
//             query: gql`mutation
//             {
//               disableRule(id:"${ruleId}")
//               {
//                 id
//                 name
//               }
//             }
//            `
//         };
//         const disablerule = await makePromise(execute(link, operation));
//         console.log(disablerule)
//     }, 60000);
//     test('DisableRule with empty rule id', async () => {
//         const ruleid = "";
//         const operation = {
//             query: gql`mutation
//             {
//               disableRule(id:"${ruleid}")
//               {
//                 id
//                 name
//               }
//             }
//            `
//         };
//         const disablerule = await makePromise(execute(link, operation));
//         expect(disablerule.errors[0].message).toEqual("Rule not found");
//     }, 60000);
//     test('DisableRule with invalid rule id', async () => {
//         const ruleid = "helloworld";
//         const operation = {
//             query: gql`mutation
//             {
//               disableRule(id:"${ruleid}")
//               {
//                 id
//                 name
//               }
//             }
//            `
//         };
//         const disablerule = await makePromise(execute(link, operation));
//         expect(disablerule.errors[0].message).toEqual("Rule not found");
//     }, 60000);
// });
// beforeAll(async () => {
//     const authorg = await createauthorg();
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
// })
