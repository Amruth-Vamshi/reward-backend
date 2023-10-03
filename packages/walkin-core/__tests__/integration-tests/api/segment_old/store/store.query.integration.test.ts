// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { addCatchUndefinedToSchema } from "graphql-tools";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { async } from "q";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//   addgroup,
//   addpolicyapp,
//   addpolicygrp,
//   addpolicyorg,
//   addpolicystore, addpolicyuser, addrole, createauthorg, createnewapp, createnewapp1, createnewapp2, createneworg1, createnewuser, linkgroup, linkuser, linkuserorg

// } from "../../utils/functions";
// jest.setTimeout(120000);

// let orgId;

// describe('QueryStore', () => {
//   test('Query all the stores', async () => {
//     // const env = Math.random().toString(36).substr(2, 14);
//     const operation = {
//       query: gql`query{
//                 stores{
//                   id
//                   name
//                   STATUS

//                   code
//                   organization{
//                     id
//                   }
//                 }
//               }
//               `
//     };
//     const QueryStore = await makePromise(execute(link, operation));
//     // console.log(QueryStore);
//   });

//   test('Query specific store', async () => {
//     // const env = Math.random().toString(36).substr(2, 14);
//     const operation = {
//       query: gql`query{
//                     stores{
//                       id
//                       name
//                       STATUS

//                       code
//                       organization{
//                         id
//                       }
//                     }
//                   }
//                   `
//     };
//     const QueryStore = await makePromise(execute(link, operation));
//     // console.log(QueryStore);
//   });
// });

// beforeAll(async () => {
//   const org = await createneworg1()
//   orgId = org.data.createOrganizationRoot.id;
// })
// beforeAll(async () => {
//   const authorg = await createauthorg();
// })
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
