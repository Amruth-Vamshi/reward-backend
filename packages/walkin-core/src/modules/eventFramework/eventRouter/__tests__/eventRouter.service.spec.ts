// import { getConnection } from "typeorm";
import * as CoreEntities from "../../../../entity";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../../__tests__/utils/unit";
import { ApplicationModule } from "../../../account/application/application.module";
import { getManager, getConnection, EntityManager } from "typeorm";
import { ApplicationProvider } from "../../../account/application/application.providers";
import { Chance } from "chance";
import { STATUS } from "../../../common/constants";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { EventTypeService } from "../../eventType/eventType.service";
import { eventTypeModule } from "../../eventType/eventType.module";
import { TriggerActionEnum } from "../../../../graphql/generated-models";
import { eventRouterModule } from "../eventRouter.module";
import { EventRouterService } from "../eventRouter.service";
import { EventSubscriptionService } from "../../eventSubscription/eventSubscription.service";
import { eventSubscriptionModule } from "../../eventSubscription/eventSubscription.module";
let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});
const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const eventTypeService: EventTypeService = eventTypeModule.injector.get(
  EventTypeService
);
const eventRouterService: EventRouterService = eventRouterModule.injector.get(
  EventRouterService
);
const eventSubscriptionService: EventSubscriptionService = eventSubscriptionModule.injector.get(
  EventSubscriptionService
);
const chance = new Chance();

describe("eventById", () => {
  test("should get eventById ", async () => {
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );
    const eventType = await eventTypeService.createEventType(entityManager, {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    });
    const pushedEvent = await eventRouterService.pushEvent(
      entityManager,
      application,
      {
        data: {},
        metadata: {},
        eventTypeCode: eventType.code,
        sourceEventId: chance.guid(),
        sourceEventTime: chance.date(),
        sourceName: chance.string()
      }
    );
    const eventFoundById = await eventRouterService.eventById(entityManager, {
      id: pushedEvent.id
    });

    expect(eventFoundById.id).toBe(pushedEvent.id);
  });
});

describe("eventBySourceEventId", () => {
  test("should get eventBy SourceEventId ", async () => {
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );
    const eventType = await eventTypeService.createEventType(entityManager, {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    });
    const pushedEvent = await eventRouterService.pushEvent(
      entityManager,
      application,
      {
        data: {},
        metadata: {},
        eventTypeCode: eventType.code,
        sourceEventId: chance.guid(),
        sourceEventTime: chance.date(),
        sourceName: chance.string()
      }
    );

    const eventFoundById = await eventRouterService.eventBySourceEventId(
      entityManager,
      {
        sourceEventId: pushedEvent.sourceEventId
      }
    );

    expect(eventFoundById.id).toBe(pushedEvent.id);
  });
  test("should get eventBy SourceEventId and eventType", async () => {
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );
    const eventType = await eventTypeService.createEventType(entityManager, {
      applicationId: application.id,
      code: chance.string({ length: 10 })
    });
    const pushedEvent = await eventRouterService.pushEvent(
      entityManager,
      application,
      {
        data: {},
        metadata: {},
        eventTypeCode: eventType.code,
        sourceEventId: chance.guid(),
        sourceEventTime: chance.date(),
        sourceName: chance.string()
      }
    );
    const eventFoundById = await eventRouterService.eventBySourceEventId(
      entityManager,
      {
        sourceEventId: pushedEvent.sourceEventId,
        eventTypeId: eventType.id
      }
    );

    expect(eventFoundById.id).toBe(pushedEvent.id);
  });
});

describe("eventsByFilters", () => {
  test("should get eventsByFilters with eventTypeCode", async () => {
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );
    const eventType = await eventTypeService.createEventType(entityManager, {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    });
    for (let i = 0; i < 10; i++) {
      const pushedEvent = await eventRouterService.pushEvent(
        entityManager,
        application,
        {
          data: {},
          metadata: {},
          eventTypeCode: eventType.code,
          sourceEventId: chance.guid(),
          sourceEventTime: chance.date(),
          sourceName: chance.string()
        }
      );
    }
    const eventFoundById = await eventRouterService.eventsByFilters(
      entityManager,
      {
        eventTypeCode: eventType.code
      }
    );
    expect(eventFoundById).toHaveLength(10);
  }, 100000);
  test("should get eventsByFilters ", async () => {
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );
    const eventType = await eventTypeService.createEventType(entityManager, {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    });
    for (let i = 0; i < 10; i++) {
      const pushedEvent = await eventRouterService.pushEvent(
        entityManager,
        application,
        {
          data: {},
          metadata: {},
          eventTypeCode: eventType.code,
          sourceEventId: chance.guid(),
          sourceEventTime: chance.date(),
          sourceName: chance.string()
        }
      );
    }
    const eventFoundById = await eventRouterService.eventsByFilters(
      entityManager,
      {
        eventTypeCode: eventType.code
      }
    );
    expect(eventFoundById).toHaveLength(10);
  });
});

describe("pushEvent", () => {
  test("should pushEvent ", async () => {
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );
    const eventType = await eventTypeService.createEventType(entityManager, {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    });
    const sourceEventId = chance.guid();
    const pushedEvent = await eventRouterService.pushEvent(
      entityManager,
      application,
      {
        data: {},
        metadata: {},
        eventTypeCode: eventType.code,
        sourceEventId,
        sourceEventTime: chance.date(),
        sourceName: chance.string()
      }
    );
    expect(pushedEvent.id).toBe(pushedEvent.id);
  });
});

describe("processEvents", () => {
  test("should Process a event for 1 api", async () => {
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );
    const eventType = await eventTypeService.createEventType(entityManager, {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    });
    const eventSubscription = await eventSubscriptionService.createEventSubscription(
      entityManager,
      {
        eventTypeId: eventType.id,
        triggerAction: TriggerActionEnum.RefinexSendFeedback
      }
    );
    const sourceEventId = chance.guid();
    const pushedEvent = await eventRouterService.pushEvent(
      entityManager,
      application,
      {
        data: {},
        metadata: {},
        eventTypeCode: eventType.code,
        sourceEventId,
        sourceEventTime: chance.date(),
        sourceName: chance.string()
      }
    );
    const processEvent = await eventRouterService.processEventById(
      entityManager,
      {
        application,
        id: pushedEvent.id
      }
    );
    expect(processEvent).toMatchObject({
      REFINEX_SEND_FEEDBACK: "Added to queue"
    });
  });
  test("should Process a event for 2 apis", async () => {
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );
    const eventType = await eventTypeService.createEventType(entityManager, {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    });
    const eventSubscriptionRefineX = await eventSubscriptionService.createEventSubscription(
      entityManager,
      {
        eventTypeId: eventType.id,
        triggerAction: TriggerActionEnum.RefinexSendFeedback
      }
    );
    const eventSubscriptionCustom = await eventSubscriptionService.createEventSubscription(
      entityManager,
      {
        eventTypeId: eventType.id,
        triggerAction: TriggerActionEnum.Custom
      }
    );
    const sourceEventId = chance.guid();
    const pushedEvent = await eventRouterService.pushEvent(
      entityManager,
      application,
      {
        data: {},
        metadata: {},
        eventTypeCode: eventType.code,
        sourceEventId,
        sourceEventTime: chance.date(),
        sourceName: chance.string()
      }
    );
    const processEvent = await eventRouterService.processEventById(
      entityManager,
      {
        application,
        id: pushedEvent.id
      }
    );
    expect(processEvent).toMatchObject({
      REFINEX_SEND_FEEDBACK: "Added to queue",
      CUSTOM: "Added to queue"
    });
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
