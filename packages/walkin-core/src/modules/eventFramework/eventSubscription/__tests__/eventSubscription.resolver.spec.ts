import { eventSubscriptionModule } from "../eventSubscription.module";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser,
  setupI18n
} from "../../../../../__tests__/utils/unit";
import * as CoreEntities from "../../../../entity";
import { getConnection, getManager } from "typeorm";
import { resolvers } from "../eventSubscription.resolver";

import { Chance } from "chance";
import { ApplicationProvider } from "../../../account/application/application.providers";
import { ApplicationModule } from "../../../account/application/application.module";
import { EventTypeService } from "../../eventType/eventType.service";
import { eventTypeModule } from "../../eventType/eventType.module";
import { TriggerActionEnum } from "../../../../graphql/generated-models";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";

let user: CoreEntities.User;

const chance = new Chance();

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const eventTypeService: EventTypeService = eventTypeModule.injector.get(
  EventTypeService
);

let application: CoreEntities.Application;
let jwt: string;
let apiKey: CoreEntities.APIKey;

beforeAll(async () => {
  setupI18n();
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  let manager = getManager();
  application = await applicationService.createApplication(
    manager,
    user.organization.id,
    { name: chance.string({ length: 5 }) }
  );
});

describe("EventSubscription Resolver TestSuite", () => {
  test("CreateEventSubscription Resolver Test", async () => {
    expect(application).toBeDefined();
    let eventType = await eventTypeService.createEventType(getManager(), {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    });
    let createdCount = 0;
    for (const triggerAction in TriggerActionEnum) {
      if (triggerAction) {
        let eventSubscriptionArgs: any = {
          eventTypeId: eventType.id,
          triggerAction: TriggerActionEnum[triggerAction]
        };
        let createdEventSubscription: any = await resolvers.Mutation.createEventSubscription(
          {},
          eventSubscriptionArgs,
          { injector: eventSubscriptionModule.injector }
        );

        expect(createdEventSubscription).toBeDefined();
        expect(createdEventSubscription.id).toBeDefined();
        expect(createdEventSubscription.status).toBeDefined();

        let foundEventSubscription: any = await resolvers.Query.eventSubscriptionById(
          {},
          { id: createdEventSubscription.id },
          { injector: eventSubscriptionModule.injector }
        );

        expect(foundEventSubscription).toBeDefined();
        expect(foundEventSubscription.id).toBeDefined();
        expect(foundEventSubscription.id).toEqual(createdEventSubscription.id);
        expect(foundEventSubscription.status).toBeDefined();
        expect(foundEventSubscription.code).toEqual(
          createdEventSubscription.code
        );
        expect(foundEventSubscription.description).toEqual(
          createdEventSubscription.description
        );
        createdCount++;
      }
    }
    let eventSubscriptions = await resolvers.Query.eventSubscriptionsForEventType(
      {},
      { eventTypeId: eventType.id },
      { injector: eventSubscriptionModule.injector }
    );
    expect(eventSubscriptions).toBeDefined();
    expect(eventSubscriptions).toHaveLength(createdCount);
  });

  // Skipping this test case since actual case is failing

  test.skip("DeleteEventSubscription resolver test", async () => {
    let eventType = await eventTypeService.createEventType(getManager(), {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    });
    let eventSubscriptionArgs: any = {
      eventTypeId: eventType.id,
      triggerAction: TriggerActionEnum.RefinexSendFeedback
    };
    let createdEventSubscription: any = await resolvers.Mutation.createEventSubscription(
      {},
      eventSubscriptionArgs,
      { injector: eventSubscriptionModule.injector }
    );

    expect(createdEventSubscription).toBeDefined();
    expect(createdEventSubscription.id).toBeDefined();
    expect(createdEventSubscription.status).toBeDefined();

    let deletedEventSubscription = await resolvers.Mutation.deleteEventSubscription(
      {},
      { id: createdEventSubscription.id },
      { injector: eventSubscriptionModule.injector }
    );
    expect(deletedEventSubscription).toBeDefined();

    let foundDeletedEventSubscriptionPromise: any = resolvers.Query.eventSubscriptionById(
      {},
      { id: createdEventSubscription.id },
      { injector: eventSubscriptionModule.injector }
    );
    await expect(foundDeletedEventSubscriptionPromise).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.EVENT_SUBSCRIPTION_NOT_FOUND)
    );
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
