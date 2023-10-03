import { actionsModule } from "../action.module";
import * as CoreEntities from "../../../entity";
import {
  createUnitTestConnection,
  getAdminUser,
  setupI18n,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { getConnection, getManager } from "typeorm";
import { Action } from "../action.providers";
import resolvers from "../action.resolvers";
import { Chance } from "chance";
import {
  ACTION_DEFINITION_TYPE,
  STATUS,
  DEFAULT_PAGE_OPTIONS
} from "../../common/constants";
import { WalkinPlatformError } from "../../common/exceptions/walkin-platform-error";
import { STATUS_CODES } from "http";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { ApplicationProvider } from "../../account/application/application.providers";
import { ApplicationModule } from "../../account/application/application.module";

let user: CoreEntities.User;
let organizationId;
// provider is not required while testing resolver. Internally injected by graphql module.
const actionProvider: Action = actionsModule.injector.get(Action);
const chance = new Chance();

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);

beforeAll(async () => {
  setupI18n();
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  organizationId = user.organization.id;
});

describe("Action Application/API Key Resolver", () => {
  test("create Application for reuse", async () => {
    const manager = getManager();
    let application = await applicationService.createApplication(
      manager,
      organizationId,
      { name: "TEST_APPLICATION" }
    );
  });

  test("createActionDefinition resolver test", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );

    const newActionDefinition = {
      name: chance.string({ length: 8 }),
      type: ACTION_DEFINITION_TYPE.GET,
      configuration: { url: "http://worldclockapi.com/api/json/utc/now" },
      organizationId,
      code: "",
      inputSchema: {},
      outputSchema: {},
      status: "ACTIVE"
    };
    const actionDefinition = await resolvers.Mutation.createActionDefinition(
      { user: null, application },
      { input: newActionDefinition },
      { injector: actionsModule.injector }
    );

    expect(actionDefinition).toBeDefined();
    expect(actionDefinition).toHaveProperty("id");
    expect(actionDefinition.id).toBeGreaterThanOrEqual(1);

    let foundActionDefinition = await resolvers.Query.actionDefinition(
      { user: null, application },
      { id: actionDefinition.id },
      { injector: actionsModule.injector }
    );

    expect(foundActionDefinition).toBeDefined();
    expect(foundActionDefinition).toHaveProperty("id");
    expect(foundActionDefinition.id).toEqual(actionDefinition.id);
  });

  test("UpdateActionDefinition resolver test", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );

    const newActionDefinition = {
      name: chance.string({ length: 8 }),
      type: ACTION_DEFINITION_TYPE.GET,
      configuration: { url: "http://worldclockapi.com/api/json/utc/now" },
      organizationId,
      code: "",
      inputSchema: {},
      outputSchema: {},
      status: "ACTIVE"
    };
    const actionDefinition = await resolvers.Mutation.createActionDefinition(
      { user: null, application },
      { input: newActionDefinition },
      { injector: actionsModule.injector }
    );

    expect(actionDefinition).toBeDefined();
    expect(actionDefinition).toHaveProperty("id");
    expect(actionDefinition.id).toBeGreaterThanOrEqual(1);

    let updatedActionDefintion = await resolvers.Mutation.updateActionDefinition(
      { user: null, application },
      {
        input: {
          id: actionDefinition.id,
          type: ACTION_DEFINITION_TYPE.POST,
          organizationId: user.organization.id
        }
      },
      { injector: actionsModule.injector }
    );

    expect(updatedActionDefintion).toBeDefined();
    expect(updatedActionDefintion).toHaveProperty("id");
    expect(updatedActionDefintion.id).toEqual(actionDefinition.id);
    expect(updatedActionDefintion).toHaveProperty("type");
    expect(updatedActionDefintion.type).toEqual(ACTION_DEFINITION_TYPE.POST);

    try {
      await resolvers.Mutation.updateActionDefinition(
        { user: null, application },
        {
          input: {
            id: actionDefinition.id,
            type: ACTION_DEFINITION_TYPE.POST
          }
        },
        { injector: actionsModule.injector }
      );
    } catch (exception) {
      expect(exception).toEqual(
        new WalkinPlatformError(
          "INVALID_ORGANIZATION_ID",
          "Invalid organization id"
        )
      );
    }

    try {
      await resolvers.Mutation.updateActionDefinition(
        { user: null, application },
        {
          input: {
            id: actionDefinition.id,
            type: ACTION_DEFINITION_TYPE.POST,
            organizationId: 1
          }
        },
        { injector: actionsModule.injector }
      );
    } catch (exception) {
      expect(exception).toEqual(
        new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH)
      );
    }
    let inputObject = {
      id: actionDefinition.id,
      type: ACTION_DEFINITION_TYPE.POST,
      organizationId: user.organization.id,
      outputSchema: { b: 1 }
    };

    try {
      await resolvers.Mutation.updateActionDefinition(
        { user: null, application },
        {
          input: inputObject
        },
        { injector: actionsModule.injector }
      );
    } catch (exception) {
      expect(exception).toEqual(
        new WalkinPlatformError(
          "INVALID_JSON_SCHEMA",
          "Invalid json schemas",
          inputObject,
          400,
          ""
        )
      );
    }
  });

  test("executeAction resolver test", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );

    let actionDefinitionsPage = await resolvers.Query.actionDefinitions(
      { user: null, application },
      {
        sortOptions: { sortBy: "id", sortOrder: "ASC" },
        pageOptions: DEFAULT_PAGE_OPTIONS
      },
      { injector: actionsModule.injector }
    );
    expect(actionDefinitionsPage).toBeDefined();
    expect(actionDefinitionsPage).toHaveProperty("data");
    expect(actionDefinitionsPage.data.length).toBeGreaterThanOrEqual(1);
    console.log("executeAction", application.organization.id);

    for (const actionDefinition of actionDefinitionsPage.data) {
      let result = await resolvers.Mutation.executeAction(
        { user: null, application },
        {
          actionDefinitionName: actionDefinition.name,
          request: {}
        },
        {
          injector: actionsModule.injector
        }
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty("response");

      let actionFromDB = await resolvers.Query.action(
        { user: null, application },
        { id: result.id },
        { injector: actionsModule.injector }
      );
      expect(actionFromDB).toBeDefined();
      expect(actionFromDB).toHaveProperty("response");
    }
  });

  test("disableActionDefinition resolver test", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );

    let actionDefinitionsPage = await resolvers.Query.actionDefinitions(
      { user: null, application },
      {
        status: STATUS.ACTIVE,
        sortOptions: { sortBy: "id", sortOrder: "ASC" },
        pageOptions: DEFAULT_PAGE_OPTIONS
      },
      { injector: actionsModule.injector }
    );
    expect(actionDefinitionsPage).toBeDefined();
    expect(actionDefinitionsPage).toHaveProperty("data");
    expect(actionDefinitionsPage.data.length).toBeGreaterThanOrEqual(1);

    for (const actionDefinition of actionDefinitionsPage.data) {
      await resolvers.Mutation.disableActionDefinition(
        { user: null, application },
        { id: actionDefinition.id },
        { injector: actionsModule.injector }
      );

      let disabledActionDefinition = await resolvers.Query.actionDefinition(
        { user: null, application },
        { id: actionDefinition.id },
        { injector: actionsModule.injector }
      );

      expect(disabledActionDefinition).toBeDefined();
      expect(disabledActionDefinition).toHaveProperty("id");
      expect(disabledActionDefinition.id).toEqual(actionDefinition.id);
      expect(disabledActionDefinition).toHaveProperty("status");
      expect(disabledActionDefinition.status).toEqual(STATUS.INACTIVE);
    }
  });

  test("Actions resolver test", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      organizationId
    );

    let actionsPage = await resolvers.Query.actions(
      { user: null, application },
      {
        sortOptions: { sortBy: "action.id", sortOrder: "ASC" },
        pageOptions: DEFAULT_PAGE_OPTIONS,
        status: STATUS.ACTIVE
      },
      { injector: actionsModule.injector }
    );
    expect(actionsPage).toBeDefined();
    expect(actionsPage).toHaveProperty("data");
    expect(actionsPage.data.length).toBeGreaterThanOrEqual(1);

    actionsPage = await resolvers.Query.actions(
      { user: null, application },
      {
        sortOptions: { sortBy: "action.id", sortOrder: "ASC" },
        pageOptions: DEFAULT_PAGE_OPTIONS,
        status: STATUS.INACTIVE
      },
      { injector: actionsModule.injector }
    );
    expect(actionsPage).toBeDefined();
    expect(actionsPage).toHaveProperty("data");
    expect(actionsPage.data).toHaveLength(0);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
