import { getManager, getConnection, EntityManager } from "typeorm";
import { DeliveryTypeProvider } from "../deliveryType.providers";
import { DeliveryTypeModule } from "../deliveryType.module";
import Chance from "chance";
import * as WCoreEntities from "../../../entity";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { STATUS, PARTNER_TYPE } from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
let user: WCoreEntities.User;
const chance = new Chance();

const deliveryTypeProvider: DeliveryTypeProvider = DeliveryTypeModule.injector.get(
  DeliveryTypeProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create a Delivery", () => {
  test("should Create a Delivery with valid input", async () => {
    const manager = getManager();
    const Delivery = {
      name: chance.string(),
      code: chance.string()
    };
    const createDelivery = await deliveryTypeProvider.addDeliveryType(
      manager,
      Delivery,
      user.organization.id
    );
    expect(createDelivery).toBeDefined();
    expect(createDelivery.name).toBe(Delivery.name);
    expect(createDelivery.code).toBe(Delivery.code);
  });

  test("should Fail to create with duplicate Delivery type", async () => {
    const manager = getManager();
    const Delivery = {
      name: chance.string(),
      code: chance.string()
    };
    const createDelivery = await deliveryTypeProvider.addDeliveryType(
      manager,
      Delivery,
      user.organization.id
    );
    try {
      const createDelivery1 = await deliveryTypeProvider.addDeliveryType(
        manager,
        Delivery,
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should update a Delivery type", () => {
  test("should update with vaid input", async () => {
    const manager = getManager();
    const Delivery = {
      name: chance.string(),
      code: chance.string()
    };
    const createDelivery = await deliveryTypeProvider.addDeliveryType(
      manager,
      Delivery,
      user.organization.id
    );

    const updatedSchema = {
      id: createDelivery.id,
      name: chance.string()
    };
    const updateSchema = await deliveryTypeProvider.updateDeliveryType(
      manager,
      updatedSchema,
      user.organization.id
    );
    expect(updateSchema).toBeDefined();
    expect(updateSchema.id).toBe(updatedSchema.id);
    expect(updateSchema.name).toBe(updatedSchema.name);
  });

  test("should fail to update with duplicate Delivery type", async () => {
    const manager = getManager();
    const Delivery = {
      name: chance.string(),
      code: chance.string()
    };
    const createDelivery = await deliveryTypeProvider.addDeliveryType(
      manager,
      Delivery,
      user.organization.id
    );
    const Delivery2 = {
      name: chance.string(),
      code: chance.string()
    };
    const createDelivery2 = await deliveryTypeProvider.addDeliveryType(
      manager,
      Delivery2,
      user.organization.id
    );

    const updatedSchema = {
      id: createDelivery.id,
      code: Delivery2.code
    };
    try {
      const updateSchema = await deliveryTypeProvider.updateDeliveryType(
        manager,
        updatedSchema,
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should remove a Delivery", () => {
  test("should remove a Delivery with valid input", async () => {
    const manager = getManager();
    const Delivery = {
      name: chance.string(),
      code: chance.string()
    };
    const createDelivery = await deliveryTypeProvider.addDeliveryType(
      manager,
      Delivery,
      user.organization.id
    );
    const removedDelivery = await deliveryTypeProvider.removeDeliveryType(
      manager,
      {
        id: createDelivery.id
      },
      user.organization.id
    );
    expect(removedDelivery).toBeDefined();
    expect(removedDelivery.name).toBe(createDelivery.name);
  });

  test("should fail to remove Delivery with invalid input", async () => {
    const manager = getManager();
    try {
      await deliveryTypeProvider.removeDeliveryType(
        manager,
        {
          id: chance.guid()
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_NOT_FOUND)
      );
    }
  });
});

describe("Should fetch a Delivery", () => {
  test("should fetch a Delivery for valid input", async () => {
    const manager = getManager();
    const Delivery = {
      name: chance.string(),
      code: chance.string()
    };
    const createDelivery = await deliveryTypeProvider.addDeliveryType(
      manager,
      Delivery,
      user.organization.id
    );
    const fetchDelivery = await deliveryTypeProvider.getDeliveryType(
      manager,
      {
        id: createDelivery.id
      },
      user.organization.id
    );
    expect(fetchDelivery).toBeDefined();
    expect(fetchDelivery.id).toBe(createDelivery.id);
    expect(fetchDelivery.code).toBe(createDelivery.code);
  });
  test("should fail to fetch a invalid Delivery", async () => {
    const manager = getManager();
    try {
      const fetchDelivery = await deliveryTypeProvider.getDeliveryType(
        manager,
        {
          id: chance.guid()
        },
        user.organization.id
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
