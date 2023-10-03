// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { link } from "../../utils/testUtils";
// import {
//   createauthorg,
//   createnewaction,
//   createnewaction1,
//   createnewactiondefinition,
//   createnewactiontype,
//   createnewapp1,
//   createneworg1,
//   getnewactiondefinition,
//   getnewactiontype
// } from "../../utils/functions";
// import {
//   randomActDefForm,
//   randomActDefName,
//   randomActMessage,
//   randomActName,
//   randomActResult,
//   randomactType,
//   UpdateActMessage,
//   UpdateActName,
//   UpdateActResult
// } from "../../utils/index";
// jest.setTimeout(120000);
// describe("Query actions", () => {
//   test("To display all the actions", async () => {
//     const operation = {
//       query: gql`
//         query {
//           actions {
//             id
//             actionDefinition {
//               id
//             }
//             application {
//               id
//             }
//             actionData
//             actionResult
//             actionMessage
//           }
//         }
//       `
//     };
//     const QueryActions = await makePromise(execute(link, operation));
//   });
// });
// describe("query specific Action", () => {
//   let orgId;
//   let appId;
//   let actDefId;
//   let actTypeId;
//   let actId;
//   beforeAll(async () => {
//     const authorg = await createauthorg();
//     const rand = Math.floor(Math.random() * 2) + 1;
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
//     const app = await createnewapp1(orgId);
//     appId = app.data.createApplication.id;
//     const actiondef = await getnewactiondefinition();
//     actDefId = actiondef.data.actionDefinitions[rand].id;
//     const actiontype = await getnewactiontype();
//     actTypeId = actiontype.data.actiontypes[rand].id;
//     const action = await createnewaction1(orgId, appId, actDefId);
//     actId = action.data.createAction.id;
//   });
//   test("query specific action", async () => {
//     const operation = {
//       query: gql`query{
//               action(id:"${actId}"){
//                 id
//                 actionDefinition{
//                   id
//                 }
//                 application{
//                   id
//                 }
//                 actionData
//                 actionResult
//                 actionMessage
//               }
//             }

//                `
//     };
//     const QueryAction = await makePromise(execute(link, operation));
//     console.log(QueryAction);
//   });
//   test("query specific action with empty action id", async () => {
//     const actid = "";
//     const operation = {
//       query: gql`query{
//               action(id:"${actid}"){
//                 id
//                 actionDefinition{
//                   id
//                 }
//                 application{
//                   id
//                 }
//                 actionData
//                 actionResult
//                 actionMessage
//               }
//             }

//                `
//     };
//     const QueryAction = await makePromise(execute(link, operation));
//     expect(QueryAction.errors[0].message).toEqual("action id cannot be empty");
//   });
//   test("query specific action with invalid action id", async () => {
//     const actid = "";
//     const operation = {
//       query: gql`query{
//               action(id:"${actid}"){
//                 id
//                 actionDefinition{
//                   id
//                 }
//                 application{
//                   id
//                 }
//                 actionData
//                 actionResult
//                 actionMessage
//               }
//             }

//                `
//     };
//     const QueryAction = await makePromise(execute(link, operation));
//     expect(QueryAction.errors[0].message).toEqual("action id is invalid");
//   });
// });
