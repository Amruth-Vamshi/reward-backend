// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ChargeTypeProvider } from "../chargeType.providers";
import { resolvers } from "../chargeType.resolvers";
import { ChargeModule } from "../chargeType.module";
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
    const chargeType = await resolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: name,
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );
    expect(chargeType).toBeDefined();
    expect(chargeType.name).toBe(name);
  });
});

describe("Update a ChargeType", () => {
  test("should update a ChargeType with valid info", async () => {
    const manager = getManager();
    const name = chance.string();
    const chargeType = await resolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: name,
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );
    const updatedName = chance.string();
    const updatedChargeType = await resolvers.Mutation.updateChargeType(
      { user },
      {
        input: {
          id: chargeType.id,
          name: updatedName
        }
      },
      { injector: ChargeModule.injector }
    );

    expect(updatedChargeType).toBeDefined();
    expect(updatedChargeType.name).toBe(updatedName);
  });

  test("should throw an error for udating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();

    try {
      const updatedChargeType = await resolvers.Mutation.updateChargeType(
        { user },
        {
          input: {
            id: chance.guid(),
            name: updatedName
          }
        },
        { injector: ChargeModule.injector }
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
    const chargeType = await resolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: name,
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const getChargeType = await resolvers.Query.chargeType(
      { user },
      {
        input: {
          id: chargeType.id
        }
      },
      { injector: ChargeModule.injector }
    );
    expect(getChargeType).toBeDefined();
    expect(getChargeType.name).toBe(name);
    expect(getChargeType.id).toBe(chargeType.id);
  });

  test("should throw an error ofr invalid ChargeType", async () => {
    const manager = getManager();
    try {
      const getChargeType = await resolvers.Query.chargeType(
        { user },
        {
          input: {
            id: chance.guid()
          }
        },
        { injector: ChargeModule.injector }
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

    const deleteChargeType = await resolvers.Mutation.deleteChargeType(
      { user },
      { id: chargeType.id },
      { injector: ChargeModule.injector }
    );
    expect(deleteChargeType).toBe(true);
  });

  test("should throw an error for deleting a invalid ChargeType", async () => {
    const manager = getManager();
    try {
      const deleteChargeType = await resolvers.Mutation.deleteChargeType(
        { user },
        { id: chance.guid() },
        { injector: ChargeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND));
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
