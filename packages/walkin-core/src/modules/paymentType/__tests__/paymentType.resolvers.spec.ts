import { getManager, getConnection, EntityManager } from "typeorm";

import { PaymentTypeModule } from "../paymentType.module";
import { resolvers as paymentTypeResolver } from "../paymentType.resolvers";
import Chance from "chance";
import * as WCoreEntities from "../../../entity";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { STATUS } from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
let user: WCoreEntities.User;
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create a paymentType", () => {
  test("should Create a paymentType with valid input", async () => {
    const manager = getManager();
    const paymentType = {
      name: chance.string(),
      code: chance.string()
    };
    const createpaymentType = await paymentTypeResolver.Mutation.addPaymentType(
      { user },
      { input: paymentType },
      {
        injector: PaymentTypeModule.injector
      }
    );
    expect(createpaymentType).toBeDefined();
    expect(createpaymentType.name).toBe(paymentType.name);
    expect(createpaymentType.code).toBe(paymentType.code);
  });

  test("should Fail to create with duplicate paymentType type", async () => {
    const manager = getManager();
    const paymentType = {
      name: chance.string(),
      code: chance.string()
    };
    const createpaymentType = await paymentTypeResolver.Mutation.addPaymentType(
      { user },
      { input: paymentType },
      {
        injector: PaymentTypeModule.injector
      }
    );
    try {
      const createpaymentType1 = await paymentTypeResolver.Mutation.addPaymentType(
        { user },
        { input: paymentType },
        {
          injector: PaymentTypeModule.injector
        }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should update a paymentType type", () => {
  test("should update with vaid input", async () => {
    const manager = getManager();
    const paymentType = {
      name: chance.string(),
      code: chance.string()
    };
    const createpaymentType = await paymentTypeResolver.Mutation.addPaymentType(
      { user },
      { input: paymentType },
      {
        injector: PaymentTypeModule.injector
      }
    );

    const updatedSchema = {
      id: createpaymentType.id,
      name: chance.string()
    };
    const updateSchema = await paymentTypeResolver.Mutation.updatePaymentType(
      { user },
      { input: updatedSchema },
      { injector: PaymentTypeModule.injector }
    );
    expect(updateSchema).toBeDefined();
    expect(updateSchema.id).toBe(updatedSchema.id);
    expect(updateSchema.name).toBe(updatedSchema.name);
  });

  test("should fail to update with duplicate paymentType type", async () => {
    const manager = getManager();
    const paymentType = {
      name: chance.string(),
      code: chance.string()
    };
    const createpaymentType = await paymentTypeResolver.Mutation.addPaymentType(
      { user },
      { input: paymentType },
      {
        injector: PaymentTypeModule.injector
      }
    );
    const paymentType2 = {
      name: chance.string(),
      code: chance.string()
    };
    const createpaymentType2 = await paymentTypeResolver.Mutation.addPaymentType(
      { user },
      { input: paymentType2 },
      {
        injector: PaymentTypeModule.injector
      }
    );

    const updatedSchema = {
      id: createpaymentType.id,
      code: paymentType2.code
    };
    try {
      const updateSchema = await paymentTypeResolver.Mutation.updatePaymentType(
        { user },
        { input: updatedSchema },
        { injector: PaymentTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should remove a paymentType", () => {
  test("should remove a paymentType with valid input", async () => {
    const manager = getManager();
    const paymentType = {
      name: chance.string(),
      code: chance.string()
    };
    const createpaymentType = await paymentTypeResolver.Mutation.addPaymentType(
      { user },
      { input: paymentType },
      {
        injector: PaymentTypeModule.injector
      }
    );
    const removedpaymentType = await paymentTypeResolver.Mutation.removePaymentType(
      { user },
      {
        input: {
          id: createpaymentType.id
        }
      },
      { injector: PaymentTypeModule.injector }
    );
    expect(removedpaymentType).toBeDefined();
    expect(removedpaymentType.name).toBe(createpaymentType.name);
  });

  test("should fail to remove paymentType with invalid input", async () => {
    const manager = getManager();
    try {
      await paymentTypeResolver.Mutation.removePaymentType(
        { user },
        {
          input: {
            id: chance.guid()
          }
        },
        { injector: PaymentTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_NOT_FOUND)
      );
    }
  });
});

describe("Should fetch a paymentType", () => {
  test("should fetch a paymentType for valid input", async () => {
    const manager = getManager();
    const paymentType = {
      name: chance.string(),
      code: chance.string()
    };
    const createpaymentType = await paymentTypeResolver.Mutation.addPaymentType(
      { user },
      { input: paymentType },
      {
        injector: PaymentTypeModule.injector
      }
    );
    const fetchpaymentType = await paymentTypeResolver.Query.getPaymentType(
      { user },
      {
        filter: {
          id: createpaymentType.id
        }
      },
      { injector: PaymentTypeModule.injector }
    );
    expect(fetchpaymentType).toBeDefined();
    expect(fetchpaymentType.id).toBe(createpaymentType.id);
    expect(fetchpaymentType.code).toBe(createpaymentType.code);
  });
  test("should fail to fetch a invalid paymentType", async () => {
    const manager = getManager();
    try {
      const fetchpaymentType = await paymentTypeResolver.Query.getPaymentType(
        { user },
        {
          filter: {
            id: chance.guid()
          }
        },
        { injector: PaymentTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_NOT_FOUND)
      );
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
