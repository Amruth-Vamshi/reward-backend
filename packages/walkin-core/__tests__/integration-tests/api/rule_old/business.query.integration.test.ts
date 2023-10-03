// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { BUSINESS_RULE_LEVELS } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import { randomBRuleType, randomBRuleValue } from "../../utils/index";
// let orgId;
// import {
//   createauthorg,
//   createnewbusinessrule,
//   createnewbusinessrule1,
//   createneworg1,
//   createnewrule,
//   createnewrule1,
//   createnewrule2,
//   createnewrule3
// } from "../../utils/functions";
// jest.setTimeout(120000);
// describe("Query BusinessRules", () => {
//   let bruleId;
//   beforeEach(async () => {
//     const brule = await createnewbusinessrule1();
//     bruleId = brule.data.createBusinessRule.id;
//   });
//   test("Query all the business rules", async () => {
//     const operation = {
//       query: gql`
//         query {
//           businessRules(input: {}) {
//             id
//             ruleLevel
//             ruleType
//             ruleDefaultValue
//           }
//         }
//       `
//     };
//     const querybrule = await makePromise(execute(link, operation));
//     // console.log(querybrule);
//   });
//   test("Query specific business rule with id", async () => {
//     const operation = {
//       query: gql`query
//             {
//               businessRule(id:"${bruleId}")
//               {
//                 id
//                 ruleLevel
//                 ruleType
//                 ruleDefaultValue
//               }
//             }
//            `
//     };
//     const querybrule = await makePromise(execute(link, operation));
//     // console.log(querybrule);
//   });
//   test("Query specific business rule with empty id", async () => {
//     const bruleid = "";
//     const operation = {
//       query: gql`query
//             {
//               businessRule(id:"${bruleid}")
//               {
//                 id
//                 ruleLevel
//                 ruleType
//                 ruleDefaultValue
//               }
//             }
//            `
//     };
//     const querybrule = await makePromise(execute(link, operation));
//     expect(querybrule.errrors[0].message).toEqual(
//       "Business rule Id is Invalid or Does not exist"
//     );
//   });
//   test("Query specific business rule with invalid id", async () => {
//     const bruleid = "helloworld";
//     const operation = {
//       query: gql`query
//             {
//               businessRule(id:"${bruleid}")
//               {
//                 id
//                 ruleLevel
//                 ruleType
//                 ruleDefaultValue
//               }
//             }
//            `
//     };
//     const querybrule = await makePromise(execute(link, operation));
//     expect(querybrule.errrors[0].message).toEqual(
//       "Business rule Id is Invalid or Does not exist"
//     );
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   // console.log(authorg);
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
// });
