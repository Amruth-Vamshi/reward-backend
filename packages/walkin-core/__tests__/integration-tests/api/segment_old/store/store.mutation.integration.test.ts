// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { addCatchUndefinedToSchema } from "graphql-tools";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { async } from "q";
// import { AdvancedConsoleLogger } from "typeorm";
// import {
//     STATUS
// } from "../../../src/modules/common/constants/constants"
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//     addgroup,
//     addpolicyapp,
//     addpolicygrp,
//     addpolicyorg,
//     addpolicystore, addpolicyuser, addrole, createauthorg, createnewapp, createnewapp1, createnewapp2, createneworg1, createnewuser, linkgroup, linkuser, linkuserorg

// } from "../../utils/functions";
// jest.setTimeout(120000);

// let orgId;

// describe('updateStore', () => {
//     test('updateStore with randomValues and change the status to INACTIVE', async () => {
//         // const env = Math.random().toString(36).substr(2, 14);
//         const operation = {
//             query: gql`mutation{
//                 updateStore(input:{
//                 id:"${orgId}"
//                 STATUS:${STATUS.INACTIVE}
//                 })
//                 {
//                   id
//                   STATUS
//                 }
//               }
//               `
//         };
//         const updateStore = await makePromise(execute(link, operation));
//         expect(updateStore.data.updateStore.status).toEqual(STATUS.INACTIVE);
//         // console.log(updateStore.errors[0].validationErrors[0]);
//         // expect(updateStore.data.updateStore.id).toBeTruthy();

//     });
//     test('updateStore with randomValues and to update the name and code to random value', async () => {
//         const name = Math.random().toString(36).substr(2, 14);
//         const code = Math.random().toString(36).substr(2, 14);
//         const operation = {
//             query: gql`mutation{
//                 updateStore(input:{
//                 id:"${orgId}"
//                 name:"${name}"
//                 code:"${code}"
//                 })
//                 {
//                   id
//                   STATUS
//                   name
//                   code
//                 }
//               }
//               `
//         };

//         const updateStore = await makePromise(execute(link, operation));
//         expect(updateStore.data.updateStore.code).toEqual(code);
//         // console.log(updateStore.errors[0].validationErrors[0]);
//         //  expect(updateStore.data.updateStore.id).toBeTruthy();
//     });

// });
// beforeAll(async () => {
//     const authorg = await createauthorg();
//     const org = await createneworg1()
//     orgId = org.data.createOrganizationRoot.id;
// })
// // beforeAll(async () => {

// //     // const user = await createnewuser();
// //     // userId = user.data.createUser.id;
// //     const org = await createneworg1();
// //     orgid = org.data.createOrganizationRoot.id;
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
