import * as CoreEntities from "../../../entity";
import {
  closeUnitTestConnection,
  createUnitTestConnection,
  getAdminUser,
} from "../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { EntityExtendProvider } from "../entityExtend.providers";
import { entityExtendModule } from "../entityExtend.module";
import { Chance } from "chance";
import { ENTITY_TYPE, EXTEND_ENTITIES } from "../../common/constants/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import * as resolvers from "../entityExtend.resolvers";
import { WalkinError } from "../../common/exceptions/walkin-platform-error";
let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const entityExtend: EntityExtendProvider = entityExtendModule.injector.get(
  EntityExtendProvider
);

describe.skip("Should fetch the basic entity extend fields", () => {
  test("Should fetch jwt info from root and not decode", async () => {
    const allEntityField = await resolvers.default.Query.basicFields(
      { user },
      { entityName: EXTEND_ENTITIES.customer },
      { injector: entityExtendModule.injector }
    );
    expect(allEntityField).toBeInstanceOf(Array);
  });

  test("fetch all entity extend values", async () => {
    const allEntityField = await resolvers.default.Query.basicFields(
      { user },
      { entityName: EXTEND_ENTITIES.customer },
      { injector: entityExtendModule.injector }
    );
    expect(allEntityField).toBeInstanceOf(Array);
  });
});

describe("Fetch all the entities", () => {
  test("Should fetch jwt info from root and not decode", async () => {
    const allEntities = await resolvers.default.Query.entities(
      { user },
      {},
      { injector: entityExtendModule.injector }
    );
    expect(allEntities).toBeInstanceOf(Array);
  });

  test("fetch all entities", async () => {
    const allEntityField = await resolvers.default.Query.entities(
      { user },
      {},
      { injector: entityExtendModule.injector }
    );
    expect(allEntityField).toBeInstanceOf(Array);
  });
});

describe("Add a new entity extend field", () => {
  test("JWT info should be fetched from root", async () => {
    const organizationId = user.organization.id;
    const entityName = Chance().name();
    const description = Chance().word();
    const addedEntityExtend = await resolvers.default.Mutation.addEntityExtend(
      { user },
      {
        input: {
          organization_id: organizationId,
          entity_name: entityName,
          description: description,
        },
      },
      { injector: entityExtendModule.injector }
    );
    expect(addedEntityExtend.entityName).toBe(entityName);
    expect(addedEntityExtend.description).toBe(description);
  });
  test("Add a new entity extend", async () => {
    const organizationId = user.organization.id;
    const entityName = Chance().name();
    const description = Chance().word();
    const addedEntityExtend = await resolvers.default.Mutation.addEntityExtend(
      { user },
      {
        input: {
          organization_id: organizationId,
          entity_name: entityName,
          description: description,
        },
      },
      { injector: entityExtendModule.injector }
    );
    expect(addedEntityExtend.entityName).toBe(entityName);
    expect(addedEntityExtend.description).toBe(description);
  });
});

describe("Should add a new entity extend fields", () => {
  test("addEntityExtendField", async () => {
    const organizationId = user.organization.id;
    const entityName = EXTEND_ENTITIES.organization;
    const description = Chance().word();
    const addedEntityExtend = await resolvers.default.Mutation.addEntityExtend(
      { user },
      {
        input: {
          organization_id: organizationId,
          entity_name: entityName,
          description: description,
        },
      },
      { injector: entityExtendModule.injector }
    );
    expect(addedEntityExtend.entityName).toBe(entityName);
    expect(addedEntityExtend.description).toBe(description);
    const options = {
      entityExtendId: addedEntityExtend.id,
      slug: Chance().word(),
      label: Chance().word(),
      help: Chance().word(),
      type: "SHORT_TEXT",
      required: Chance().bool(),
      choices: Chance().word(),
      defaultValue: Chance().word(),
      validator: Chance().word(),
      description: Chance().word(),
      searchable: Chance().bool(),
    };

    const entityExtendFields = await resolvers.default.Mutation.addEntityExtendField(
      { user },
      {
        input: {
          ...options,
        },
      },
      { injector: entityExtendModule.injector }
    );
    expect(entityExtendFields.label).toBe(options.label);
    expect(entityExtendFields.required).toBe(options.required);
  });

  test("addEntityExtendField - for non existing entity extend", async () => {
    const organizationId = user.organization.id;
    // Wrong entityExtendId
    const options = {
      entityExtendId: Chance().word(),
      slug: Chance().word(),
      label: Chance().word(),
      help: Chance().word(),
      type: "SHORT_TEXT",
      required: Chance().bool(),
      choices: Chance().word(),
      defaultValue: Chance().word(),
      validator: Chance().word(),
      description: Chance().word(),
      searchable: Chance().bool(),
    };

    try {
      const entityExtendFields = await resolvers.default.Mutation.addEntityExtendField(
        { user },
        {
          input: {
            ...options,
          },
        },
        { injector: entityExtendModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WalkinError);
    }

    expect.assertions(1);
  });

  test("addEntityExtendField - Duplicate slug", async () => {
    const organizationId = user.organization.id;
    const entityName = EXTEND_ENTITIES.category;
    const description = Chance().word();
    const addedEntityExtend = await resolvers.default.Mutation.addEntityExtend(
      { user },
      {
        input: {
          organization_id: organizationId,
          entity_name: entityName,
          description: description,
        },
      },
      { injector: entityExtendModule.injector }
    );
    expect(addedEntityExtend.entityName).toBe(entityName);
    expect(addedEntityExtend.description).toBe(description);
    const options = {
      entityExtendId: addedEntityExtend.id,
      slug: Chance().word(),
      label: Chance().word(),
      help: Chance().word(),
      type: "SHORT_TEXT",
      required: Chance().bool(),
      choices: Chance().word(),
      defaultValue: Chance().word(),
      validator: Chance().word(),
      description: Chance().word(),
      searchable: Chance().bool(),
    };

    const entityExtendFields = await resolvers.default.Mutation.addEntityExtendField(
      { user },
      {
        input: {
          ...options,
        },
      },
      { injector: entityExtendModule.injector }
    );
    expect(entityExtendFields.label).toBe(options.label);
    expect(entityExtendFields.required).toBe(options.required);
    expect(entityExtendFields.searchable).toBe(options.searchable);
    try {
      const entityExtendFields2 = await resolvers.default.Mutation.addEntityExtendField(
        { user },
        {
          input: {
            ...options,
          },
        },
        { injector: entityExtendModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    expect.assertions(5);
  });
});

describe("Should fetch entity extend by name", () => {
  test("entityExtendByName", async () => {
    const organizationId = user.organization.id;
    const entityName = Chance().word();
    const description = Chance().word();
    const addedEntityExtend = await resolvers.default.Mutation.addEntityExtend(
      { user },
      {
        input: {
          organization_id: organizationId,
          entity_name: entityName,
          description: description,
        },
      },
      { injector: entityExtendModule.injector }
    );
    expect(addedEntityExtend.entityName).toBe(entityName);
    expect(addedEntityExtend.description).toBe(description);
    const entityExtend = await resolvers.default.Query.entityExtendByName(
      { user },
      {
        entityName: entityName,
      },
      { injector: entityExtendModule.injector }
    );
    expect(entityExtend.entityName).toBe(entityName);
    expect(entityExtend.description).toBe(description);
  });

  test("Fetch entity extend by Name", async () => {
    const organizationId = user.organization.id;
    const entityName = Chance().word();
    const description = Chance().word();
    const addedEntityExtend = await resolvers.default.Mutation.addEntityExtend(
      { user },
      {
        input: {
          organization_id: organizationId,
          entity_name: entityName,
          description: description,
        },
      },
      { injector: entityExtendModule.injector }
    );
    expect(addedEntityExtend.entityName).toBe(entityName);
    expect(addedEntityExtend.description).toBe(description);
    const entityExtend = await resolvers.default.Query.entityExtendByName(
      { user },
      {
        entityName: entityName,
      },
      { injector: entityExtendModule.injector }
    );
    expect(entityExtend.entityName).toBe(entityName);
    expect(entityExtend.description).toBe(description);
  });

  test("Fetch entity extend by invalid Name", async () => {
    const organizationId = user.organization.id;
    const entityName = Chance().name();

    try {
      const entityExtend = await resolvers.default.Query.entityExtendByName(
        { user },
        {
          entityName: entityName,
        },
        { injector: entityExtendModule.injector }
      );
      expect(entityExtend).toBeUndefined();
    } catch (error) {
      //expect(error).toBeInstanceOf(WalkinError);
    }
    expect.assertions(1);
  });
});

describe("Should fetch Entity Extend Fields", () => {
  test("Query: entityExtendField - Fetch Entity Extend field", async () => {
    const organizationId = user.organization.id;
    const entityName = EXTEND_ENTITIES.customer;
    const description = Chance().word();
    const addedEntityExtend = await resolvers.default.Mutation.addEntityExtend(
      { user },
      {
        input: {
          organization_id: organizationId,
          entity_name: entityName,
          description: description,
        },
      },
      { injector: entityExtendModule.injector }
    );
    expect(addedEntityExtend.entityName).toBe(entityName);
    expect(addedEntityExtend.description).toBe(description);
    const options = {
      entityExtendId: addedEntityExtend.id,
      slug: Chance().word(),
      label: Chance().word(),
      help: Chance().word(),
      type: "SHORT_TEXT",
      required: Chance().bool(),
      choices: Chance().word(),
      defaultValue: Chance().word(),
      validator: Chance().word(),
      description: Chance().word(),
      searchable: Chance().bool(),
    };

    const entityExtendFields = await resolvers.default.Mutation.addEntityExtendField(
      { user },
      {
        input: {
          ...options,
        },
      },
      { injector: entityExtendModule.injector }
    );
    const FetchExtityExtendFields: any = await resolvers.default.Query.entityExtendField(
      { user },
      {
        id: entityExtendFields.id,
      },
      { injector: entityExtendModule.injector }
    );
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
