//NOTE: This module always gives  the following error 
//Call retries were exceeded
// at ChildProcessWorker.initialize (node_modules/jest-worker/build/workers/ChildProcessWorker.js:230:21)
// Multiple times. Hence I am skipping it as of now @thejeshgn
//And adding a very simple test case and skipping it to keep this going


describe.skip("communication.resolvers.spec.ts  unit tests", () => {
  test.skip("communication.resolvers.spec.ts  control module", () => { });
});



// import { communicationModule } from "../communication.module";
// import * as CoreEntities from "../../../entity";
// import {
//   createUnitTestConnection,
//   closeUnitTestConnection,
//   getAdminUser,
//   setupI18n
// } from "../../../../__tests__/utils/unit";
// import { getConnection, getManager } from "typeorm";
// import { CommunicationProvider } from "../communication.providers";
// import resolvers from "../communication.resolvers";
// import { Chance } from "chance";
// import {
//   STATUS,
//   MESSAGE_FORMAT,
//   TEMPLATE_STYLE,
//   METRIC_FILTER_TYPE,
//   ENTITY_TYPE,
//   COMMUNICATION_STATUS,
//   CAMPAIGN_TYPE,
//   WORKFLOW_STATES,
//   CAMPAIGN_TRIGGER_TYPE
// } from "../../common/constants";
// import { WCoreError } from "../../common/exceptions";
// import { WCORE_ERRORS } from "../../common/constants/errors";
// import { CampaignProvider } from "../../campaigns/campaign.providers";
// import { campaignModule } from "../../campaigns/campaign.module";

// let user: CoreEntities.User;
// // provider is not required while testing resolver. Internally injected by graphql module.
// const communicationProvider: CommunicationProvider = communicationModule.injector.get(
//   CommunicationProvider
// );
// const campaignProvider: CampaignProvider = campaignModule.injector.get(
//   CampaignProvider
// );
// const chance = new Chance();

// beforeAll(async () => {
//   setupI18n();
//   await createUnitTestConnection(CoreEntities);
//   ({ user } = await getAdminUser(getConnection()));
// });

// const createMessageTemplate: any = async () => {
//   const messageTemplateInput: any = {
//     name: chance.string({ length: 2 }),
//     description: chance.string({ length: 6 }),
//     messageFormat: MESSAGE_FORMAT.PUSH,
//     templateStyle: TEMPLATE_STYLE.MUSTACHE,
//     templateBodyText: chance.string({ length: 3 }),
//     templateSubjectText: chance.string({ length: 5 }),
//     org: user.organization,
//     organization_id: user.organization.id,
//     url: "",
//     imageUrl: "",
//     status: STATUS.ACTIVE
//   };
//   const messageTemplate = await resolvers.Mutation.createMessageTemplate(
//     {},
//     { input: messageTemplateInput },
//     { injector: communicationModule.injector }
//   );
//   return messageTemplate;
// };

// const createCommunication: any = async (messageTemplate, campaign) => {
//   const communicationInput: any = {
//     name: chance.string({ length: 2 }),
//     key: chance.string({ length: 2 }),
//     type: METRIC_FILTER_TYPE.STRING,
//     status: STATUS.ACTIVE,
//     messageTemplateId: messageTemplate.id,
//     isScheduled: true,
//     firstScheduleDateTime: new Date(),
//     entityId: "",
//     entityType: ENTITY_TYPE.CAMPAIGN,
//     isRepeatable: false,
//     lastProcessedDateTime: new Date().getDate() + 1,
//     commsChannelName: chance.string({ length: 3 }),
//     organizationId: user.organization.id,
//     campaign_id: campaign.id
//   };

//   const createdCommunication = await resolvers.Mutation.createCommunication(
//     {},
//     { input: communicationInput },
//     { injector: communicationModule.injector }
//   );
//   return createdCommunication;
// };

// const createCampaign: any = async (campaignInput?: any) => {
//   const manager = getManager();
//   const campaign = await campaignProvider.createCampaign(
//     manager,
//     campaignInput,
//     user
//   );
//   return campaign;
// };

// const campaignData: any = {
//   description: chance.string({ length: 5 }),
//   campaignType: CAMPAIGN_TYPE.OFFER,
//   campaignStatus: WORKFLOW_STATES.DRAFT,
//   campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
//   triggerRule: undefined,
//   startTime: new Date(),
//   endTime: new Date().getTime() + 1,
//   audienceFilterRule: undefined,
//   application: undefined,
//   status: STATUS.ACTIVE
// };

// describe("Communication Resolver", () => {
//   test("Create Communication test", async () => {
//     campaignData.name = chance.string({ length: 5 });
//     campaignData.organization = user.organization.id;
//     const campaign = await createCampaign(campaignData);

//     const messageTemplateInput: any = {
//       name: chance.string({ length: 2 }),
//       description: chance.string({ length: 6 }),
//       messageFormat: MESSAGE_FORMAT.PUSH,
//       templateStyle: TEMPLATE_STYLE.MUSTACHE,
//       templateBodyText: chance.string({ length: 3 }),
//       templateSubjectText: chance.string({ length: 5 }),
//       org: user.organization,
//       organization_id: user.organization.id,
//       url: "",
//       imageUrl: "",
//       status: STATUS.ACTIVE
//     };
//     const messageTemplate = await resolvers.Mutation.createMessageTemplate(
//       {},
//       { input: messageTemplateInput },
//       { injector: communicationModule.injector }
//     );
//     expect(messageTemplate).toBeDefined();

//     const foundMessageTeamplate = await resolvers.Query.messageTemplate(
//       {},
//       { id: messageTemplate.id },
//       { injector: communicationModule.injector }
//     );
//     expect(foundMessageTeamplate).toBeDefined();
//     expect(foundMessageTeamplate.id).toBeDefined();
//     expect(foundMessageTeamplate.id).toEqual(messageTemplate.id);

//     const communicationInput: any = {
//       name: chance.string({ length: 2 }),
//       key: chance.string({ length: 2 }),
//       type: METRIC_FILTER_TYPE.STRING,
//       status: STATUS.ACTIVE,
//       messageTemplateId: messageTemplate.id,
//       isScheduled: true,
//       firstScheduleDateTime: new Date(),
//       entityId: "",
//       entityType: ENTITY_TYPE.CAMPAIGN,
//       isRepeatable: false,
//       lastProcessedDateTime: new Date().getDate() + 1,
//       commsChannelName: chance.string({ length: 3 }),
//       organizationId: user.organization.id,
//       campaign_id: campaign.id
//     };

//     const createdCommunication = await resolvers.Mutation.createCommunication(
//       {},
//       { input: communicationInput },
//       { injector: communicationModule.injector }
//     );
//     expect(createdCommunication).toBeDefined();

//     const communicationFoundById = await resolvers.Query.communication(
//       {},
//       { id: createdCommunication.id, organizationId: user.organization.id },
//       { injector: communicationModule.injector }
//     );

//     console.log(communicationFoundById);
//     expect(communicationFoundById.id).toBe(createdCommunication.id);
//   });

//   test("Update Communication test", async () => {
//     campaignData.name = chance.string({ length: 5 });
//     campaignData.organization = user.organization.id;
//     const campaign = await createCampaign(campaignData);

//     const messageTemplateInput: any = {
//       name: chance.string({ length: 2 }),
//       description: chance.string({ length: 6 }),
//       messageFormat: MESSAGE_FORMAT.PUSH,
//       templateStyle: TEMPLATE_STYLE.MUSTACHE,
//       templateBodyText: chance.string({ length: 3 }),
//       templateSubjectText: chance.string({ length: 5 }),
//       org: user.organization,
//       organization_id: user.organization.id,
//       url: "",
//       imageUrl: "",
//       status: STATUS.ACTIVE
//     };
//     const messageTemplate = await resolvers.Mutation.createMessageTemplate(
//       {},
//       { input: messageTemplateInput },
//       { injector: communicationModule.injector }
//     );
//     expect(messageTemplate).toBeDefined();

//     const foundMessageTeamplate = await resolvers.Query.messageTemplate(
//       {},
//       { id: messageTemplate.id },
//       { injector: communicationModule.injector }
//     );
//     expect(foundMessageTeamplate).toBeDefined();
//     expect(foundMessageTeamplate.id).toBeDefined();
//     expect(foundMessageTeamplate.id).toEqual(messageTemplate.id);

//     foundMessageTeamplate.templateBodyText = "New body text";
//     foundMessageTeamplate.templateSubjectText = "New subject text";

//     const updatedMessageTemlate = await resolvers.Mutation.updateMessageTemplate(
//       {},
//       { input: foundMessageTeamplate },
//       { injector: communicationModule.injector }
//     );

//     expect(updatedMessageTemlate).toBeDefined();
//     expect(updatedMessageTemlate.templateBodyText).toEqual("New body text");
//     expect(updatedMessageTemlate.templateSubjectText).toEqual(
//       "New subject text"
//     );

//     const communicationInput: any = {
//       name: chance.string({ length: 2 }),
//       key: chance.string({ length: 2 }),
//       type: METRIC_FILTER_TYPE.STRING,
//       status: STATUS.ACTIVE,
//       messageTemplateId: messageTemplate.id,
//       isScheduled: true,
//       firstScheduleDateTime: new Date(),
//       entityId: "",
//       entityType: ENTITY_TYPE.CAMPAIGN,
//       isRepeatable: false,
//       lastProcessedDateTime: new Date().getDate() + 1,
//       commsChannelName: chance.string({ length: 3 }),
//       organizationId: user.organization.id,
//       campaign_id: campaign.id
//     };

//     const createdCommunication = await resolvers.Mutation.createCommunication(
//       {},
//       { input: communicationInput },
//       { injector: communicationModule.injector }
//     );
//     expect(createdCommunication).toBeDefined();

//     const communicationFoundById = await resolvers.Query.communication(
//       {},
//       { id: createdCommunication.id, organizationId: user.organization.id },
//       { injector: communicationModule.injector }
//     );

//     console.log(communicationFoundById);
//     expect(communicationFoundById.id).toBe(createdCommunication.id);

//     communicationFoundById.entityType = ENTITY_TYPE.EVENT;
//     const updatedCommunication = await resolvers.Mutation.updateCommunication(
//       {},
//       { input: communicationFoundById },
//       { injector: communicationModule.injector }
//     );

//     expect(updatedCommunication).toBeDefined();
//     expect(updatedCommunication.entityType).toEqual(ENTITY_TYPE.EVENT);
//   });

//   test("messageTemplates test case", async () => {
//     const messageTemplates = await resolvers.Query.messageTemplates(
//       {},
//       {},
//       { injector: communicationModule.injector }
//     );

//     expect(messageTemplates).toBeDefined();
//     expect(messageTemplates).toHaveLength(2);
//   });

//   test("Add communication log testcase", async () => {
//     campaignData.name = chance.string({ length: 4 });
//     campaignData.organization = user.organization.id;
//     const campaign = await createCampaign(campaignData);

//     const messageTemplate = await createMessageTemplate();
//     const communcation = await createCommunication(messageTemplate, campaign);

//     const log = [
//       {
//         time: new Date(),
//         communicationStatus: COMMUNICATION_STATUS.ADDED,
//         message: chance.string({ length: 10 })
//       }
//     ];
//     const communicationLogInput = {
//       communication_id: communcation.id,
//       startTime: new Date(),
//       runType: chance.string({ length: 4 }),
//       log
//     };
//     const communicationLog = await resolvers.Mutation.addCommunicationLog(
//       {},
//       { input: communicationLogInput },
//       { injector: communicationModule.injector }
//     );
//     expect(communicationLog).toBeDefined();
//     expect(communicationLog.id).toBeDefined();

//     const foundCommunicationLog = await resolvers.Query.communicationLog(
//       {},
//       { communicationLogId: communicationLog.id },
//       { injector: communicationModule.injector }
//     );
//     expect(foundCommunicationLog).toBeDefined();
//     expect(foundCommunicationLog.id).toEqual(communicationLog.id);
//   });

//   test("Update communicationlog test case", async () => {
//     campaignData.name = chance.string({ length: 5 });
//     campaignData.organization = user.organization.id;
//     const campaign = await createCampaign(campaignData);

//     const messageTemplate = await createMessageTemplate();
//     const communcation = await createCommunication(messageTemplate, campaign);

//     const log = [
//       {
//         time: new Date(),
//         communicationStatus: COMMUNICATION_STATUS.ADDED,
//         message: chance.string({ length: 10 })
//       }
//     ];
//     const communicationLogInput = {
//       communication_id: communcation.id,
//       startTime: new Date(),
//       runType: chance.string({ length: 4 }),
//       log
//     };
//     const communicationLog = await resolvers.Mutation.addCommunicationLog(
//       {},
//       { input: communicationLogInput },
//       { injector: communicationModule.injector }
//     );
//     expect(communicationLog).toBeDefined();
//     expect(communicationLog.id).toBeDefined();

//     const foundCommunicationLog: any = await resolvers.Query.communicationLog(
//       {},
//       {
//         communicationLogId: communicationLog.id,
//         organizationId: user.organization.id
//       },
//       { injector: communicationModule.injector }
//     );
//     expect(foundCommunicationLog).toBeDefined();
//     expect(foundCommunicationLog.id).toEqual(communicationLog.id);

//     foundCommunicationLog.communicationStatus = COMMUNICATION_STATUS.STARTED;
//     // id coping to communcationLodId
//     foundCommunicationLog.communicationLogId = foundCommunicationLog.id;
//     const updatedCommunicationLog = await resolvers.Mutation.updateCommunicationLog(
//       {},
//       { input: foundCommunicationLog },
//       { injector: communicationModule.injector }
//     );
//     expect(updatedCommunicationLog).toBeDefined();
//     expect(updatedCommunicationLog.communicationStatus).toEqual(
//       COMMUNICATION_STATUS.STARTED
//     );
//   });
// });

// describe("Message Template Resolver", () => {
//   test("messageTemplate testcases", async () => {
//     const messageTemplateInput1: any = {
//       name: chance.string({ length: 7 }),
//       description: chance.string({ length: 6 }),
//       messageFormat: MESSAGE_FORMAT.PUSH,
//       templateStyle: TEMPLATE_STYLE.MUSTACHE,
//       templateBodyText: chance.string({ length: 3 }),
//       templateSubjectText: chance.string({ length: 5 }),
//       organization_id: user.organization.id,
//       url: "",
//       imageUrl: "",
//       status: STATUS.ACTIVE
//     };

//     resolvers.Mutation.createMessageTemplate(
//       {},
//       { input: messageTemplateInput1 },
//       { injector: communicationModule.injector }
//     ).then(async messageTemplate => {
//       const messageTemplateInput2: any = {
//         name: messageTemplate.name,
//         description: chance.string({ length: 6 }),
//         messageFormat: MESSAGE_FORMAT.PUSH,
//         templateStyle: TEMPLATE_STYLE.MUSTACHE,
//         templateBodyText: chance.string({ length: 3 }),
//         templateSubjectText: chance.string({ length: 5 }),
//         organization_id: user.organization.id,
//         url: "",
//         imageUrl: "",
//         status: STATUS.ACTIVE
//       };
//       const messageTemplatePromise = resolvers.Mutation.createMessageTemplate(
//         {},
//         { input: messageTemplateInput2 },
//         { injector: communicationModule.injector }
//       );
//       await expect(messageTemplatePromise).rejects.toThrowError(
//         new WCoreError(WCORE_ERRORS.NAME_NOT_UNIQUE_TO_ORG)
//       );
//     });
//   });
// });

// afterAll(async () => {
//   await closeUnitTestConnection();
// });
