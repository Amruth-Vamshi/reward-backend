// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { CustomerProvider } from "../customer.providers";
import { customerModule } from "../customer.module";
import * as CoreEntities from "../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { STATUS } from "../../common/constants";
let user: CoreEntities.User;
let customerForCustomerDeviceTests: CoreEntities.Customer;
var chance = new Chance();

jest.mock("i18n");

let customerInputs = {
  firstName: "Test",
  lastName: "12345",
  dateOfBirth: "11/12/1990",
  phoneNumber: "+911234567890"
};

let customerInputs2 = {
  firstName: "Test2",
  lastName: "123456",
  dateOfBirth: "11/10/1990",
  phoneNumber: "+911234667890"
};

let customerDeviceInputs = {
  fcmToken: "12345",
  deviceId: "deviceId",
  osVersion: "1923",
  modelNumber: "1234"
};

let customerDeviceInputs2 = {
  fcmToken: "123456",
  deviceId: "deviceId2",
  osVersion: "19232",
  modelNumber: "12342"
};

const customerService: CustomerProvider = customerModule.injector.get(
  CustomerProvider
);

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();
  customerForCustomerDeviceTests = await customerService.createOrUpdateCustomer(
    manager,
    {
      phoneNumber: `+91${chance.phone({ formatted: false })}`,
      organization: user.organization.id,
      firstName: "Test",
      lastName: "Blah"
    }
  );
});

describe.skip("Testing customer Device APIs", () => {
  test.skip("should createOrUpdateCustomerDevice given correct inputs", async () => {
    const manager = getManager();
    const customerDevice = await customerService.createOrUpdateCustomerDevice(
      manager,
      {
        ...customerDeviceInputs,
        customer_id: customerForCustomerDeviceTests.id
      }
    );
    expect(customerDevice).toBeTruthy();
    expect(customerDevice.fcmToken).toBe(customerDeviceInputs.fcmToken);
    expect(customerDevice.deviceId).toBe(customerDeviceInputs.deviceId);
    expect(customerDevice.osVersion).toBe(customerDeviceInputs.osVersion);
    expect(customerDevice.modelNumber).toBe(customerDeviceInputs.modelNumber);
    expect(customerDevice.customer.id).toBe(customerForCustomerDeviceTests.id);

    const customerDevice2 = await customerService.createOrUpdateCustomerDevice(
      manager,
      {
        ...customerDeviceInputs2,
        id: customerDevice.id,
        customer_id: customerForCustomerDeviceTests.id
      }
    );
    expect(customerDevice2).toBeTruthy();
    expect(customerDevice2.fcmToken).toBe(customerDeviceInputs2.fcmToken);
    expect(customerDevice2.deviceId).toBe(customerDeviceInputs2.deviceId);
    expect(customerDevice2.osVersion).toBe(customerDeviceInputs2.osVersion);
    expect(customerDevice2.modelNumber).toBe(customerDeviceInputs2.modelNumber);
    expect(customerDevice2.customer.id).toBe(customerForCustomerDeviceTests.id);
  });
  test.skip("should get customerdevice based", async () => {
    const manager = getManager();
    const customerDeviceCreated = await customerService.createOrUpdateCustomerDevice(
      manager,
      {
        ...customerDeviceInputs,
        customer_id: customerForCustomerDeviceTests.id
      }
    );

    // Based on fcm token
    const customerDevice = await customerService.getCustomerDevice(manager, {
      fcmToken: customerDeviceInputs.fcmToken
    });
    expect(customerDevice).toBeTruthy();
    expect(customerDeviceCreated.id).toBe(customerDevice.id);

    // Based on device id, os version, model number
    const customerDevice2 = await customerService.getCustomerDevice(manager, {
      deviceId: customerDeviceInputs.deviceId,
      osVersion: customerDeviceInputs.osVersion,
      modelNumber: customerDeviceInputs.modelNumber
    });
    expect(customerDevice2).toBeTruthy();
    expect(customerDeviceCreated.id).toBe(customerDevice2.id);
  });
  test.skip("get disable customer device", async () => {
    const manager = getManager();
    const customerDevice = await customerService.createOrUpdateCustomerDevice(
      manager,
      {
        ...customerDeviceInputs,
        customer_id: customerForCustomerDeviceTests.id
      }
    );

    const customerDevice2 = await customerService.disableCustomerDevice(
      manager,
      {
        customer_id: customerForCustomerDeviceTests.id,
        id: customerDevice.id
      }
    );

    expect(customerDevice2.status).toBe(STATUS.INACTIVE);
  });

  test.skip("get customer devices by customer id", async () => {
    const manager = getManager();
    const customer = await customerService.createOrUpdateCustomer(manager, {
      phoneNumber: `+91${chance.phone({ formatted: false })}`,
      organization: user.organization.id,
      firstName: "Test",
      lastName: "Blah"
    });
    const customerDeviceCreated = await customerService.createOrUpdateCustomerDevice(
      manager,
      {
        ...customerDeviceInputs,
        customer_id: customer.id
      }
    );

    const customerDeviceCreated2 = await customerService.createOrUpdateCustomerDevice(
      manager,
      {
        ...customerDeviceInputs2,
        customer_id: customer.id
      }
    );

    // Based on fcm token
    const customerDevices = await customerService.getCustomerDevicesByCustomerID(
      manager,
      customer.id
    );

    expect(customerDevices).toBeTruthy();
    expect(customerDevices.length).toBe(2);

    const customerDevice1 = customerDevices[0];
    const customerDevice2 = customerDevices[1];
    expect(customerDeviceCreated.id).toBe(customerDevice1.id);
    expect(customerDeviceCreated2.id).toBe(customerDevice2.id);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
