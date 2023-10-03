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
import { eventSubscriptionModule } from "../eventSubscription.module";
import { EventSubscriptionService } from "../eventSubscription.service";
import { EventTypeService } from "../../eventType/eventType.service";
import { eventTypeModule } from "../../eventType/eventType.module";
import { TriggerActionEnum } from "../../../../graphql/generated-models";

let user: CoreEntities.User;

const eventSubscriptionService: EventSubscriptionService = eventSubscriptionModule.injector.get(
  EventSubscriptionService
);
const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const eventTypeService: EventTypeService = eventTypeModule.injector.get(
  EventTypeService
);
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("eventSubscriptionById", () => {
  test("should fetch an event subscription by ID", async done => {
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
      code: chance.string({ length: 5 }),
      description: chance.string({ length: 10 })
    });
    const eventSubscription = await eventSubscriptionService.createEventSubscription(
      entityManager,
      {
        eventTypeId: eventType.id,
        triggerAction: TriggerActionEnum.RefinexSendFeedback
      }
    );
    const foundEventSubscription = await eventSubscriptionService.eventSubscriptionById(
      entityManager,
      eventSubscription.id
    );
    expect(foundEventSubscription.id).toBe(eventSubscription.id);
    expect(foundEventSubscription.status).toBe("ACTIVE");
    expect(foundEventSubscription.eventType.id).toBe(eventType.id);
    expect(foundEventSubscription.triggerAction).toBe(
      TriggerActionEnum.RefinexSendFeedback
    );
    done();
  });
});
describe("eventSubscriptionsForEventType", () => {
  test("should Get event subscriptions for event type", async done => {
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
      code: chance.string({ length: 5 }),
      description: chance.string({ length: 10 })
    });
    let subscriptionsCreated = 0;
    for (const triggerAction in TriggerActionEnum) {
      if (triggerAction) {
        const eventSubscription = await eventSubscriptionService.createEventSubscription(
          entityManager,
          {
            eventTypeId: eventType.id,
            triggerAction: TriggerActionEnum[triggerAction]
          }
        );
        subscriptionsCreated++;
      }
    }

    const eventSubscriptions = await eventSubscriptionService.eventSubscriptionsForEventType(
      entityManager,
      eventType.id
    );
    expect(eventSubscriptions).toHaveLength(subscriptionsCreated);
    done();
  });
});
describe("createEventSubscription", () => {
  test("should create event subscription", async done => {
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
      code: chance.string({ length: 5 }),
      description: chance.string({ length: 10 })
    });
    const eventSubscription = await eventSubscriptionService.createEventSubscription(
      entityManager,
      {
        eventTypeId: eventType.id,
        triggerAction: TriggerActionEnum.RefinexSendFeedback
      }
    );
    expect(eventSubscription.id).toBeTruthy();
    expect(eventSubscription.triggerAction).toBe(
      TriggerActionEnum.RefinexSendFeedback
    );
    expect(eventSubscription.eventType.id).toBe(eventType.id);
    done();
  });
  test("should not create duplicate event subscription", async done => {
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
      code: chance.string({ length: 5 }),
      description: chance.string({ length: 10 })
    });
    const eventSubscription = await eventSubscriptionService.createEventSubscription(
      entityManager,
      {
        eventTypeId: eventType.id,
        triggerAction: TriggerActionEnum.RefinexSendFeedback
      }
    );
    const duplicateEventSubscriptionPromise = eventSubscriptionService.createEventSubscription(
      entityManager,
      {
        eventTypeId: eventType.id,
        triggerAction: TriggerActionEnum.RefinexSendFeedback
      }
    );
    await expect(duplicateEventSubscriptionPromise).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.EVENT_SUBSCRIPTION_ALREADY_PRESENT)
    );

    done();
  });
});
describe("deleteEventSubscription", () => {
  test("should delete an event subscription", async done => {
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
      code: chance.string({ length: 5 }),
      description: chance.string({ length: 10 })
    });
    const eventSubscription = await eventSubscriptionService.createEventSubscription(
      entityManager,
      {
        eventTypeId: eventType.id,
        triggerAction: TriggerActionEnum.RefinexSendFeedback
      }
    );
    const deletedEventSubscription = await eventSubscriptionService.deleteEventSubscription(
      entityManager,
      eventSubscription.id
    );
    const findDeletedEventSubscriptionPromise = eventSubscriptionService.deleteEventSubscription(
      entityManager,
      eventSubscription.id
    );
    await expect(findDeletedEventSubscriptionPromise).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.EVENT_SUBSCRIPTION_NOT_FOUND)
    );
    done();
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
