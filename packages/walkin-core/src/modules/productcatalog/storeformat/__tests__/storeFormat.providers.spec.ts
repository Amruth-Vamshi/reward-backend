// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { StoreFormatProvider } from "../storeFormat.providers";
import { StoreFormatModule } from "../storeFormat.module";
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
import { TaxTypeProvider } from "../../taxtype/taxtype.providers";
import { TaxTypeModule } from "../../taxtype/taxtype.module";
let user: WCoreEntities.User;
const chance = new Chance();

const storeFormatProvider: StoreFormatProvider = StoreFormatModule.injector.get(
  StoreFormatProvider
);
const taxTypeProvider: TaxTypeProvider = TaxTypeModule.injector.get(
  TaxTypeProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create StoreFormat", () => {
  const createCustomTaxType = async manager => {
    return taxTypeProvider.createTaxType(manager, {
      name: chance.string(),
      description: "",
      taxTypeCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE
    });
  };

  test("should create storeFormat with correct inputs", async () => {
    const manager = getManager();
    const name = chance.string();
    const storeFormatCode = chance.string();

    // Create taxType
    const taxType = await createCustomTaxType(manager);

    // Create StoreFormat
    const createStoreFormat = await storeFormatProvider.createStoreFormat(
      manager,
      {
        name,
        description: "",
        status: STATUS.ACTIVE,
        storeFormatCode,
        organizationId: user.organization.id,
        taxTypeCodes: [taxType.taxTypeCode]
      }
    );

    expect(createStoreFormat.name).toBe(name);
    expect(createStoreFormat.storeFormatCode).toBe(storeFormatCode);
  });
  test("should create storeFormat with incorrect inputs", async () => {
    const manager = getManager();
    const name = chance.guid();

    // Create taxType
    const taxType = await createCustomTaxType(manager);

    taxType.taxTypeCode = chance.string();

    try {
      await storeFormatProvider.createStoreFormat(manager, {
        name,
        description: "",
        organizationId: user.organization.id,
        status: STATUS.ACTIVE,
        storeFormatCode: chance.string({ length: 5 }),
        taxTypeCodes: [chance.string({ length: 6 })]
      });
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND));
    }
  });

  test("should update a taxType with valid info", async () => {
    const manager = getManager();
    const name = chance.string();

    // Create taxType
    const taxType = await createCustomTaxType(manager);

    const storeFormatCreated = await storeFormatProvider.createStoreFormat(
      manager,
      {
        name,
        description: "",
        organizationId: user.organization.id,
        status: STATUS.ACTIVE,
        storeFormatCode: chance.string({ length: 5 }),
        taxTypeCodes: [taxType.taxTypeCode]
      }
    );
    const updatedName = chance.string();
    const updatedStoreFormat = await storeFormatProvider.updateStoreFormat(
      manager,
      {
        id: storeFormatCreated.id,
        organizationId: user.organization.id,
        status: STATUS.ACTIVE,
        name: updatedName
      }
    );

    expect(updatedStoreFormat.name).toBe(updatedName);
  });

  test("should throw an error for udating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();
    try {
      const updatedStoreFormat = await storeFormatProvider.updateStoreFormat(
        manager,
        {
          id: chance.guid(),
          name: updatedName,
          organizationId: user.organization.id
        }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND)
      );
    }
  });

  test("should be able to fetch a valid storeFormat", async () => {
    const manager = getManager();
    const name = chance.string();

    const taxType = await createCustomTaxType(manager);

    const storeFormatCreated = await storeFormatProvider.createStoreFormat(
      manager,
      {
        name,
        description: "",
        organizationId: user.organization.id,
        status: STATUS.ACTIVE,
        storeFormatCode: chance.string({ length: 5 }),
        taxTypeCodes: [taxType.taxTypeCode]
      }
    );

    const getStoreFormat = await storeFormatProvider.getStoreFormat(manager, {
      id: storeFormatCreated.id,
      organizationId: user.organization.id
    });
    expect(getStoreFormat).toBeDefined();
    expect(getStoreFormat.name).toBe(name);
  });

  test("should throw an error ofr invalid storeFormat", async () => {
    const manager = getManager();

    try {
      const getStoreFormat = await storeFormatProvider.getStoreFormat(manager, {
        id: chance.guid(),
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND)
      );
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
