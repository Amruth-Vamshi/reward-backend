// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { DiscountTypeProvider } from "../discountType.providers";
import { DiscountTypeModule } from "../discountType.module";
import { resolvers } from "../discountType.resolvers";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { STATUS } from "../../../common/constants";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
let user: WCoreEntities.User;
const chance = new Chance();

const discountTypeProvider: DiscountTypeProvider = DiscountTypeModule.injector.get(
  DiscountTypeProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create discount Type", () => {
  test("should create discountType with correct inputs", async () => {
    const manager = getManager();
    const name = chance.string();
    const discountType = await resolvers.Mutation.createDiscountType(
      { user },
      {
        input: {
          name,
          discountTypeCode: chance.string()
        }
      },
      { injector: DiscountTypeModule.injector }
    );
    expect(discountType).toBeDefined();
    expect(discountType.name).toBe(name);
  });
});

describe("Update a discountType", () => {
  test("should update a discountType with valid info", async () => {
    const manager = getManager();
    const name = chance.string();
    const discountType = await resolvers.Mutation.createDiscountType(
      { user },
      {
        input: {
          name,
          discountTypeCode: chance.string()
        }
      },
      { injector: DiscountTypeModule.injector }
    );
    const updatedName = chance.string();
    const updateddiscountType = await resolvers.Mutation.updateDiscountType(
      { user },
      {
        input: {
          id: discountType.id,
          name: updatedName
        }
      },
      { injector: DiscountTypeModule.injector }
    );

    expect(updateddiscountType).toBeDefined();
    expect(updateddiscountType.name).toBe(updatedName);
  });

  test("should throw an error for udating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();

    try {
      const updateddiscountType = await resolvers.Mutation.updateDiscountType(
        { user },
        {
          input: {
            id: chance.guid(),
            name: updatedName
          }
        },
        { injector: DiscountTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_NOT_FOUND)
      );
    }
  });
});

describe("Should fetch a discountType", () => {
  test("should be able to fech a valid discountType", async () => {
    const manager = getManager();
    const name = chance.string();
    const discountType = await resolvers.Mutation.createDiscountType(
      { user },
      {
        input: {
          name,
          discountTypeCode: chance.string()
        }
      },
      { injector: DiscountTypeModule.injector }
    );

    const getdiscountType = await resolvers.Query.discountType(
      { user },
      {
        input: {
          id: discountType.id
        }
      },
      { injector: DiscountTypeModule.injector }
    );
    expect(getdiscountType).toBeDefined();
    expect(getdiscountType.name).toBe(name);
    expect(getdiscountType.id).toBe(discountType.id);
  });

  test("should throw an error ofr invalid discountType", async () => {
    const manager = getManager();
    try {
      const getdiscountType = await resolvers.Query.discountType(
        { user },
        {
          input: {
            id: chance.guid()
          }
        },
        { injector: DiscountTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_NOT_FOUND)
      );
    }
  });
});

describe("Should be able to delete a discountType ", () => {
  test("Delete a valid discountType ", async () => {
    const manager = getManager();
    const name = chance.string();
    const discountType = await discountTypeProvider.createDiscountType(
      manager,
      {
        name,
        discountTypeCode: chance.string()
      },
      user.organization.id
    );

    const deletediscountType = await resolvers.Mutation.deleteDiscountType(
      { user },
      { id: discountType.id },
      { injector: DiscountTypeModule.injector }
    );
    expect(deletediscountType).toBe(true);
  });

  test("should throw an error for deleting a invalid discountType", async () => {
    const manager = getManager();
    try {
      const deletediscountType = await resolvers.Mutation.deleteDiscountType(
        { user },
        { id: chance.guid() },
        { injector: DiscountTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_NOT_FOUND)
      );
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
