// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { async } from "q";
// import { AdvancedConsoleLogger } from "typeorm";
// import { CAMPAIGN_TYPE, RULE_TYPE, STATUS } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//   addgroup, addpolicyapp, addpolicygrp, addpolicyorg, addpolicystore, addpolicyuser, addrole, createauthorg, createnewapp, createnewapp1, createnewcampaign, createnewcampaign1, createneworg, createneworg1, createnewrule, createnewrule3, createnewuser, createnewworkflow1, createnewworkflowprocess1, createnewworkflowprocesstranistion, createnewworkflowprocesstranistion1, createnewworkflowstate1, linkgroup, linkuser, linkuserorg
// } from "../../utils/functions"
// import {
//   campEndDate,
//   campStartDate,
//   randomCampName,
//   randomCampType,
//   randomGroupName,
//   randomOrgAddress,
//   randomOrgPhone,
//   randomOrgT,
//   randomOrgWebsite,
//   randomRoleDescription,
//   randomRoleName,
//   randomRuleDescription,
//   UpdatecampEndDate, UpdateCampName,
//   UpdatecampStartDate,
//   UpdateCampType
// } from "../../utils/index";
// let workflowId, pstateId, dstateId, processId, processtransitionId;
// let orgId;
// let appId;
// let ruleId;
// jest.setTimeout(120000);
// describe('createCampaign', () => {
//   test('createCampaign with randomValues', async () => {
//     const status = STATUS.ACTIVE;
//     const type = CAMPAIGN_TYPE.OFFER;
//     const camp = await createnewcampaign(orgId, appId, ruleId, randomCampName, campStartDate, campEndDate, type, workflowId);
//     console.log('***orgId****', orgId);
//     console.log('***appId****', appId);
//     console.log('***ruleId****', ruleId);
//     console.log('%%%%%%%%%%%', camp);
//     // positive tests for the createRule_attribute API
//     expect(camp.data.createCampaign.name).toBeTruthy();
//     expect(camp.data.createCampaign.status).toBeTruthy();
//     expect(camp.data.createCampaign.organization.id).toBeTruthy();
//     expect(camp.data.createCampaign.application.id).toBeTruthy();
//     // expect(checkstartdate).toBeGreaterThan(currentDate);
//     //  expect(camp.data.createCampaign.endTime).toBeGreaterThan(camp.data.createCampaign.startTime);
//     // expect(statusopt1).toContain(rule_config.data.createRuleConfiguration.status);
//   });
//   test('createCampaign with randomValues and status as INACTIVE', async () => {
//     const status = STATUS.INACTIVE;
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appId, ruleId, CampName, campStartDate, campEndDate, randomCampType, status);
//   });
//   test('createCampaign with randomValues and startdate as invalid ', async () => {
//     const status = STATUS.ACTIVE;
//     const StartDate = "hello";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appId, ruleId, CampName, StartDate, campEndDate, randomCampType, status);
//     expect(camp.error[0].validationErrors[0].message).toEqual("startdate in invalid");
//   });
//   test('createCampaign with randomValues and enddate as invalid', async () => {
//     const status = STATUS.ACTIVE;
//     const EndDate = "hello";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appId, ruleId, CampName, campStartDate, EndDate, randomCampType, status);
//     expect(camp.error[0].validationErrors[0].message).toEqual("Enddate in invalid");
//   });
//   test('createCampaign with randomValues and CampName as empty', async () => {
//     const status = STATUS.ACTIVE;
//     const CampName = "";
//     const camp = await createnewcampaign(orgId, appId, ruleId, CampName, campStartDate, campEndDate, randomCampType, status);
//     expect(camp.errors[0].validationErrors[0].message[0].message).toEqual("name cannot be null");
//   });
//   test('createCampaign with randomValues and CampName which already exists', async () => {
//     const status = STATUS.ACTIVE;
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appId, ruleId, randomCampName, campStartDate, campEndDate, randomCampType, status);
//     expect(camp.errors[0].validationErrors[0].message).toEqual("campaign  name already exists");
//   });
//   test('createCampaign with randomValues and camp type as empty', async () => {
//     const status = STATUS.ACTIVE;
//     const CampType = "";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appId, ruleId, CampName, campStartDate, campEndDate, CampType, status);
//     expect(camp.errors[0].validationErrors[0].message[0].message).toEqual("campaignType cannot be null");
//   });

//   test('createCampaign with randomValues and orgid as empty', async () => {
//     const status = STATUS.ACTIVE;
//     const orgid = "";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgid, appId, ruleId, CampName, campStartDate, campEndDate, randomCampType, status);
//     expect(camp.errors[0].errorCode).toEqual("errors.ORGANIZATION_INVALID.code");
//   });
//   test('createCampaign with randomValues and orgid as invalid', async () => {
//     const status = STATUS.ACTIVE;
//     const orgid = "12345";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgid, appId, ruleId, CampName, campStartDate, campEndDate, randomCampType, status);
//     expect(camp.errors[0].errorCode).toEqual("errors.ORGANIZATION_INVALID.code");
//   });
//   test('createCampaign with randomValues and appid as empty', async () => {
//     const status = STATUS.ACTIVE;
//     const appid = "";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appid, ruleId, CampName, campStartDate, campEndDate, randomCampType, status);
//     expect(camp.errors[0].errorCode).toEqual("errors.APPLICATION_INVALID.code");
//   });
//   test('createCampaign with randomValues and appid as invalid', async () => {
//     const status = STATUS.ACTIVE;
//     const appid = "hello world";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appid, ruleId, CampName, campStartDate, campEndDate, randomCampType, status);
//     expect(camp.errors[0].errorCode).toEqual("errors.APPLICATION_INVALID.code");
//   });
//   test('createCampaign with randomValues and ruleid as empty', async () => {
//     const status = STATUS.ACTIVE;
//     const ruleid = "";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appId, ruleid, CampName, campStartDate, campEndDate, randomCampType, status);
//     expect(camp.errors[0].errorCode).toEqual("errors.RULE_INVALID.code");
//   });
//   test('createCampaign with randomValues and ruleid as invalid', async () => {
//     const status = STATUS.ACTIVE;
//     const ruleid = "hello world";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appId, ruleid, CampName, campStartDate, campEndDate, randomCampType, status);
//     expect(camp.errors[0].errorCode).toEqual("errors.RULE_INVALID.code");
//   });
// });
// describe('createCampaign', () => {
//   let orgid;
//   beforeEach(async () => {
//     const status = STATUS.INACTIVE;
//     const OrgName = Math.random().toString(36).substr(2, 14);
//     const OrgCode = Math.random().toString(36).substr(2, 14);
//     const org = await createneworg(OrgName, randomOrgAddress, OrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);
//     orgid = org.data.createOrganizationRoot.id;
//   });
//   test('createCampaign with randomValues and organization status as INACTIVE', async () => {
//     const status = STATUS.ACTIVE;
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgId, appId, ruleId, CampName, campStartDate, campEndDate, randomCampType, status);
//     console.log(camp.errors[0].validationErrors[0]);
//   });
// });
// describe('createCampaign', () => {
//   let orgid;
//   let ruleid
//   beforeEach(async () => {
//     const org = await createneworg1();
//     orgid = org.data.createOrganizationRoot.id;
//     const status = STATUS.INACTIVE;
//     const type = RULE_TYPE.SIMPLE;
//     const RuleName = Math.random().toString(36).substr(2, 14);
//     // createtheorganization in ACTIVE status then only it will work
//     const rule = await createnewrule(RuleName, randomRuleDescription, type, status, orgid);
//     ruleid = rule.data.createRule.id;
//   });
//   test('createCampaign with randomValues and rule status as INACTIVE', async () => {
//     const status = STATUS.ACTIVE;
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const camp = await createnewcampaign(orgid, appId, ruleId, CampName, campStartDate, campEndDate, randomCampType, status);
//     console.log(camp.errors[0].validationErrors[0]);
//   });
// });

// describe('updateCampaign', () => {
//   let campId;

//   beforeEach(async () => {
//     const campaign = await createnewcampaign1(ruleId, appId, orgId);
//     campId = campaign.data.createCampaign.id;
//   })
//   test('updateCampaign with randomValues', async () => {
//     const status = STATUS.ACTIVE;
//     const operation = {
//       query: gql`mutation {
//                       updateCampaign(
//                         input: {
//                           id: "${campId}"
//                           name: "${UpdateCampName}"
//                           campaignType: "${UpdateCampType}"
//                           startTime: "${UpdatecampStartDate}"
//                           endTime: "${UpdatecampEndDate}"
//                           status: ${status}
//                         }
//                       ) {
//                         id
//                         name
//                         description
//                         startTime
//                         endTime
//                       }
//                     }

//                `
//     };
//     const Updatecamp = await makePromise(execute(link, operation));
//     expect(Updatecamp.data.updateCampaign.name).toBeTruthy();
//     expect(Updatecamp.data.updateCampaign.status).not.toBeNull();
//   });
//   test('updateCampaign with randomValues and update name to null', async () => {
//     const CampName = "";
//     const status = STATUS.ACTIVE;
//     const operation = {
//       query: gql`mutation {
//                         updateCampaign(
//                           input: {
//                             id: "${campId}"
//                             name: "${CampName}"
//                             campaignType: "${UpdateCampType}"
//                             startTime: "${UpdatecampStartDate}"
//                             endTime: "${UpdatecampEndDate}"
//                             status: ${status}
//                           }
//                         ) {
//                           id
//                           name
//                           description
//                           startTime
//                           endTime
//                         }
//                       }

//                  `
//     };
//     const Updatecamp = await makePromise(execute(link, operation));
//     expect(Updatecamp.errors[0].validationErrors[0].message[0].message).toEqual("name cannot be null");
//   });
//   test('updateCampaign with randomValues and update type to null', async () => {
//     const CampType = "";
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const status = STATUS.ACTIVE;
//     const operation = {
//       query: gql`mutation {
//                         updateCampaign(
//                           input: {
//                             id: "${campId}"
//                             name: "${CampName}"
//                             campaignType: "${CampType}"
//                             startTime: "${UpdatecampStartDate}"
//                             endTime: "${UpdatecampEndDate}"
//                             status: ${status}
//                           }
//                         ) {
//                           id
//                           name
//                           description
//                           startTime
//                           endTime
//                         }
//                       }

//                  `
//     };
//     const Updatecamp = await makePromise(execute(link, operation));
//     expect(Updatecamp.errors[0].validationErrors[0].message[0].message).toEqual("campaignType cannot be null");
//   });
//   test('updateCampaign with randomValues and update name to which already exists', async () => {
//     // const CampType = "";
//     // const CampName = Math.random().toString(36).substr(2, 14);
//     const status = STATUS.ACTIVE;
//     const operation = {
//       query: gql`mutation {
//                         updateCampaign(
//                           input: {
//                             id: "${campId}"
//                             name: "${UpdateCampName}"
//                             campaignType: "${UpdateCampType}"
//                             startTime: "${UpdatecampStartDate}"
//                             endTime: "${UpdatecampEndDate}"
//                             status: ${status}
//                           }
//                         ) {
//                           id
//                           name
//                           description
//                           startTime
//                           endTime
//                         }
//                       }

//                  `
//     };
//     const Updatecamp = await makePromise(execute(link, operation));
//     expect(Updatecamp.errors[0].validationErrors[0].message).toEqual("Campaign name already exists");
//   });
//   test('updateCampaign with randomValues and update startdate to invalid', async () => {
//     // const CampType = "";
//     const status = STATUS.ACTIVE;
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const StartDate = "";
//     const operation = {
//       query: gql`mutation {
//                         updateCampaign(
//                           input: {
//                             id: "${campId}"
//                             name: "${CampName}"
//                             campaignType: "${UpdateCampType}"
//                             startTime: "${StartDate}"
//                             endTime: "${UpdatecampEndDate}"
//                             status: ${status}
//                           }
//                         ) {
//                           id
//                           name
//                           description
//                           startTime
//                           endTime
//                         }
//                       }

//                  `
//     };
//     const Updatecamp = await makePromise(execute(link, operation));
//     expect(Updatecamp.errors[0].validationErrors[0].message[0].message).toEqual("startTime cannot be null");
//   });
//   test('updateCampaign with randomValues and update enddate to invalid', async () => {
//     // const CampType = "";
//     const status = STATUS.ACTIVE;
//     const CampName = Math.random().toString(36).substr(2, 14);
//     const EndDate = "";
//     const operation = {
//       query: gql`mutation {
//                         updateCampaign(
//                           input: {
//                             id: "${campId}"
//                             name: "${CampName}"
//                             campaignType: "${UpdateCampType}"
//                             startTime: "${UpdatecampStartDate}"
//                             endTime: "${EndDate}"
//                             status: ${status}
//                           }
//                         ) {
//                           id
//                           name
//                           description
//                           startTime
//                           endTime
//                         }
//                       }

//                  `
//     };
//     const Updatecamp = await makePromise(execute(link, operation));
//     expect(Updatecamp.errors[0].validationErrors[0].message[0].message).toEqual("endTime cannot be null");
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
//   const workflow = await createnewworkflow1(orgId);
//   workflowId = workflow.data.createWorkflow.id;
//   const state1 = await createnewworkflowstate1(workflowId);
//   console.log(state1);
//   pstateId = state1.data.createWorkflowState.id;
//   const state2 = await createnewworkflowstate1(workflowId);
//   console.log(state2);
//   dstateId = state2.data.createWorkflowState.id;
//   const process = await createnewworkflowprocess1(workflowId);
//   console.log(process);
//   processId = process.data.createWorkflowProcess.id;
//   const processtransition = await createnewworkflowprocesstranistion1(pstateId, dstateId, workflowId);
//   console.log(processtransition.errors[0].validationErrors[0]);
//   // processtransitionId = processtransition.data.createWorkflowProcessTransition.id;
//   const app = await createnewapp1(orgId);
//   appId = app.data.createApplication.id;
//   const rule = await createnewrule3(orgId);
//   ruleId = rule.data.createRule.id;
// })
