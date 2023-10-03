// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { async } from "q";
// import { AdvancedConsoleLogger } from "typeorm";
// import {
//   SEGMENT_TYPE,
//   STATUS
// } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//   createauthorg,
//   createnewapp1,
//   createneworg,
//   createneworg1,
//   createnewrule3,
//   createnewruleconfig1,
//   createnewsegment,
//   createnewsegment1
// } from "../../utils/functions";
// import {
//   randomOrgAddress,
//   randomOrgPhone,
//   randomOrgT,
//   randomOrgWebsite,
//   randomSegDescription,
//   randomSegName,
//   randomSegStatus,
//   UpdateSegDescription,
//   UpdateSegName, UpdateSegStatus,
//   UpdateSegType
// } from "../../utils/index";
// jest.setTimeout(120000);
// let orgId;
// let appId;
// let ruleId;
// describe('createSegment', () => {
//   test('createSegment with randomValues', async () => {
//     const status = STATUS.ACTIVE;
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appId, ruleId, randomSegName, randomSegDescription, randomSegType, status);
//     // positive tests for the createRule_attribute API
//     expect(segment.data.createSegment.name).toBeTruthy();
//     expect(segment.data.createSegment.segmentType).toBeTruthy();
//     expect(segment.data.createSegment.status).toBeTruthy();
//     expect(segment.data.createSegment.organization.id).toBeTruthy();
//     expect(segment.data.createSegment.application.id).toBeTruthy();

//     // expect(statusopt1).toContain(rule_config.data.createRuleConfiguration.status);
//   }, 60000);
//   test('createSegment with randomValues with name as null', async () => {
//     const status = STATUS.ACTIVE;
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const SegDescription = Math.random().toString(36).substr(2, 14);

//     const SegName = "";
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appId, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].validationErrors[0].message).toEqual("Please choose another segment name");

//   }, 60000);
//   test('createSegment with randomValues with name which already exists', async () => {
//     const status = STATUS.ACTIVE;
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const SegDescription = Math.random().toString(36).substr(2, 14);

//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appId, ruleId, randomSegName, SegDescription, randomSegType, status);

//     expect(segment.errors[0].validationErrors[0].message).toEqual("Please choose another segment name");
//   }, 60000);
//   test('createSegment with randomValues with description as null', async () => {
//     const status = STATUS.ACTIVE;
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const SegDescription = "";
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appId, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].validationErrors[0].message).toEqual("Description cannot be null");
//   }, 600000);
//   test('createSegment with randomValues with status as INACTIVE', async () => {
//     const status = STATUS.INACTIVE;
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appId, ruleId, SegName, SegDescription, randomSegType, status);
//   }, 60000);
//   test('createSegment with randomValues with status as INVALID', async () => {
//     const status = "INVALID";
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const SegType = Math.random().toString(36).substr(2, 14);
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appId, ruleId, SegName, SegDescription, randomSegType, status);
//     // console.log(segment);
//   }, 60000);
//   test('createSegment with randomValues with organization id as null', async () => {
//     const status = STATUS.ACTIVE;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const orgid = "";
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgid, appId, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].errorMessage).toEqual("errors.ORGANIZATION_INVALID.message");
//   }, 60000);
//   test('createSegment with randomValues with organization id as invalid organization', async () => {
//     const status = STATUS.ACTIVE;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const orgid = "1234";
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgid, appId, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].errorMessage).toEqual("errors.ORGANIZATION_INVALID.message");
//   }, 60000);
//   test('createSegment with randomValues with application id as invalid application', async () => {
//     const status = STATUS.ACTIVE;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const appid = "1234";
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appid, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].errorMessage).toEqual("errors.APPLICATION_INVALID.message");
//   }, 60000);
//   test('createSegment with randomValues with application id as null', async () => {
//     const status = STATUS.ACTIVE;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const appid = "";
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appid, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].errorMessage).toEqual("errors.APPLICATION_INVALID.message");
//   }, 60000);
//   test('createSegment with randomValues with ruleId as null', async () => {
//     const status = STATUS.ACTIVE;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const ruleId = "";
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appId, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].errorMessage).toEqual("errors.RULE_INVALID.message");
//   }, 60000);
//   test('createSegment with randomValues with ruleId as invalid', async () => {
//     const status = STATUS.ACTIVE;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const ruleId = "12345";
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgId, appId, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].errorMessage).toEqual("errors.RULE_INVALID.message");
//   }, 60000);
// });
// describe('createSegment', () => {
//   let orgid;
//   beforeEach(async () => {
//     const status = STATUS.INACTIVE;
//     const OrgName = Math.random().toString(36).substr(2, 14);
//     const OrgCode = Math.random().toString(36).substr(2, 14);
//     const org = await createneworg(OrgName, randomOrgAddress, OrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);
//     orgid = org.data.createOrganizationRoot.id;
//   });
//   test('createsegment with randomvalues and organization status as INACTIVE', async () => {
//     const status = STATUS.ACTIVE;
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgid, appId, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].errorMessage).toEqual("errors.ORGANIZATION_INVALID.message");
//   }, 60000);
// })
// describe('createSegment', () => {
//   let orgid;
//   beforeEach(async () => {
//     const status = STATUS.DRAFT;
//     const OrgName = Math.random().toString(36).substr(2, 14);
//     const OrgCode = Math.random().toString(36).substr(2, 14);
//     const org = await createneworg(OrgName, randomOrgAddress, OrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);
//     orgid = org.data.createOrganizationRoot.id;
//   })
//   test('createsegment with randomvalues and organization status as DRAFT', async () => {
//     const status = STATUS.ACTIVE;
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const randomSegType = SEGMENT_TYPE.CUSTOM;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     // createtheorganization in ACTIVE status then only it will work
//     const segment = await createnewsegment(orgid, appId, ruleId, SegName, SegDescription, randomSegType, status);
//     expect(segment.errors[0].errorMessage).toEqual("errors.ORGANIZATION_INVALID.message");
//   }, 60000);
// })
// describe('updateSegment', () => {

//   let segId;
//   beforeEach(async () => {
//     const seg = await createnewsegment1(orgId, appId, ruleId);
//     segId = seg.data.createSegment.id;
//   })
//   test('updateSegment with randomValues', async () => {
//     const status = STATUS.ACTIVE;
//     const type = SEGMENT_TYPE.CUSTOM;
//     const operation = {// createtheorganization in ACTIVE status then only it will work
//       query: gql`mutation {
//                 updateSegment(input:{
//                         id:"${segId}"
//                         name:"${UpdateSegName}"
//                         description:"${UpdateSegDescription}"
//                         segmentType:${type}

//                     })
//                     {
//                         id
//                         name
//                         description
//                         segmentType

//                     }
//                   }
//          `
//     };

//     const Updatesegment = await makePromise(execute(link, operation));
//     const segName = Updatesegment.data.updateSegment.name;
//     // positive tests for the createRule_attribute API
//     expect(Updatesegment.data.updateSegment.id).toBeTruthy();
//     expect(Updatesegment.data.updateSegment.name).toBeTruthy();
//     expect(Updatesegment.data.updateSegment.segmentType).toBeTruthy();
//     expect(Updatesegment.data.updateSegment.status).not.toBeNull();
//     // expect(statusopt1).toContain(rule_config.data.createRuleConfiguration.status);
//   });
//   test('updateSegment with randomValues with name null', async () => {
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const type = SEGMENT_TYPE.CUSTOM;
//     const status = STATUS.ACTIVE;
//     const SegName = "";
//     const operation = {// createtheorganization in ACTIVE status then only it will work
//       query: gql`mutation {
//                 updateSegment(input:{
//                         id:"${segId}"
//                         name:"${SegName}"
//                         description:"${SegDescription}"
//                         segmentType:${type}

//                     })
//                     {
//                         id
//                         name
//                         description
//                         segmentType

//                     }
//                   }
//          `
//     };

//     const Updatesegment = await makePromise(execute(link, operation));
//     expect(Updatesegment.errors[0].validationErrors[0].message).toEqual("Please choose another segment name");
//     // expect(statusopt1).toContain(rule_config.data.createRuleConfiguration.status);
//   });
//   test('updateSegment with randomValues with name which already exists', async () => {
//     const SegDescription = Math.random().toString(36).substr(2, 14);
//     const status = STATUS.ACTIVE;
//     const type = SEGMENT_TYPE.CUSTOM
//     const operation = {// createtheorganization in ACTIVE status then only it will work
//       query: gql`mutation {
//                 updateSegment(input:{
//                         id:"${segId}"
//                         name:"${UpdateSegName}"
//                         description:"${SegDescription}"
//                         segmentType:${type}

//                     })
//                     {
//                         id
//                         name
//                         description
//                         segmentType

//                     }
//                   }
//          `
//     };

//     const Updatesegment = await makePromise(execute(link, operation));
//     expect(Updatesegment.errors[0].validationErrors[0].message).toEqual("Please choose another segment name");
//     // expect(statusopt1).toContain(rule_config.data.createRuleConfiguration.status);
//   });
//   test('updateSegment with randomValues with description null', async () => {
//     const SegDescription = "";
//     const status = STATUS.ACTIVE;
//     const SegName = Math.random().toString(36).substr(2, 14);
//     const type = SEGMENT_TYPE.CUSTOM;
//     const operation = {// createtheorganization in ACTIVE status then only it will work
//       query: gql`mutation {
//                 updateSegment(input:{
//                         id:"${segId}"
//                         name:"${SegName}"
//                         description:"${SegDescription}"
//                         segmentType:${type}

//                     })
//                     {
//                         id
//                         name
//                         description
//                         segmentType

//                     }
//                   }
//          `
//     };

//     const Updatesegment = await makePromise(execute(link, operation));
//     expect(Updatesegment.errors[0].validationErrors).toEqual("description cannot be null");
//     // expect(statusopt1).toContain(rule_config.data.createRuleConfiguration.status);
//   });
// });
// describe('disableSegment', () => {

//   let segId;
//   beforeEach(async () => {
//     const seg = await createnewsegment1(orgId, appId, ruleId);
//     segId = seg.data.createSegment.id;
//   })
//   test('disableSegment with segment id ', async () => {
//     const operation = {// createtheorganization in ACTIVE status then only it will work
//       query: gql`mutation{
//         disableSegment(id:"${segId}")
//         {
//           id
//           status
//         }
//       }
//          `
//     };

//     const disablesegment = await makePromise(execute(link, operation));
//     expect(disablesegment.data.disableSegment.id).toEqual(segId);
//     expect(disablesegment.data.disableSegment.status).toEqual(STATUS.ACTIVE);
//   });
//   test('disableSegment with segment id with empty segment id', async () => {
//     const segid = "";
//     const operation = {// createtheorganization in ACTIVE status then only it will work
//       query: gql`mutation{
//         disableSegment(id:"${segid}")
//         {
//           id
//           status
//         }
//       }
//          `
//     };

//     const disablesegment = await makePromise(execute(link, operation));
//     expect(disablesegment.errors[0].message).toEqual("Segment id is invalid or not found");
//   });
//   test('disableSegment with segment id with invalid segment id', async () => {
//     const segid = "invalid";
//     const operation = {// createtheorganization in ACTIVE status then only it will work
//       query: gql`mutation{
//         disableSegment(id:"${segid}")
//         {
//           id
//           status
//         }
//       }
//          `
//     };

//     const disablesegment = await makePromise(execute(link, operation));
//     expect(disablesegment.errors[0].message).toEqual("Segment id is invalid or not found");
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
//   // console.log(org);
//   const app = await createnewapp1(orgId);
//   appId = app.data.createApplication.id;
//   // console.log(app);
//   const ruleConfig = await createnewrule3(orgId);
//   // console.log(ruleConfig);
//   ruleId = ruleConfig.data.createRule.id;

// })
