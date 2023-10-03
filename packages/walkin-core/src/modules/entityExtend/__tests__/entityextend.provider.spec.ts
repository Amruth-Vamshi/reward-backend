import * as CoreEntities from "../../../entity";
import {
  closeUnitTestConnection,
  createUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { EntityExtendProvider } from "../entityExtend.providers";
import { entityExtendModule } from "../entityExtend.module";
import { Chance } from "chance";
import {
  CACHING_KEYS,
  ENTITY_TYPE,
  EXTEND_ENTITIES,
  STATUS
} from "../../common/constants/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { Organizations } from "../../account/organization/organization.providers";

import {
  OrganizationTypeEnum,
  Status,
  Organization
} from "../../../graphql/generated-models";
import { WalkinError } from "../../common/exceptions/walkin-platform-error";
import { getValueFromCache } from "../../common/utils/redisUtils";

let user: CoreEntities.User;
let organizationProvider: Organizations;
let globalOrganization: any;

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  const manager = getManager();
  organizationProvider = new Organizations();

  globalOrganization = await organizationProvider.createOrganization(manager, {
    code: Chance().string(),
    name: "TEST_ORG",
    organizationType: OrganizationTypeEnum.Organization,
    status: Status.Active
  });
  ({ user } = await getAdminUser(getConnection()));
});

const entityExtendProvider: EntityExtendProvider = entityExtendModule.injector.get(
  EntityExtendProvider
);

describe("EntityExtendProvider Basic Tests", () => {
  test("getEntities", async () => {
    const entityManager = getManager();
    const entityExtends = await entityExtendProvider.getEntities(
      entityManager,
      globalOrganization.id
    );
    expect(entityExtends).toContain("Customer");
    expect(entityExtends).toContain("Organization");
  });

  test("getBasicFields for Customer", async () => {
    const entityManager = getManager();
    const entityFields = await entityExtendProvider.getBasicFields(
      entityManager,
      EXTEND_ENTITIES.customer
    );
    expect(entityFields.length).toBeGreaterThan(0);
  });

  test("getEntityExtendByEntityName - non existent", async () => {
    const entityManager = getManager();
    const entityFields = await entityExtendProvider.getEntityExtendByEntityName(
      entityManager,
      EXTEND_ENTITIES.customer,
      globalOrganization.id
    );
    expect(entityFields).toBeUndefined();
  });

  test("createEntityExtend", async () => {
    const entityManager = getManager();
    const createEntity = await entityExtendProvider.createEntityExtend(
      entityManager,
      globalOrganization.id,
      EXTEND_ENTITIES.customer,
      "entity for customer"
    );

    const key = `${CACHING_KEYS.ENTITY_EXTEND}_${createEntity.entityName}_${createEntity.organization.id}`;
    const entityValueFromCache = await getValueFromCache(key);

    expect(createEntity.entityName).toBe(EXTEND_ENTITIES.customer);
    expect(createEntity.id).toBeDefined();
    expect(entityValueFromCache).toBeNull();
  });

  test("getEntityExtendByName", async () => {
    const entityManager = getManager();
    const entityExtend1 = await entityExtendProvider.getEntityExtendByName(
      entityManager,
      EXTEND_ENTITIES.customer,
      globalOrganization.id
    );
    expect(entityExtend1.entityName).toBe(EXTEND_ENTITIES.customer);
  });

  test("getEntityExtendByEntityName", async () => {
    const entityManager = getManager();
    const entityExtend1 = await entityExtendProvider.getEntityExtendByEntityName(
      entityManager,
      globalOrganization.id,
      EXTEND_ENTITIES.customer
    );
    expect(entityExtend1.entityName).toBe(EXTEND_ENTITIES.customer);
  });

  test("createEntityExtendField", async () => {
    const entityManager = getManager();
    const entityExtend1 = await entityExtendProvider.getEntityExtendByName(
      entityManager,
      EXTEND_ENTITIES.customer,
      globalOrganization.id
    );
    expect(entityExtend1.entityName).toBe(EXTEND_ENTITIES.customer);

    const options = {
      entityExtendId: entityExtend1.id,
      slug: "name",
      label: Chance().string(),
      help: Chance().string(),
      type: Chance().string(),
      required: Chance().bool(),
      choices: [Chance().string()],
      defaultValue: Chance().string(),
      validator: Chance().string(),
      description: Chance().string(),
      searchable: Chance().bool()
    };

    const createEntityField = await entityExtendProvider.createEntityExtendField(
      entityManager,
      options.entityExtendId,
      options.slug,
      options.label,
      options.help,
      options.type,
      options.required,
      options.choices,
      options.defaultValue,
      options.validator,
      options.description,
      options.searchable
    );

    expect(createEntityField.slug).toBe(options.slug);
    expect(createEntityField.label).toBe(options.label);
    expect(createEntityField.type).toBe(options.type);
    expect(createEntityField.searchable).toBe(options.searchable);
  });

  test("createEntityExtendField - for an entty which does not exists", async () => {
    const entityManager = getManager();
    const options = {
      entityExtendId: "12345",
      slug: Chance().string(),
      label: Chance().string(),
      help: Chance().string(),
      type: Chance().string(),
      required: Chance().bool(),
      choices: [Chance().string()],
      defaultValue: Chance().string(),
      validator: Chance().string(),
      description: Chance().string(),
      searchable: Chance().bool()
    };

    try {
      const createEntityField = await entityExtendProvider.createEntityExtendField(
        entityManager,
        options.entityExtendId,
        options.slug,
        options.label,
        options.help,
        options.type,
        options.required,
        options.choices,
        options.defaultValue,
        options.validator,
        options.description,
        options.searchable
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WalkinError);
    }

    expect.assertions(1);
  });

  test("createEntityExtendField - With duplicate slug", async () => {
    const entityManager = getManager();
    const entityExtend1 = await entityExtendProvider.getEntityExtendByName(
      entityManager,
      EXTEND_ENTITIES.customer,
      globalOrganization.id
    );
    expect(entityExtend1.entityName).toBe(EXTEND_ENTITIES.customer);

    const options = {
      entityExtendId: entityExtend1.id,
      slug: "name",
      label: Chance().string(),
      help: Chance().string(),
      type: Chance().string(),
      required: Chance().bool(),
      choices: [Chance().string()],
      defaultValue: Chance().string(),
      validator: Chance().string(),
      description: Chance().string(),
      searchable: Chance().bool()
    };

    try {
      const createEntityField = await entityExtendProvider.createEntityExtendField(
        entityManager,
        options.entityExtendId,
        options.slug,
        options.label,
        options.help,
        options.type,
        options.required,
        options.choices,
        options.defaultValue,
        options.validator,
        options.description,
        options.searchable
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WalkinError);
    }

    expect.assertions(1);
  });

  test("getEntityExtendField - for entityExtendId which does not exists", async () => {
    const entityManager = getManager();
    const entityExtendId = Chance().guid();
    const entityExtendField = await entityExtendProvider.getEntityExtendField(
      entityManager,
      entityExtendId
    );
    expect(entityExtendField).toBeUndefined();
  });

  test("getEntityExtendField", async () => {
    const entityManager = getManager();
    const entityExtend1 = await entityExtendProvider.getEntityExtendByName(
      entityManager,
      EXTEND_ENTITIES.customer,
      globalOrganization.id
    );
    expect(entityExtend1.entityName).toBe(EXTEND_ENTITIES.customer);

    const options = {
      entityExtendId: entityExtend1.id,
      slug: "name2",
      label: Chance().string(),
      help: Chance().string(),
      type: Chance().string(),
      required: Chance().bool(),
      choices: [Chance().string()],
      defaultValue: Chance().string(),
      validator: Chance().string(),
      description: Chance().string(),
      searchable: Chance().bool()
    };

    const createEntityField = await entityExtendProvider.createEntityExtendField(
      entityManager,
      options.entityExtendId,
      options.slug,
      options.label,
      options.help,
      options.type,
      options.required,
      options.choices,
      options.defaultValue,
      options.validator,
      options.description,
      options.searchable
    );

    expect(createEntityField.slug).toBe(options.slug);
    expect(createEntityField.label).toBe(options.label);
    expect(createEntityField.type).toBe(options.type);
    expect(createEntityField.searchable).toBe(options.searchable);

    const field = await entityExtendProvider.getEntityExtendField(
      entityManager,
      createEntityField.id
    );

    expect(field.slug).toBe(options.slug);
    expect(field.label).toBe(options.label);
    expect(field.type).toBe(options.type);
  });

  test("getEntityExtendFieldsByEntityExtendId", async () => {
    const entityManager = getManager();
    const entityExtend1 = await entityExtendProvider.getEntityExtendByName(
      entityManager,
      EXTEND_ENTITIES.customer,
      globalOrganization.id
    );
    expect(entityExtend1.entityName).toBe(EXTEND_ENTITIES.customer);

    const fields = await entityExtendProvider.getEntityExtendFieldsByEntityExtendId(
      entityManager,
      entityExtend1.id
    );

    expect(fields).toBeDefined();
    expect(fields.length).toBeGreaterThan(0);
  });

  test("getEntityExtendFields", async () => {
    const entityManager = getManager();
    const entityExtend1 = await entityExtendProvider.getEntityExtendByName(
      entityManager,
      EXTEND_ENTITIES.customer,
      globalOrganization.id
    );
    expect(entityExtend1.entityName).toBe(EXTEND_ENTITIES.customer);

    const fields = await entityExtendProvider.getEntityExtendFields(
      entityManager,
      entityExtend1.id
    );

    expect(fields).toBeDefined();
    expect(fields.length).toBeGreaterThan(0);
  });

  test("getEntityExtendFields - wrong id", async () => {
    const entityManager = getManager();
    const fields = await entityExtendProvider.getEntityExtendFields(
      entityManager,
      "random_id"
    );
    expect(fields).toBeDefined();
    expect(fields.length).toBe(0);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
