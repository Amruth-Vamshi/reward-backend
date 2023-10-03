import { webhookModule } from "../webhook.module";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser,
} from "../../../../__tests__/utils/unit";
import { getConnection, getManager } from "typeorm";
import * as CoreEntities from "../../../entity";
import resolvers from "../webhook.resolvers";
import { ApplicationProvider } from "../../account/application/application.providers";
import { ApplicationModule } from "../../account/application/application.module";
import { WCoreError } from "../../common/exceptions";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { WEBHOOK_TYPE } from "../../common/constants";
import { Chance } from "chance";
import { WCORE_ERRORS } from "../../common/constants/errors";

let user: CoreEntities.User;
let organizationId;
const chance = new Chance();

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  organizationId = user.organization.id;
});
describe("Webhook (Using API Key) Resolvers", () => {
  test("Mutation - createWebhookEventType", async () => {
    organizationId = user.organization.id;
    const manager = getManager();
    let application = await applicationService.createApplication(
      manager,
      organizationId,
      { name: "TEST_APPLICATION" }
    );
    const webhookEventType = await resolvers.Mutation.createWebhookEventType(
      { user: null, application },
      {
        input: {
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
          description: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
          organizationId,
        },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_1");
    expect(webhookEventType.description).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_1");
    expect(webhookEventType.organization.id).toBe(organizationId);
    expect(webhookEventType.status).toBe("ACTIVE");
  });

  test("Query - Get webhookEventType", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhookEventType = await resolvers.Mutation.createWebhookEventType(
      { user: null, application },
      {
        input: {
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_2",
          description: "WEBHOOK_EVENT_TYPE_RESOLVER_2",
          organizationId: organizationId,
        },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_2");
    expect(webhookEventType.description).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_2");
    expect(webhookEventType.organization.id).toBe(organizationId);
    expect(webhookEventType.status).toBe("ACTIVE");

    const webhookEventType2 = await resolvers.Query.webhookEventType(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_2",
      },
      { injector: webhookModule.injector }
    );
    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_2");
    expect(webhookEventType.description).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_2");
    expect(webhookEventType.organization.id).toBe(organizationId);
    expect(webhookEventType.status).toBe("ACTIVE");
  });

  test("Query - Get webhookEventType - wrong organizationId", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhookEventType = await resolvers.Mutation.createWebhookEventType(
      { user: null, application },
      {
        input: {
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_13",
          description: "WEBHOOK_EVENT_TYPE_RESOLVER_13",
          organizationId: organizationId,
        },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_13");
    expect(webhookEventType.description).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_13");
    expect(webhookEventType.organization.id).toBe(organizationId);
    expect(webhookEventType.status).toBe("ACTIVE");

    try {
      const webhookEventType2 = await resolvers.Query.webhookEventType(
        { user: null, application },
        {
          organizationId: "563845634",
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_13",
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(7);
  });

  test("Query - Get webhookEventType - organizationId UNDEFINED", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhookEventType = await resolvers.Mutation.createWebhookEventType(
      { user: null, application },
      {
        input: {
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_15",
          description: "WEBHOOK_EVENT_TYPE_RESOLVER_15",
          organizationId: organizationId,
        },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_15");
    expect(webhookEventType.description).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_15");
    expect(webhookEventType.organization.id).toBe(organizationId);
    expect(webhookEventType.status).toBe("ACTIVE");

    try {
      const webhookEventType2 = await resolvers.Query.webhookEventType(
        { user: null, application: null },
        {
          organizationId: undefined,
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_13",
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
    expect.assertions(7);
  });

  test("Query - Get webhookEventType - wrong eventType", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );

    try {
      const webhookEventType2 = await resolvers.Query.webhookEventType(
        { user: null, application },
        {
          organizationId: organizationId,
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_2kjghdsjf",
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
    expect.assertions(0);
  });

  test("Query - webhookEventTypes - ACTIVE ", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhookEventType = await resolvers.Mutation.createWebhookEventType(
      { user: null, application },
      {
        input: {
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_3",
          description: "WEBHOOK_EVENT_TYPE_RESOLVER_3",
          organizationId: organizationId,
        },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_3");
    expect(webhookEventType.description).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_3");
    expect(webhookEventType.status).toBe("ACTIVE");

    //now get the same using event
    const webhookEventTypes = await resolvers.Query.webhookEventTypes(
      { user: null, application },
      {
        organizationId: organizationId,
        status: "ACTIVE",
        pageOptions: { page: 1, pageSize: 10 },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventTypes).toBeDefined();
    expect(webhookEventTypes).toHaveProperty("data");
    expect(webhookEventTypes["data"]).toHaveProperty("length");
    expect(webhookEventTypes).toHaveProperty("paginationInfo");
    expect(webhookEventTypes["data"].length).toBeGreaterThan(0);
  });

  test("Mutation - createWebhookEventType - Duplicate event", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    try {
      const webhookEventType = await resolvers.Mutation.createWebhookEventType(
        { user: null, application: application },
        {
          input: {
            event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
            description: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
            organizationId: organizationId,
          },
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }

    //Should throw an error
    expect.assertions(1);
  });

  test("Mutation - updateWebhookEventType ", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhookEventType = await resolvers.Mutation.createWebhookEventType(
      { user: null, application },
      {
        input: {
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_4",
          description: "WEBHOOK_EVENT_TYPE_RESOLVER_4",
          organizationId: organizationId,
        },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_4");
    expect(webhookEventType.description).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_4");
    expect(webhookEventType.status).toBe("ACTIVE");

    //now get the same using event
    const webhookEventType2 = await resolvers.Mutation.updateWebhookEventType(
      { user: null, application },
      {
        input: {
          id: webhookEventType.id,
          organizationId: organizationId,
          status: "INACTIVE",
          description: "WEBHOOK_EVENT_TYPE_RESOLVER_4_UPDATED",
        },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventType2).toBeDefined();
    expect(webhookEventType2.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_4");
    expect(webhookEventType2.description).toBe(
      "WEBHOOK_EVENT_TYPE_RESOLVER_4_UPDATED"
    );
    expect(webhookEventType2.status).toBe("INACTIVE");
  });

  test("Mutation - updateWebhookEventType - Wrong id", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    try {
      const webhookEventType2 = await resolvers.Mutation.updateWebhookEventType(
        { user: null, application },
        {
          input: {
            id: "26547asfy4528635428637",
            organizationId: organizationId,
            status: "INACTIVE",
            description: "WEBHOOK_EVENT_TYPE_RESOLVER_4_UPDATED",
          },
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }

    expect.assertions(1);
  });

  test("Mutation - updateWebhookEventType wrong organizationId", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhookEventType = await resolvers.Mutation.createWebhookEventType(
      { user: null, application },
      {
        input: {
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_16",
          description: "WEBHOOK_EVENT_TYPE_RESOLVER_16",
          organizationId: organizationId,
        },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_16");
    expect(webhookEventType.description).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_16");
    expect(webhookEventType.status).toBe("ACTIVE");

    try {
      const webhookEventType2 = await resolvers.Mutation.updateWebhookEventType(
        { user: null, application },
        {
          input: {
            id: webhookEventType.id,
            organizationId: "47856",
            status: "ACTIVE",
            description: "WEBHOOK_EVENT_TYPE_RESOLVER_16_UPDATED",
          },
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(6);
  });

  test("Mutation - updateWebhookEventType organizationId UNDEFINED", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhookEventType = await resolvers.Mutation.createWebhookEventType(
      { user: null, application },
      {
        input: {
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_17",
          description: "WEBHOOK_EVENT_TYPE_RESOLVER_17",
          organizationId: organizationId,
        },
      },
      { injector: webhookModule.injector }
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_17");
    expect(webhookEventType.description).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_17");
    expect(webhookEventType.status).toBe("ACTIVE");

    try {
      const webhookEventType2 = await resolvers.Mutation.updateWebhookEventType(
        { user: null, application: null },
        {
          input: {
            id: webhookEventType.id,
            organizationId: undefined,
            status: "ACTIVE",
            description: "WEBHOOK_EVENT_TYPE_RESOLVER_17_UPDATED",
          },
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(6);
  });

  test("Mutation - createWebhook", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    let inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);
  });

  test("Mutation - createWebhook: FAIL to create webhook with same url and same event which is already present", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    let inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();

    try {
      const webhook2 = await resolvers.Mutation.createWebhook(
        { user: null, application },
        {
          input: inputOptions,
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.WEBHOOK_DETAILS_ALREADY_PRESENT));
    }
  });

  test("Mutation - createWebhook - wrong webhook event type", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    let inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1_DOESNT_EXIST",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    try {
      const webhook1 = await resolvers.Mutation.createWebhook(
        { user: null, application },
        {
          input: inputOptions,
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect.assertions(1);
  });

  test("Mutation - createWebhook - wrong organizationId", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    let inputOptions = {
      organizationId: "9843534895",
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };
    try {
      const webhook1 = await resolvers.Mutation.createWebhook(
        { user: null, application },
        {
          input: inputOptions,
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(1);
  });

  test("Mutation - createWebhook - organizationId is undefined", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    let inputOptions = {
      organizationId: undefined,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };
    try {
      const webhook1 = await resolvers.Mutation.createWebhook(
        { user: null, application: null },
        {
          input: inputOptions,
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
    expect.assertions(1);
  });

  test("Mutation - createWebhook - headers empty string ", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: "",
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(webhook1.headers).toEqual({});
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);
  });

  test("Query - webhook ", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    const webhook2 = await resolvers.Query.webhook(
      { user: null, application },
      {
        id: webhook1.id,
        organizationId: organizationId,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook2).toBeDefined();
    expect(webhook2.event).toBe(inputOptions.event);
    expect(webhook2.name).toBe(inputOptions.name);
    expect(webhook2.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook2.method).toBe(inputOptions.method);
    expect(webhook2.status).toBe("ACTIVE");
    expect(webhook2.enabled).toBe(true);
  });

  test("Mutation - updateWebhook", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let updateOptions = {
      id: webhook1.id,
      organizationId: organizationId,
      name: "Webhook 2",
      url: "http://example-updated.com",
      headers: JSON.stringify({
        Authorization: "Bearer kfkashkshfksjhfkupdated",
      }),
      method: "GET",
    };

    const webhook2 = await resolvers.Mutation.updateWebhook(
      { user: null, application },
      {
        input: updateOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook2).toBeDefined();
    expect(webhook2.event).toBe(inputOptions.event); //event remains the same
    expect(webhook2.name).toBe(updateOptions.name);
    expect(webhook2.url).toBe(updateOptions.url);
    expect(JSON.stringify(webhook2.headers)).toBe(updateOptions.headers);
    expect(webhook2.method).toBe(updateOptions.method);
    expect(webhook2.status).toBe("ACTIVE");
    expect(webhook2.enabled).toBe(true);
  });

  test("Mutation - updateWebhook - make it inactive", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let updateOptions = {
      id: webhook1.id,
      organizationId: organizationId,
      status: "INACTIVE",
    };

    const webhook2 = await resolvers.Mutation.updateWebhook(
      { user: null, application },
      {
        input: updateOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook2).toBeDefined();
    expect(webhook2.status).toBe("INACTIVE");

    //rest remains the same
    expect(webhook2.event).toBe(inputOptions.event);
    expect(webhook2.name).toBe(inputOptions.name);
    expect(webhook2.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook2.headers)).toBe(inputOptions.headers);
    expect(webhook2.method).toBe(inputOptions.method);
    expect(webhook2.enabled).toBe(true);
  });

  test("Mutation - updateWebhook - make it disabled", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let updateOptions = {
      id: webhook1.id,
      organizationId: organizationId,
      enabled: false,
    };

    const webhook2 = await resolvers.Mutation.updateWebhook(
      { user: null, application },
      {
        input: updateOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook2).toBeDefined();
    expect(webhook2.enabled).toBe(false);

    //rest remains the same
    expect(webhook2.event).toBe(inputOptions.event);
    expect(webhook2.name).toBe(inputOptions.name);
    expect(webhook2.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook2.headers)).toBe(inputOptions.headers);
    expect(webhook2.method).toBe(inputOptions.method);
    expect(webhook2.status).toBe("ACTIVE");
  });

  test("Mutation - updateWebhook - make it disabled and enable it again", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let updateOptions = {
      id: webhook1.id,
      organizationId: organizationId,
      enabled: false,
    };

    const webhook2 = await resolvers.Mutation.updateWebhook(
      { user: null, application },
      {
        input: updateOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook2).toBeDefined();
    expect(webhook2.enabled).toBe(false);

    //rest remains the same
    expect(webhook2.event).toBe(inputOptions.event);
    expect(webhook2.name).toBe(inputOptions.name);
    expect(webhook2.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook2.headers)).toBe(inputOptions.headers);
    expect(webhook2.method).toBe(inputOptions.method);
    expect(webhook2.status).toBe("ACTIVE");

    let updateOptions3 = {
      id: webhook1.id,
      organizationId: organizationId,
      enabled: true,
    };

    const webhook3 = await resolvers.Mutation.updateWebhook(
      { user: null, application },
      {
        input: updateOptions3,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook3).toBeDefined();
    expect(webhook3.enabled).toBe(true);

    //rest remains the same
    expect(webhook3.event).toBe(inputOptions.event);
    expect(webhook3.name).toBe(inputOptions.name);
    expect(webhook3.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook2.headers)).toBe(inputOptions.headers);
    expect(webhook3.method).toBe(inputOptions.method);
    expect(webhook3.status).toBe("ACTIVE");
  });

  test("Mutation - updateWebhook - Wrong webhook id", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    let updateOptions3 = {
      id: "28748264826348",
      organizationId: organizationId,
      enabled: true,
    };

    try {
      const webhook3 = await resolvers.Mutation.updateWebhook(
        { user: null, application },
        {
          input: updateOptions3,
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }

    //need to expect eror
    expect.assertions(1);
  });

  test("Mutation - updateWebhook - wrong organizationId", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let updateOptions = {
      id: webhook1.id,
      organizationId: organizationId,
      name: "Webhook 2",
      url: "http://example-updated.com",
      headers: JSON.stringify({
        Authorization: "Bearer kfkashkshfksjhfkupdated",
      }),
      method: "GET",
    };

    try {
      const webhook2 = await resolvers.Mutation.updateWebhook(
        { user: null, application },
        {
          input: updateOptions,
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(8);
  });

  test("Mutation - updateWebhook - wrong headers", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: '{ "Authorization": "Bearer kfkashkshfksjhfk" }',
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };

    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );

    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(
      '{"Authorization":"Bearer kfkashkshfksjhfk"}'
    );
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let updateOptions = {
      id: webhook1.id,
      organizationId: organizationId,
      name: "Webhook 2",
      url: "http://example-updated.com",
      headers: JSON.stringify({
        Authorization: "Bearer kfkashkshfksjhfkupdated",
      }),
      method: "GET",
    };

    try {
      const webhook2 = await resolvers.Mutation.updateWebhook(
        { user: null, application },
        {
          input: updateOptions,
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(0);
      expect(error).toBeDefined();
    }
    expect.assertions(8);
  });

  test("Query - webhook - wrong id", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    try {
      const webhook2 = await resolvers.Query.webhook(
        { user: null, application },
        {
          id: "this doesnt exist",
          organizationId: organizationId,
        },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }

    expect.assertions(1);
  });

  test("Query - webhooks - enabled", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: true,
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    for (const webhook of webhooks["data"]) {
      expect(webhook["status"]).toBe("ACTIVE");
      expect(webhook["enabled"]).toBe(true);
      expect(webhook["event"]).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_1");
    }
  });

  test("Query - webhooks - get disabled", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: false,
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);
    for (const webhook of webhooks["data"]) {
      expect(webhook["status"]).toBe("ACTIVE");
      expect(webhook["enabled"]).toBe(false);
      expect(webhook["event"]).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_1");
    }
  });

  test("Query - webhooks - get INACTIVE", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "INACTIVE",
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);
    for (const webhook of webhooks["data"]) {
      expect(webhook["status"]).toBe("INACTIVE");
      expect(webhook["event"]).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_1");
    }
  });

  test("Query - webhooks - wrong organizationId", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    try {
      const webhooks = await resolvers.Query.webhooks(
        { user: null, application },
        {
          organizationId: "non existent org",
          event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
          status: "ACTIVE",
          enabled: true,
          pageOptions: { page: 0, perPage: 0 },
        },
        { injector: webhookModule.injector }
      );
      expect(webhooks).toBeDefined();
      expect(webhooks.length).toBeGreaterThan(0);
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }

    expect.assertions(1);
  });

  test("Query - webhooks - wrong event", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1_THAT DOESNT EXIST",
        status: "ACTIVE",
        enabled: true,
        pageOptions: { page: 0, perPage: 0 },
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBe(0);
    expect(webhooks["paginationInfo"].totalItems).toBe(0);
  });

  test("Query - webhooks - with pageOptions and sortOptions", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: true,
        pageOptions: { page: 1, perPage: 10 },
        sortOptions: { sortBy: "createdBy", sort: "ASC" },
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    for (const webhook of webhooks["data"]) {
      expect(webhook["status"]).toBe("ACTIVE");
      expect(webhook["enabled"]).toBe(true);
      expect(webhook["event"]).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_1");
    }
  });

  test("Query - webhooks(organization)  ", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Organization.webhooks(
      user.organization,
      {
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        enabled: true,
        status: "ACTIVE",
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    for (const webhook of webhooks["data"]) {
      expect(webhook["status"]).toBe("ACTIVE");
      expect(webhook["enabled"]).toBe(true);
      expect(webhook["event"]).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_1");
    }
  });

  test("Query - webhooks(organization) - invalid input fields", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Organization.webhooks(
      "3475634",
      {
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1983475",
        enabled: null,
        status: "INACTIVE",
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeLessThanOrEqual(0);
    expect(webhooks["paginationInfo"].totalItems).toBeLessThanOrEqual(0);
  });

  test("Query - webhooks(organization) - invalid organizationId", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Organization.webhooks(
      "78349834",
      {
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        enabled: true,
        status: "ACTIVE",
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBe(0);
    expect(webhooks["paginationInfo"].totalItems).toBe(0);

    for (const webhook of webhooks["data"]) {
      expect(webhook["status"]).toBe("ACTIVE");
      expect(webhook["enabled"]).toBe(true);
      expect(webhook["event"]).toBe("WEBHOOK_EVENT_TYPE_RESOLVER_1");
    }
  });

  test("Mutation - createWebhookEventData", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: true,
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    let webhook = webhooks["data"][0];

    expect(webhook).toBeDefined();
    expect(webhook.id).toBeDefined();
    expect(webhook.status).toBe("ACTIVE");

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };

    let inputs = {
      webhookId: webhook.id,
      data: webhookEventData,
      organizationId: organizationId,
    };

    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );
  });

  test("Mutation - createWebhookEventData - wrong webhook ID", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };

    let inputs = {
      webhookId: "3u6823648ugis webhook.id",
      data: webhookEventData,
      organizationId: organizationId,
    };

    try {
      let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
        { user: null, application },
        { input: inputs },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
    //Should throw an error
    expect.assertions(1);
  });

  test("Mutation - createWebhookEventData - wrong webhookId", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: true,
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    let webhook = webhooks["data"][0];

    expect(webhook).toBeDefined();
    expect(webhook.id).toBeDefined();
    expect(webhook.status).toBe("ACTIVE");

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };

    let inputs = {
      webhookId: "23875839457",
      data: webhookEventData,
      organizationId: organizationId,
    };

    try {
      let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
        { user: null, application },
        { input: inputs },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
    expect.assertions(10);
  });

  test("Mutation - updateWebhookEventData - http status", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: true,
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    let webhook = webhooks["data"][0];

    expect(webhook).toBeDefined();
    expect(webhook.id).toBeDefined();
    expect(webhook.status).toBe("ACTIVE");

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };

    let webhookEventData2 = {
      specversion: "1.1",
      type: "com.example1.someevent",
      source: "/mycontext/5",
      id: "B234-1234-1235",
      time: "2018-04-05T17:32:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary1",
      data_base64: "... base64 encoded string  ...",
    };

    let inputs = {
      webhookId: webhook.id,
      organizationId: organizationId,
      data: webhookEventData,
    };

    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    let inputsUpdate = {
      id: webhookEventDataSaved.id,
      httpStatus: "200",
      webhookId: webhook.id,
      organizationId: organizationId,
      webhookEventData: webhookEventData2,
    };

    let webhookEventDataUpdated = await resolvers.Mutation.updateWebhookEventData(
      { user: null, application },
      { input: inputsUpdate },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataUpdated).toBeDefined();
    expect(webhookEventDataUpdated.httpStatus).toBe("200");
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );
  });

  test("Mutation - updateWebhookEventData - invalid webhookEventDataId", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: true,
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    let webhook = webhooks["data"][0];

    expect(webhook).toBeDefined();
    expect(webhook.id).toBeDefined();
    expect(webhook.status).toBe("ACTIVE");

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };

    let inputs = {
      webhookId: webhook.id,
      organizationId: organizationId,
      data: webhookEventData,
    };

    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    let inputsUpdate = {
      id: "43785634",
      httpStatus: "200",
      webhookId: webhook.id,
      organizationId: organizationId,
    };
    try {
      let webhookEventDataUpdated = await resolvers.Mutation.updateWebhookEventData(
        { user: null, application },
        { input: inputsUpdate },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(14);
  });

  test("Mutation - updateWebhookEventData - wrong organizationId", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: true,
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    let webhook = webhooks["data"][0];

    expect(webhook).toBeDefined();
    expect(webhook.id).toBeDefined();
    expect(webhook.status).toBe("ACTIVE");

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };

    let inputs = {
      webhookId: webhook.id,
      organizationId: organizationId,
      data: webhookEventData,
    };

    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    let inputsUpdate = {
      id: webhookEventDataSaved.id,
      httpStatus: "200",
      webhookId: webhook.id,
      organizationId: "94837534",
    };
    try {
      let webhookEventDataUpdated = await resolvers.Mutation.updateWebhookEventData(
        { user: null, application },
        { input: inputsUpdate },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
    expect.assertions(14);
  });

  test("Mutation - updateWebhookEventData - UNDEFINED webhookEventData", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: true,
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    let webhook = webhooks["data"][0];

    expect(webhook).toBeDefined();
    expect(webhook.id).toBeDefined();
    expect(webhook.status).toBe("ACTIVE");

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };

    let inputs = {
      webhookId: webhook.id,
      organizationId: organizationId,
      data: undefined,
    };

    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe("{}");

    let inputsUpdate = {
      id: webhookEventDataSaved.id,
      httpStatus: "200",
      webhookId: webhook.id,
      organizationId: organizationId,
      webhookEventData: undefined,
    };
    try {
      let webhookEventDataUpdated = await resolvers.Mutation.updateWebhookEventData(
        { user: null, application },
        { input: inputsUpdate },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
    expect.assertions(13);
  });

  test("Mutation - updateWebhookEventData - wrong webhookId", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const webhooks = await resolvers.Query.webhooks(
      { user: null, application },
      {
        organizationId: organizationId,
        event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
        status: "ACTIVE",
        enabled: true,
      },
      { injector: webhookModule.injector }
    );

    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks["data"]).toHaveProperty("length");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"].totalItems).toBeGreaterThan(0);

    let webhook = webhooks["data"][0];

    expect(webhook).toBeDefined();
    expect(webhook.id).toBeDefined();
    expect(webhook.status).toBe("ACTIVE");

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };

    let webhookEventData2 = {
      specversion: "1.1",
      type: "com.example1.someevent",
      source: "/mycontext/5",
      id: "B234-1234-1235",
      time: "2018-04-05T17:32:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary1",
      data_base64: "... base64 encoded string  ...",
    };

    let inputs = {
      webhookId: webhook.id,
      organizationId: organizationId,
      data: webhookEventData,
    };

    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    let inputsUpdate = {
      id: webhookEventDataSaved.id,
      httpStatus: "200",
      webhookId: "65684645868",
      organizationId: organizationId,
      webhookEventData: webhookEventData2,
    };
    try {
      let webhookEventDataUpdated = await resolvers.Mutation.updateWebhookEventData(
        { user: null, application },
        { input: inputsUpdate },
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(13);
  });

  test("Query - webhookEventData by webhookId", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };
    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );
    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };
    let inputs = {
      webhookId: webhook1.id,
      organizationId: organizationId,
      data: webhookEventData,
    };
    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook1.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    let webhookEventDataInput = {
      organizationId: organizationId,
      webhookId: webhook1.id,
      httpStatus: "0",
      pageOptions: { page: 1, perPage: 10 },
      sortOptions: { sortBy: "createdBy", sort: "ASC" },
    };
    const getWebhookEventData = await resolvers.Query.webhookEventData(
      { user: null, application },
      webhookEventDataInput,
      { injector: webhookModule.injector }
    );
    expect(getWebhookEventData).toBeTruthy();
    expect(getWebhookEventData).toHaveProperty("data");
    expect(getWebhookEventData["data"]).toHaveProperty("length");
    expect(getWebhookEventData).toHaveProperty("paginationInfo");
    expect(getWebhookEventData["data"].length).toBeGreaterThan(0);
    expect(getWebhookEventData["paginationInfo"].totalItems).toBeGreaterThan(0);

    expect(getWebhookEventData["data"][0].id).toBeTruthy();
    expect(getWebhookEventData["data"][0].data["specversion"]).toEqual(
      webhookEventData.specversion
    );
    expect(getWebhookEventData["data"][0].data["type"]).toEqual(
      webhookEventData.type
    );
    expect(getWebhookEventData["data"][0].data["source"]).toEqual(
      webhookEventData.source
    );
    expect(getWebhookEventData["data"][0].data["id"]).toEqual(
      webhookEventData.id
    );
    expect(getWebhookEventData["data"][0].data["time"]).toEqual(
      webhookEventData.time
    );
    expect(getWebhookEventData["data"][0].data["comexampleextension1"]).toEqual(
      webhookEventData.comexampleextension1
    );
    expect(getWebhookEventData["data"][0].data["comexampleothervalue"]).toEqual(
      webhookEventData.comexampleothervalue
    );
    expect(getWebhookEventData["data"][0].data["datacontenttype"]).toEqual(
      webhookEventData.datacontenttype
    );
    expect(getWebhookEventData["data"][0].data["data_base64"]).toEqual(
      webhookEventData.data_base64
    );
    expect(getWebhookEventData["data"][0].httpStatus).toEqual("0");
    expect(getWebhookEventData["paginationInfo"].page).toEqual(1);
    expect(getWebhookEventData["paginationInfo"].perPage).toEqual(10);
  });

  test("Query - webhookEventData by webhookId missing pageOptions, sortOptions and httpStatus as null ", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };
    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );
    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };
    let inputs = {
      webhookId: webhook1.id,
      organizationId: organizationId,
      data: webhookEventData,
    };
    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook1.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    let webhookEventDataInput = {
      organizationId: organizationId,
      webhookId: webhook1.id,
      httpStatus: null,
    };
    const getWebhookEventData = await resolvers.Query.webhookEventData(
      { user: null, application },
      webhookEventDataInput,
      { injector: webhookModule.injector }
    );
    expect(getWebhookEventData).toBeTruthy();
    expect(getWebhookEventData).toHaveProperty("data");
    expect(getWebhookEventData["data"]).toHaveProperty("length");
    expect(getWebhookEventData).toHaveProperty("paginationInfo");
    expect(getWebhookEventData["data"].length).toBeGreaterThan(0);
    expect(getWebhookEventData["paginationInfo"].totalItems).toBeGreaterThan(0);

    expect(getWebhookEventData["data"][0].id).toBeTruthy();
    expect(getWebhookEventData["data"][0].data["specversion"]).toEqual(
      webhookEventData.specversion
    );
    expect(getWebhookEventData["data"][0].data["type"]).toEqual(
      webhookEventData.type
    );
    expect(getWebhookEventData["data"][0].data["source"]).toEqual(
      webhookEventData.source
    );
    expect(getWebhookEventData["data"][0].data["id"]).toEqual(
      webhookEventData.id
    );
    expect(getWebhookEventData["data"][0].data["time"]).toEqual(
      webhookEventData.time
    );
    expect(getWebhookEventData["data"][0].data["comexampleextension1"]).toEqual(
      webhookEventData.comexampleextension1
    );
    expect(getWebhookEventData["data"][0].data["comexampleothervalue"]).toEqual(
      webhookEventData.comexampleothervalue
    );
    expect(getWebhookEventData["data"][0].data["datacontenttype"]).toEqual(
      webhookEventData.datacontenttype
    );
    expect(getWebhookEventData["data"][0].data["data_base64"]).toEqual(
      webhookEventData.data_base64
    );
    expect(getWebhookEventData["data"][0].httpStatus).toEqual("0");
    expect(getWebhookEventData["paginationInfo"].page).toEqual(1);
    expect(getWebhookEventData["paginationInfo"].perPage).toEqual(10);
  });

  test("Query - webhookEventData by webhookId missing non mandatory fields", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };
    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );
    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };
    let inputs = {
      webhookId: webhook1.id,
      organizationId: organizationId,
      data: webhookEventData,
    };
    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook1.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    let webhookEventDataInput = {
      organizationId: organizationId,
      webhookId: webhook1.id,
    };
    const getWebhookEventData = await resolvers.Query.webhookEventData(
      { user: null, application },
      webhookEventDataInput,
      { injector: webhookModule.injector }
    );
    expect(getWebhookEventData).toBeTruthy();
    expect(getWebhookEventData).toHaveProperty("data");
    expect(getWebhookEventData["data"]).toHaveProperty("length");
    expect(getWebhookEventData).toHaveProperty("paginationInfo");
    expect(getWebhookEventData["data"].length).toBeGreaterThan(0);
    expect(getWebhookEventData["paginationInfo"].totalItems).toBeGreaterThan(0);

    expect(getWebhookEventData["data"][0].id).toBeTruthy();
    expect(getWebhookEventData["data"][0].data["specversion"]).toEqual(
      webhookEventData.specversion
    );
    expect(getWebhookEventData["data"][0].data["type"]).toEqual(
      webhookEventData.type
    );
    expect(getWebhookEventData["data"][0].data["source"]).toEqual(
      webhookEventData.source
    );
    expect(getWebhookEventData["data"][0].data["id"]).toEqual(
      webhookEventData.id
    );
    expect(getWebhookEventData["data"][0].data["time"]).toEqual(
      webhookEventData.time
    );
    expect(getWebhookEventData["data"][0].data["comexampleextension1"]).toEqual(
      webhookEventData.comexampleextension1
    );
    expect(getWebhookEventData["data"][0].data["comexampleothervalue"]).toEqual(
      webhookEventData.comexampleothervalue
    );
    expect(getWebhookEventData["data"][0].data["datacontenttype"]).toEqual(
      webhookEventData.datacontenttype
    );
    expect(getWebhookEventData["data"][0].data["data_base64"]).toEqual(
      webhookEventData.data_base64
    );
    expect(getWebhookEventData["data"][0].httpStatus).toEqual("0");
    expect(getWebhookEventData["paginationInfo"].page).toEqual(1);
    expect(getWebhookEventData["paginationInfo"].perPage).toEqual(10);
  });

  test("Query - webhookEventData by invalid organizationId", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };
    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );
    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };
    let inputs = {
      webhookId: webhook1.id,
      organizationId: organizationId,
      data: webhookEventData,
    };
    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook1.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    console.log("Saved webhookEventDataSaved", webhookEventDataSaved);

    let webhookEventDataInput = {
      organizationId: "ABCD",
      webhookId: webhook1.id,
      httpStatus: "0",
    };
    try {
      const getWebhookEventData = await resolvers.Query.webhookEventData(
        { user: null, application },
        webhookEventDataInput,
        { injector: webhookModule.injector }
      );
      expect(getWebhookEventData).toBeDefined();
    } catch (error) {
      //console.log(error);
      expect(error).toBeDefined();
    }
    expect.assertions(13);
  });

  test("Query - webhookEventData by invalid webhookId", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );

    let webhookEventDataInput = {
      organizationId: organizationId,
      webhookId: "6545467564",
      httpStatus: "0",
      status: "ACTIVE",
    };
    const getWebhookEventData = await resolvers.Query.webhookEventData(
      { user: null, application },
      webhookEventDataInput,
      { injector: webhookModule.injector }
    );

    expect(getWebhookEventData["data"].length).toEqual(0);
  });

  test("Query - webhookEventData by missing mandatory input fields", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    let webhookEventDataInput = {
      httpStatus: "0",
      pageOptions: { page: 1, perPage: 10 },
      sortOptions: { sortBy: "createdBy", sort: "ASC" },
    };
    try {
      const getWebhookEventData = await resolvers.Query.webhookEventData(
        { user: null, application: null },
        webhookEventDataInput,
        { injector: webhookModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(1);
  });

  test("Query - webhookEventData by webhookId with missing pageOptions", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };
    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );
    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };
    let inputs = {
      webhookId: webhook1.id,
      organizationId: organizationId,
      data: webhookEventData,
    };
    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook1.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    let webhookEventDataInput = {
      organizationId: organizationId,
      webhookId: webhook1.id,
      httpStatus: "0",
      pageOptions: undefined,
      sortOptions: { sortBy: "createdBy", sort: "ASC" },
    };
    const getWebhookEventData = await resolvers.Query.webhookEventData(
      { user: null, application },
      webhookEventDataInput,
      { injector: webhookModule.injector }
    );
    expect(getWebhookEventData).toBeTruthy();
    expect(getWebhookEventData).toHaveProperty("data");
    expect(getWebhookEventData["data"]).toHaveProperty("length");
    expect(getWebhookEventData).toHaveProperty("paginationInfo");
    expect(getWebhookEventData["data"].length).toBeGreaterThan(0);
    expect(getWebhookEventData["paginationInfo"].totalItems).toBeGreaterThan(0);

    expect(getWebhookEventData["data"][0].id).toBeTruthy();
    expect(getWebhookEventData["data"][0].data["specversion"]).toEqual(
      webhookEventData.specversion
    );
    expect(getWebhookEventData["data"][0].data["type"]).toEqual(
      webhookEventData.type
    );
    expect(getWebhookEventData["data"][0].data["source"]).toEqual(
      webhookEventData.source
    );
    expect(getWebhookEventData["data"][0].data["id"]).toEqual(
      webhookEventData.id
    );
    expect(getWebhookEventData["data"][0].data["time"]).toEqual(
      webhookEventData.time
    );
    expect(getWebhookEventData["data"][0].data["comexampleextension1"]).toEqual(
      webhookEventData.comexampleextension1
    );
    expect(getWebhookEventData["data"][0].data["comexampleothervalue"]).toEqual(
      webhookEventData.comexampleothervalue
    );
    expect(getWebhookEventData["data"][0].data["datacontenttype"]).toEqual(
      webhookEventData.datacontenttype
    );
    expect(getWebhookEventData["data"][0].data["data_base64"]).toEqual(
      webhookEventData.data_base64
    );
    expect(getWebhookEventData["data"][0].httpStatus).toEqual("0");
    expect(getWebhookEventData["paginationInfo"].page).toEqual(1);
    expect(getWebhookEventData["paginationInfo"].perPage).toEqual(10);
  });

  test("Query - webhookEventData by webhookId with missing sortOptions", async () => {
    const manager = getManager();
    const application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );
    const url = `http://${chance.string()}.com`;
    const inputOptions = {
      organizationId: organizationId,
      event: "WEBHOOK_EVENT_TYPE_RESOLVER_1",
      name: "Webhook 1",
      url,
      headers: JSON.stringify({ Authorization: "Bearer kfkashkshfksjhfk" }),
      method: "POST",
      webhookType: WEBHOOK_TYPE.EXTERNAL
    };
    const webhook1 = await resolvers.Mutation.createWebhook(
      { user: null, application },
      {
        input: inputOptions,
      },
      { injector: webhookModule.injector }
    );
    expect(webhook1).toBeDefined();
    expect(webhook1.event).toBe(inputOptions.event);
    expect(webhook1.name).toBe(inputOptions.name);
    expect(webhook1.url).toBe(inputOptions.url);
    expect(JSON.stringify(webhook1.headers)).toBe(inputOptions.headers);
    expect(webhook1.method).toBe(inputOptions.method);
    expect(webhook1.status).toBe("ACTIVE");
    expect(webhook1.enabled).toBe(true);

    let webhookEventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ...",
    };
    let inputs = {
      webhookId: webhook1.id,
      organizationId: organizationId,
      data: webhookEventData,
    };
    let webhookEventDataSaved = await resolvers.Mutation.createWebhookEventData(
      { user: null, application },
      { input: inputs },
      { injector: webhookModule.injector }
    );

    expect(webhookEventDataSaved).toBeDefined();
    expect(webhookEventDataSaved.httpStatus).toBe("0");
    expect(webhookEventDataSaved.webhook.id).toBe(webhook1.id);
    expect(JSON.stringify(webhookEventDataSaved.data)).toBe(
      JSON.stringify(webhookEventData)
    );

    let webhookEventDataInput = {
      organizationId: organizationId,
      webhookId: webhook1.id,
      httpStatus: "0",
      pageOptions: { page: 1, perPage: 10 },
      sortOptions: undefined,
    };
    const getWebhookEventData = await resolvers.Query.webhookEventData(
      { user: null, application },
      webhookEventDataInput,
      { injector: webhookModule.injector }
    );
    expect(getWebhookEventData).toBeTruthy();
    expect(getWebhookEventData).toHaveProperty("data");
    expect(getWebhookEventData["data"]).toHaveProperty("length");
    expect(getWebhookEventData).toHaveProperty("paginationInfo");
    expect(getWebhookEventData["data"].length).toBeGreaterThan(0);
    expect(getWebhookEventData["paginationInfo"].totalItems).toBeGreaterThan(0);

    expect(getWebhookEventData["data"][0].id).toBeTruthy();
    expect(getWebhookEventData["data"][0].data["specversion"]).toEqual(
      webhookEventData.specversion
    );
    expect(getWebhookEventData["data"][0].data["type"]).toEqual(
      webhookEventData.type
    );
    expect(getWebhookEventData["data"][0].data["source"]).toEqual(
      webhookEventData.source
    );
    expect(getWebhookEventData["data"][0].data["id"]).toEqual(
      webhookEventData.id
    );
    expect(getWebhookEventData["data"][0].data["time"]).toEqual(
      webhookEventData.time
    );
    expect(getWebhookEventData["data"][0].data["comexampleextension1"]).toEqual(
      webhookEventData.comexampleextension1
    );
    expect(getWebhookEventData["data"][0].data["comexampleothervalue"]).toEqual(
      webhookEventData.comexampleothervalue
    );
    expect(getWebhookEventData["data"][0].data["datacontenttype"]).toEqual(
      webhookEventData.datacontenttype
    );
    expect(getWebhookEventData["data"][0].data["data_base64"]).toEqual(
      webhookEventData.data_base64
    );
    expect(getWebhookEventData["data"][0].httpStatus).toEqual("0");
    expect(getWebhookEventData["paginationInfo"].page).toEqual(1);
    expect(getWebhookEventData["paginationInfo"].perPage).toEqual(10);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
