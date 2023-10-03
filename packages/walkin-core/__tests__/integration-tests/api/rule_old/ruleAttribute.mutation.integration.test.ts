// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { STATUS, VALUE_TYPE } from "../../../src/modules/common/constants/constants"
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//     createauthorg,
//     createneworg1,
//     createnewrule,
//     createnewrule1,
//     createnewruleattribute,
//     createnewruleattribute1,
//     createnewruleentity1
// } from "../../utils/functions";
// import {
//     randomAttrDescription,
//     randomAttrName,
//     randomAttrStatus,
//     randomAttrType
// } from "../../utils/index";
// jest.setTimeout(120000);
// let orgId;
// let entityId;
// describe('createRuleAttribute', () => {
//     test('createRuleAttribute with randomValues', async () => {

//         const status = STATUS.ACTIVE;
//         const ruleattr = await createnewruleattribute(randomAttrName, randomAttrDescription, status, VALUE_TYPE.NUMBER, entityId, orgId);
//     }, 60000);
//     test('createRuleAttribute with randomValues and status as INACTIVE', async () => {
//         const status = STATUS.INACTIVE;
//         const AttrName = Math.random().toString(36).substr(2, 14);
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.NUMBER, entityId, orgId);

//     }, 60000);
//     test('createRuleAttribute with randomValues and name as null', async () => {
//         const status = STATUS.ACTIVE;
//         const AttrName = '';
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.NUMBER, entityId, orgId);
//         expect(ruleattr.errors[0].message).toEqual("name cannot be null");
//     }, 60000);
//     test('createRuleAttribute with randomValues and name which already exists', async () => {
//         const status = STATUS.ACTIVE;
//         const ruleattr = await createnewruleattribute(randomAttrName, randomAttrDescription, status, VALUE_TYPE.NUMBER, entityId, orgId);
//         expect(ruleattr.errors[0].message).toEqual("Rule Attribuite Already exists");
//     }, 60000);
//     test('createRuleAttribute with randomValues and entityid as invalid', async () => {
//         const entityid = "1234";
//         const status =STATUS.ACTIVE;
//         const AttrName = Math.random().toString(36).substr(2, 14);
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.NUMBER, entityid, orgId);
//         expect(ruleattr.errors[0].message).toEqual("Invalid Rule Entity provided.");
//     }, 60000);
//     test('createRuleAttribute with randomValues and entityid as empty', async () => {
//         const entityid = "";
//         const status = STATUS.ACTIVE;
//         const AttrName = Math.random().toString(36).substr(2, 14);
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.NUMBER, entityid, orgId);
//         expect(ruleattr.errors[0].message).toEqual("Invalid Rule Entity provided.");
//     }, 60000);
//     test('createRuleAttribute with randomValues and orgid as empty', async () => {
//         const orgid = "";
//         const status = STATUS.ACTIVE;
//         const AttrName = Math.random().toString(36).substr(2, 14);
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.NUMBER, entityId, orgid);
//         expect(ruleattr.errors[0].message).toEqual("Invalid OrganizationId provided.");
//     }, 60000);
//     test('createRuleAttribute with randomValues and orgid as invalid', async () => {
//         const orgid = "123123";
//         const status = STATUS.ACTIVE;
//         const AttrName = Math.random().toString(36).substr(2, 14);
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.NUMBER, entityId, orgid);
//         expect(ruleattr.errors[0].message).toEqual("Invalid OrganizationId provided.")
//     }, 60000);
//     test('createRuleAttribute with randomValues and status as INVALID', async () => {
//         const status = "INVALID";
//         const AttrName = Math.random().toString(36).substr(2, 14);
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.NUMBER, entityId, orgId);
//     }, 60000);
//     test('createRuleAttribute with randomValues and value type as STRING', async () => {
//         const status = STATUS.ACTIVE;
//         const AttrName = Math.random().toString(36).substr(2, 14);
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.STRING, entityId, orgId);
//         expect(ruleattr.data.createRuleAttribute.attributeValueType).toEqual(VALUE_TYPE.STRING);
//     }, 60000);
//     test('createRuleAttribute with randomValues and value type as BOOLEAN', async () => {
//         const status = STATUS.ACTIVE;
//         const AttrName = Math.random().toString(36).substr(2, 14);
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.BOOLEAN, entityId, orgId);
//         expect(ruleattr.data.createRuleAttribute.attributeValueType).toEqual(VALUE_TYPE.BOOLEAN);
//     }, 60000);
//     test('createRuleAttribute with randomValues and value type as OBJECT', async () => {
//         const status = STATUS.ACTIVE;
//         const AttrName = Math.random().toString(36).substr(2, 14);
//         const ruleattr = await createnewruleattribute(AttrName, randomAttrDescription, status, VALUE_TYPE.OBJECT, entityId, orgId);
//         expect(ruleattr.data.createRuleAttribute.attributeValueType).toEqual(VALUE_TYPE.OBJECT);
//     }, 60000);
// });
// describe('DisableRuleAttribute', () => {
//     let ruleAttrId;
//     let orgId;
//     let entityId;
//     beforeAll(async () => {
//         const org = await createneworg1();
//         orgId = org.data.createOrganizationRoot.id;
//         const entity = await createnewruleentity1(orgId);
//         entityId = entity.data.createRuleEntity.id;
//         const rule = await createnewruleattribute1(entityId, orgId);
//         ruleAttrId = rule.data.createRuleAttribute.id;
//     })
//     test('DisableRuleAttribute', async () => {
//         const operation = {
//             query: gql`mutation
//             {
//               disableRuleAttribute(id:"${ruleAttrId}")
//               {
//                 id
//               }
//             }
//            `
//         };
//         const disableruleattr = await makePromise(execute(link, operation));
//     }, 60000);
//     test('DisableRuleAttribute with empty rule attr id', async () => {
//         const ruleattrid = "";
//         const operation = {
//             query: gql`mutation
//             {
//               disableRuleAttribute(id:"${ruleattrid}")
//               {
//                 id
//               }
//             }
//            `
//         };
//         const disableruleattr = await makePromise(execute(link, operation));
//         expect(disableruleattr.errors[0].message).toEqual("ruleAttribute not found");
//     }, 60000);
//     test('DisableRuleAttribute with invalid rule attr id', async () => {
//         const ruleattrid = "helloworld";
//         const operation = {
//             query: gql`mutation
//             {
//               disableRuleAttribute(id:"${ruleattrid}")
//               {
//                 id
//               }
//             }
//            `
//         };
//         const disableruleattr = await makePromise(execute(link, operation));
//         expect(disableruleattr.errors[0].message).toEqual("ruleAttribute not found");
//     }, 60000);
//     test('DisableRuleAttribute which is already disabled', async () => {
//         const operation = {
//             query: gql`mutation
//             {
//               disableRuleAttribute(id:"${ruleAttrId}")
//               {
//                 id
//               }
//             }
//            `
//         };
//         const disableruleattr = await makePromise(execute(link, operation));
//         expect(disableruleattr.errors[0].message).toEqual("ruleAttribute is already inactive.");
//     }, 60000);
// });
// beforeAll(async () => {
//     const authorg = await createauthorg();
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
//     const entity = await createnewruleentity1(orgId);
//     entityId = entity.data.createRuleEntity.id;
// })
