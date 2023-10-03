// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { ProvidedRequiredArgumentsOnDirectives } from "graphql/validation/rules/ProvidedRequiredArguments";
// import { link } from "../../utils/testUtils";
// import { addgroup, addpolicyapp, addpolicygrp, addpolicyorg, addpolicystore, addpolicyuser, addrole, createauthorg, createnewapp, createnewapp1, createnewcampaign1, createneworg1, createneworg2, createnewrule3, createnewruleconfig1, createnewuser, linkgroup, linkuser, linkuserorg } from "../../utils/functions";
// import {
//   randomGroupName,
//   randomRoleDescription,
//   randomRoleName
// } from "../../utils/index";
// let userId, orgid, grpId, roleId;
// let linkGrpId;
// let linkUserId;
// let ruleConfigId;
// let campId;
// let orgId;
// let appId;
// let ruleId;
// jest.setTimeout(120000);
// describe('Query campaigns', () => {
//   test('To display all the campaigns', async () => {
//     const operation = {
//       query: gql`query{
//               campaigns(status:ACTIVE)
//             {
//               id
//               name
//               description
//               startTime
//               endTime
//               organization{
//                 id
//               }
//               application{
//                 id
//               }
//             }
//             }
//               `
//     };
//     const QueryCampaigns = await makePromise(execute(link, operation));

//   }, 60000);
// });

// describe('Query campaign', () => {
//   test('To display a specific campaign', async () => {
//     const operation = {
//       query: gql`query{
//               campaign(id:"${campId}")
//             {
//               id
//               name
//               description
//               startTime
//               endTime
//               organization{
//                 id
//               }
//               application{
//                 id
//               }
//             }
//             }
//               `
//     };
//     const QueryCampaign = await makePromise(execute(link, operation));

//   }, 60000);
//   test('To display a specific campaign and campid as empty', async () => {
//     const campid = "";
//     const operation = {
//       query: gql`query{
//               campaign(id:"${campid}")
//             {
//               id
//               name
//               description
//               startTime
//               endTime
//               organization{
//                 id
//               }
//               application{
//                 id
//               }
//             }
//             }
//               `
//     };
//     const QueryCampaign = await makePromise(execute(link, operation));
//     console.log(QueryCampaign.errors[0].validatonErrors[0]);
//   }, 60000);
//   test('To display a specific campaign and campid as empty', async () => {
//     const campid = "helloworld";
//     const operation = {
//       query: gql`query{
//               campaign(id:"${campid}")
//             {
//               id
//               name
//               description
//               startTime
//               endTime
//               organization{
//                 id
//               }
//               application{
//                 id
//               }
//             }
//             }
//               `
//     };
//     const QueryCampaign = await makePromise(execute(link, operation));
//     console.log(QueryCampaign.errors[0].validatonErrors[0]);
//   }, 60000);
// });
// // beforeAll(async () => {
// //   const user = await createnewuser();
// //   userId = user.data.createUser.id;
// //   const org = await createneworg1();
// //   orgid = org.data.createOrganizationRoot.id;
// //   const grp = await addgroup(orgid, randomGroupName);
// //   grpId = grp.data.addGroupToOrganization.id;
// //   // const lgrp = await linkgroup(orgid, grpId);
// //   // console.log(lgrp);
// //   // linkGrpId = lgrp.data.linkGroupToOrganization.id;
// //   const role = await addrole(grpId, randomRoleName, randomRoleDescription);
// //   roleId = role.data.addRole.id;
// //   const luserorg = await linkuserorg(orgid, userId);
// //   const luser = await linkuser(grpId, userId);
// //   linkUserId = luser.data.linkUserToGroup.id;
// //   const porg = await addpolicyorg(roleId);
// //   const pgrp = await addpolicygrp(roleId);
// //   const papp = await addpolicyapp(roleId);
// //   const puser = await addpolicyuser(roleId);
// //   const pstore = await addpolicystore(roleId);
// // });
// beforeAll(async () => {
//   const authorg = createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
//   const app = await createnewapp1(orgId);
//   appId = app.data.createApplication.id;
//   const rule = await createnewrule3(orgId);
//   ruleId = rule.data.createRule.id;
//   const camp = await createnewcampaign1(ruleId, appId, orgId);
//   campId = camp.data.createCampaign.id;
// })
