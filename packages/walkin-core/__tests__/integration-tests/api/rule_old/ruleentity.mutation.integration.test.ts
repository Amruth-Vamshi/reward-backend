// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { STATUS } from "../../../src/modules/common/constants/constants"
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//     createauthorg,
//     createneworg1,
//     createnewrule,
//     createnewrule1,
//     createnewruleentity,
//     createnewruleentity1
// } from "../../utils/functions"
// import {
//     randomRuleEntCode,
//     randomRuleEntName,
//     randomRuleEntStatus
// } from "../../utils/index";
// jest.setTimeout(120000);
// let orgId;
// describe('createRuleEnitity', () => {
//     test('createRuleEnitity with randomValues', async () => {
//         const status = STATUS.ACTIVE;
//         // createtheorganization in ACTIVE status then only it will work
//         const ruleEnt = await createnewruleentity(randomRuleEntName, randomRuleEntCode, status, orgId);
//     }, 60000);
//     test('createRuleEnitity with randomValues with status as INACTIVE', async () => {
//         const status = STATUS.INACTIVE;
//         const RuleEntName = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const ruleEnt = await createnewruleentity(RuleEntName, randomRuleEntCode, status, orgId);
//         // console.log(ruleEnt);
//     }, 60000);
//     test('createRuleEnitity with randomValues and name as empty', async () => {
//         const status = STATUS.ACTIVE;
//         const RuleEntName = "";
//         // createtheorganization in ACTIVE status then only it will work
//         const ruleEnt = await createnewruleentity(RuleEntName, randomRuleEntCode, status, orgId);
//         expect(ruleEnt.errors[0].message).toEqual("name cannot be null");
//     }, 60000);
//     test('createRuleEnitity with randomValues and name which already exists', async () => {
//         const status = STATUS.ACTIVE;
//         //  const RuleEntName = "";
//         // createtheorganization in ACTIVE status then only it will work
//         const ruleEnt = await createnewruleentity(randomRuleEntName, randomRuleEntCode, status, orgId);
//         expect(ruleEnt.errors[0].message).toEqual("Rule Entity Already exists");
//     }, 60000);
//     test('createRuleEnitity with randomValues and organization id as empty', async () => {
//         const status =STATUS.ACTIVE;
//         const orgid = "";
//         const RuleEntName = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const ruleEnt = await createnewruleentity(RuleEntName, randomRuleEntCode, status, orgid);
//         expect(ruleEnt.errors[0].message).toEqual("Invalid OrganizationId provided.");
//     }, 60000);
//     test('createRuleEnitity with randomValues and organization id as invalid id ', async () => {
//         const status = STATUS.ACTIVE;
//         const orgid = "12345";
//         const RuleEntName = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const ruleEnt = await createnewruleentity(RuleEntName, randomRuleEntCode, status, orgid);
//         expect(ruleEnt.errors[0].message).toEqual("Invalid OrganizationId provided.");
//     }, 60000);
//     test('createRuleEnitity with randomValues and status as INVALID ', async () => {
//         const status = "INVALID";
//         const RuleEntName = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const ruleEnt = await createnewruleentity(RuleEntName, randomRuleEntCode, status, orgId);
//         console.log(ruleEnt);
//     }, 60000);
// });
// describe('DisableRuleEntity', () => {
//     let orgId;
//     let entityId;
//     beforeAll(async () => {
//         const org = await createneworg1();
//         orgId = org.data.createOrganizationRoot.id;
//         const entity = await createnewruleentity1(orgId);
//         entityId = entity.data.createRuleEntity.id;
//     })
//     test('DisableRuleEntity', async () => {
//         const operation = {
//             query: gql`mutation{
//                 disableRuleEntity(id:"${entityId}")
//                 {
//                   id
//                   entityName
//                 }
//               }
//            `
//         };
//         const disableruleent = await makePromise(execute(link, operation));
//         expect(disableruleent.data.disableRuleEntity.id).toBeTruthy();
//     }, 60000);
//     test('DisableRuleEntity with empty entityid', async () => {
//         const entityid = "";
//         const operation = {
//             query: gql`mutation{
//                 disableRuleEntity(id:"${entityid}")
//                 {
//                   id
//                   entityName
//                 }
//               }
//            `
//         };
//         const disableruleent = await makePromise(execute(link, operation));
//         expect(disableruleent.errors[0].message).toEqual("ruleEntity not found");
//     }, 60000);
//     test('DisableRuleEntity with invalid entityid', async () => {
//         const entityid = "helloworld";
//         const operation = {
//             query: gql`mutation{
//                 disableRuleEntity(id:"${entityid}")
//                 {
//                   id
//                   entityName
//                 }
//               }
//            `
//         };
//         const disableruleent = await makePromise(execute(link, operation));
//         expect(disableruleent.errors[0].message).toEqual("ruleEntity not found");
//     }, 60000);
//     test('DisableRuleEntity which is already disabled', async () => {
//         const operation = {
//             query: gql`mutation{
//                 disableRuleEntity(id:"${entityId}")
//                 {
//                   id
//                   entityName
//                 }
//               }
//            `
//         };
//         const disableruleent = await makePromise(execute(link, operation));
//         expect(disableruleent.errors[0].message).toEqual("ruleEntity is already inactive.");
//     }, 60000);
// });
// beforeAll(async () => {
//     const authorg = await createauthorg();
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
// })
