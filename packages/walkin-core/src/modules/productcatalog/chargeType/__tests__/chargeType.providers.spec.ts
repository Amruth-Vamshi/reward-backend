// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ChargeTypeProvider } from "../chargeType.providers";
import { ChargeModule } from "../chargeType.module";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { CACHING_KEYS, STATUS } from "../../../common/constants";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { getValueFromCache } from "../../../common/utils/redisUtils";
let user: WCoreEntities.User;
let customerForCustomerDeviceTests: WCoreEntities.Customer;
var chance = new Chance();

const chargeTypeProvider: ChargeTypeProvider = ChargeModule.injector.get(
  ChargeTypeProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create Charge Type", () => {
  test("should create ChargeType with correct inputs", async () => {
    const manager = getManager();
    const name = chance.string();
    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: name,
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );
    expect(chargeType).toBeDefined();
    expect(chargeType.name).toBe(name);
  });
  test("should create ChargeType with incorrect inputs", async () => {
    const manager = getManager();
    const name = chance.guid();
    try {
      const chargeType = await chargeTypeProvider.createChargeType(
        manager,
        {
          name: name,
          chargeTypeCode: chance.string()
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

describe("Update a ChargeType", () => {
  test("should update a ChargeType with valid info", async () => {
    const manager = getManager();
    const name = chance.string();
    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: name,
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );
    const updatedName = chance.string();
    const updatedChargeType = await chargeTypeProvider.updateChargeType(
      manager,
      {
        id: chargeType.id,
        name: updatedName
      },
      user.organization.id
    );

    const cacheKey = `${CACHING_KEYS.CHARGE_TYPE}_${chargeType.id}`;
    const cacheValue = await getValueFromCache(cacheKey);

    expect(updatedChargeType).toBeDefined();
    expect(updatedChargeType.name).toBe(updatedName);
    expect(cacheValue).toBeNull();
  });

  test("should throw an error for udating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();

    try {
      const updatedChargeType = await chargeTypeProvider.updateChargeType(
        manager,
        {
          id: chance.guid(),
          name: updatedName
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND));
    }
  });
});

describe("Should fetch a ChargeType", () => {
  test("should be able to fech a valid ChargeType", async () => {
    const manager = getManager();
    const name = chance.string();
    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: name,
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const getChargeType = await chargeTypeProvider.getChargeType(
      manager,
      {
        id: chargeType.id
      },
      user.organization.id
    );
    expect(getChargeType).toBeDefined();
    expect(getChargeType.name).toBe(name);
    expect(getChargeType.id).toBe(chargeType.id);
  });

  test("should throw an error ofr invalid ChargeType", async () => {
    const manager = getManager();
    try {
      const getChargeType = await chargeTypeProvider.getChargeType(
        manager,
        {
          id: chance.guid()
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND));
    }
  });
});

describe("Should be able to delete a ChargeType ", () => {
  test("Delete a valid ChargeType ", async () => {
    const manager = getManager();
    const name = chance.string();
    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: name,
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const deleteChargeType = await chargeTypeProvider.deleteChargeType(
      manager,
      chargeType.id,
      user.organization.id
    );

    const cacheKey = `${CACHING_KEYS.CHARGE_TYPE}_${chargeType.id}`;
    const cacheValue = await getValueFromCache(cacheKey);
    expect(deleteChargeType).toBe(true);
    expect(cacheValue).toBeNull();
  });

  test("should throw an error for deleting a invalid ChargeType", async () => {
    const manager = getManager();
    try {
      const deleteChargeType = await chargeTypeProvider.deleteChargeType(
        manager,
        chance.guid(),
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND));
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
