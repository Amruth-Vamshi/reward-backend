import { eventTypeModule } from "../eventType.module";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser,
  setupI18n
} from "../../../../../__tests__/utils/unit";
import * as CoreEntities from "../../../../entity";
import { getConnection, getManager } from "typeorm";
import { resolvers } from "../eventType.resolver";

import { Chance } from "chance";
import { ApplicationProvider } from "../../../account/application/application.providers";
import { ApplicationModule } from "../../../account/application/application.module";
import { EventTypeService } from "../../eventType/eventType.service";
import { IAuthResolverArgs } from "../../../account/auth-guard/auth-guard.interface";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { WCoreError } from "../../../common/exceptions";

let user: CoreEntities.User;

const chance = new Chance();

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
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

describe("EventType Resolver TestSuite", () => {
  test("CreateEventType Resolver Test", async () => {
    let eventType = {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    };

    let createdEventType = await resolvers.Mutation.createEventType(
      { user, application, apiKey, jwt },
      eventType,
      { injector: eventTypeModule.injector }
    );

    expect(createdEventType).toBeDefined();
    expect(createdEventType.code).toBeDefined();

    let foundEventType: any = await resolvers.Query.eventTypeById(
      {},
      { id: createdEventType.id },
      { injector: eventTypeModule.injector }
    );

    expect(foundEventType).toBeDefined();
    expect(foundEventType.code).toBeDefined();
  });

  test("Duplicate createEventType", async () => {
    let eventType = {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    };

    let createdEventType = await resolvers.Mutation.createEventType(
      { user, application, apiKey, jwt },
      eventType,
      { injector: eventTypeModule.injector }
    );

    expect(createdEventType).toBeDefined();
    expect(createdEventType.code).toBeDefined();

    let foundEventType: any = await resolvers.Query.eventTypeById(
      {},
      { id: createdEventType.id },
      { injector: eventTypeModule.injector }
    );

    expect(foundEventType).toBeDefined();
    expect(foundEventType.code).toBeDefined();
    let gotCaught = false;

    try {
      let sameEventTypeCreated = await resolvers.Mutation.createEventType(
        { user, application, apiKey, jwt },
        eventType,
        { injector: eventTypeModule.injector }
      );
      expect(sameEventTypeCreated).toBeUndefined();
    } catch (e) {
      gotCaught = true;
      expect(e).toEqual(new WCoreError(WCORE_ERRORS.EVENT_TYPE_CREATE_FAILED));
    }
    expect(gotCaught).toBeTruthy();
  });

  test("UpdateEventType Resolver Test", async () => {
    let eventType = {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    };

    let createdEventType = await resolvers.Mutation.createEventType(
      { user, application, apiKey, jwt },
      eventType,
      { injector: eventTypeModule.injector }
    );

    expect(createdEventType).toBeDefined();
    expect(createdEventType.code).toBeDefined();

    let foundEventTypeByCode: any = await resolvers.Query.eventTypeByCode(
      {},
      { code: createdEventType.code },
      { injector: eventTypeModule.injector }
    );
    expect(foundEventTypeByCode).toBeDefined();
    expect(foundEventTypeByCode.code).toEqual(createdEventType.code);
    foundEventTypeByCode.description = chance.string({ length: 4 });

    let updatedEventType = await resolvers.Mutation.updateEventType(
      { user, application, apiKey, jwt },
      foundEventTypeByCode,
      { injector: eventTypeModule.injector }
    );

    expect(updatedEventType).toBeDefined();
    expect(updatedEventType.description).toBeDefined();
  });

  test("DeleteEventType Resolver Test", async () => {
    let eventType = {
      applicationId: application.id,
      code: chance.string({ length: 5 })
    };

    let createdEventType = await resolvers.Mutation.createEventType(
      { user, application, apiKey, jwt },
      eventType,
      { injector: eventTypeModule.injector }
    );

    expect(createdEventType).toBeDefined();
    expect(createdEventType.code).toBeDefined();

    let deletedEventType = await resolvers.Mutation.deleteEventType(
      { user, application, apiKey, jwt },
      { id: createdEventType.id },
      { injector: eventTypeModule.injector }
    );
    expect(deletedEventType).toBeDefined();

    let gotCaught = false;
    try {
      let foundEventType: any = await resolvers.Query.eventTypeById(
        {},
        { id: createdEventType.id },
        { injector: eventTypeModule.injector }
      );
    } catch (e) {
      gotCaught = true;
      expect(e).toEqual(new WCoreError(WCORE_ERRORS.EVENT_TYPE_INVALID));
    }

    expect(gotCaught).toBeTruthy();
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
