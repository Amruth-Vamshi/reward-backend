// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { TaxTypeProvider } from "../taxtype.providers";
import { TaxTypeModule } from "../taxtype.module";
import resolvers from "../taxtype.resolvers";
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

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create TaxType", () => {
  const application = null;

  test("should create taxType with correct inputs", async () => {
    const taxTypeCode = chance.string({ length: 5 });

    const createTaxType = await resolvers.Mutation.createTaxType(
      { user, application },
      {
        input: {
          name: chance.string(),
          description: "",
          taxTypeCode,
          organizationId: user.organization.id,
          status: STATUS.ACTIVE
        }
      },
      { injector: TaxTypeModule.injector }
    );

    expect(createTaxType.taxTypeCode).toBe(taxTypeCode);
  });
  test("should fail to create taxType with incorrect inputs", async () => {
    const name = chance.guid();
    const taxTypeCode = chance.string();
    try {
      await resolvers.Mutation.createTaxType(
        { user, application },
        {
          input: {
            name,
            description: "",
            taxTypeCode,
            organizationId: user.organization.id,
            status: STATUS.ACTIVE
          }
        },
        { injector: TaxTypeModule.injector }
      );

      await resolvers.Mutation.createTaxType(
        { user, application },
        {
          input: {
            name,
            description: "",
            taxTypeCode,
            organizationId: user.organization.id,
            status: STATUS.ACTIVE
          }
        },
        { injector: TaxTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_UNIQUE));
    }
  });

  test("should update a taxType with valid info", async () => {
    const manager = getManager();
    const name = chance.string();

    const taxTypeCode = chance.string({ length: 5 });

    const createTaxType = await resolvers.Mutation.createTaxType(
      { user, application },
      {
        input: {
          name,
          description: "",
          taxTypeCode,
          organizationId: user.organization.id,
          status: STATUS.ACTIVE
        }
      },
      { injector: TaxTypeModule.injector }
    );
    const updatedName = chance.string();
    const updatedTaxType = await resolvers.Mutation.updateTaxType(
      { user, application },
      {
        id: createTaxType.id,
        input: {
          name: updatedName
        }
      },
      { injector: TaxTypeModule.injector }
    );

    expect(updatedTaxType.name).toBe(updatedName);
  });

  test("should throw an error for udating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();
    try {
      await resolvers.Mutation.updateTaxType(
        { user, application },
        {
          input: {
            id: chance.guid(),
            name: updatedName
          }
        },
        { injector: TaxTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND));
    }
  });

  test("should be able to fech a valid taxType", async () => {
    const manager = getManager();
    const name = chance.string();

    const taxTypeCode = chance.string({ length: 5 });

    const createdStoreFormat = await resolvers.Mutation.createTaxType(
      { user, application },
      {
        input: {
          name,
          taxTypeCode,
          organizationId: user.organization.id,
          status: STATUS.ACTIVE
        }
      },
      { injector: TaxTypeModule.injector }
    );

    const getTaxType = await resolvers.Query.taxType(
      { user, application },
      {
        id: createdStoreFormat.id
      },
      { injector: TaxTypeModule.injector }
    );
    expect(getTaxType).toBeDefined();
    expect(getTaxType.name).toBe(name);
  });

  test("should throw an error ofr invalid taxType", async () => {
    const manager = getManager();

    try {
      const getTaxType = await resolvers.Query.taxType(
        { user, application },
        {
          input: {
            id: chance.guid()
          }
        },
        { injector: TaxTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND));
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
