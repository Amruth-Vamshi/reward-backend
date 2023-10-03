import {
  createUnitTestConnection,
  closeUnitTestConnection,
} from "../../../../__tests__/utils/unit";
import * as WCoreEntities from "../../../entity";
import { Action } from "../action.providers";
import { Organizations } from "../../account/organization/organization.providers";
import { getManager } from "typeorm";
import {
  OrganizationTypeEnum,
  Status,
  Organization,
} from "../../../graphql/generated-models";
import { DEFAULT_PAGE_OPTIONS } from "../../common/constants";

let actionProvider: Action;
let organizationProvider: Organizations;
let globalOrganization: any;

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  actionProvider = new Action();
  organizationProvider = new Organizations();
  const manager = getManager();
  globalOrganization = await organizationProvider.createOrganization(manager, {
    code: "TEST_ORG",
    name: "TEST_ORG",
    organizationType: OrganizationTypeEnum.Organization,
    status: Status.Active,
  });
});

describe("Action Provider ", () => {
  test("Create Action Definition and execute GET action", async () => {
    const manager = getManager();

    expect(globalOrganization).toBeDefined();
    const actionName = "BASIC_GET_TEST";
    const createdActionDefinition = await actionProvider.createActionDefinition(
      manager,
      actionName,
      "GET",
      globalOrganization,
      {
        url: "https://gitlab.com/WalkIn/dummy-testcases/-/raw/master/api.json",
      },
      null,
      {},
      {},
      "ACTIVE"
    );

    // ActionDefinition result validation
    expect(createdActionDefinition).toBeDefined();
    expect(createdActionDefinition).toHaveProperty("id");
    const actionDefinitionFromDB = await actionProvider.getActionDefinition(
      manager,
      createdActionDefinition.id,
      globalOrganization.id
    );

    expect(actionDefinitionFromDB).toBeDefined();
    expect(actionDefinitionFromDB).toHaveProperty("id");
    expect(actionDefinitionFromDB.id).toEqual(createdActionDefinition.id);
    expect(actionDefinitionFromDB.name).toEqual(actionName);

    const action: any = await actionProvider.executeAction(
      manager,
      actionName,
      {},
      globalOrganization.id
    );

    // Action result validation
    expect(action).toBeDefined();
    expect(action).toHaveProperty("id");
    expect(action.id).toBeGreaterThan(0);

    // load action data from DB and validate values.
    const actionFromDB: any = await actionProvider.getAction(
      manager,
      action.id,
      globalOrganization.id
    );
    expect(actionFromDB).toBeDefined();
    expect(actionFromDB).toHaveProperty("actionDefinition");
    expect(actionFromDB.actionDefinition).toHaveProperty("id");
    expect(actionFromDB.actionDefinition.id).toEqual(
      createdActionDefinition.id
    );

    expect(actionFromDB).toHaveProperty("response");
    // Checking action executed and returned response.
    expect(actionFromDB.response).toHaveProperty("status");

    // update ActionDefinition
    createdActionDefinition.configuration = {
      url:
        "https://gitlab.com/WalkIn/dummy-testcases/-/raw/master/api_not_found.json",
    };
    const updatedActionDefintion = await actionProvider.updateActionDefinition(
      manager,
      createdActionDefinition,
      globalOrganization
    );

    expect(updatedActionDefintion).toHaveProperty("id");

    const newActionResult: any = await actionProvider.executeAction(
      manager,
      actionName,
      {},
      globalOrganization.id
    );

    // Action result validation
    expect(newActionResult).toBeDefined();
    expect(newActionResult).toHaveProperty("id");
    expect(newActionResult.id).toBeGreaterThan(0);
    console.log("newAction", newActionResult.response);
    expect(newActionResult).toHaveProperty("response");
    // Checking action executed and returned response.
    expect(newActionResult.response).toHaveProperty("status");
    expect(newActionResult.response.status).toEqual(503);
    expect(newActionResult.response).toHaveProperty("statusText");
  }, 20000);

  test("Create Action Definition and execute POST action", async () => {
    const manager = getManager();

    expect(globalOrganization).toBeDefined();
    const actionName = "BASIC_POST_TEST";
    const createdActionDefinition = await actionProvider.createActionDefinition(
      manager,
      actionName,
      "POST",
      globalOrganization,
      { url: "http://worldclockapi.com/api/json/utc/now" },
      null,
      {},
      {},
      "ACTIVE"
    );

    // ActionDefinition result validation
    expect(createdActionDefinition).toBeDefined();
    expect(createdActionDefinition).toHaveProperty("id");
    const actionDefinitionFromDB = await actionProvider.getActionDefinition(
      manager,
      createdActionDefinition.id,
      globalOrganization.id
    );

    expect(actionDefinitionFromDB).toBeDefined();
    expect(actionDefinitionFromDB).toHaveProperty("id");
    expect(actionDefinitionFromDB.id).toEqual(createdActionDefinition.id);
    expect(actionDefinitionFromDB.name).toEqual(actionName);

    const action: any = await actionProvider.executeAction(
      manager,
      actionName,
      {},
      globalOrganization.id
    );

    // Action result validation
    expect(action).toBeDefined();
    expect(action).toHaveProperty("id");
    expect(action.id).toBeGreaterThan(0);

    // load action data from DB and validate values.
    const actionFromDB: any = await actionProvider.getAction(
      manager,
      action.id,
      globalOrganization.id
    );
    expect(actionFromDB).toBeDefined();
    expect(actionFromDB).toHaveProperty("actionDefinition");
    expect(actionFromDB.actionDefinition).toHaveProperty("id");
    expect(actionFromDB.actionDefinition.id).toEqual(
      createdActionDefinition.id
    );

    expect(actionFromDB).toHaveProperty("response");
    // Checking action executed and returned response.
    // Universal time API has not POST
    expect(actionFromDB.response).toHaveProperty("status");
    // expect(actionFromDB.response.status).toEqual("ERROR");
  }, 20000);

  test("Create Action Definition and execute POST action", async () => {
    const manager = getManager();

    expect(globalOrganization).toBeDefined();
    const actionName = "BASIC_ECHO_POST_TEST";
    const createdActionDefinition = await actionProvider.createActionDefinition(
      manager,
      actionName,
      "POST",
      globalOrganization,
      { url: "https://postman-echo.com/post" },
      null,
      {},
      {},
      "ACTIVE"
    );

    // ActionDefinition result validation
    expect(createdActionDefinition).toBeDefined();
    expect(createdActionDefinition).toHaveProperty("id");
    const actionDefinitionFromDB = await actionProvider.getActionDefinition(
      manager,
      createdActionDefinition.id,
      globalOrganization.id
    );

    expect(actionDefinitionFromDB).toBeDefined();
    expect(actionDefinitionFromDB).toHaveProperty("id");
    expect(actionDefinitionFromDB.id).toEqual(createdActionDefinition.id);
    expect(actionDefinitionFromDB.name).toEqual(actionName);

    const action: any = await actionProvider.executeAction(
      manager,
      actionName,
      { payload: { a: 24 } },
      globalOrganization.id
    );

    // Action result validation
    expect(action).toBeDefined();
    expect(action).toHaveProperty("id");
    expect(action.id).toBeGreaterThan(0);

    // load action data from DB and validate values.
    const actionFromDB: any = await actionProvider.getAction(
      manager,
      action.id,
      globalOrganization.id
    );
    expect(actionFromDB).toBeDefined();
    expect(actionFromDB).toHaveProperty("actionDefinition");
    expect(actionFromDB.actionDefinition).toHaveProperty("id");
    expect(actionFromDB.actionDefinition.id).toEqual(
      createdActionDefinition.id
    );

    expect(actionFromDB).toHaveProperty("response");
    // Checking action executed and returned response.
    // Universal time API has not POST
    // expect(actionFromDB.response).toHaveProperty("json");
    // expect(actionFromDB.response.json).toHaveProperty("a");
    // expect(actionFromDB.response.json.a).toEqual(24);
  }, 20000);

  test("Disable Action Definition", async () => {
    const manager = getManager();

    expect(globalOrganization).toBeDefined();
    const actionName = "BASIC_GET_WORLD";
    const createdActionDefinition = await actionProvider.createActionDefinition(
      manager,
      actionName,
      "GET",
      globalOrganization,
      { url: "http://worldclockapi.com/api/json/utc/now" },
      null,
      {},
      {},
      "ACTIVE"
    );

    // ActionDefinition result validation
    expect(createdActionDefinition).toBeDefined();
    expect(createdActionDefinition).toHaveProperty("id");
    const getActionDefinition = await actionProvider.getActionDefinitionById(
      manager,
      createdActionDefinition.id,
      globalOrganization.id
    );

    // ActionDefinition result validation
    expect(getActionDefinition).toBeDefined();
    expect(getActionDefinition).toHaveProperty("id");

    const disableActionDefinition = await actionProvider.disableActionDefinition(
      manager,
      getActionDefinition.id,
      globalOrganization.id
    );

    // Action result validation
    expect(disableActionDefinition).toBeDefined();
    expect(disableActionDefinition).toHaveProperty("id");
    expect(disableActionDefinition.id).toBeGreaterThan(0);
    expect(disableActionDefinition).toHaveProperty("status");
    expect(disableActionDefinition.status).toEqual("INACTIVE");
  });

  test("Create Action Definition and execute AXIOS_REQUEST action", async () => {
    const manager = getManager();

    expect(globalOrganization).toBeDefined();
    const actionName = "CCD_BUILD_NUMBER_AXIOS_REQUEST_1";
    const createdActionDefinition = await actionProvider.createActionDefinition(
      manager,
      actionName,
      "AXIOS_REQUEST",
      globalOrganization,
      {
        url: "/now",
        method: "get",
        baseURL: "http://worldclockapi.com/api/json/utc",
        auth: { username: "pawanyara", password: "tvgbPhw6yV" },
      },
      null,
      {},
      {},
      "ACTIVE"
    );

    // ActionDefinition result validation
    expect(createdActionDefinition).toBeDefined();
    expect(createdActionDefinition).toHaveProperty("id");
    const actionDefinitionFromDB = await actionProvider.getActionDefinition(
      manager,
      createdActionDefinition.id,
      globalOrganization.id
    );

    expect(actionDefinitionFromDB).toBeDefined();
    expect(actionDefinitionFromDB).toHaveProperty("id");
    expect(actionDefinitionFromDB.id).toEqual(createdActionDefinition.id);
    expect(actionDefinitionFromDB.name).toEqual(actionName);

    const action: any = await actionProvider.executeAction(
      manager,
      actionName,
      {},
      globalOrganization.id
    );

    // Action result validation
    expect(action).toBeDefined();
    expect(action).toHaveProperty("id");
    expect(action.id).toBeGreaterThan(0);

    // load action data from DB and validate values.
    const actionFromDB: any = await actionProvider.getAction(
      manager,
      action.id,
      globalOrganization.id
    );
    expect(actionFromDB).toBeDefined();
    expect(actionFromDB).toHaveProperty("actionDefinition");
    expect(actionFromDB.actionDefinition).toHaveProperty("id");
    expect(actionFromDB.actionDefinition.id).toEqual(
      createdActionDefinition.id
    );

    expect(actionFromDB).toHaveProperty("response");
    // Checking action executed and returned response.
    // expect(actionFromDB.response).toHaveProperty("app");
    // expect(actionFromDB.response.app).toHaveProperty("version");
    // expect(actionFromDB.response.app.version).toEqual("1.0.0-BUILD-SNAPSHOT");

    // update ActionDefinition
    createdActionDefinition.configuration = {
      url: "/now",
      method: "get",
      baseURL: "http://worldclockapi.com/api/json/utc",
      auth: { username: "pawanyara", password: "password" },
    };
    const updatedActionDefintion = await actionProvider.updateActionDefinition(
      manager,
      createdActionDefinition,
      globalOrganization
    );

    expect(updatedActionDefintion).toHaveProperty("id");

    const newActionResult: any = await actionProvider.executeAction(
      manager,
      actionName,
      {},
      globalOrganization.id
    );

    // Action result validation
    expect(newActionResult).toBeDefined();
    expect(newActionResult).toHaveProperty("id");
    expect(newActionResult.id).toBeGreaterThan(0);

    expect(newActionResult).toHaveProperty("response");
    // Checking action executed and returned response.
    // expect(newActionResult.response).toHaveProperty("status");
    // expect(newActionResult.response.status).toEqual(401);
    // expect(newActionResult.response).toHaveProperty("statusText");
    // expect(newActionResult.response.statusText).toEqual("Unauthorized");
  });

  test("Create Action Definition and execute SCRIPT action", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    const actionName = "BASIC_SCRIPT_TEST";
    const createdActionDefinition = await actionProvider.createActionDefinition(
      manager,
      actionName,
      "SCRIPT",
      globalOrganization,
      { timeout: 10000 },
      "module.exports = function(request) {return { ...request, time: new Date()} }",
      {},
      {},
      "ACTIVE"
    );

    // ActionDefinition result validation
    expect(createdActionDefinition).toBeDefined();
    expect(createdActionDefinition).toHaveProperty("id");
    const actionDefinitionFromDB = await actionProvider.getActionDefinition(
      manager,
      createdActionDefinition.id,
      globalOrganization.id
    );

    expect(actionDefinitionFromDB).toBeDefined();
    expect(actionDefinitionFromDB).toHaveProperty("id");
    expect(actionDefinitionFromDB.id).toEqual(createdActionDefinition.id);
    expect(actionDefinitionFromDB.name).toEqual(actionName);

    const action: any = await actionProvider.executeAction(
      manager,
      actionName,
      { a: 1, b: 2, c: 3 },
      globalOrganization.id
    );

    // Action result validation
    expect(action).toBeDefined();
    expect(action).toHaveProperty("id");
    expect(action.id).toBeGreaterThan(0);

    // load action data from DB and validate values.
    const actionFromDB: any = await actionProvider.getAction(
      manager,
      action.id,
      globalOrganization.id
    );
    expect(actionFromDB).toBeDefined();
    expect(actionFromDB).toHaveProperty("actionDefinition");
    expect(actionFromDB.actionDefinition).toHaveProperty("id");
    expect(actionFromDB.actionDefinition.id).toEqual(
      createdActionDefinition.id
    );

    expect(actionFromDB).toHaveProperty("response");
    // Checking action executed and returned response.
    expect(actionFromDB.response).toHaveProperty("time");
    expect(actionFromDB.response).toHaveProperty("a");
    expect(actionFromDB.response.a).toEqual(1);
    expect(actionFromDB.response).toHaveProperty("b");
    expect(actionFromDB.response.b).toEqual(2);
    expect(actionFromDB.response).toHaveProperty("c");
    expect(actionFromDB.response.c).toEqual(3);
  });

  test("Create Action Definition and execute SCRIPT action", async () => {
    const manager = getManager();

    expect(globalOrganization).toBeDefined();
    const actionName = "BASIC_SCRIPT_RANDOM_TEST";
    const createdActionDefinition = await actionProvider.createActionDefinition(
      manager,
      actionName,
      "SCRIPT",
      globalOrganization,
      { timeout: 10000 },
      "bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZXF1ZXN0KSB7IHJldHVybiB7IC4uLnJlcXVlc3QsIHRpbWU6IG5ldyBEYXRlKCksIHJhbmRvbTogTWF0aC5yYW5kb20oKX0gfQ==",
      {},
      {},
      "ACTIVE"
    );

    // ActionDefinition result validation
    expect(createdActionDefinition).toBeDefined();
    expect(createdActionDefinition).toHaveProperty("id");
    const actionDefinitionFromDB = await actionProvider.getActionDefinition(
      manager,
      createdActionDefinition.id,
      globalOrganization.id
    );

    expect(actionDefinitionFromDB).toBeDefined();
    expect(actionDefinitionFromDB).toHaveProperty("id");
    expect(actionDefinitionFromDB.id).toEqual(createdActionDefinition.id);
    expect(actionDefinitionFromDB.name).toEqual(actionName);

    const action: any = await actionProvider.executeAction(
      manager,
      actionName,
      { a: 1, b: 2, c: 3 },
      globalOrganization.id
    );

    // Action result validation
    expect(action).toBeDefined();
    expect(action).toHaveProperty("id");
    expect(action.id).toBeGreaterThan(0);

    // load action data from DB and validate values.
    const actionFromDB: any = await actionProvider.getAction(
      manager,
      action.id,
      globalOrganization.id
    );
    expect(actionFromDB).toBeDefined();
    expect(actionFromDB).toHaveProperty("actionDefinition");
    expect(actionFromDB.actionDefinition).toHaveProperty("id");
    expect(actionFromDB.actionDefinition.id).toEqual(
      createdActionDefinition.id
    );

    expect(actionFromDB).toHaveProperty("response");
    // Checking action executed and returned response.
    expect(actionFromDB.response).toHaveProperty("time");
    expect(actionFromDB.response).toHaveProperty("random");
    expect(actionFromDB.response).toHaveProperty("a");
    expect(actionFromDB.response.a).toEqual(1);
    expect(actionFromDB.response).toHaveProperty("b");
    expect(actionFromDB.response.b).toEqual(2);
    expect(actionFromDB.response).toHaveProperty("c");
    expect(actionFromDB.response.c).toEqual(3);
  });

  test("Get all ActionDefinitions", async () => {
    const manager = getManager();

    expect(globalOrganization).toBeDefined();
    let actionDefinitionsPage = await actionProvider.getAllActionDefinitions(
      manager,
      DEFAULT_PAGE_OPTIONS,
      {
        sortBy: "id",
        sortOrder: "DESC",
      },
      globalOrganization.id,
      "BASIC_GET_TEST",
      "GET",
      "ACTIVE"
    );

    expect(actionDefinitionsPage).toBeDefined();
    expect(actionDefinitionsPage).toHaveProperty("data");
    expect(actionDefinitionsPage.data).toHaveLength(1);
  });

  test("Get all Actions", async () => {
    const manager = getManager();

    expect(globalOrganization).toBeDefined();
    let actionsPage = await actionProvider.getAllActions(
      manager,
      DEFAULT_PAGE_OPTIONS,
      {
        sortBy: "action.id",
        sortOrder: "DESC",
      },
      globalOrganization.id,
      "BASIC_GET_TEST",
      "ACTIVE"
    );

    expect(actionsPage).toBeDefined();
    expect(actionsPage).toHaveProperty("data");
    expect(actionsPage.data).toHaveProperty("length");
    expect(actionsPage.data.length).toBeGreaterThan(0);
  });

  test("Create Action Definition and execute SCRIPT action with import third party libs lodash", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();
    const actionName = "BASIC_SCRIPT_TEST_WITH_IMPORT";
    const createdActionDefinition = await actionProvider.createActionDefinition(
      manager,
      actionName,
      "SCRIPT",
      globalOrganization,
      { timeout: 10000 },
      'const _ = require("lodash"); module.exports = function(request) {return { ...request, time: new Date(), lodashVersion: _.VERSION} }',
      {},
      {},
      "ACTIVE"
    );

    // ActionDefinition result validation
    expect(createdActionDefinition).toBeDefined();
    expect(createdActionDefinition).toHaveProperty("id");
    const actionDefinitionFromDB = await actionProvider.getActionDefinition(
      manager,
      createdActionDefinition.id,
      globalOrganization.id
    );

    expect(actionDefinitionFromDB).toBeDefined();
    expect(actionDefinitionFromDB).toHaveProperty("id");
    expect(actionDefinitionFromDB.id).toEqual(createdActionDefinition.id);
    expect(actionDefinitionFromDB.name).toEqual(actionName);

    const action: any = await actionProvider.executeAction(
      manager,
      actionName,
      { a: 1, b: 2, c: 3 },
      globalOrganization.id
    );

    // Action result validation
    expect(action).toBeDefined();
    expect(action).toHaveProperty("id");
    expect(action.id).toBeGreaterThan(0);

    // load action data from DB and validate values.
    const actionFromDB: any = await actionProvider.getAction(
      manager,
      action.id,
      globalOrganization.id
    );
    expect(actionFromDB).toBeDefined();
    expect(actionFromDB).toHaveProperty("actionDefinition");
    expect(actionFromDB.actionDefinition).toHaveProperty("id");
    expect(actionFromDB.actionDefinition.id).toEqual(
      createdActionDefinition.id
    );

    expect(actionFromDB).toHaveProperty("response");
    // Checking action executed and returned response.
    expect(actionFromDB.response).toHaveProperty("time");
    expect(actionFromDB.response).toHaveProperty("a");
    expect(actionFromDB.response.a).toEqual(1);
    expect(actionFromDB.response).toHaveProperty("b");
    expect(actionFromDB.response.b).toEqual(2);
    expect(actionFromDB.response).toHaveProperty("c");
    expect(actionFromDB.response.c).toEqual(3);
    expect(actionFromDB.response).toHaveProperty("lodashVersion");
    expect(actionFromDB.response.lodashVersion).toBeDefined();
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
