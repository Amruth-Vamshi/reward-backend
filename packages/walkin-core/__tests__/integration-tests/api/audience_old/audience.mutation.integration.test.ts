// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import {
//     STATUS
// } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { addgroup, addpolicyapp, addpolicygrp, addpolicyorg, addpolicystore, addpolicyuser, addrole, createauthorg, createnewapp, createnewapp1, createnewaudience, createnewcampaign, createnewcampaign1, createneworg, createneworg1, createnewrule3, createnewsegment, createnewsegment1, createnewuser, linkgroup, linkuser, linkuserorg } from "../../utils/functions";
// import {
//     campEndDate,
//     campStartDate,
//     randomCampName,
//     randomCampType,
//     randomGroupName, randomOrgAddress,
//     randomOrgPhone,
//     randomOrgT, randomOrgWebsite, randomRoleDescription, randomRoleName
// } from "../../utils/index";
// jest.setTimeout(120000);
// describe('createAudience', () => {
//     test('To createAudience with random values', async () => {
//         const status = STATUS.ACTIVE;
//         const operation = await createnewaudience(campId, segId, orgId, appId, status);
//     })
//     test('To createAudience with random values and status as INACTIVE', async () => {
//         const status = STATUS.INACTIVE;
//         const operation = await createnewaudience(campId, segId, orgId, appId, status);
//         console.log(operation);
//     })
//     test('To createAudience with random values and org as empty', async () => {
//         const status = STATUS.ACTIVE;
//         const orgid = "";
//         const operation = await createnewaudience(campId, segId, orgid, appId, status);
//         expect(operation.errors[0].errorCode).toEqual("errors.ORGANIZATION_INVALID.code");
//     })
//     test('To createAudience with random values and org as invalid', async () => {
//         const status = STATUS.ACTIVE;
//         const orgid = "123";
//         const operation = await createnewaudience(campId, segId, orgid, appId, status);
//         expect(operation.errors[0].errorCode).toEqual("errors.ORGANIZATION_INVALID.code");
//     })
//     test('To createAudience with random values and app as empty', async () => {
//         const status = STATUS.ACTIVE;
//         const appid = "";
//         const operation = await createnewaudience(campId, segId, orgId, appid, status);
//         expect(operation.errors[0].errorCode).toEqual("errors.APPLICATION_INVALID.code");
//     })
//     test('To createAudience with random values and app as invalid', async () => {
//         const status = STATUS.ACTIVE;
//         const appid = "helloworld";
//         const operation = await createnewaudience(campId, segId, orgId, appid, status);
//         expect(operation.errors[0].errorCode).toEqual("errors.APPLICATION_INVALID.code");
//     })
//     test('To createAudience with random values and seg as empty', async () => {
//         const status = STATUS.ACTIVE;
//         const segid = "";
//         const operation = await createnewaudience(campId, segid, orgId, appId, status);
//         expect(operation.errors[0].errorCode).toEqual("errors.SEGMENT_INVALID.code");
//     })
//     test('To createAudience with random values and seg as invalid', async () => {
//         const status = STATUS.ACTIVE;
//         const segid = "helloworld";
//         const operation = await createnewaudience(campId, segid, orgId, appId, status);
//         expect(operation.errors[0].errorCode).toEqual("errors.SEGMENT_INVALID.code");
//     })
//     test('To createAudience with random values and camp as empty', async () => {
//         const status = STATUS.ACTIVE;
//         const campid = "";
//         const operation = await createnewaudience(campid, segId, orgId, appId, status);
//         expect(operation.errors[0].validationErrors[0].message).toEqual("campaign cannot be null")
//     })
//     test('To createAudience with random values and camp as invalid', async () => {
//         const status = STATUS.ACTIVE;
//         const campid = "helloworld";
//         const operation = await createnewaudience(campid, segId, orgId, appId, status);
//         expect(operation.errors[0].validationErrors[0].message).toEqual("Invalid campaign id")
//     })
// });
// describe('createAudience', () => {
//     let orgid;
//     beforeEach(async () => {
//         const status = STATUS.INACTIVE;
//         const OrgName = Math.random().toString(36).substr(2, 14);
//         const OrgCode = Math.random().toString(36).substr(2, 14);
//         const org = await createneworg(OrgName, randomOrgAddress, OrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);
//         orgid = org.data.createOrganizationRoot.id;
//     });
//     test('createAudience with randomValues and organization status as INACTIVE', async () => {
//         const status = STATUS.ACTIVE;
//         const operation = await createnewaudience(campId, segId, orgid, appId, status);
//         expect(operation.errors[0].errorCode).toEqual("errors.ORGANIZATION_INVALID.code");
//     });
// });
// describe('createAudience', () => {
//     let segid;
//     beforeEach(async () => {
//         const status = STATUS.INACTIVE;
//         const SegName = Math.random().toString(36).substr(2, 14);
//         const SegDescription = Math.random().toString(36).substr(2, 14);
//         const SegType = Math.random().toString(36).substr(2, 14);
//         // createtheorganization in ACTIVE status then only it will work
//         const segment = await createnewsegment(orgId, appId, ruleId, SegName, SegDescription, SegType, status);
//         segid = segment.data.createSegment.id;
//     });
//     test('createAudience with randomValues and segment status as INACTIVE', async () => {
//         const status = STATUS.ACTIVE;
//         const operation = await createnewaudience(campId, segid, orgId, appId, status);
//         // console.log(operation);
//         // expect(operation.errors[0].errorCode).toEqual("errors.ORGANIZATION_INVALID.code");
//     });
// });
// describe('createAudience', () => {

//     let campid;
//     beforeEach(async () => {
//         const status = STATUS.INACTIVE;
//         const CampName = Math.random().toString(36).substr(2, 14);
//         const camp = await createnewcampaign(orgId, appId, ruleId, CampName, campStartDate, campEndDate, randomCampType, status);
//         campid = camp.data.createCampaign.id;
//     });
//     test('createAudience with randomValues and campaign status as INACTIVE', async () => {
//         const status = STATUS.ACTIVE;
//         const operation = await createnewaudience(campid, segId, orgId, appId, status);
//         //   console.log(operation);
//     });
// });
// let orgId;
// let appId;
// let ruleId;
// let segId;
// let campId;

// // beforeAll(async () => {
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
// //     const pgrp = await addpolicygrp(roleId);
// //     const papp = await addpolicyapp(roleId);
// //     const puser = await addpolicyuser(roleId);
// //     const pstore = await addpolicystore(roleId);
// // })
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
// })
