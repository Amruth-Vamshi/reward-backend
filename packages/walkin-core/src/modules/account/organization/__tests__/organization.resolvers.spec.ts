import { OrganizationModule } from "../organization.module";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../../__tests__/utils/unit";
import { getConnection, getManager } from "typeorm";
import * as CoreEntities from "../../../../entity";
import { Chance } from "chance";
import * as resolvers from "../organization.resolvers";
import { Organizations } from "../organization.providers";
import {
  STATUS,
  METRIC_FILTER_TYPE,
  METRIC_TYPE,
  DB_SOURCE,
  BASIC_METRICS
} from "../../../common/constants";
import {
  ORGANIZATION_TYPES,
  WALKIN_PRODUCTS
} from "../../../common/constants/constants";
import { Mutation } from "../../../../graphql/generated-models";
// import { createOrganization } from "../../../../../../walkin-hyperx/__tests__/utils/functions";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";

let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const chance = new Chance();

describe("createOrganization", () => {
  test("test createOrganization with valid inputs", async () => {
    const organizationInput: Partial<CoreEntities.Organization> = {
      name: chance.name(),
      code: chance.word(),
      organizationType: ORGANIZATION_TYPES.ORGANIZATION,
      status: STATUS.ACTIVE
    };

    const adminUserInput: Partial<CoreEntities.User> = {
      email: `admin_${chance.string({ length: 3 })}@getwalk.in`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const organization = await resolvers.default.Mutation.createOrganization(
      { user },
      {
        organizationInput,
        parentId: null,
        walkinProducts: null,
        adminUserInput
      },
      { injector: OrganizationModule.injector }
    );

    expect(organization).toBeDefined();
  });

  test("test createOrganization with invalid admin email", async () => {
    const organizationInput: Partial<CoreEntities.Organization> = {
      name: chance.name(),
      code: chance.word(),
      organizationType: ORGANIZATION_TYPES.ORGANIZATION,
      status: STATUS.ACTIVE
    };

    const adminUserInput: Partial<CoreEntities.User> = {
      email: `dummy`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };
    const organization = resolvers.default.Mutation.createOrganization(
      { user },
      {
        organizationInput,
        parentId: null,
        walkinProducts: null,
        adminUserInput
      },
      { injector: OrganizationModule.injector }
    );
    await expect(organization).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.INVALID_EMAIL)
    );
  });

  test("test createOrganization with invalid org code", async () => {
    const organizationInput: Partial<CoreEntities.Organization> = {
      name: chance.name(),
      code: `${chance.string({ length: 3 })}& New`,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION,
      status: STATUS.ACTIVE
    };

    const adminUserInput: Partial<CoreEntities.User> = {
      email: `admin_${chance.string({ length: 3 })}@getwalk.in`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const organization = resolvers.default.Mutation.createOrganization(
      { user },
      {
        organizationInput,
        parentId: null,
        walkinProducts: null,
        adminUserInput
      },
      { injector: OrganizationModule.injector }
    );
    await expect(organization).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.INVALID_ORG_CODE)
    );
  });

  test("test createOrganization with duplicate code", async () => {
    const organizationInput: Partial<CoreEntities.Organization> = {
      name: chance.name(),
      code: `New`,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION,
      status: STATUS.ACTIVE
    };

    const adminUserInput1: Partial<CoreEntities.User> = {
      email: `admin_${chance.string({ length: 3 })}@getwalk.in`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const organization1 = await resolvers.default.Mutation.createOrganization(
      { user },
      {
        organizationInput,
        parentId: null,
        walkinProducts: null,
        adminUserInput: adminUserInput1
      },
      { injector: OrganizationModule.injector }
    );

    const adminUserInput2: Partial<CoreEntities.User> = {
      email: `admin_${chance.string({ length: 3 })}@getwalk.in`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const organization2 = resolvers.default.Mutation.createOrganization(
      { user },
      {
        organizationInput,
        parentId: null,
        walkinProducts: null,
        adminUserInput: adminUserInput2
      },
      { injector: OrganizationModule.injector }
    );

    await expect(organization2).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.ORG_CODE_EXISTS)
    );
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
