import { eventRouterModule } from "../eventRouter.module";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser,
  setupI18n
} from "../../../../../__tests__/utils/unit";
import * as CoreEntities from "../../../../entity";
import { getConnection, getManager } from "typeorm";
import { resolvers } from "../eventRouter.resolver";

import { Chance } from "chance";
import { WalkinPlatformError } from "../../../common/exceptions/walkin-platform-error";

import { STATUS } from "../../../common/constants";
import { ApplicationProvider } from "../../../account/application/application.providers";
import { ApplicationModule } from "../../../account/application/application.module";
import { IAuthResolverArgs } from "../../../account/auth-guard/auth-guard.interface";
import { EventTypeService } from "../../eventType/eventType.service";
import { eventTypeModule } from "../../eventType/eventType.module";

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
let eventType: any;

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
  eventType = await eventTypeService.createEventType(manager, {
    applicationId: application.id,
    code: chance.string({ length: 5 })
  });
});

describe("EventRouter Resolver TestSuite", () => {
  test("PushEvent Resolver Test", async () => {
    expect(application).toBeDefined();

    let events = [
      {
        data: {},
        metadata: {},
        eventTypeCode: eventType.code,
        sourceEventId: chance.guid(),
        sourceEventTime: chance.date(),
        sourceName: chance.string()
      }
    ];
    let savedEvents = await resolvers.Mutation.pushEvents(
      { user, application, jwt, apiKey },
      { events },
      { injector: eventRouterModule.injector }
    );

    expect(savedEvents).toBeDefined();
    expect(savedEvents.length).toBeDefined();
    expect(savedEvents.length).toBeGreaterThanOrEqual(1);
    expect(savedEvents[0]).toBeDefined();

    let savedEvent = savedEvents[0];
    let eventById = await resolvers.Query.eventById(
      { user, application, jwt, apiKey },
      { id: savedEvent.id },
      { injector: eventRouterModule.injector }
    );

    expect(eventById).toBeDefined();
    expect(eventById.id).toBeDefined();
    expect(eventById.id).toEqual(savedEvent.id);
    expect(eventById.sourceName).toBeDefined();
    expect(eventById.sourceName).toEqual(savedEvent.sourceName);
  });

  test("PushEvent Resolver Test", async () => {
    expect(application).toBeDefined();

    let events = [
      {
        data: {},
        metadata: {},
        eventTypeCode: eventType.code,
        sourceEventId: chance.guid(),
        sourceEventTime: chance.date(),
        sourceName: chance.string()
      }
    ];
    let savedEvents = await resolvers.Mutation.pushEvents(
      { user, application, jwt, apiKey },
      { events },
      { injector: eventRouterModule.injector }
    );

    expect(savedEvents).toBeDefined();
    expect(savedEvents.length).toBeDefined();
    expect(savedEvents.length).toBeGreaterThanOrEqual(1);

    let savedEvent = savedEvents[0];
    let eventBySourceEventId = await resolvers.Query.eventBySourceEventId(
      { user, application, jwt, apiKey },
      { sourceEventId: savedEvent.sourceEventId },
      { injector: eventRouterModule.injector }
    );

    expect(eventBySourceEventId).toBeDefined();
    expect(eventBySourceEventId.id).toBeDefined();
    expect(eventBySourceEventId.id).toEqual(savedEvent.id);
    expect(eventBySourceEventId.sourceName).toBeDefined();
    expect(eventBySourceEventId.sourceName).toEqual(savedEvent.sourceName);

    let eventBySourcesByEventTypeCode = await resolvers.Query.eventsByFilters(
      { user, application, jwt, apiKey },
      { eventTypeCode: eventType.code },
      { injector: eventRouterModule.injector }
    );

    expect(eventBySourcesByEventTypeCode).toBeDefined();
    expect(eventBySourcesByEventTypeCode.length).toBeDefined();
    expect(eventBySourcesByEventTypeCode.length).toBeGreaterThanOrEqual(1);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
