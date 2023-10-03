// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { ProvidedRequiredArgumentsOnDirectives } from "graphql/validation/rules/ProvidedRequiredArguments";
// import { link } from "../../utils/testUtils";
// import { addgroup, addpolicyapp, addpolicygrp, addpolicyorg, addpolicystore, addpolicyuser, addrole, createauthorg, createnewapp, createnewapp1, createnewaudience, createnewcampaign1, createneworg1, createneworg2, createnewrule3, createnewruleconfig1, createnewsegment1, createnewuser, linkgroup, linkuser, linkuserorg } from "../../utils/functions";
// import {
//   randomGroupName,
//   randomRoleDescription,
//   randomRoleName
// } from "../../utils/index";

// jest.setTimeout(120000);
// let campId;
// let orgId;
// let appId;
// let ruleId;
// let segId;
// let audId;
// describe('Query audience', () => {
//   test('To display all the audience', async () => {
//     const operation = {
//       query: gql`query{
//                 audiences{
//                   id
//                   campaign{
//                     id
//                   }
//                   campaign{
//                     id
//                   }
//                   organization{
//                     id
//                   }
//                   status
//                   application{
//                     id
//                   }
//                 }

//               }
//               `
//     };
//     const QueryAudiences = await makePromise(execute(link, operation));

//   });
// });

// describe('Query audience', () => {
//   test('To display a specific audience', async () => {
//     const operation = {
//       query: gql`query{
//                 audience(id:"${audId}")
//                 {
//                   id
//                   campaign{
//                     id
//                   }
//                   segment{
//                     id
//                   }
//                   organization{
//                     id
//                   }
//                   application{
//                     id
//                   }
//                   status
//                 }
//               }
//               `
//     };
//     const QueryAudience = await makePromise(execute(link, operation));

//   });
//   test('To display a specific audience and audid as empty', async () => {
//     const audid = "";
//     const operation = {
//       query: gql`query{
//                 audience(id:"${audid}")
//                 {
//                   id
//                   campaign{
//                     id
//                   }
//                   segment{
//                     id
//                   }
//                   organization{
//                     id
//                   }
//                   application{
//                     id
//                   }
//                   status
//                 }
//               }
//               `
//     };
//     const QueryCampaign = await makePromise(execute(link, operation));
//     expect(QueryCampaign.errors[0].message).toEqual("");
//   });
//   test('To display a specific audience and audid as invalid ', async () => {
//     const audid = "helloworld";
//     const operation = {
//       query: gql`query{
//                 audience(id:"${audid}")
//                 {
//                   id
//                   campaign{
//                     id
//                   }
//                   segment{
//                     id
//                   }
//                   organization{
//                     id
//                   }
//                   application{
//                     id
//                   }
//                   status
//                 }
//               }
//               `
//     };
//     const QueryCampaign = await makePromise(execute(link, operation));
//     expect(QueryCampaign.errors[0].message).toEqual("Invalid Campaign id");

//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
//   const app = await createnewapp1(orgId);
//   appId = app.data.createApplication.id;
//   const rule = await createnewrule3(orgId);
//   ruleId = rule.data.createRule.id;
//   const camp = await createnewcampaign1(ruleId, appId, orgId);
//   campId = camp.data.createCampaign.id;
//   const seg = await createnewsegment1(orgId, appId, ruleId);
//   segId = seg.data.createSegment.id;
//   const aud = await createnewaudience(campId, segId, orgId, appId, "ACTIVE");
//   audId = aud.data.createAudience.id;
// })
