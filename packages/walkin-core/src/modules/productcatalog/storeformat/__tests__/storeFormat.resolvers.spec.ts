// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { StoreFormatProvider } from "../storeFormat.providers";
import { StoreFormatModule } from "../storeFormat.module";
import resolvers from "../storeFormat.resolvers";
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
  const application = null;

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

    const taxType = await createCustomTaxType(manager);
    const storeFormatCode = chance.string({ length: 5 });

    const createStoreFormat = await resolvers.Mutation.createStoreFormat(
      { user, application },
      {
        input: {
          name,
          description: "",
          storeFormatCode,
          taxTypeCodes: [taxType.taxTypeCode],
          organizationId: user.organization.id,
          status: STATUS.ACTIVE
        }
      },
      { injector: StoreFormatModule.injector }
    );

    expect(createStoreFormat.storeFormatCode).toBe(storeFormatCode);
  });
  test("should create storeFormat with incorrect inputs", async () => {
    const name = chance.guid();
    const storeFormatCode = chance.string({ length: 5 });
    try {
      await resolvers.Mutation.createStoreFormat(
        { user, application },
        {
          input: {
            name,
            description: "",
            storeFormatCode,
            taxTypeCodes: [chance.string()],
            organizationId: user.organization.id,
            status: STATUS.ACTIVE
          }
        },
        { injector: StoreFormatModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND));
    }
  });

  test("should update a storeFormat with valid info", async () => {
    const manager = getManager();
    const name = chance.string();

    const taxType = await createCustomTaxType(manager);
    const storeFormatCode = chance.string({ length: 5 });

    const createStoreFormat = await resolvers.Mutation.createStoreFormat(
      { user, application },
      {
        input: {
          name,
          description: "",
          storeFormatCode,
          taxTypeCodes: [taxType.taxTypeCode],
          organizationId: user.organization.id,
          status: STATUS.ACTIVE
        }
      },
      { injector: StoreFormatModule.injector }
    );
    const updatedName = chance.string();
    const updatedStoreFormat = await resolvers.Mutation.updateStoreFormat(
      { user, application },
      {
        id: createStoreFormat.id,
        input: {
          name: updatedName
        }
      },
      { injector: StoreFormatModule.injector }
    );

    expect(updatedStoreFormat.name).toBe(updatedName);
  });

  test("should throw an error for udating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();
    try {
      const updateChannel = await resolvers.Mutation.updateStoreFormat(
        { user, application },
        {
          input: {
            id: chance.guid(),
            name: updatedName
          }
        },
        { injector: StoreFormatModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND)
      );
    }
  });

  test("should be able to fech a valid storeFormat", async () => {
    const manager = getManager();
    const name = chance.string();

    const taxType = await createCustomTaxType(manager);
    const storeFormatCode = chance.string({ length: 5 });

    const createdStoreFormat = await resolvers.Mutation.createStoreFormat(
      { user, application },
      {
        input: {
          name,
          storeFormatCode,
          taxTypeCodes: [taxType.taxTypeCode],
          organizationId: user.organization.id,
          status: STATUS.ACTIVE
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const getStoreFormat = await resolvers.Query.storeFormat(
      { user, application },
      {
        id: createdStoreFormat.id
      },
      { injector: StoreFormatModule.injector }
    );
    expect(getStoreFormat).toBeDefined();
    expect(getStoreFormat.name).toBe(name);
  });

  test("should throw an error ofr invalid storeFormat", async () => {
    const manager = getManager();

    try {
      const getStoreFormat = await resolvers.Query.storeFormat(
        { user, application },
        {
          input: {
            id: chance.guid()
          }
        },
        { injector: StoreFormatModule.injector }
      );
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
