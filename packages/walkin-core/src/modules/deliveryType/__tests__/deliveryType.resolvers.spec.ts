import { getManager, getConnection, EntityManager } from "typeorm";

import { DeliveryTypeModule } from "../deliveryType.module";
import { resolvers as deliveryTypeResolver } from "../deliveryType.resolvers";
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

describe("Should Create a Delivery", () => {
  test("should Create a Delivery with valid input", async () => {
    const manager = getManager();
    const Delivery = {
      name: chance.string({ length: 10 }),
      code: chance.string({ length: 5 })
    };
    const createDelivery = await deliveryTypeResolver.Mutation.addDeliveryType(
      { user },
      { input: Delivery },
      {
        injector: DeliveryTypeModule.injector
      }
    );
    expect(createDelivery).toBeDefined();
    expect(createDelivery.name).toBe(Delivery.name);
    expect(createDelivery.code).toBe(Delivery.code);
  });

  test("should Fail to create with duplicate Delivery type", async () => {
    const manager = getManager();
    const delivery = {
      name: chance.string({ length: 10 }),
      code: chance.string({ length: 5 })
    };
    const createDelivery = await deliveryTypeResolver.Mutation.addDeliveryType(
      { user },
      { input: delivery },
      {
        injector: DeliveryTypeModule.injector
      }
    );
    try {
      const createdelivery1 = await deliveryTypeResolver.Mutation.addDeliveryType(
        { user },
        { input: delivery },
        {
          injector: DeliveryTypeModule.injector
        }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should update a delivery type", () => {
  test("should update with vaid input", async () => {
    const manager = getManager();
    const delivery = {
      name: chance.string({ length: 10 }),
      code: chance.string({ length: 9 })
    };
    const createdelivery = await deliveryTypeResolver.Mutation.addDeliveryType(
      { user },
      { input: delivery },
      {
        injector: DeliveryTypeModule.injector
      }
    );

    const updatedSchema = {
      id: createdelivery.id,
      name: chance.string()
    };
    const updateSchema = await deliveryTypeResolver.Mutation.updateDeliveryType(
      { user },
      { input: updatedSchema },
      { injector: DeliveryTypeModule.injector }
    );
    expect(updateSchema).toBeDefined();
    expect(updateSchema.id).toBe(updatedSchema.id);
    expect(updateSchema.name).toBe(updatedSchema.name);
  });

  test("should fail to update with duplicate delivery type", async () => {
    const manager = getManager();
    const delivery = {
      name: chance.string({ length: 5 }),
      code: chance.string({ length: 6 })
    };
    const createdelivery = await deliveryTypeResolver.Mutation.addDeliveryType(
      { user },
      { input: delivery },
      {
        injector: DeliveryTypeModule.injector
      }
    );
    const delivery2 = {
      name: chance.string({ length: 4 }),
      code: chance.string({ length: 6 })
    };
    const createdelivery2 = await deliveryTypeResolver.Mutation.addDeliveryType(
      { user },
      { input: delivery2 },
      {
        injector: DeliveryTypeModule.injector
      }
    );

    const updatedSchema = {
      id: createdelivery.id,
      code: delivery2.code
    };
    try {
      const updateSchema = await deliveryTypeResolver.Mutation.updateDeliveryType(
        { user },
        { input: updatedSchema },
        { injector: DeliveryTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should remove a delivery", () => {
  test("should remove a delivery with valid input", async () => {
    const manager = getManager();
    const delivery = {
      name: chance.string({ length: 5 }),
      code: chance.string({ lenth: 3 })
    };
    const createdelivery = await deliveryTypeResolver.Mutation.addDeliveryType(
      { user },
      { input: delivery },
      {
        injector: DeliveryTypeModule.injector
      }
    );
    const removeddelivery = await deliveryTypeResolver.Mutation.removeDeliveryType(
      { user },
      {
        input: {
          id: createdelivery.id
        }
      },
      { injector: DeliveryTypeModule.injector }
    );
    expect(removeddelivery).toBeDefined();
    expect(removeddelivery.name).toBe(createdelivery.name);
  });

  test("should fail to remove delivery with invalid input", async () => {
    const manager = getManager();
    try {
      await deliveryTypeResolver.Mutation.removeDeliveryType(
        { user },
        {
          input: {
            id: chance.guid()
          }
        },
        { injector: DeliveryTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_NOT_FOUND)
      );
    }
  });
});

describe("Should fetch a delivery", () => {
  test("should fetch a delivery for valid input", async () => {
    const manager = getManager();
    const delivery = {
      name: chance.string({ length: 5 }),
      code: chance.string({ length: 4 })
    };
    const createdelivery = await deliveryTypeResolver.Mutation.addDeliveryType(
      { user },
      { input: delivery },
      {
        injector: DeliveryTypeModule.injector
      }
    );
    const fetchdelivery = await deliveryTypeResolver.Query.getDeliveryType(
      { user },
      {
        filter: {
          id: createdelivery.id
        }
      },
      { injector: DeliveryTypeModule.injector }
    );
    expect(fetchdelivery).toBeDefined();
    expect(fetchdelivery.id).toBe(createdelivery.id);
    expect(fetchdelivery.code).toBe(createdelivery.code);
  });
  test("should fail to fetch a invalid delivery", async () => {
    const manager = getManager();
    try {
      const fetchdelivery = await deliveryTypeResolver.Query.getDeliveryType(
        { user },
        {
          filter: {
            id: chance.guid()
          }
        },
        { injector: DeliveryTypeModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_NOT_FOUND)
      );
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
