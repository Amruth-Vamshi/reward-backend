// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
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
import { TaxTypeProvider } from "../taxtype.providers";
import { TaxTypeModule } from "../taxtype.module";
import { getValueFromCache } from "../../../common/utils/redisUtils";
let user: WCoreEntities.User;
const chance = new Chance();

const taxTypeProvider: TaxTypeProvider = TaxTypeModule.injector.get(
  TaxTypeProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create StoreFormat", () => {
  const createCustomTaxType = async manager => {
    return;
  };

  test("should create taxType with correct inputs", async () => {
    const manager = getManager();
    const name = chance.string();
    const taxTypeCode = chance.string();

    // Create taxType
    const createdTaxType = await taxTypeProvider.createTaxType(manager, {
      name,
      description: "",
      taxTypeCode,
      organizationId: user.organization.id,
      status: STATUS.ACTIVE
    });
    expect(createdTaxType.name).toBe(name);
    expect(createdTaxType.taxTypeCode).toBe(taxTypeCode);
  });

  test("should update a taxType with valid info", async () => {
    const manager = getManager();
    const name = chance.string();
    const taxTypeCode = chance.string();

    // Create taxType
    const taxType = await createCustomTaxType(manager);

    const taxTypeCreated = await taxTypeProvider.createTaxType(manager, {
      name: chance.string(),
      description: "",
      taxTypeCode,
      organizationId: user.organization.id,
      status: STATUS.ACTIVE
    });
    const updatedName = chance.string();
    const updatedTaxType = await taxTypeProvider.updateTaxType(manager, {
      id: taxTypeCreated.id,
      name: updatedName,
      description: "",
      taxTypeCode,
      organizationId: user.organization.id,
      status: STATUS.ACTIVE
    });

    const key = `${CACHING_KEYS.TAX_TYPE}_${taxTypeCreated.id}`;
    const cacheValue = await getValueFromCache(key);

    expect(updatedTaxType.name).toBe(updatedName);
    expect(cacheValue).toBeNull();
  });

  test("should be able to fetch a valid taxType", async () => {
    const manager = getManager();
    const name = chance.string();

    const taxTypeCode = chance.string();

    const storeFormatCreated = await taxTypeProvider.createTaxType(manager, {
      name,
      description: "",
      taxTypeCode,
      organizationId: user.organization.id,
      status: STATUS.ACTIVE
    });

    const getTaxtype = await taxTypeProvider.getTaxType(manager, {
      id: storeFormatCreated.id,
      organizationId: user.organization.id
    });
    expect(getTaxtype).toBeDefined();
    expect(getTaxtype.name).toBe(name);
  });

  test("should throw an error for invalid taxType", async () => {
    const manager = getManager();

    try {
      await taxTypeProvider.getTaxType(manager, {
        id: chance.guid(),
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND));
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
