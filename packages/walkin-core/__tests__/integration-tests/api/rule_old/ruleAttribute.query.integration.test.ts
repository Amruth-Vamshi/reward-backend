// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { link } from "../../utils/testUtils";
// import { createauthorg, createneworg1, createnewruleattribute1, createnewruleentity1 } from "../../utils/functions"
// jest.setTimeout(120000);
// const attrName = Math.random().toString(36).substr(2, 10);
// describe('Query ruleAttributes', () => {
//   test('To display all the ruleAttributes', async () => {
//     const operation = {
//       query: gql`query {
//                 ruleAttributes {
//                   id
//                   attributeName
//                   description
//                   status
//                   attributeValueType
//                   organization{
//                     id
//                   }
//                   ruleEntity
//                   {
//                     id
//                   }
//                 }
//               }

//               `
//     };
//     const QueryRuleAttributes = await makePromise(execute(link, operation));

//   });
// });
// describe('Query ruleAttribute', () => {
//   let ruleAttrId;
//   let orgId;
//   let entityId;
//   beforeEach(async () => {
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
//     const entity = await createnewruleentity1(orgId);
//     entityId = entity.data.createRuleEntity.id;
//     const rule = await createnewruleattribute1(entityId, orgId);
//     ruleAttrId = rule.data.createRuleAttribute.id;
//   });
//   test('Query specific ruleAttribute', async () => {
//     const operation = {
//       query: gql`query {
//                 ruleAttribute(id: "${ruleAttrId}") {
//                   id
//                   attributeName
//                   description
//                   status
//                   attributeValueType
//                   organization
//                   {
//                       id
//                   }
//                   ruleEntity{
//                       id
//                   }
//                 }
//               }

//                 `
//     };
//     const QueryRuleAttribute = await makePromise(execute(link, operation));
//   });
//   test('Query specific ruleAttribute with empty rule attribute id ', async () => {
//     const ruleattrid = "";
//     const operation = {
//       query: gql`query {
//                 ruleAttribute(id: "${ruleattrid}") {
//                   id
//                   attributeName
//                   description
//                   status
//                   attributeValueType
//                   organization
//                   {
//                       id
//                   }
//                   ruleEntity{
//                       id
//                   }
//                 }
//               }

//                 `
//     };
//     const QueryRuleAttribute = await makePromise(execute(link, operation));
//     console.log(QueryRuleAttribute);
//   });
//   test('Query specific ruleAttribute with invalid rule attribute id ', async () => {
//     const ruleattrid = "invalid";
//     const operation = {
//       query: gql`query {
//                 ruleAttribute(id: "${ruleattrid}") {
//                   id
//                   attributeName
//                   description
//                   status
//                   attributeValueType
//                   organization
//                   {
//                       id
//                   }
//                   ruleEntity{
//                       id
//                   }
//                 }
//               }

//                 `
//     };
//     const QueryRuleAttribute = await makePromise(execute(link, operation));
//     console.log(QueryRuleAttribute);
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
// })
