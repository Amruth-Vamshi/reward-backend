// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { addCatchUndefinedToSchema } from "graphql-tools";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { async } from "q";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import {
//   addgroup,
//   addpolicyapp,
//   addpolicygrp,
//   addpolicyorg,
//   addpolicystore,
//   addpolicyuser,
//   addrole,
//   createauthorg,
//   createnewapp,
//   createnewapp1,
//   createnewapp2,
//   createneworg1,
//   createnewuser,
//   linkgroup,
//   linkuser,
//   linkuserorg
// } from "../../utils/functions";
// import {
//   randomAppAuth,
//   randomAppDescription,
//   randomAppName,
//   randomAppPlatform,
//   randomGroupName,
//   randomRoleDescription,
//   randomRoleName,
//   UpdateAppAuth,
//   UpdateAppDescription,
//   UpdateAppName,
//   UpdateAppPlatform
// } from "../../utils/index";
// let orgId;
// jest.setTimeout(120000);

// describe("createApplication", () => {
//   test("createApplication with randomValues", async () => {
//     const application = await createnewapp(
//       orgId,
//       randomAppName,
//       randomAppDescription,
//       randomAppAuth,
//       randomAppPlatform
//     );
//     expect(application.data.createApplication.name).toBeTruthy();
//   });
//   test("createApplication with randomValues and name as empty", async () => {
//     const AppName = "";
//     const application = await createnewapp(
//       orgId,
//       AppName,
//       randomAppDescription,
//       randomAppAuth,
//       randomAppPlatform
//     );
//     expect(application.errors[0].validationErrors[0].message).toEqual(
//       "name cannot be null"
//     );
//   });
//   test("createApplication with randomValues and repeating the name of the applcation", async () => {
//     const application = await createnewapp(
//       orgId,
//       randomAppName,
//       randomAppDescription,
//       randomAppAuth,
//       randomAppPlatform
//     );
//     expect(application.errors[0].validationErrors[0].message).toEqual(
//       "Application name already exists"
//     );
//   });
// });
// describe("generate API key", () => {
//   let appId;
//   // create newOrganization
//   beforeEach(async () => {
//     const app = await createnewapp1(orgId);
//     appId = app.data.createApplication.id;
//   });
//   test("generate API key for application with random values", async () => {
//     const env = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const operation = {
//       query: gql`mutation{
//                 generateAPIKey(id:"${appId}",environment:"${env}")
//                 {
//                   api_key
//                 }
//               }
//               `
//     };
//     const apikey = await makePromise(execute(link, operation));
//     // console.log(apikey);
//   });
//   test("generate API key for application with random values and empty appid", async () => {
//     const env = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const appid = "";
//     const operation = {
//       query: gql`mutation{
//                 generateAPIKey(id:"${appid}",environment:"${env}")
//                 {
//                   api_key
//                 }
//               }
//               `
//     };
//     const apikey = await makePromise(execute(link, operation));
//     // console.log(apikey);
//   });
//   test("generate API key for application with random values and invalid appid", async () => {
//     const env = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const appid = "helloworld";
//     const operation = {
//       query: gql`mutation{
//                 generateAPIKey(id:"${appid}",environment:"${env}")
//                 {
//                   api_key
//                 }
//               }
//               `
//     };
//     const apikey = await makePromise(execute(link, operation));
//     // console.log(apikey);
//   });
//   test("generate API key for application with random values and empty environment", async () => {
//     const env = "";
//     const operation = {
//       query: gql`mutation{
//                 generateAPIKey(id:"${appId}",environment:"${env}")
//                 {
//                   api_key
//                 }
//               }
//               `
//     };
//     const apikey = await makePromise(execute(link, operation));
//     // console.log(apikey);
//   });
// });
// // updateApplication tests

// describe("updateApplication", () => {
//   let appId;
//   // create newOrganization
//   beforeEach(async () => {
//     const app = await createnewapp1(orgId);
//     appId = app.data.createApplication.id;
//   });
//   test("updateApplication with randomValues", async () => {
//     const operation = {
//       query: gql`mutation{
//             updateApplication(input: {
//             id: "${appId}"
//             name: "${UpdateAppName}"
//             description: "${UpdateAppDescription}"
//             auth_key_hooks: "${UpdateAppAuth}"
//             platform: "${UpdateAppPlatform}"
//             }) {
//                 id
//                 name
//                 description
//                 auth_key_hooks
//                 platform
//                 organization{
//                     id
//                 }
//             }
//         }

//         `
//     };
//     //  console.log(operation);
//     const Updateapplication = await makePromise(execute(link, operation));
//     // positive tests for the createApplicaton API
//     expect(Updateapplication.data.updateApplication.name).toBeTruthy();
//     expect(Updateapplication.data.updateApplication.id).toBeTruthy();
//   });
//   test("updateApplication with randomValues and invalid application id ", async () => {
//     const appid = "hello";
//     const operation = {
//       query: gql`mutation{
//             updateApplication(input: {
//             id: "${appid}"
//             name: "${UpdateAppName}"
//             description: "${UpdateAppDescription}"
//             auth_key_hooks: "${UpdateAppAuth}"
//             platform: "${UpdateAppPlatform}"
//             }) {
//                 id
//                 name
//                 description
//                 auth_key_hooks
//                 platform
//                 organization{
//                     id
//                 }
//             }
//         }

//         `
//     };
//     //  console.log(operation);
//     const Updateapplication = await makePromise(execute(link, operation));
//     expect(Updateapplication.errors[0].validationErrors[0].message).toEqual(
//       "Application Not Found!"
//     );
//   });
//   test("updateApplication with randomValues and update name to null", async () => {
//     const AppName = "";
//     const operation = {
//       query: gql`mutation{
//             updateApplication(input: {
//             id: "${appId}"
//             name: "${AppName}"
//             description: "${UpdateAppDescription}"
//             auth_key_hooks: "${UpdateAppAuth}"
//             platform: "${UpdateAppPlatform}"
//             }) {
//                 id
//                 name
//                 description
//                 auth_key_hooks
//                 platform
//                 organization{
//                     id
//                 }
//             }
//         }

//         `
//     };
//     //  console.log(operation);
//     const Updateapplication = await makePromise(execute(link, operation));
//     expect(Updateapplication.errors[0].validationErrors[0].message).toEqual(
//       "name cannot be null"
//     );
//   });
//   test("updateApplication with randomValues and update name to the name which already exists", async () => {
//     const operation = {
//       query: gql`mutation{
//             updateApplication(input: {
//             id: "${appId}"
//             name: "${randomAppName}"
//             description: "${UpdateAppDescription}"
//             auth_key_hooks: "${UpdateAppAuth}"
//             platform: "${UpdateAppPlatform}"
//             }) {
//                 id
//                 name
//                 description
//                 auth_key_hooks
//                 platform
//                 organization{
//                     id
//                 }
//             }
//         }

//         `
//     };
//     //  console.log(operation);
//     const Updateapplication = await makePromise(execute(link, operation));
//     expect(Updateapplication.errors[0].validationErrors[0].message).toEqual(
//       "Application name already exists"
//     );
//   });
// });

// // deleteApplication tests
// describe("deleteApplication", () => {
//   let appId;

//   beforeEach(async () => {
//     const app = await createnewapp1(orgId);
//     appId = app.data.createApplication.id;
//   });
//   test("deleteApplication with new applcation", async () => {
//     const operation = {
//       query: gql`mutation{
//             deleteApplication(id: "${appId}")
//         }
//         `
//     };
//     //  console.log(operation);
//     const Deleteapplication = await makePromise(execute(link, operation));
//     // console.log(Deleteapplication);
//     // throws SQL foriegn key error as it cannot be deleted because of its connection in multiple tables
//   });
//   test("deleteApplication with empty application id ", async () => {
//     const appid = "";
//     const operation = {
//       query: gql`mutation{
//             deleteApplication(id: "${appid}")
//         }
//         `
//     };
//     //  console.log(operation);
//     const Deleteapplication = await makePromise(execute(link, operation));
//     expect(Deleteapplication.errors[0].validationErrors[0].message).toEqual(
//       "Application Not Found!"
//     );
//     // throws SQL foriegn key error as it cannot be deleted because of its connection in multiple tables
//   });
//   test("deleteApplication with invalid application id ", async () => {
//     const appid = "helloworld";
//     const operation = {
//       query: gql`mutation{
//             deleteApplication(id: "${appid}")
//         }
//         `
//     };
//     //  console.log(operation);
//     const Deleteapplication = await makePromise(execute(link, operation));
//     expect(Deleteapplication.errors[0].validationErrors[0].message).toEqual(
//       "Application Not Found!"
//     );
//     // throws SQL foriegn key error as it cannot be deleted because of its connection in multiple tables
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
// });
// // beforeAll(async () => {
// //     let userId, orgid, grpId, roleId;
// //     let linkGrpId;
// //     let linkUserId;
// //     const user = await createnewuser();
// //     userId = user.data.createUser.id;
// //     const org = await createneworg1();
// //     orgid = org.data.createOrganizationRoot.id;
// //     const grp = await addgroup(orgid, randomGroupName);
// //     grpId = grp.data.addGroupToOrganization.id;
// //     // const lgrp = await linkgroup(orgid, grpId);
// //     // console.log(lgrp);
// //     // linkGrpId = lgrp.data.linkGroupToOrganization.id;
// //     const role = await addrole(grpId, randomRoleName, randomRoleDescription);
// //     roleId = role.data.addRole.id;
// //     const luserorg = await linkuserorg(orgid, userId);
// //     const luser = await linkuser(grpId, userId);
// //     linkUserId = luser.data.linkUserToGroup.id;
// //     const porg = await addpolicyorg(roleId);
// // })
// // beforeAll(async () => {
// //     ;
// // })
// // beforeAll(async () => {

// //     // beforeAll(async () => {

// //     // })
// //     beforeAll(async () => {

// //     })
// //     beforeAll(async () => {

// //     })
// //     beforeAll(async () => {

// //     })
// //     beforeAll(async () => {

// //     })
// // // beforeAll(async () => {
// // //     const pgrp = await addpolicygrp(roleId);
// // // })
// // // beforeAll(async () => {
// // //     const papp = await addpolicyapp(roleId);
// // // })
// // // beforeAll(async () => {
// // //     const puser = await addpolicyuser(roleId);
// // // })
// // // beforeAll(async () => {
// // //     const pstore = await addpolicystore(roleId);
// // // })
