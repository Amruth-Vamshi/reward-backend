// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
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
// jest.setTimeout(120000);
// describe("createAction", () => {
//   test("createAction with random values", async () => {
//     const action = await createnewaction(
//       orgId,
//       appId,
//       actDefId,
//       randomActResult,
//       randomActMessage,
//       randomActName
//     );
//     // expect(action.data.createAction.actionDefinition.id).toBeTruthy();
//     expect(action.data.createAction.organization.id).toBeTruthy();
//     expect(action.data.createAction.application.id).toBeTruthy();
//     expect(action.data.createAction.actionData).toBeTruthy();
//     expect(action.data.createAction.actionMessage).toBeTruthy();
//     // expect(actionFormat).toContain(actionDef.data.createAction.actionResult);
//   });
//   test("createAction with random values and message as empty", async () => {
//     const ActMessage = "";
//     const action = await createnewaction(
//       orgId,
//       appId,
//       actDefId,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     expect(action.errors[0].message).toEqual("Message cannot be empty");
//   });
//   test("createAction with random values and message which is already present", async () => {
//     // const ActMessage = Math.random().toString(36).substr(2, 14);
//     const action = await createnewaction(
//       orgId,
//       appId,
//       actDefId,
//       randomActResult,
//       randomActMessage,
//       randomActName
//     );
//     //  console.log(action);
//   });
//   test("createAction with random values and orgid as empty", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const orgid = "";
//     const action = await createnewaction(
//       orgid,
//       appId,
//       actDefId,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //  console.log(action);
//   });
//   test("createAction with random values and orgid as invalid", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const orgid = "12345";
//     const action = await createnewaction(
//       orgid,
//       appId,
//       actDefId,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //   console.log(action);
//   });
//   test("createAction with random values and appid as empty", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const appid = "";
//     const action = await createnewaction(
//       orgId,
//       appid,
//       actDefId,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //  console.log(action);
//   });
//   test("createAction with random values and appid as invalid", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const appid = "helloworld";
//     const action = await createnewaction(
//       orgId,
//       appid,
//       actDefId,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //   console.log(action);
//   });
//   test("createAction with random values and message which is already present", async () => {
//     // const ActMessage = Math.random().toString(36).substr(2, 14);
//     const action = await createnewaction(
//       orgId,
//       appId,
//       actDefId,
//       randomActResult,
//       randomActMessage,
//       randomActName
//     );
//     //  console.log(action);
//   });
//   test("createAction with random values and orgid as empty", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const orgid = "";
//     const action = await createnewaction(
//       orgid,
//       appId,
//       actDefId,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //  console.log(action);
//   });
//   test("createAction with random values and orgid as invalid", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const orgid = "12345";
//     const action = await createnewaction(
//       orgid,
//       appId,
//       actDefId,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //   console.log(action);
//   });
//   test("createAction with random values and appid as empty", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const appid = "";
//     const action = await createnewaction(
//       orgId,
//       appid,
//       actDefId,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //  console.log(action);
//   });
//   test("createAction with random values and appid as invalid", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const appid = "helloworld";
//     const action = await createnewaction(
//       orgId,
//       appid,
//       actDefId,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //  console.log(action);
//   });
//   test("createAction with random values and actdefid as empty", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const actdefid = "";
//     const action = await createnewaction(
//       orgId,
//       appId,
//       actdefid,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //  console.log(action);
//   });
//   test("createAction with random values and actdefid as invalid", async () => {
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const actdefid = "helloworld";
//     const action = await createnewaction(
//       orgId,
//       appId,
//       actdefid,
//       randomActResult,
//       ActMessage,
//       randomActName
//     );
//     //  console.log(action);
//   });
//   test("createAction with random values and result as INVALID", async () => {
//     const ActResult = "INVALID";
//     const ActMessage = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const action = await createnewaction(
//       orgId,
//       appId,
//       actDefId,
//       ActResult,
//       ActMessage,
//       randomActName
//     );
//     // console.log(action);
//   });
// });
// describe("updateAction", () => {
//   beforeEach(async () => {
//     const action = await createnewaction1(orgId, appId, actDefId);
//     actId = action.data.createAction.id;
//   });
//   test("updateAction with random values", async () => {
//     const operation = {
//       query: gql`mutation {
//                       updateAction(input:{
//                         id:"${actId}"
//                         actionResult:${UpdateActResult}
//                         message:"${UpdateActMessage}"
//                       })
//                       }
//                `
//     };

//     const Updateaction = await makePromise(execute(link, operation));
//     expect(Updateaction.data.updateAction).toEqual(true);
//   });
//   test("updateAction with random values and action id as empty", async () => {
//     const actid = "";
//     const operation = {
//       query: gql`mutation {
//                       updateAction(input:{
//                         id:"${actid}"
//                         actionResult:${UpdateActResult}
//                         message:"${UpdateActMessage}"
//                       })
//                       }
//                `
//     };

//     const Updateaction = await makePromise(execute(link, operation));
//     expect(Updateaction.data.updateAction).toEqual(false);
//     // positive tests for the createActionType API
//   });
//   test("updateAction with random values and action id as invalid", async () => {
//     const actid = "";
//     const operation = {
//       query: gql`mutation {
//                       updateAction(input:{
//                         id:"${actid}"
//                         actionResult:${UpdateActResult}
//                         message:"${UpdateActMessage}"
//                       })
//                       }
//                `
//     };

//     const Updateaction = await makePromise(execute(link, operation));
//     expect(Updateaction.data.updateAction).toEqual(false);
//     // positive tests for the createActionType API
//   });
//   test("updateAction with random values and message to empty", async () => {
//     const updateactmessage = "";
//     const operation = {
//       query: gql`mutation {
//                       updateAction(input:{
//                         id:"${actId}"
//                         message:"${updateactmessage}"
//                       })
//                       }
//                `
//     };

//     const Updateaction = await makePromise(execute(link, operation));
//     expect(Updateaction.data.updateAction).toEqual(false);
//     // positive tests for the createActionType API
//   });
// });
// describe("disableAction", () => {
//   beforeEach(async () => {
//     const action = await createnewaction1(orgId, appId, actDefId);
//     actId = action.data.createAction.id;
//   });
//   test("disableAction with action id  ", async () => {
//     const operation = {
//       query: gql`mutation{
//                 disableAction(id:"${actId}")
//               }
//                `
//     };

//     const Deleteaction = await makePromise(execute(link, operation));
//     console.log(Deleteaction);
//   });
//   test("disableAction with empty action id", async () => {
//     const actid = "";
//     const operation = {
//       query: gql`mutation{
//                 disableAction(id:"${actid}")
//               }
//                `
//     };

//     const Deleteaction = await makePromise(execute(link, operation));
//     console.log(Deleteaction);
//   });
//   test("disableAction with invalid action id", async () => {
//     const actid = "invalid";
//     const operation = {
//       query: gql`mutation{
//                 disableAction(id:"${actid}")
//               }
//                `
//     };

//     const Deleteaction = await makePromise(execute(link, operation));
//     console.log(Deleteaction);
//   });
// });
// let orgId;
// let appId;
// let actDefId;
// let actTypeId;
// let actId;
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const rand = Math.floor(Math.random() * 2) + 1;
//   const org = await createneworg1();
//   // console.log(org);
//   orgId = org.data.createOrganizationRoot.id;
//   const app = await createnewapp1(orgId);
//   appId = app.data.createApplication.id;
//   const actiondef = await getnewactiondefinition();
//   actDefId = actiondef.data.actionDefinitions[rand].id;
// });
