// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//   createauthorg, createnewuser2

// } from "../../utils/functions";
// import {
//   randomGroupName,
//   randomRoleDescription, randomRoleName, randomUserEmail,
//   randomUserFname,
//   randomUserLname,
//   randomUserPassword

// } from "../../utils/index";
// jest.setTimeout(120000);
// import { addCatchUndefinedToSchema } from "graphql-tools";
// import { async } from "q";
// describe('QueryUser', () => {
//   let userId;
//   beforeAll(async () => {
//     const user = await createnewuser2();
//     //  console.log(user);
//     userId = user.data.createUser.id;
//   })
//   test('Query specific User', async () => {
//     const operation = {
//       query: gql`query{
//              user(id:"${userId}"){
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                   members{
//                     applicationId
//                   }

//                   organization{
//                     id
//                   }
//                 }
//               }
//               `
//     };
//     const QueryUser = await makePromise(execute(link, operation));
//     expect(QueryUser.data.user.id).toEqual(userId);
//     // console.log(QueryUser)
//   });
//   test('Query specific User with empty userid', async () => {
//     const userid = "";
//     const operation = {
//       query: gql`query{
//              user(id:"${userid}"){
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                   members{
//                     applicationId
//                   }

//                   organization{
//                     id
//                   }
//                 }
//               }
//               `
//     };
//     const QueryUser = await makePromise(execute(link, operation));
//     expect(QueryUser.errors[0].validationErrors[0].message).toEqual("User Id not valid or User not found");
//     // console.log(QueryUser)
//   });
//   test('Query specific User with invalid userid', async () => {
//     const userid = "helloworld";
//     const operation = {
//       query: gql`query{
//              user(id:"${userid}"){
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                   members{
//                     applicationId
//                   }

//                   organization{
//                     id
//                   }
//                 }
//               }
//               `
//     };
//     const QueryUser = await makePromise(execute(link, operation));
//     expect(QueryUser.errors[0].validationErrors[0].message).toEqual("User Id not valid or User not found");
//     // console.log(QueryUser)
//   });
//   test('Query all the Users', async () => {
//     const operation = {
//       query: gql`query{
//                 users{
//                   id
//                   email
//                   firstName
//                   lastName
//                   status
//                   members{
//                     applicationId
//                   }
//                   organization{
//                     id
//                   }
//                 }
//               }
//               `
//     };
//     const QueryUsers = await makePromise(execute(link, operation));
//     // console.log(QueryUsers);
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
// })
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
