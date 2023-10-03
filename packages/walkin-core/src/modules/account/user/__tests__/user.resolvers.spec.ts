import { UserModule } from "../user.module";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { getConnection, getManager } from "typeorm";
import * as CoreEntities from "../../../../entity";
import { Chance } from "chance";
import * as resolvers from "../user.resolvers";
import { Users } from "../user.providers";
import { STATUS } from "../../../common/constants";
import {
  ORGANIZATION_TYPES,
  WALKIN_PRODUCTS
} from "../../../common/constants/constants";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";

let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const chance = new Chance();

describe("createUser", () => {
  test("test createUser with valid inputs - confirmation email not set", async () => {
    const input: any = {
      email: `admin_${chance.string({ length: 3 })}@getwalk.in`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const createOrganization: any = {
      name: chance.name(),
      code: chance.word(),
      organizationType: ORGANIZATION_TYPES.ORGANIZATION,
      status: STATUS.ACTIVE
    };

    const newUser = await resolvers.default.Mutation.createUser(
      { user },
      { input, createOrganization, walkinProducts: null },
      { injector: UserModule.injector }
    );

    expect(newUser).toBeDefined();
    expect(newUser.emailConfirmed).toBe(true);
  });
  test("test createUser with valid inputs", async () => {
    const input: any = {
      email: `admin_${chance.string({ length: 3 })}@getwalk.in`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const createOrganization: any = {
      name: chance.name(),
      code: chance.word(),
      organizationType: ORGANIZATION_TYPES.ORGANIZATION,
      status: STATUS.ACTIVE
    };

    const newUser = await resolvers.default.Mutation.createUser(
      { user },
      { input, createOrganization, walkinProducts: null },
      { injector: UserModule.injector }
    );

    expect(newUser).toBeDefined();
  });

  test("test createUser with invalid email", async () => {
    const input: any = {
      email: `dummy`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const createOrganization: any = {
      name: chance.name(),
      code: chance.word(),
      organizationType: ORGANIZATION_TYPES.ORGANIZATION,
      status: STATUS.ACTIVE
    };

    const newUser = resolvers.default.Mutation.createUser(
      { user },
      { input, createOrganization, walkinProducts: null },
      { injector: UserModule.injector }
    );
    await expect(newUser).rejects.toThrowError("Error: Invalid email address");
  });

  test("test createUser with duplicate email", async () => {
    const input: any = {
      email: `admin_new@getwalk.in`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const createOrganization1: any = {
      name: chance.name(),
      code: chance.word(),
      organizationType: ORGANIZATION_TYPES.ORGANIZATION,
      status: STATUS.ACTIVE
    };

    const newUser1 = await resolvers.default.Mutation.createUser(
      { user },
      { input, createOrganization: createOrganization1, walkinProducts: null },
      { injector: UserModule.injector }
    );

    const createOrganization2: any = {
      name: chance.name(),
      code: chance.word(),
      organizationType: ORGANIZATION_TYPES.ORGANIZATION,
      status: STATUS.ACTIVE
    };

    const newUser2 = resolvers.default.Mutation.createUser(
      { user },
      { input, createOrganization: createOrganization2, walkinProducts: null },
      { injector: UserModule.injector }
    );

    await expect(newUser2).rejects.toThrowError(
      "Error: Email address is already taken, please use other address"
    );
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
