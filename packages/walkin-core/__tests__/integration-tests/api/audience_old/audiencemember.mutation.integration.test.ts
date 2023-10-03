// import { execute, makePromise } from "apollo-link";
// import { stat } from "fs";
// import gql from "graphql-tag";
// import {
//     STATUS
// } from "../../../src/modules/common/constants/constants"
// import { link } from "../../utils/testUtils";
// import { addgroup, addpolicyapp, addpolicygrp, addpolicyorg, addpolicystore, addpolicyuser, addrole, createauthorg, createnewapp, createnewapp1, createnewaudience, createnewaudiencemember, createnewcampaign1, createnewcustomer1, createneworg1, createnewrule3, createnewsegment1, createnewuser, linkgroup, linkuser, linkuserorg } from "../../utils/functions";
// import {
//     randomGroupName,
//     randomRoleDescription,
//     randomRoleName
// } from "../../utils/index";
// jest.setTimeout(120000);
// describe('createAudienceMember', () => {
//     test('To createAudienceMember with random values', async () => {
//         const status = STATUS.ACTIVE;
//         const operation = await createnewaudiencemember(audId, custId, status);
//     })
//     test('To createAudienceMember with random values and audience id as empty', async () => {
//         const status = STATUS.ACTIVE;
//         const audid = "";
//         const operation = await createnewaudiencemember(audid, custId, status);
//     })
//     test('To createAudienceMember with random values and audience id as invalid ', async () => {
//         const status = STATUS.ACTIVE;
//         const audid = "helloworld";
//         const operation = await createnewaudiencemember(audid, custId, status);
//     })
//     test('To createAudienceMember with random values and customer id as empty', async () => {
//         const status = STATUS.ACTIVE;
//         const custid = "";
//         const operation = await createnewaudiencemember(audId, custid, status);
//     })
//     test('To createAudienceMember with random values and customer id as invalid', async () => {
//         const status = STATUS.ACTIVE;
//         const custid = "helloworld";
//         const operation = await createnewaudiencemember(audId, custid, status);
//     })
//     test('To createAudienceMember with random values and status as INACTIVE', async () => {
//         const status = STATUS.INACTIVE;
//         const operation = await createnewaudiencemember(audId, custId, status);

//     })
//     test('To createAudienceMember with random values and status as INVALID', async () => {
//         const status = "INVALID";
//         const operation = await createnewaudiencemember(audId, custId, status);
//     })
// });
// let userId, orgid, grpId, roleId;
// let linkGrpId;
// let linkUserId;
// let orgId;
// let appId;
// let ruleId;
// let segId;
// let campId;
// let audId;
// let custId;
// const status = STATUS.ACTIVE;

// beforeAll(async () => {
//     const authorg = await createauthorg();
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
//     const app = await createnewapp1(orgId);
//     appId = app.data.createApplication.id;
//     const rule = await createnewrule3(orgId);
//     ruleId = rule.data.createRule.id;
//     const seg = await createnewsegment1(orgId, appId, ruleId);
//     segId = seg.data.createSegment.id;
//     const camp = await createnewcampaign1(ruleId, appId, orgId);
//     campId = camp.data.createCampaign.id;
//     const cust = await createnewcustomer1(orgId);
//     custId = cust.data.createCustomer.id;

//     const aud = await createnewaudience(campId, segId, orgId, appId, status);

//     audId = aud.data.createAudience.id;
// })
