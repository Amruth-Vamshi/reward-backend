// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import {
//   createauthorg,
//   createnewactiondefinition,
//   createnewactiontype,
//   createnewactiontype1,
//   createnewactiontype2
// } from "../../utils/functions";
// import {
//   randomActDefForm,
//   randomActDefName,
//   randomactType
// } from "../../utils/index";
// jest.setTimeout(120000);
// describe("createActionType", () => {
//   test("createActionType 1 with random type", async () => {
//     const operation = {
//       query: gql`
//         mutation {
//           createActionType(
//             input: { type: CREATE_CUSTOMER_FEEDBACK_FORM, status: ACTIVE }
//           ) {
//             id
//           }
//         }
//       `
//     };
//     const org = await makePromise(execute(link, operation));
//   });
//   test("createActionType 2 with random type", async () => {
//     const operation = {
//       query: gql`
//         mutation {
//           createActionType(input: { type: EXTERNAL_API, status: ACTIVE }) {
//             id
//           }
//         }
//       `
//     };
//     const org = await makePromise(execute(link, operation));
//   });
//   test("createActionType 3 with random type", async () => {
//     const operation = {
//       query: gql`
//         mutation {
//           createActionType(input: { type: NOTIFICATION, status: ACTIVE }) {
//             id
//           }
//         }
//       `
//     };
//     const org = await makePromise(execute(link, operation));
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
// });
