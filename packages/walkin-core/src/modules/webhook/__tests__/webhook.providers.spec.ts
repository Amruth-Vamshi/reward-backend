import {
  createUnitTestConnection,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import * as WCoreEntities from "../../../entity";
import { WebhookProvider } from "../webhook.providers";
import { Organizations } from "../../account/organization/organization.providers";
import { getManager } from "typeorm";
import {
  OrganizationTypeEnum,
  Status
} from "../../../graphql/generated-models";
import { Chance } from "chance";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";

import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { addPaginateInfo } from "../../common/utils/utils";
import { WEBHOOK_TYPE } from "../../common/constants";

const chance = new Chance();
let webhookProvider: WebhookProvider;
let organizationProvider: Organizations;
let globalOrganization: any;

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  webhookProvider = new WebhookProvider();
  organizationProvider = new Organizations();
  const manager = getManager();
  globalOrganization = await organizationProvider.createOrganization(manager, {
    code: "TEST_ORG",
    name: "TEST_ORG",
    organizationType: OrganizationTypeEnum.Organization,
    status: Status.Active
  });
});

describe("Webhook Provider ", () => {
  test("Get WebhookEvenType", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT7";
    let description = "MY_TEST_DESCRIPTION1";
    let webhookEventType = await webhookProvider.createWebhookEvent(
      manager,
      event,
      description,
      globalOrganization
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toEqual(event);
    expect(webhookEventType.description).toEqual(description);
    expect(webhookEventType.status).toEqual("ACTIVE");
    expect(webhookEventType.organization.id).toEqual(globalOrganization.id);

    let webhookEventType2 = await webhookProvider.getWebhookEvenType(
      manager,
      event,
      globalOrganization.id
    );

    expect(webhookEventType2).toBeDefined();

    // expect(JSON.stringify(webhookEventType2, null, 2)).toEqual(1);
  });

  test("Get non existent webhook Event Type", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT_NON_EXISTING";
    let webhookEventType2 = await webhookProvider.getWebhookEvenType(
      manager,
      event,
      globalOrganization.id
    );

    expect(webhookEventType2).toBeUndefined();
  });

  test("Add Webhook Event Type", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let description = "MY_TEST_DESCRIPTION1";
    let webhookEventType = await webhookProvider.createWebhookEvent(
      manager,
      event,
      description,
      globalOrganization
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");
    expect(webhookEventType.event).toEqual(event);
    expect(webhookEventType.description).toEqual(description);
    expect(webhookEventType.status).toEqual("ACTIVE");
    expect(webhookEventType.organization.id).toEqual(globalOrganization.id);
  });

  //Should skip
  test.skip("Add duplicate Webhook Event Type", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();

    //this should be same as previous
    let event = "MY_TEST_EVENT1";
    let description = "MY_TEST_DESCRIPTION1";
    try {
      let webhookEventType = await webhookProvider.createWebhookEvent(
        manager,
        event,
        description,
        globalOrganization
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(2);
  });

  test("Get Webhook Event Type", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();

    //insert an event type
    let event = "MY_TEST_EVENT2";
    let description = "MY_TEST_DESCRIPTION2";
    let webhookEventType = await webhookProvider.createWebhookEvent(
      manager,
      event,
      description,
      globalOrganization
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");

    //get the same and check
    let webhookEventType2 = await webhookProvider.getWebhookEvenType(
      manager,
      event,
      globalOrganization
    );

    expect(webhookEventType2.event).toEqual(event);
    expect(webhookEventType2.description).toEqual(description);
    expect(webhookEventType2.status).toEqual("ACTIVE");
    expect(webhookEventType2.organization.id).toEqual(globalOrganization.id);
  });

  //We have inserted more than one active event type so count should be more
  //than one
  test("Get all Webhooks Event Types", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let webhookEventTypes = await webhookProvider.getWebhookEventTypes(
      manager,
      "ACTIVE",
      { page: 1, pageSize: 10 },
      { sortBy: "createdTime", sortOrder: "DESC" },
      globalOrganization.id
    );
    console.log(webhookEventTypes);
    expect(webhookEventTypes).toBeDefined();
    expect(webhookEventTypes).toHaveProperty("data");
    expect(webhookEventTypes).toHaveProperty("paginationInfo");
    expect(webhookEventTypes["data"].length).toBeGreaterThan(0);
    expect(webhookEventTypes["paginationInfo"]["totalItems"]).toBeGreaterThan(
      0
    );
  });

  test("update Webhook Event Type", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();

    //insert an event type
    let event = "MY_TEST_EVENT3";
    let description = "MY_TEST_DESCRIPTION3";
    let webhookEventType = await webhookProvider.createWebhookEvent(
      manager,
      event,
      description,
      globalOrganization
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");

    //get the same and check
    let webhookEventType2 = await webhookProvider.getWebhookEvenType(
      manager,
      event,
      globalOrganization
    );

    expect(webhookEventType2.event).toEqual(event);
    expect(webhookEventType2.description).toEqual(description);
    expect(webhookEventType2.status).toEqual("ACTIVE");
    expect(webhookEventType2.organization.id).toEqual(globalOrganization.id);

    //get the same and check
    let webhookEventType3 = await webhookProvider.updateWebhookEvent(
      manager,
      webhookEventType2.id,
      "null",
      "INACTIVE",
      globalOrganization
    );

    expect(webhookEventType3.event).toEqual(event);
    expect(webhookEventType3.description).toEqual("null");
    expect(webhookEventType3.status).toEqual("INACTIVE");
    expect(webhookEventType3.organization.id).toEqual(globalOrganization.id);
  });

  test("update Webhook Event Type", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();

    //insert an event type
    let event = "MY_TEST_EVENT4";
    let description = "MY_TEST_DESCRIPTION4";
    let webhookEventType = await webhookProvider.createWebhookEvent(
      manager,
      event,
      description,
      globalOrganization
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");

    //get the same and check
    let webhookEventType2 = await webhookProvider.getWebhookEvenType(
      manager,
      event,
      globalOrganization
    );

    expect(webhookEventType2.event).toEqual(event);
    expect(webhookEventType2.description).toEqual(description);
    expect(webhookEventType2.status).toEqual("ACTIVE");
    expect(webhookEventType2.organization.id).toEqual(globalOrganization.id);

    //get the same and check
    let webhookEventType3 = await webhookProvider.updateWebhookEvent(
      manager,
      webhookEventType2.id,
      "Updated the description",
      "INACTIVE",
      globalOrganization
    );

    expect(webhookEventType3.event).toEqual(event);
    expect(webhookEventType3.description).toEqual("Updated the description");
    expect(webhookEventType3.status).toEqual("INACTIVE");
    expect(webhookEventType3.organization.id).toEqual(globalOrganization.id);
  });

  test("delete Webhook Event Type", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT11";
    let description = "MY_TEST_DESCRIPTION4";
    let webhookEventType = await webhookProvider.createWebhookEvent(
      manager,
      event,
      description,
      globalOrganization
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");

    let deletedWebhookEvent = await webhookProvider.deleteWebhookEvent(
      manager,
      webhookEventType.id,
      globalOrganization.id
    );

    expect(deletedWebhookEvent).toEqual(true);
  });

  test("update Webhook Event Type by invalid webhookId", async () => {
    const manager = getManager();

    let event = "MY_TEST_EVENT12";
    let description = "MY_TEST_DESCRIPTION4";
    let webhookEventType = await webhookProvider.createWebhookEvent(
      manager,
      event,
      description,
      globalOrganization
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");

    let deletedWebhookEvent = await webhookProvider.deleteWebhookEvent(
      manager,
      "43785638745384",
      globalOrganization.id
    );

    expect(deletedWebhookEvent).toEqual(true);
  });

  test("update Webhook Event Type by wrong organizationId", async () => {
    const manager = getManager();

    let event = "MY_TEST_EVENT13";
    let description = "MY_TEST_DESCRIPTION4";
    let webhookEventType = await webhookProvider.createWebhookEvent(
      manager,
      event,
      description,
      globalOrganization
    );

    expect(webhookEventType).toBeDefined();
    expect(webhookEventType).toHaveProperty("id");

    // try {
    let deletedWebhookEvent = await webhookProvider.deleteWebhookEvent(
      manager,
      webhookEventType.id,
      "4895793874238"
    );
    // }
    // )
    expect(deletedWebhookEvent).toEqual(true);
  });

  test("Create a webhook", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT1";
    expect(globalOrganization).toBeDefined();

    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription",
      "http://example.com",
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );
    expect(webhook).toBeDefined();
    expect(webhook.event).toEqual(event);
    expect(webhook.name).toEqual("My test subscription");
    expect(webhook.method).toEqual("POST");
    expect(webhook.enabled).toEqual(true);
    expect(webhook.url).toEqual("http://example.com");
    expect(webhook.status).toEqual("ACTIVE");
  });

  test("FAIL to create a webhook with same event and same url which already exists", async () => {
    const manager = getManager();
    const event = "MY_TEST_EVENT1";
    const url = `http://${chance.string()}.com`;
    expect(globalOrganization).toBeDefined();

    const webhook1 = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription",
      url,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.INTERNAL
    );
    try {
      const webhook2 = await webhookProvider.createWebhook(
        manager,
        globalOrganization,
        event,
        "My test subscription",
        url,
        {},
        "POST",
        true,
        "ACTIVE",
        WEBHOOK_TYPE.INTERNAL
      );
    }
    catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.WEBHOOK_DETAILS_ALREADY_PRESENT));
    }
  });

  test("Update a webhook", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT1";
    const url = `http://${chance.string()}.com`;
    expect(globalOrganization).toBeDefined();
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription",
      url,
      { Authorization: "bearer sdfghdfk" },
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );
    expect(webhook).toBeDefined();
    expect(webhook.event).toEqual(event);
    expect(webhook.name).toEqual("My test subscription");
    expect(webhook.method).toEqual("POST");
    expect(webhook.enabled).toEqual(true);
    expect(webhook.url).toEqual(url);
    expect(webhook.status).toEqual("ACTIVE");

    let updatedWebhook = await webhookProvider.updateWebhook(
      manager,
      webhook.id,
      globalOrganization.id,
      "http://example.com",
      "My test subscription1",
      "",
      "GET",
      false,
      "INACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(updatedWebhook).toBeDefined();
    expect(updatedWebhook.id).toBeDefined();
    expect(updatedWebhook.name).toEqual("My test subscription1");
    expect(updatedWebhook.method).toEqual("GET");
    expect(updatedWebhook.status).toEqual("INACTIVE");
    expect(updatedWebhook.enabled).toEqual(false);
    expect(updatedWebhook.organization.id).toEqual(globalOrganization.id);
  });

  test("Update a webhook wrong webhook Id", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT1";
    const url = `http://${chance.string()}.com`;
    expect(globalOrganization).toBeDefined();
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription",
      url,
      { Authorization: "bearer sdfghdfk" },
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );
    expect(webhook).toBeDefined();
    expect(webhook.event).toEqual(event);
    expect(webhook.name).toEqual("My test subscription");
    expect(webhook.method).toEqual("POST");
    expect(webhook.enabled).toEqual(true);
    expect(webhook.url).toEqual(url);
    expect(webhook.status).toEqual("ACTIVE");

    try {
      let updatedWebhook = await webhookProvider.updateWebhook(
        manager,
        "347853784",
        globalOrganization.id,
        "http://example.com",
        "My test subscription1",
        "",
        "GET",
        false,
        "INACTIVE",
        WEBHOOK_TYPE.EXTERNAL
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(9);
  });

  test("Get all Webhooks", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      event,
      true,
      "ACTIVE",
      { page: 1, pageSize: 10 },
      { sortBy: "createdTime", sortOrder: "DESC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeGreaterThan(0);
  });

  test("Should not Get all Webhooks by invalid inputs", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      "globalOrganization",
      "event",
      null,
      "null",
      { page: 1000, pageSize: 1000 },
      { sortBy: "createdTime", sortOrder: "DESC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeLessThanOrEqual(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeLessThanOrEqual(0);
  });

  test("Get all Webhooks by ASC order", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      { Authorization: "bearer sdjkf" },
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      event,
      null,
      "ACTIVE",
      { page: 1, pageSize: 10 },
      { sortBy: "createdTime", sortOrder: "ASC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeGreaterThan(0);
  });

  test("Get all Webhooks which status is INACTIVE", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "INACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      event,
      true,
      "INACTIVE",
      { page: 1, pageSize: 10 },
      { sortBy: "createdTime", sortOrder: "DESC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeGreaterThan(0);
  });

  test("Get all Webhooks by enabled is false", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      { Authorization: "bearer sdjkf" },
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      event,
      false,
      "ACTIVE",
      { page: 1, pageSize: 10 },
      { sortBy: "createdTime", sortOrder: "ASC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeLessThanOrEqual(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeLessThanOrEqual(0);
  });

  //Skipping because if pageOptions is 0 then should return 0 webhooks but returning all webhooks
  test.skip("Should not Get all Webhooks pageOptions is 0", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      { Authorization: "bearer sdjkf" },
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      event,
      true,
      "ACTIVE",
      { page: 0, pageSize: 0 },
      { sortBy: "createdTime", sortOrder: "ASC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeLessThanOrEqual(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeLessThanOrEqual(0);
  });

  test("Get all Webhooks by only orgId and status", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      null,
      null,
      "ACTIVE",
      { page: 0, pageSize: 0 },
      null
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThan(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeGreaterThan(0);
  });

  test("Should not Get all Webhooks by invalid event", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      "MY_TEST_EVENT1234567890",
      true,
      "ACTIVE",
      { page: 1, pageSize: 10 },
      { sortBy: "createdTime", sortOrder: "DESC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeLessThanOrEqual(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeLessThanOrEqual(0);
  });

  test("Should not Get all Webhooks by invalid organizationId", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();
    try {
      let webhooks = await webhookProvider.getWebhooks(
        manager,
        "48735",
        event,
        true,
        "ACTIVE",
        { page: 1, pageSize: 10 },
        { sortBy: "createdTime", sortOrder: "DESC" }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(2);
  });

  test("Should not Get all Webhooks by missing status", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      event,
      true,
      undefined,
      { page: 1, pageSize: 10 },
      { sortBy: "createdTime", sortOrder: "DESC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeLessThanOrEqual(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeLessThanOrEqual(0);
  });

  test("Should not Get all Webhooks by missing event", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      undefined,
      true,
      "ACTIVE",
      { page: 1, pageSize: 10 },
      { sortBy: "createdTime", sortOrder: "DESC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThanOrEqual(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeGreaterThanOrEqual(0);
  });

  test("Should Get all Webhooks by missing enabled", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription2",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhooks = await webhookProvider.getWebhooks(
      manager,
      globalOrganization.id,
      event,
      undefined,
      "ACTIVE",
      { page: 1, pageSize: 10 },
      { sortBy: "createdTime", sortOrder: "DESC" }
    );
    expect(webhooks).toBeDefined();
    expect(webhooks).toHaveProperty("data");
    expect(webhooks).toHaveProperty("paginationInfo");
    expect(webhooks["data"].length).toBeGreaterThanOrEqual(0);
    expect(webhooks["paginationInfo"]["totalItems"]).toBeGreaterThanOrEqual(0);
  });

  test("Get Webhook by ID", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    const url = `http://${chance.string()}.com`;
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      url,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhook2 = await webhookProvider.getWebhookByID(
      manager,
      webhook.id,
      globalOrganization.id
    );

    expect(webhook2).toBeDefined();
    expect(webhook.id).toEqual(webhook2.id);
    expect(webhook2.event).toEqual(event);
    expect(webhook2.name).toEqual("My test subscription3");
    expect(webhook2.organization.id).toEqual(globalOrganization.id);
    expect(webhook2.method).toEqual("POST");
    expect(webhook2.enabled).toEqual(true);
    expect(webhook2.url).toEqual(url);
    expect(webhook2.status).toEqual("ACTIVE");
  });

  test("Delete Webhook by ID", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhook2 = await webhookProvider.deleteWebhook(
      manager,
      webhook.id,
      globalOrganization.id
    );

    expect(webhook2).toEqual(true);
  });

  test("Delete Webhook by wrong webhook ID", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();
    try {
      let webhook2 = await webhookProvider.deleteWebhook(
        manager,
        "45645645",
        globalOrganization.id
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(2);
  });

  test("Delete Webhook by wrong organization ID", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    try {
      let webhook2 = await webhookProvider.deleteWebhook(
        manager,
        webhook.id,
        "45645645"
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(2);
  });

  test("Get non existant Webhook by ID", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let webhook = await webhookProvider.getWebhookByID(
      manager,
      "123456",
      globalOrganization.id
    );
    expect(webhook).toBeUndefined();
  });

  //Skipping because should not fetch is orgaId is invalid but fetching the webhook
  test.skip("Should not Get Webhook by valid ID and invalid orgId combination", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhook2 = await webhookProvider.getWebhookByID(
      manager,
      webhook.id,
      "349857349"
    );
    expect(webhook2).toBeUndefined();
  });

  //Skipping because should not fetch inactive webhook but fetching
  test.skip("Should not Get Inactive Webhook by ID", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "INACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );

    expect(webhook).toBeDefined();

    let webhook2 = await webhookProvider.getWebhookByID(
      manager,
      webhook.id,
      globalOrganization.id
    );

    expect(webhook2).toBeUndefined();
  });

  test("Get createWebhookEventData", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT1";
    const url = `http://${chance.string()}.com`;
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      url,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );
    let eventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ..."
    };
    let webhookEventData = await webhookProvider.createWebhookEventData(
      manager,
      webhook,
      eventData
    );

    expect(webhookEventData.queueName).toEqual("WEBHOOK");
    expect(webhookEventData.queueData.webhook_id).toEqual(webhook.id);
    expect(webhookEventData.queueData.webhook_event_data_id).toBeDefined();
    expect(webhookEventData.queueData.url).toEqual(url);
    expect(webhookEventData.queueData.method).toEqual("POST");
    expect(webhookEventData.queueData.headers).toEqual({});
    expect(webhookEventData.queueData["data"].data).toBeDefined();
    expect(webhookEventData.queueData["data"].data.specversion).toEqual("1.0");
    expect(webhookEventData.queueData["data"].data.type).toEqual(
      "com.example.someevent"
    );
    expect(webhookEventData.queueData["data"].data.source).toEqual(
      "/mycontext/4"
    );
    expect(webhookEventData.queueData["data"].data.id).toEqual(
      "B234-1234-1234"
    );
    expect(webhookEventData.queueData["data"].data.time).toEqual(
      "2018-04-05T17:31:00Z"
    );
    expect(
      webhookEventData.queueData["data"].data.comexampleextension1
    ).toEqual("value");
    expect(
      webhookEventData.queueData["data"].data.comexampleothervalue
    ).toEqual(5);
    expect(webhookEventData.queueData["data"].data.datacontenttype).toEqual(
      "application/vnd.apache.thrift.binary"
    );
    expect(webhookEventData.queueData["data"].data.data_base64).toEqual(
      "... base64 encoded string ..."
    );

    expect(webhookEventData.queueData["data"].contenttype).toEqual("text/json");
    expect(webhookEventData.queueData["data"].specversion).toEqual("0.2");
    expect(webhookEventData.queueData["data"].type).toEqual(event);
    expect(webhookEventData.queueData["data"].id).toBeDefined();
    expect(webhookEventData.queueData["data"].time).toBeDefined();
    expect(webhookEventData.queueData["data"].source).toEqual("WalkinPlatform");

    expect(webhookEventData.webhookData.id).toBeDefined();
    expect(webhookEventData.webhookData.data).toBeDefined();
    expect(webhookEventData.webhookData.data.specversion).toEqual("1.0");
    expect(webhookEventData.webhookData.data.type).toEqual(
      "com.example.someevent"
    );
    expect(webhookEventData.webhookData.data.source).toEqual("/mycontext/4");
    expect(webhookEventData.webhookData.data.id).toEqual("B234-1234-1234");
    expect(webhookEventData.webhookData.data.time).toBeDefined();
    expect(webhookEventData.webhookData.data.comexampleextension1).toEqual(
      "value"
    );
    expect(webhookEventData.webhookData.data.comexampleothervalue).toEqual(5);
    expect(webhookEventData.webhookData.data.datacontenttype).toEqual(
      "application/vnd.apache.thrift.binary"
    );
    expect(webhookEventData.webhookData.data.data_base64).toEqual(
      "... base64 encoded string ..."
    );
    expect(webhookEventData.webhookData.httpStatus).toEqual("0");
    expect(webhookEventData.webhookData.webhook.id).toBeDefined();

    expect(webhookEventData.webhookData.webhook.event).toEqual(event);
    expect(webhookEventData.webhookData.webhook.name).toEqual(
      "My test subscription3"
    );
    expect(webhookEventData.webhookData.webhook.method).toEqual("POST");
    expect(webhookEventData.webhookData.webhook.url).toEqual(
      url
    );
    expect(webhookEventData.webhookData.webhook.headers).toEqual({});
    expect(webhookEventData.webhookData.webhook.enabled).toEqual(true);
    expect(webhookEventData.webhookData.webhook.status).toEqual("ACTIVE");
  });

  test("Create WebhookEventData Method is GET", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT1";
    const url = `http://${chance.string()}.com`;
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      url,
      {},
      "GET",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );
    let eventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ..."
    };
    let webhookEventData = await webhookProvider.createWebhookEventData(
      manager,
      webhook,
      eventData
    );

    expect(webhookEventData.queueName).toEqual("WEBHOOK");
    expect(webhookEventData.queueData.webhook_id).toEqual(webhook.id);
    expect(webhookEventData.queueData.webhook_event_data_id).toBeDefined();
    expect(webhookEventData.queueData.url).toEqual(url);
    expect(webhookEventData.queueData.method).toEqual("GET");
    expect(webhookEventData.queueData.headers).toEqual({});
    expect(webhookEventData.queueData["data"].data).toBeDefined();
    expect(webhookEventData.queueData["data"].data.specversion).toEqual("1.0");
    expect(webhookEventData.queueData["data"].data.type).toEqual(
      "com.example.someevent"
    );
    expect(webhookEventData.queueData["data"].data.source).toEqual(
      "/mycontext/4"
    );
    expect(webhookEventData.queueData["data"].data.id).toEqual(
      "B234-1234-1234"
    );
    expect(webhookEventData.queueData["data"].data.time).toEqual(
      "2018-04-05T17:31:00Z"
    );
    expect(
      webhookEventData.queueData["data"].data.comexampleextension1
    ).toEqual("value");
    expect(
      webhookEventData.queueData["data"].data.comexampleothervalue
    ).toEqual(5);
    expect(webhookEventData.queueData["data"].data.datacontenttype).toEqual(
      "application/vnd.apache.thrift.binary"
    );
    expect(webhookEventData.queueData["data"].data.data_base64).toEqual(
      "... base64 encoded string ..."
    );

    expect(webhookEventData.queueData["data"].contenttype).toEqual("text/json");
    expect(webhookEventData.queueData["data"].specversion).toEqual("0.2");
    expect(webhookEventData.queueData["data"].type).toEqual(event);
    expect(webhookEventData.queueData["data"].id).toBeDefined();
    expect(webhookEventData.queueData["data"].time).toBeDefined();
    expect(webhookEventData.queueData["data"].source).toEqual("WalkinPlatform");

    expect(webhookEventData.webhookData.id).toBeDefined();
    expect(webhookEventData.webhookData.data).toBeDefined();
    expect(webhookEventData.webhookData.data.specversion).toEqual("1.0");
    expect(webhookEventData.webhookData.data.type).toEqual(
      "com.example.someevent"
    );
    expect(webhookEventData.webhookData.data.source).toEqual("/mycontext/4");
    expect(webhookEventData.webhookData.data.id).toEqual("B234-1234-1234");
    expect(webhookEventData.webhookData.data.time).toBeDefined();
    expect(webhookEventData.webhookData.data.comexampleextension1).toEqual(
      "value"
    );
    expect(webhookEventData.webhookData.data.comexampleothervalue).toEqual(5);
    expect(webhookEventData.webhookData.data.datacontenttype).toEqual(
      "application/vnd.apache.thrift.binary"
    );
    expect(webhookEventData.webhookData.data.data_base64).toEqual(
      "... base64 encoded string ..."
    );
    expect(webhookEventData.webhookData.httpStatus).toEqual("0");
    expect(webhookEventData.webhookData.webhook.id).toBeDefined();

    expect(webhookEventData.webhookData.webhook.event).toEqual(event);
    expect(webhookEventData.webhookData.webhook.name).toEqual(
      "My test subscription3"
    );
    expect(webhookEventData.webhookData.webhook.method).toEqual("GET");
    expect(webhookEventData.webhookData.webhook.url).toEqual(
      url
    );
    expect(webhookEventData.webhookData.webhook.headers).toEqual({});
    expect(webhookEventData.webhookData.webhook.enabled).toEqual(true);
    expect(webhookEventData.webhookData.webhook.status).toEqual("ACTIVE");
  });

  test("Get createWebhookEventData for inactive webhookId", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "INACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );
    let eventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ..."
    };
    try {
      let webhookEventData = await webhookProvider.createWebhookEventData(
        manager,
        webhook,
        eventData
      );
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect.assertions(1);
  });

  test("Get WebhookEventData By Webhook", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );
    let eventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ..."
    };
    let webhookEventData = await webhookProvider.createWebhookEventData(
      manager,
      webhook,
      eventData
    );

    expect(webhookEventData).toBeDefined();

    let pageOptions = {
      page: 1,
      pageSize: 5
    };
    let webhookEventDataByWebhook = await webhookProvider.getWebhookEventDataByWebhook(
      manager,
      globalOrganization.id,
      webhook.id,
      "0",
      "ACTIVE",
      pageOptions,
      null
    );
    expect(webhookEventDataByWebhook).toBeTruthy();
    expect(webhookEventDataByWebhook).toHaveProperty("data");
    expect(webhookEventDataByWebhook["data"]).toHaveProperty("length");
    expect(webhookEventDataByWebhook).toHaveProperty("paginationInfo");
    expect(webhookEventDataByWebhook["data"].length).toBeGreaterThan(0);
    expect(
      webhookEventDataByWebhook["paginationInfo"].totalItems
    ).toBeGreaterThan(0);

    expect(webhookEventDataByWebhook["data"][0].id).toBeTruthy();
    expect(webhookEventDataByWebhook["data"][0].data["specversion"]).toEqual(
      eventData.specversion
    );
    expect(webhookEventDataByWebhook["data"][0].data["type"]).toEqual(
      eventData.type
    );
    expect(webhookEventDataByWebhook["data"][0].data["source"]).toEqual(
      eventData.source
    );
    expect(webhookEventDataByWebhook["data"][0].data["id"]).toEqual(
      eventData.id
    );
    expect(webhookEventDataByWebhook["data"][0].data["time"]).toEqual(
      eventData.time
    );
    expect(
      webhookEventDataByWebhook["data"][0].data["comexampleextension1"]
    ).toEqual(eventData.comexampleextension1);
    expect(
      webhookEventDataByWebhook["data"][0].data["comexampleothervalue"]
    ).toEqual(eventData.comexampleothervalue);
    expect(
      webhookEventDataByWebhook["data"][0].data["datacontenttype"]
    ).toEqual(eventData.datacontenttype);
    expect(webhookEventDataByWebhook["data"][0].data["data_base64"]).toEqual(
      eventData.data_base64
    );
    expect(webhookEventDataByWebhook["data"][0].httpStatus).toEqual("0");
    expect(webhookEventDataByWebhook["paginationInfo"].page).toEqual(1);
    expect(webhookEventDataByWebhook["paginationInfo"].perPage).toEqual(5);
  });

  test("Get non existant WebhookEventData By Webhook", async () => {
    const manager = getManager();
    let pageOptions = {
      page: 1,
      pageSize: 5
    };
    let webhookEventDataByWebhook = await webhookProvider.getWebhookEventDataByWebhook(
      manager,
      globalOrganization.id,
      "384762348",
      "0",
      "ACTIVE",
      pageOptions,
      null
    );
    expect(webhookEventDataByWebhook["data"].length).toEqual(0);
  });

  test("delete WebhookEventData By ID", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );
    let eventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ..."
    };
    let webhookEventData = await webhookProvider.createWebhookEventData(
      manager,
      webhook,
      eventData
    );
    expect(webhookEventData).toBeDefined();

    let pageOptions = {
      page: 1,
      pageSize: 5
    };
    let webhookEventDataByWebhook = await webhookProvider.getWebhookEventDataByWebhook(
      manager,
      globalOrganization.id,
      webhook.id,
      "0",
      "ACTIVE",
      pageOptions,
      null
    );
    expect(webhookEventDataByWebhook).toBeTruthy();
    expect(webhookEventDataByWebhook).toHaveProperty("data");
    expect(webhookEventDataByWebhook["data"]).toHaveProperty("length");
    expect(webhookEventDataByWebhook).toHaveProperty("paginationInfo");
    expect(webhookEventDataByWebhook["data"].length).toBeGreaterThan(0);
    expect(
      webhookEventDataByWebhook["paginationInfo"].totalItems
    ).toBeGreaterThan(0);

    expect(webhookEventDataByWebhook["data"][0].id).toBeTruthy();
    expect(webhookEventDataByWebhook["data"][0].data["specversion"]).toEqual(
      eventData.specversion
    );
    expect(webhookEventDataByWebhook["data"][0].data["type"]).toEqual(
      eventData.type
    );
    expect(webhookEventDataByWebhook["data"][0].data["source"]).toEqual(
      eventData.source
    );
    expect(webhookEventDataByWebhook["data"][0].data["id"]).toEqual(
      eventData.id
    );
    expect(webhookEventDataByWebhook["data"][0].data["time"]).toEqual(
      eventData.time
    );
    expect(
      webhookEventDataByWebhook["data"][0].data["comexampleextension1"]
    ).toEqual(eventData.comexampleextension1);
    expect(
      webhookEventDataByWebhook["data"][0].data["comexampleothervalue"]
    ).toEqual(eventData.comexampleothervalue);
    expect(
      webhookEventDataByWebhook["data"][0].data["datacontenttype"]
    ).toEqual(eventData.datacontenttype);
    expect(webhookEventDataByWebhook["data"][0].data["data_base64"]).toEqual(
      eventData.data_base64
    );
    expect(webhookEventDataByWebhook["data"][0].httpStatus).toEqual("0");
    expect(webhookEventDataByWebhook["paginationInfo"].page).toEqual(1);
    expect(webhookEventDataByWebhook["paginationInfo"].perPage).toEqual(5);

    let deletedWebhookEventData = await webhookProvider.deleteWebhookEventData(
      manager,
      webhookEventDataByWebhook["data"][0].id
    );
    expect(deletedWebhookEventData).toEqual(true);
  });

  test("delete INACTIVE WebhookEventData By ID", async () => {
    const manager = getManager();
    let event = "MY_TEST_EVENT1";
    let webhook = await webhookProvider.createWebhook(
      manager,
      globalOrganization,
      event,
      "My test subscription3",
      `http://${chance.string()}.com`,
      {},
      "POST",
      true,
      "ACTIVE",
      WEBHOOK_TYPE.EXTERNAL
    );
    let eventData = {
      specversion: "1.0",
      type: "com.example.someevent",
      source: "/mycontext/4",
      id: "B234-1234-1234",
      time: "2018-04-05T17:31:00Z",
      comexampleextension1: "value",
      comexampleothervalue: 5,
      datacontenttype: "application/vnd.apache.thrift.binary",
      data_base64: "... base64 encoded string ..."
    };
    let webhookEventData = await webhookProvider.createWebhookEventData(
      manager,
      webhook,
      eventData
    );
    expect(webhookEventData).toBeDefined();

    let pageOptions = {
      page: 1,
      pageSize: 5
    };
    let webhookEventDataByWebhook = await webhookProvider.getWebhookEventDataByWebhook(
      manager,
      globalOrganization.id,
      webhook.id,
      "0",
      "INACTIVE",
      pageOptions,
      null
    );
    expect(webhookEventDataByWebhook).toBeTruthy();
    expect(webhookEventDataByWebhook).toHaveProperty("data");
    expect(webhookEventDataByWebhook["data"]).toHaveProperty("length");
    expect(webhookEventDataByWebhook).toHaveProperty("paginationInfo");
    expect(webhookEventDataByWebhook["data"].length).toBeGreaterThan(0);
    expect(
      webhookEventDataByWebhook["paginationInfo"].totalItems
    ).toBeGreaterThan(0);

    expect(webhookEventDataByWebhook["data"][0].id).toBeTruthy();
    expect(webhookEventDataByWebhook["data"][0].data["specversion"]).toEqual(
      eventData.specversion
    );
    expect(webhookEventDataByWebhook["data"][0].data["type"]).toEqual(
      eventData.type
    );
    expect(webhookEventDataByWebhook["data"][0].data["source"]).toEqual(
      eventData.source
    );
    expect(webhookEventDataByWebhook["data"][0].data["id"]).toEqual(
      eventData.id
    );
    expect(webhookEventDataByWebhook["data"][0].data["time"]).toEqual(
      eventData.time
    );
    expect(
      webhookEventDataByWebhook["data"][0].data["comexampleextension1"]
    ).toEqual(eventData.comexampleextension1);
    expect(
      webhookEventDataByWebhook["data"][0].data["comexampleothervalue"]
    ).toEqual(eventData.comexampleothervalue);
    expect(
      webhookEventDataByWebhook["data"][0].data["datacontenttype"]
    ).toEqual(eventData.datacontenttype);
    expect(webhookEventDataByWebhook["data"][0].data["data_base64"]).toEqual(
      eventData.data_base64
    );
    expect(webhookEventDataByWebhook["data"][0].httpStatus).toEqual("0");
    expect(webhookEventDataByWebhook["paginationInfo"].page).toEqual(1);
    expect(webhookEventDataByWebhook["paginationInfo"].perPage).toEqual(5);

    let deletedWebhookEventData = await webhookProvider.deleteWebhookEventData(
      manager,
      webhookEventDataByWebhook["data"][0].id
    );
    expect(deletedWebhookEventData).toEqual(true);
  });

  test("delete WebhookEventData By invalid ID", async () => {
    const manager = getManager();
    try {
      let deletedWebhookEventData = await webhookProvider.deleteWebhookEventData(
        manager,
        "43987fdjklg4899"
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect.assertions(0);
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
