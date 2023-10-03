// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { link } from "../../utils/testUtils";
// import { createauthorg, createneworg1, createnewrule, createnewrule3, createnewruleattribute1, createnewruleentity1 } from "../../utils/functions"
// jest.setTimeout(120000);
// const attrName = Math.random().toString(36).substr(2, 10);
// describe('Query rule', () => {
//   test('To display all the rules', async () => {
//     const operation = {
//       query: gql`query {
//                 rules {
//                   id
//                   name
//                   description
//                   status
//                   type
//                   ruleConfiguration
//                   ruleExpression
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
// describe('Query specific rule', () => {
//   let ruleId;
//   let orgId;

//   beforeEach(async () => {
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
//     const rule = await createnewrule3(orgId);
//     ruleId = rule.data.createRule.id;
//   });
//   test('Query specific rule', async () => {
//     const operation = {
//       query: gql`query{
//                 rule(id:"${ruleId}")
//                 {
//                   id
//                   name
//                   description
//                   status
//                   type
//                   ruleConfiguration
//                   ruleExpression
//                   organization{
//                     id
//                   }
//                 }
//               }
//                 `
//     };
//     const QueryRuleAttribute = await makePromise(execute(link, operation));
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
// })
