// import { getConnection } from "typeorm";
import * as CoreEntities from "../../../entity";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { Chance } from "chance";
import { communicationModule } from "../communication.module";
import { CommunicationProvider } from "../communication.providers";
import {
  STATUS,
  METRIC_TYPE,
  METRIC_FILTER_TYPE,
  DB_SOURCE,
  MESSAGE_FORMAT,
  TEMPLATE_STYLE,
  COMMUNICATION_ENTITY_TYPE
} from "../../common/constants/constants";
let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const communicationProvider: CommunicationProvider = communicationModule.injector.get(
  CommunicationProvider
);

const chance = new Chance();

describe("getCommunication", () => {
  test("should get getCommunication ", async () => {
    /* Test getMetric by creating a metricFilter & metric
       1. CREATE COMMUNICATION
       2. GET COMMUNICATION
    */
    const entityManager = getManager();

    const messageTemplateInput: any = {
      name: chance.string({ length: 2 }),
      description: chance.string({ length: 6 }),
      messageFormat: MESSAGE_FORMAT.PUSH,
      templateStyle: TEMPLATE_STYLE.MUSTACHE,
      templateBodyText: chance.string({ length: 3 }),
      templateSubjectText: chance.string({ length: 5 }),
      org: user.organization,
      url: "",
      imageUrl: "",
      status: STATUS.ACTIVE
    };

    const messageTemplate = await communicationProvider.createMessageTemplate(
      entityManager,
      messageTemplateInput.name,
      messageTemplateInput.description,
      messageTemplateInput.messageFormat,
      messageTemplateInput.templateBodyText,
      messageTemplateInput.templateSubjectText,
      messageTemplateInput.templateStyle,
      messageTemplateInput.org,
      messageTemplateInput.url,
      messageTemplateInput.imageUrl,
      messageTemplateInput.status
    );

    const communicationInput: any = {
      name: chance.string({ length: 2 }),
      key: chance.string({ length: 2 }),
      type: METRIC_FILTER_TYPE.STRING,
      status: STATUS.ACTIVE,
      messageTemplate,
      isScheduled: true,
      firstScheduleDateTime: new Date(),
      entityId: "",
      entityName: COMMUNICATION_ENTITY_TYPE.CAMPAIGN,
      isRepeatable: true,
      lastProcessedDateTime: new Date().getDate() + 1,
      commsChannelName: chance.string({ length: 3 }),
      organizationId: user.organization.id,
      repeatRuleConfiguration: {
        time: "17:45:00",
        frequency: "WEEKLY",
        endAfter: "2019-12-23:23:23:23",
        noOfOccurances: 1
      }
    };

    const communication = await communicationProvider.createCommunication(
      entityManager,
      communicationInput.entityId,
      communicationInput.entityName,
      communicationInput.messageTemplate,
      communicationInput.isScheduled,
      communicationInput.firstScheduledDateTime,
      communicationInput.isRepeatable,
      communicationInput.lastProcessedDateTime,
      communicationInput.repeatRuleConfiguration,
      communicationInput.commsChannelName,
      communicationInput.organizationId,
      communicationInput.status,
      communicationInput.campaign
    );

    const communicationFoundById = await communicationProvider.getCommunication(
      entityManager,
      communication.id,
      user.organization.id
    );

    console.log(communicationFoundById);
    expect(communicationFoundById.id).toBe(communication.id);
    expect(communicationFoundById.organization.id).toBe(user.organization.id);
    // expect(communicationFoundById.repeatRuleConfiguration.time).toBe("12:45:00 pm");
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
