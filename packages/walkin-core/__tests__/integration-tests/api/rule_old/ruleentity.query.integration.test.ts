// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { link } from "../../utils/testUtils";
// import { createauthorg, createneworg1, createnewrule, createnewruleattribute1, createnewruleentity1 } from "../../utils/functions"
// jest.setTimeout(120000);
// describe('Query ruleEntity', () => {
//   test('To display all the ruleEntities', async () => {
//     const operation = {
//       query: gql`query{
//                 ruleEntities{
//                   id
//                   entityName
//                   entityCode
//                   status
//                   organization{
//                     id
//                   }
//                 }
//               }
//               `
//     };
//     const QueryRuleAttributes = await makePromise(execute(link, operation));

//   });
// });
// describe('Query specific rule Entity', () => {
//   let ruleId;
//   let orgId;

//   beforeEach(async () => {
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
//     const rule = await createnewruleentity1(orgId);
//     ruleId = rule.data.createRuleEntity.id;
//   });
//   test('Query specific ruleEntity', async () => {
//     const operation = {
//       query: gql`query{
//                 ruleEntity(id:"${ruleId}")
//                 {
//                    id
//                   entityName
//                   entityCode
//                   status
//                   organization{
//                       id
//                   }
//                 }
//               }
//                 `
//     };
//     const QueryRuleAttribute = await makePromise(execute(link, operation));
//   });
//   test('Query specific ruleEntity where rule id is empty ', async () => {
//     const ruleid = "";
//     const operation = {
//       query: gql`query{
//                 ruleEntity(id:"${ruleid}")
//                 {
//                    id
//                   entityName
//                   entityCode
//                   status
//                   organization{
//                       id
//                   }
//                 }
//               }
//                 `
//     };
//     const QueryRuleAttribute = await makePromise(execute(link, operation));
//     expect(QueryRuleAttribute.errors[0].message).toEqual("Rule entity cannot be null");
//   });
//   test('Query specific ruleEntity where rule id is invalid', async () => {
//     const ruleid = "helloworld";
//     const operation = {
//       query: gql`query{
//                 ruleEntity(id:"${ruleid}")
//                 {
//                    id
//                   entityName
//                   entityCode
//                   status
//                   organization{
//                       id
//                   }
//                 }
//               }
//                 `
//     };
//     const QueryRuleAttribute = await makePromise(execute(link, operation));
//     expect(QueryRuleAttribute.errors[0].message).toEqual("Rule entity id  is invalid");
//   });

// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
// })
