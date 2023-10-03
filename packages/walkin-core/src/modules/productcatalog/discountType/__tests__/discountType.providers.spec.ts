// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { DiscountTypeProvider } from "../discountType.providers";
import { DiscountTypeModule } from "../discountType.module";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection,
} from "../../../../../__tests__/utils/unit";
import { CACHING_KEYS, STATUS } from "../../../common/constants";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { getValueFromCache } from "../../../common/utils/redisUtils";
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
    const discountType = await discountTypeProvider.createDiscountType(
      manager,
      {
        name,
        discountTypeCode: chance.string(),
      },
      user.organization.id
    );
    expect(discountType).toBeDefined();
    expect(discountType.name).toBe(name);
  });
  test("should create discountType with incorrect inputs", async () => {
    const manager = getManager();
    const name = chance.guid();
    try {
      const discountType = await discountTypeProvider.createDiscountType(
        manager,
        {
          name,
          discountTypeCode: chance.string(),
        },
        chance.guid()
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND)
      );
    }
  });
});

describe("Update a discountType", () => {
  test("should update a discountType with valid info", async () => {
    const manager = getManager();
    const name = chance.string();
    const discountType = await discountTypeProvider.createDiscountType(
      manager,
      {
        name,
        discountTypeCode: chance.string(),
      },
      user.organization.id
    );
    const updatedName = chance.string();
    const updateddiscountType = await discountTypeProvider.updateDiscountType(
      manager,
      {
        id: discountType.id,
        name: updatedName,
      },
      user.organization.id
    );

    const cacheKey = `${CACHING_KEYS.DISCOUNT_TYPE}_${discountType.id}`;
    const cacheValue = await getValueFromCache(cacheKey);

    expect(updateddiscountType).toBeDefined();
    expect(updateddiscountType.name).toBe(updatedName);
    expect(cacheValue).toBeNull();
  });

  test("should throw an error for udating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();

    try {
      const updateddiscountType = await discountTypeProvider.updateDiscountType(
        manager,
        {
          id: chance.guid(),
          name: updatedName,
        },
        user.organization.id
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
    const discountType = await discountTypeProvider.createDiscountType(
      manager,
      {
        name,
        discountTypeCode: chance.string(),
      },
      user.organization.id
    );

    const getdiscountType = await discountTypeProvider.getDiscountType(
      manager,
      {
        id: discountType.id,
      },
      user.organization.id
    );
    expect(getdiscountType).toBeDefined();
    expect(getdiscountType.name).toBe(name);
    expect(getdiscountType.id).toBe(discountType.id);
  });

  test("should return an empty array for invalid discount type", async () => {
    const manager = getManager();
    const name = chance.string();
    const discountType = await discountTypeProvider.createDiscountType(
      manager,
      {
        name,
        discountTypeCode: chance.string(),
      },
      user.organization.id
    );

    const getdiscountTypes = await discountTypeProvider.getDiscountTypeForOrganization(
      manager,
      {
        discountTypeCode: [chance.string()],
      },
      user.organization.id
    );
    expect(getdiscountTypes).toBeDefined();
    expect(getdiscountTypes.length).toBe(0);
  });
  test("should throw an error ofr invalid discountType", async () => {
    const manager = getManager();
    try {
      const getdiscountType = await discountTypeProvider.getDiscountType(
        manager,
        {
          id: chance.guid(),
        },
        user.organization.id
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
        discountTypeCode: chance.string(),
      },
      user.organization.id
    );

    const deletediscountType = await discountTypeProvider.deleteDiscountType(
      manager,
      discountType.id,
      user.organization.id
    );

    const cacheKey = `${CACHING_KEYS.DISCOUNT_TYPE}_${discountType.id}`;
    const cacheValue = await getValueFromCache(cacheKey);
    expect(deletediscountType).toBe(true);
    expect(cacheValue).toBeNull();
  });

  test("should throw an error for deleting a invalid discountType", async () => {
    const manager = getManager();
    try {
      const deletediscountType = await discountTypeProvider.deleteDiscountType(
        manager,
        chance.guid(),
        user.organization.id
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
