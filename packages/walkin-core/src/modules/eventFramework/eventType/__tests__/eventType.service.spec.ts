// import { getConnection } from "typeorm";
import * as CoreEntities from "../../../../entity";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../../__tests__/utils/unit";
import { EventTypeService } from "../eventType.service";
import { ApplicationModule } from "../../../account/application/application.module";
import { getManager, getConnection, EntityManager } from "typeorm";
import { eventTypeModule } from "../eventType.module";
import { ApplicationProvider } from "../../../account/application/application.providers";
import { Chance } from "chance";
import { STATUS } from "../../../common/constants";
let user: CoreEntities.User;
const eventTypeService: EventTypeService = eventTypeModule.injector.get(
  EventTypeService
);
const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);

const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Testing createEventType", () => {
  test("should createEventType", async () => {
    const manager = getManager();
    const application = await applicationService.createApplication(
      manager,
      user.organization.id,
      {
        name: chance.string({
          length: 5
        })
      }
    );
    const code = chance.string({
      length: 5
    });
    const eventType = await eventTypeService.createEventType(manager, {
      applicationId: application.id,
      code,
      description: chance.string({
        length: 10
      })
    });
    expect(eventType).toBeTruthy();
    expect(eventType.code).toBe(code);
  });
});

describe("updateEventType", () => {
  test("should update EventType", async () => {
    const manager = getManager();
    const application = await applicationService.createApplication(
      manager,
      user.organization.id,
      {
        name: chance.string({
          length: 5
        })
      }
    );
    const code = chance.string({
      length: 5
    });
    const eventType = await eventTypeService.createEventType(manager, {
      applicationId: application.id,
      code,
      description: chance.string({
        length: 10
      })
    });
    const newCode = chance.string({
      length: 5
    });
    const newDescription = chance.string({
      length: 5
    });
    const updatedEventType = await eventTypeService.updateEventType(manager, {
      code: newCode,
      description: newDescription,
      id: eventType.id,
      status: STATUS.INACTIVE
    });
    const fetchedEventType = await eventTypeService.eventTypeById(
      manager,
      eventType.id
    );
    expect(fetchedEventType.id).toBe(eventType.id);
    expect(fetchedEventType.code).toBe(newCode);
    expect(fetchedEventType.description).toBe(newDescription);
    expect(fetchedEventType.status).toBe(STATUS.INACTIVE);
  });
});
describe("deleteEventType", () => {
  test("should delete EventType", async () => {
    const manager = getManager();
    const application = await applicationService.createApplication(
      manager,
      user.organization.id,
      {
        name: chance.string({
          length: 5
        })
      }
    );
    const code = chance.string({
      length: 5
    });
    const eventType = await eventTypeService.createEventType(manager, {
      applicationId: application.id,
      code,
      description: chance.string({
        length: 10
      })
    });
    const eventTypebeforDelete = await eventTypeService.eventTypeById(
      manager,
      eventType.id
    );

    expect(eventTypebeforDelete.code).toBe(code);
    const deletedEventType = await eventTypeService.deleteEventType(
      manager,
      eventType.id
    );
    expect(deletedEventType.code).toBe(code);
    const eventTypeAfterDelete = eventTypeService.eventTypeById(
      manager,
      eventType.id
    );
    await expect(eventTypeAfterDelete).rejects.toThrow();
  });
});
describe("eventTypeById", () => {
  test("should get eventTypeById", async () => {
    const manager = getManager();
    const application = await applicationService.createApplication(
      manager,
      user.organization.id,
      {
        name: chance.string({
          length: 5
        })
      }
    );
    const code = chance.string({
      length: 5
    });
    const description = chance.string({
      length: 5
    });
    const eventType = await eventTypeService.createEventType(manager, {
      applicationId: application.id,
      code,
      description
    });
    const fetchedEventType = await eventTypeService.eventTypeById(
      manager,
      eventType.id
    );
    expect(fetchedEventType.id).toBe(eventType.id);
    expect(fetchedEventType.code).toBe(code);
    expect(fetchedEventType.description).toBe(description);
    expect(fetchedEventType.status).toBe(STATUS.ACTIVE);
  });
});
describe("eventTypeByCode", () => {
  test("should get eventTypeBy Code", async () => {
    const manager = getManager();
    const application = await applicationService.createApplication(
      manager,
      user.organization.id,
      {
        name: chance.string({
          length: 5
        })
      }
    );
    const code = chance.string({
      length: 5
    });
    const description = chance.string({
      length: 5
    });
    const eventType = await eventTypeService.createEventType(manager, {
      applicationId: application.id,
      code,
      description
    });
    const fetchedEventType = await eventTypeService.eventTypeByCode(
      manager,
      code
    );
    expect(fetchedEventType.id).toBe(eventType.id);
    expect(fetchedEventType.code).toBe(code);
    expect(fetchedEventType.description).toBe(description);
    expect(fetchedEventType.status).toBe(STATUS.ACTIVE);
  });
});
describe("eventTypesForApplication", () => {
  test("should get eventTypesForApplication", async () => {
    const manager = getManager();
    const application = await applicationService.createApplication(
      manager,
      user.organization.id,
      {
        name: chance.string({
          length: 5
        })
      }
    );
    for (let i = 0; i < 10; i++) {
      const code = chance.string({
        length: 5
      });
      const description = chance.string({
        length: 5
      });
      await eventTypeService.createEventType(manager, {
        applicationId: application.id,
        code,
        description
      });
    }
    const eventTypesAfterDelete = await eventTypeService.eventTypesForApplication(
      manager,
      application.id
    );

    expect(eventTypesAfterDelete).toHaveLength(10);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
