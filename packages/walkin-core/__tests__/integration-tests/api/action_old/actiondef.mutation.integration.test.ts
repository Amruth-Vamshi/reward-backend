// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import {
//   createauthorg,
//   createnewactiondefinition,
//   createnewactiondefinition1,
//   createnewactiondefinition2
// } from "../../utils/functions";
// import {
//   randomActDefForm,
//   randomActDefName,
//   randomactType
// } from "../../utils/index";
// jest.setTimeout(120000);
// describe("createActionDefinition", () => {
//   let actDefId;
//   let actTypeId;
//   test("createActionDefinition 1 with random values", async () => {
//     const operation = {
//       query: gql`mutation{
//                 createActionDefinition(input:{
//                   actionTypeId:"1",
//                   format:${randomActDefForm},
//                   schema:{demo:"test"}
//                   status:ACTIVE,
//                   name:"${randomActDefName}"
//                 })
//                   {
//                     id
//                     format
//                     schema
//                     status
//                   }
//                 }

//                      `
//     };
//     const QueryActions = await makePromise(execute(link, operation));
//   });
//   test("createActionDefinition 2 with random values", async () => {
//     const name = Math.random()
//       .toString(36)
//       .substr(2, 9);
//     const operation = {
//       query: gql`mutation{
//         createActionDefinition(input:{
//           actionTypeId:"2",
//           format:${randomActDefForm},
//           schema:{demo:"test"}
//           status:ACTIVE,
//           name:"${name}"
//         })
//           {
//             id
//             format
//             schema
//             status
//           }
//         }
//                      `
//     };
//     const QueryActions = await makePromise(execute(link, operation));
//   });
//   test("createActionDefinition 3 with random values", async () => {
//     const name = Math.random()
//       .toString(36)
//       .substr(2, 9);
//     const operation = {
//       query: gql`mutation{
//         createActionDefinition(input:{
//           actionTypeId:"3",
//           format:${randomActDefForm},
//           schema:{demo:"test"}
//           status:ACTIVE,
//           name:"${name}"
//         })
//           {
//             id
//             format
//             schema
//             status
//           }
//         }
//                      `
//     };
//     const QueryActions = await makePromise(execute(link, operation));
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
// });
