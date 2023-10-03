// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { addCatchUndefinedToSchema } from "graphql-tools";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { async } from "q";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//     addgroup,
//     addpolicyapp, addpolicygrp,
//     addpolicyorg, addpolicystore, addpolicyuser, addrole, createnewapp, createnewapp2, createneworg1, createnewuser, createnewuser1, createnewuser2, linkgroup, linkuser, linkuserorg

// } from "../../utils/functions";
// import {
//     randomGroupName,
//     randomRoleDescription, randomRoleName, randomUserEmail,
//     randomUserFname,
//     randomUserLname,
//     randomUserPassword

// } from "../../utils/index";
// describe('Group Mutation', () => {
//     let userId;
//     let groupId;
//     let orgId;
//     beforeEach(async () => {
//         const name = Math.random().toString(36).substr(2, 14);
//         const org = await createneworg1();
//         orgId = org.data.createOrganizationRoot.id;
//         const user = await createnewuser2();
//         userId = user.data.createUser.id;
//         const linkuser = await linkuserorg(orgId, userId);
//         const group = await addgroup(orgId, name);
//         groupId = group.data.addGroupToOrganization.id;
//     })
//     test('Link user to group ', async () => {
//         const operation = await linkuser(groupId, userId);

//     });
//     test('remove user from group', async () => {
//         const operation = {
//             query: gql`mutation{
//                 removeUserFromGroup(groupId:"${groupId}",userId:"${userId}")
//                 {
//                   id
//                 }
//               }
//               `
//         };
//         const rmuser = await makePromise(execute(link, operation));
//         console.log(rmuser.errors[0].validationErrors[0]);
//     })
//     test('update group', async () => {
//         const operation = {
//             query: gql`mutation{
//                 updateGroup(group:{
//                   id:"${groupId}"
//                   name:"NEWNAME"
//                 })
//                 {
//                   id
//                   name
//                 }
//               }
//               `
//         };
//         const updategroup = await makePromise(execute(link, operation));

//     })
//     // test('link role to group ', async () => {
//     //     const operation = {
//     //         query: gql`mutation{
//     //             linkRoleToGroup(groupId:"${groupId}",roleId:"${roleId}")
//     //             {
//     //               id
//     //               name
//     //               users{
//     //                 id
//     //               }
//     //               organization{
//     //                 id
//     //               }
//     //             }
//     //           }
//     //           `
//     //     };
//     //     const linkrolegroup = await makePromise(execute(link, operation));
//     //     console.log(deletegroup);
//     // })
//     test('delete group by', async () => {
//         const operation = {
//             query: gql`mutation{
//                 deleteGroupbyId(groupId:"${groupId}")
//                 {
//                   id
//                 }
//               }
//               `
//         };
//         const deletegroup = await makePromise(execute(link, operation));
//         console.log(deletegroup.errors[0].validationErrors[0]);
//     })

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
