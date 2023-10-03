// import { execute, makePromise } from "apollo-link";
// import { stat } from "fs";
// import gql from "graphql-tag";
// import { addCatchUndefinedToSchema } from "graphql-tools";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { async } from "q";
// import { AdvancedConsoleLogger } from "typeorm";
// import { STATUS } from "../../../src/modules/common/constants/constants";
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
//   createneworg,
//   createneworg1,
//   createnewuser,
//   createnewuser1,
//   createnewuser2,
//   linkgroup,
//   linkuser,
//   linkuserorg
// } from "../../utils/functions";
// import {
//   randomGroupName,
//   randomRoleDescription,
//   randomRoleName,
//   randomUserEmail,
//   randomUserFname,
//   randomUserLname,
//   randomUserPassword,
//   updateUserEmail,
//   updateUserFname,
//   updateUserLname
// } from "../../utils/index";
// jest.setTimeout(120000);
// describe("createUser", () => {
//   test("createUser with randomValues", async () => {
//     const status = STATUS.ACTIVE;
//     const user = await createnewuser1(
//       randomUserEmail,
//       randomUserFname,
//       randomUserLname,
//       status,
//       randomUserPassword
//     );
//     expect(user.data.createUser.email).toBeTruthy();
//     expect(user.data.createUser.status).toBeTruthy();
//     expect(user.data.createUser.firstName).toBeTruthy();
//     expect(user.data.createUser.lastName).toBeTruthy();
//     // console.log(user);
//   });
//   test("createUser with randomValues with empty user email", async () => {
//     const status = STATUS.ACITVE;
//     const UserEmail = "";
//     const user = await createnewuser1(
//       UserEmail,
//       randomUserFname,
//       randomUserLname,
//       status,
//       randomUserPassword
//     );
//     expect(user.errors[0].validationErrors[0].message).toEqual(
//       "email cannot be empty"
//     );
//   });
//   test("createUser with randomValues with user email which already exists", async () => {
//     const status = STATUS.ACTIVE;
//     const user = await createnewuser1(
//       randomUserEmail,
//       randomUserFname,
//       randomUserLname,
//       status,
//       randomUserPassword
//     );
//     expect(user.errors[0].validationErrors[0].message).toEqual(
//       "email already exists"
//     );
//   });
//   test("createUser with randomValues with status as INACTIVE", async () => {
//     const status = STATUS.INACTIVE;
//     const UserEmail = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const user = await createnewuser1(
//       UserEmail,
//       randomUserFname,
//       randomUserLname,
//       status,
//       randomUserPassword
//     );
//     expect(user.data.createUser.status).toEqual(STATUS.INACTIVE);
//   });
//   test("createUser with randomValues with status as INVALID", async () => {
//     const status = "INVALID";
//     const UserEmail = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const user = await createnewuser1(
//       UserEmail,
//       randomUserFname,
//       randomUserLname,
//       status,
//       randomUserPassword
//     );
//     console.log(user);
//   });
// });
// describe("UpdateUser", () => {
//   let userId;
//   beforeAll(async () => {
//     const user = await createnewuser2();
//     userId = user.data.createUser.id;
//   });
//   test("UpdateUser with randomValues", async () => {
//     const status = STATUS.ACTIVE;
//     const operation = {
//       query: gql`mutation{
//                 updateUser(input:{
//                   id:"${userId}"
//                   email:"${updateUserEmail}"
//                   firstName:"${updateUserFname}"
//                   lastName:"${updateUserLname}"
//                   status:${status}
//                 })
//                 {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const updateUser = await makePromise(execute(link, operation));
//   });
//   test("UpdateUser with empty userid", async () => {
//     const status = STATUS.ACTIVE;
//     const userid = "";
//     const operation = {
//       query: gql`mutation{
//                 updateUser(input:{
//                   id:"${userid}"
//                   status:${status}
//                 })
//                 {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const updateUser = await makePromise(execute(link, operation));
//     expect(updateUser.errors[0].validationErrors[0].message).toEqual(
//       "User not found"
//     );
//   });
//   test("UpdateUser with status as same as already exists", async () => {
//     const status = STATUS.ACTIVE;
//     const operation = {
//       query: gql`mutation{
//                 updateUser(input:{
//                   id:"${userId}"
//                   status:${status}
//                 })
//                 {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const updateUser = await makePromise(execute(link, operation));
//     expect(updateUser.errors[0].validationErrors[0].message).toEqual(
//       "status is already active"
//     );
//   });
//   test("UpdateUser with randomValues and update email to empty", async () => {
//     const status = STATUS.ACTIVE;
//     const UserEmail = "";
//     const operation = {
//       query: gql`mutation{
//                 updateUser(input:{
//                   id:"${userId}"
//                   email:"${UserEmail}"
//                   status:${status}
//                 })
//                 {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const updateUser = await makePromise(execute(link, operation));
//     expect(updateUser.errors[0].validationErrors[0].message).toEqual(
//       "email cannot be empty"
//     );
//   });
//   test("UpdateUser with randomValues and update email to which already exists", async () => {
//     const status = STATUS.ACTIVE;
//     const operation = {
//       query: gql`mutation{
//                 updateUser(input:{
//                   id:"${userId}"
//                   email:"${updateUserEmail}"
//                   status:${status}
//                 })
//                 {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const updateUser = await makePromise(execute(link, operation));
//     expect(updateUser.errors[0].validationErrors[0].message).toEqual(
//       "email already exists"
//     );
//   });
//   test("UpdateUser to status INVALID", async () => {
//     const operation = {
//       query: gql`mutation{
//                 updateUser(input:{
//                   id:"${userId}"
//                   status:INVALID
//                 })
//                 {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const updateUser = await makePromise(execute(link, operation));
//   });
// });
// describe("deleteUser", () => {
//   let userId;
//   beforeAll(async () => {
//     const user = await createnewuser2();
//     userId = user.data.createUser.id;
//   });
//   test("deleteUser using user id ", async () => {
//     const operation = {
//       query: gql`mutation {
//                 deleteUserById(id: "${userId}")
//               }
//               `
//     };
//     const deleteUser = await makePromise(execute(link, operation));
//     // console.log(deleteUser);
//   });
//   test("deleteUser using empty user id", async () => {
//     const userid = "";
//     const operation = {
//       query: gql`mutation {
//                 deleteUserById(id: "${userid}")
//               }
//               `
//     };
//     const deleteUser = await makePromise(execute(link, operation));
//     expect(deleteUser.errors[0].validationErrors[0].message).toEqual(
//       "User not found"
//     );
//   });
//   test("deleteUser using invalid user id", async () => {
//     const userid = "helloworld";
//     const operation = {
//       query: gql`mutation {
//                 deleteUserById(id: "${userid}")
//               }
//               `
//     };
//     const deleteUser = await makePromise(execute(link, operation));
//     expect(deleteUser.errors[0].validationErrors[0].message).toEqual(
//       "User not found"
//     );
//   });
//   test("deleteUser which has already been deleted", async () => {
//     const userid = "";
//     const operation = {
//       query: gql`mutation {
//                 deleteUserById(id: "${userid}")
//               }
//               `
//     };
//     const deleteUser = await makePromise(execute(link, operation));
//     expect(deleteUser.errors[0].validationErrors[0].message).toEqual(
//       "User not found"
//     );
//   });
// });
// describe("linkUsertoapplication", () => {
//   let userId;
//   let orgId;
//   let appId;
//   beforeAll(async () => {
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
//     const user = await createnewuser2();
//     userId = user.data.createUser.id;
//     const app = await createnewapp1(orgId);
//     appId = app.data.createApplication.id;
//   });
//   test("linkUsertoapplication", async () => {
//     const operation = {
//       query: gql`mutation {
//                 linkApplicationToUser(userId: "${userId}", applicationID: "${appId}") {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const linkusertoapplication = await makePromise(execute(link, operation));
//     // console.log(linkusertoapplication);
//   });
//   test("linkUsertoapplication to empty userid", async () => {
//     const userid = "";
//     const operation = {
//       query: gql`mutation {
//                 linkApplicationToUser(userId: "${userid}", applicationID: "${appId}") {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const linkusertoapplication = await makePromise(execute(link, operation));
//     expect(linkusertoapplication.errors[0].validationErrors[0].message).toEqual(
//       "User not found"
//     );
//   });
//   test("linkUsertoapplication to invalid userid", async () => {
//     const userid = "helloworld";
//     const operation = {
//       query: gql`mutation {
//                 linkApplicationToUser(userId: "${userid}", applicationID: "${appId}") {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const linkusertoapplication = await makePromise(execute(link, operation));
//     expect(linkusertoapplication.errors[0].validationErrors[0].message).toEqual(
//       "User not found"
//     );
//   });
//   test("linkUsertoapplication to empty appid", async () => {
//     const appid = "";
//     const operation = {
//       query: gql`mutation {
//                 linkApplicationToUser(userId: "${userId}", applicationID: "${appid}") {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const linkusertoapplication = await makePromise(execute(link, operation));
//     expect(linkusertoapplication.errors[0].validationErrors[0].message).toEqual(
//       "Application not found"
//     );
//   });
//   test("linkUsertoapplication to invalid appid", async () => {
//     const appid = "helloworld";
//     const operation = {
//       query: gql`mutation {
//                 linkApplicationToUser(userId: "${userId}", applicationID: "${appid}") {
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                 }
//               }
//               `
//     };
//     const linkusertoapplication = await makePromise(execute(link, operation));
//     expect(linkusertoapplication.errors[0].validationErrors[0].message).toEqual(
//       "Application not found"
//     );
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
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
