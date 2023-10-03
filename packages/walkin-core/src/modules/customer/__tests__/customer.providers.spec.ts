// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { CustomerProvider } from "../customer.providers";
import { Organizations } from "../../account/organization/organization.providers";
import { customerModule } from "../customer.module";
import { OrganizationModule } from "../../account/organization/organization.module";
import { EntityExtendProvider } from "../../entityExtend/entityExtend.providers";
import { entityExtendModule } from "../../entityExtend/entityExtend.module";
import * as WCoreEntities from "../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { CACHING_KEYS, STATUS } from "../../common/constants";
import { getValueFromCache } from "../../common/utils/redisUtils";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WalkinPlatformError } from "../../common/exceptions/walkin-platform-error";
let user: WCoreEntities.User;
let customerForCustomerDeviceTests: WCoreEntities.Customer;
var chance = new Chance();

jest.mock("i18n");

let customerInputs = {
  firstName: "Test",
  lastName: "12345",
  dateOfBirth: "11/12/1990",
  phoneNumber: `+91${chance.phone({ formatted: false })}`
};

let customerInputs2 = {
  firstName: "Test2",
  lastName: "123456",
  dateOfBirth: "11/10/1990",
  phoneNumber: "+911234667890"
};

let customerInputs3 = {
  firstName: "Test3",
  lastName: "123456",
  dateOfBirth: "11/10/1990",
  phoneNumber: "+911234667390",
  externalCustomerId: "123324354354"
};

let customerInputs4 = {
  firstName: "Test4",
  lastName: "1234561",
  dateOfBirth: "11/10/1991",
  phoneNumber: "+911234697391"
};

let customerInputs5 = {
  firstName: "Test5",
  lastName: "1234562",
  dateOfBirth: "11/10/1992",
  phoneNumber: "+911234667392"
};

let customerDeviceInputs = {
  fcmToken: "12345",
  deviceId: "deviceId",
  osVersion: "1923",
  modelNumber: "1234"
};

let customers = [
  {
    firstName: chance.string({ length: 6 }),
    lastName: chance.string({ length: 6 }),
    dateOfBirth: "11/12/1990",
    phoneNumber: `+91${chance.phone({ formatted: false })}`
  },
  {
    firstName: chance.string({ length: 6 }),
    lastName: chance.string({ length: 6 }),
    dateOfBirth: "11/12/1992",
    phoneNumber: `+91${chance.phone({ formatted: false })}`
  },
  {
    firstName: chance.string({ length: 6 }),
    lastName: chance.string({ length: 6 }),
    dateOfBirth: "11/12/1986",
    phoneNumber: `+91${chance.phone({ formatted: false })}`
  },
  {
    firstName: chance.string({ length: 6 }),
    lastName: chance.string({ length: 6 }),
    dateOfBirth: "11/12/1987",
    phoneNumber: `+91${chance.phone({ formatted: false })}`
  }
];

let customers2 = [
  {
    firstName: chance.string({ length: 6 }),
    lastName: chance.string({ length: 6 }),
    dateOfBirth: "11/12/2100",
    phoneNumber: "+913234567890"
  },
  {
    firstName: chance.string({ length: 6 }),
    lastName: chance.string({ length: 6 }),
    dateOfBirth: "11/12/2001",
    phoneNumber: `+91${chance.phone({ formatted: false })}`
  },
  {
    firstName: chance.string({ length: 6 }),
    lastName: chance.string({ length: 6 }),
    dateOfBirth: "11/12/1986",
    phoneNumber: "+913234567891"
  },
  {
    firstName: chance.string({ length: 6 }),
    lastName: chance.string({ length: 6 }),
    dateOfBirth: "11/12/1987",
    phoneNumber: "+913234567893"
  }
];

let extendFields = '{"extend_field_1":"123","extend_field_2":"234"}';

const customerService: CustomerProvider = customerModule.injector.get(
  CustomerProvider
);

const entityExtendService: EntityExtendProvider = entityExtendModule.injector.get(
  EntityExtendProvider
);

const organizationService: Organizations = OrganizationModule.injector.get(
  Organizations
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();
  let entityExtend = await entityExtendService.createEntityExtend(
    manager,
    user.organization.id,
    "customer",
    "Testing"
  );
  let entityExtendField1 = await entityExtendService.createEntityExtendField(
    manager,
    entityExtend.id,
    "extend_field_1",
    "field_1",
    "field_1",
    "SHORT_TEXT",
    false,
    null,
    null,
    null,
    null,
    true
  );
  let entityExtendField2 = await entityExtendService.createEntityExtendField(
    manager,
    entityExtend.id,
    "extend_field_2",
    "field_2",
    "field_2",
    "SHORT_TEXT",
    false,
    null,
    null,
    null,
    null,
    true
  );
});

/**
 * We are removing updateCustomer functionality. Hence changing the test case to have only createCustomer
 */

describe("Testing createOrUpdateCustomer", () => {
  test("should createCustomer given correct inputs", async () => {
    const manager = getManager();
    let personId;
    const { person } = await customerService.createPerson(manager, {
      firstName: "Test",
      phoneNumber: `+91${chance.phone({ formatted: false })}`
    });

    if (person) {
      personId = person.id
    }

    customerInputs.phoneNumber = person.phoneNumber

    const customer = await customerService.createOrUpdateCustomer(manager, {
      ...customerInputs,
      organization: user.organization.id,
      extend: extendFields,
      personId,
    });
    expect(customer).toBeTruthy();
    expect(customer.firstName).toBe(customerInputs.firstName);
    expect(customer.lastName).toBe(customerInputs.lastName);
    expect(customer.dateOfBirth).toBe(customerInputs.dateOfBirth);
    expect(customer.phoneNumber).toBe(customerInputs.phoneNumber);
    let extendFieldsJSONObj = JSON.parse(extendFields);
    expect(customer.extend).toMatchObject(extendFieldsJSONObj);
  });

  test("should throw error when phone number is of wrong format", async () => {
    const manager = getManager();

    let personId;
    const { person } = await customerService.createPerson(manager, {
      firstName: "Test",
      phoneNumber: `+91${chance.phone({ formatted: false })}`
    });

    if (person) {
      personId = person.id
    }

    let customerPromise = customerService.createOrUpdateCustomer(manager, {
      ...customerInputs,
      phoneNumber: "1234",
      organization: user.organization.id,
      personId,
    });
    await expect(customerPromise).rejects.toThrowError();
  });

  test("should throw error when externalCustomerId is not unique", async () => {
    const manager = getManager();

    let personId;
    const { person, customerId } = await customerService.createPerson(manager, {
      firstName: "Test",
      phoneNumber: `+91${chance.phone({ formatted: false })}`
    });

    if (person) {
      personId = person.id
    }
    customerInputs.phoneNumber = person.phoneNumber
    try {
      let customer = await customerService
        .createOrUpdateCustomer(manager, {
          id: customerId,
          ...customerInputs,
          externalCustomerId: "1234567890",
          organization: user.organization.id,
          personId
        })
    } catch (error) {
      expect(error).toEqual(
        new WalkinPlatformError(
          "cust003",
          "external customer is not unique",
          person.phoneNumber,
          400,
          "")
      );
    }

  });
});

// Skipping this test case since its not likely to happen

test.skip("should throw error when customerIdentifier is not unique", async () => {
  const manager = getManager();

  let personId;
  const { person } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber: `+91${chance.phone({ formatted: false })}`
  });

  if (person) {
    personId = person.id
  }

  customerInputs.phoneNumber = person.phoneNumber

  try {
    let customer = await customerService
      .createOrUpdateCustomer(manager, {
        ...customerInputs,
        customerIdentifier: "1234567890",
        organization: user.organization.id,
        personId
      })
    customerInputs.phoneNumber = "91893942332";
    let customer2 = await customerService.createOrUpdateCustomer(manager, {
      ...customerInputs,
      customerIdentifier: "1234567890",
      organization: user.organization.id,
      personId
    });
  } catch (error) {
    expect(error).toEqual(
      new WCoreError(WCORE_ERRORS.CUSTOMER_PHONE_NUMBER_DOES_NOT_MATCH_WITH_PERSON)
    );
  }

});
test("should throw error when organization does not exist", async () => {
  const manager = getManager();
  const organizationId = "123123";

  try {
    const { person, customerId } = await customerService.createPerson(manager, {
      firstName: "Test",
      phoneNumber: `91${chance.phone({ formatted: false })}`,
      organizationId: "1212121"
    });
  } catch (error) {
    await expect(error).toEqual(
      new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND)
    );
  }
});

// Below scenario is not possible hence invalidating the test case

test.skip("should not throw error when externalCustomerId is unique", async () => {
  const manager = getManager();

  let personId;
  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber: `+91${chance.phone({ formatted: false })}`
  });

  if (person) {
    personId = person.id
  }

  customerInputs.phoneNumber = person.phoneNumber;

  let customer = await customerService
    .createOrUpdateCustomer(manager, {
      id: customerId,
      ...customerInputs,
      externalCustomerId: "1234667395",
      organization: user.organization.id,
      personId
    })
  let customer2 = await customerService.createOrUpdateCustomer(manager, {
    id: customerId,
    ...customerInputs,
    externalCustomerId: "1234667396",
    organization: user.organization.id,
    personId
  });

  expect(customer2).toBeDefined();

});

// Skipping below test case because the corresponding API is deprecated

test.skip("Test createBulkCustomer", async () => {
  const manager = getManager();
  let response = await customerService.createBulkCustomer(manager, customers);
  expect(response).toBeDefined();
  expect(response.savedCustomers).toHaveLength(4);
  expect(response.validationErrors).toHaveLength(0);
});

// Skipping below test case because the corresponding API is deprecated

test.skip("Test createBulkCustomer for date invalid", async () => {
  const manager = getManager();
  let response = await customerService.createBulkCustomer(
    manager,
    customers2
  );
  expect(response).toBeDefined();
  expect(response.savedCustomers).toHaveLength(3);
  expect(response.validationErrors).toBeDefined();
  expect(response.validationErrors).toHaveLength(1);
});

// Skipping below test case because the corresponding API is deprecated

test.skip("Test createBulkCustomer for phone number invalid and date invalid", async () => {
  const manager = getManager();
  // set invalid phone number
  customers2[1].phoneNumber = "12";
  try {
    let response = await customerService.createBulkCustomer(
      manager,
      customers2
    );
  } catch (error) {
    expect(error).toEqual(
      new WCoreError(WCORE_ERRORS.INVALID_PHONE_NUMBER)
    );
  }


});

test("addAddress To Person", async () => {
  const manager = getManager();

  let personId;
  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber: `+91${chance.phone({ formatted: false })}`,
    organizationId: user.organization.id
  });

  if (person) {
    personId = person.id
  }

  const shippingAddress = {
    name: chance.name(),
    addressLine1: chance.address(),
    addressLine2: chance.address(),
    city: chance.city(),
    state: chance.state(),
    country: chance.country(),
    zip: chance.zip(),
    contactNumber: person.phoneNumber,
    addressTitle: chance.string(),
    addressType: "SHIPPING",
    geoLocation: `Point(${chance.latitude()},${chance.longitude()})`
  };

  const addAddress = await customerService.addAddressToCustomer(
    manager,
    {
      customerId,
      ...shippingAddress
    },
    user.organization.id
  );

  const key = `${CACHING_KEYS.CUSTOMER}_${person.id}`;
  const cachedValue = await getValueFromCache(key);
  expect(addAddress).toBeDefined();
  expect(cachedValue).toBeNull();
});
test("updateAddress To Customer", async () => {
  const manager = getManager();

  let personId;
  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber: `+91${chance.phone({ formatted: false })}`,
    organizationId: user.organization.id
  });

  if (person) {
    personId = person.id
  }

  const createShippingAddress = {
    name: chance.name(),
    addressLine1: chance.address(),
    addressLine2: chance.address(),
    city: chance.city(),
    state: chance.state(),
    country: chance.country(),
    zip: chance.zip(),
    contactNumber: `+91${chance.phone({ formatted: false })}`,
    addressTitle: chance.string(),
    addressType: "SHIPPING",
    geoLocation: `Point(${chance.latitude()},${chance.longitude()})`,
    organizationId: user.organization.id
  };

  const addAddress = await customerService.addAddressToCustomer(
    manager,
    {
      customerId,
      ...createShippingAddress
    },
    user.organization.id
  );

  const updateAddress = await customerService.updateAddress(
    manager,
    {
      addressId: addAddress.id,
      customerId
    },
    user.organization.id
  );

  const updateAddressKey = `${CACHING_KEYS.CUSTOMER}_${personId}`;
  const updatecachedValue = await getValueFromCache(updateAddressKey);
  expect(addAddress).toBeDefined();
  expect(updateAddress).toBeDefined();
  expect(updatecachedValue).toBeNull();
});
test("remove Address From Customer", async () => {
  const manager = getManager();

  let personId;
  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber: `+91${chance.phone({ formatted: false })}`,
    organizationId: user.organization.id
  });

  if (person) {
    personId = person.id
  }

  const createShippingAddress = {
    name: chance.name(),
    addressLine1: chance.address(),
    addressLine2: chance.address(),
    city: chance.city(),
    state: chance.state(),
    country: chance.country(),
    zip: chance.zip(),
    contactNumber: `+91${chance.phone({ formatted: false })}`,
    addressTitle: chance.string(),
    addressType: "SHIPPING",
    geoLocation: `Point(${chance.latitude()},${chance.longitude()})`
  };

  const addAddress = await customerService.addAddressToCustomer(
    manager,
    {
      customerId,
      ...createShippingAddress
    },
    user.organization.id
  );

  const removeAddress = await customerService.removeAddressFromPerson(
    manager,
    {
      customerId,
      addressId: addAddress.id
    },
    user.organization.id
  );

  const removeAddressKey = `${CACHING_KEYS.CUSTOMER}_${person.id}`;
  const removecachedValue = await getValueFromCache(removeAddressKey);
  expect(addAddress).toBeDefined();
  expect(removeAddress).toBeDefined();
  expect(removecachedValue).toBeNull();
});

test("Test personWithCustomerId with personId as input", async () => {
  const manager = getManager();

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber: `+91${chance.phone({ formatted: false })}`,
    organizationId: user.organization.id
  });

  const personWithCustomerId = await customerService.getPersonWithCustomerId(manager, {
    personId: person.id,
    organizationId: user.organization.id
  });

  expect(personWithCustomerId).toBeDefined();
  expect(personWithCustomerId.person.id).toBe(person.id)
  expect(personWithCustomerId).toHaveProperty('customerId')
});

test("Test personWithCustomerId API with phoneNumber as input", async () => {
  const manager = getManager();
  const phoneNumber = `+91${chance.phone({ formatted: false })}`;

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber,
    organizationId: user.organization.id,
  });

  const personWithCustomerId = await customerService.getPersonWithCustomerId(manager, {
    phoneNumber,
    organizationId: user.organization.id
  });

  expect(personWithCustomerId).toBeDefined();
  expect(personWithCustomerId.person.id).toBe(person.id)
  expect(personWithCustomerId).toHaveProperty('customerId')
});

test("Test updatePerson API with same phoneNumber as createPerson input", async () => {
  const manager = getManager();
  const phoneNumber = `+91${chance.phone({ formatted: false })}`;

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber,
    organizationId: user.organization.id,
  });

  const updatePerson = await customerService.updatePerson(manager, {
    id: person.id,
    phoneNumber,
  });

  expect(updatePerson).toBeDefined();
  expect(updatePerson.id).toBe(person.id)
  expect(updatePerson.phoneNumber).toBe(phoneNumber)
});

test("Test updatePerson API with new unique phoneNumber", async () => {
  const manager = getManager();
  const phoneNumber = `+91${chance.phone({ formatted: false })}`;

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber,
    organizationId: user.organization.id,
  });

  const newPhoneNumber = `+91${chance.phone({ formatted: false })}`;

  const updatePerson = await customerService.updatePerson(manager, {
    id: person.id,
    phoneNumber: newPhoneNumber
  });

  expect(updatePerson).toBeDefined();
  expect(updatePerson.id).toBe(person.id)
  expect(updatePerson.phoneNumber).toBe(newPhoneNumber)
});

test("Test createPerson API with same phoneNumber as newly updatedPerson input", async () => {

  const manager = getManager();
  const phoneNumber = `+91${chance.phone({ formatted: false })}`;

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber,
    organizationId: user.organization.id,
  });

  const newPhoneNumber = '91' + chance.phone({ formatted: false });

  const updatePerson = await customerService.updatePerson(manager, {
    id: person.id,
    phoneNumber: newPhoneNumber
  });

  try {
    const newPerson = await customerService.createPerson(manager, {
      firstName: "Test",
      phoneNumber: newPhoneNumber,
      organizationId: user.organization.id,
    });
  } catch (error) {
    expect(error).toEqual(
      new WCoreError(WCORE_ERRORS.PERSON_NOT_UNIQUE)
    );
  }

});

test("Test updatePerson API with newPhoneNumber and check if customersPhone number is also updated", async () => {

  const manager = getManager();
  const phoneNumber = `+91${chance.phone({ formatted: false })}`;

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber,
    organizationId: user.organization.id,
  });

  const newPhoneNumber = `+91${chance.phone({ formatted: false })}`;

  const updatePerson = await customerService.updatePerson(manager, {
    id: person.id,
    phoneNumber: newPhoneNumber
  });

  for (let customer of updatePerson.customers) {
    expect(customer.phoneNumber).toEqual(newPhoneNumber)
  }

});

test("Test linkPersonWithOrganization API, to link a existing person with a new organization", async () => {

  const manager = getManager();
  const phoneNumber = `91${chance.phone({ formatted: false })}`;

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber,
    organizationId: user.organization.id,
  });

  const newOrganization = await organizationService.createOrganization(manager, {
    code: chance.name(),
    name: chance.name_prefix(),
    status: STATUS.ACTIVE
  });

  const linkedPerson = await customerService.linkPersonWithOrganization(manager, {
    personId: person.id,
    organizationId: newOrganization.id,
  });

  const personWithCustomers = await customerService.getPerson(manager, {
    personId: person.id
  });

  expect(personWithCustomers.customers.length).toEqual(2);
  for (let customer of personWithCustomers.customers) {
    expect(customer.phoneNumber).toEqual(person.phoneNumber)
    expect(customer.customerIdentifier).toEqual(person.personIdentifier)
  }

});

test("Test createPerson API, to fail if phoneNumber length is less than or equal to 10", async () => {

  const manager = getManager();
  const phoneNumber = '9898394232'

  try {
    const newPerson = await customerService.createPerson(manager, {
      firstName: "Test",
      phoneNumber,
      organizationId: user.organization.id,
    });

  } catch (error) {
    expect(error).toEqual(
      new WCoreError(WCORE_ERRORS.INVALID_PHONE_NUMBER)
    );

  }
});


test("Test linkPersonWithOrganization API, to link a existing person with a new organization", async () => {

  const manager = getManager();
  const phoneNumber = `91${chance.phone({ formatted: false })}`;

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber,
    organizationId: user.organization.id,
  });

  const newOrganization = await organizationService.createOrganization(manager, {
    code: chance.name(),
    name: chance.name_prefix(),
    status: STATUS.ACTIVE
  });

  const linkedPerson = await customerService.linkPersonWithOrganization(manager, {
    personId: person.id,
    organizationId: newOrganization.id,
  });

  const personWithCustomers = await customerService.getPerson(manager, {
    personId: person.id
  });

  expect(personWithCustomers.customers.length).toEqual(2);
  for (let customer of personWithCustomers.customers) {
    expect(customer.phoneNumber).toEqual(person.phoneNumber)
    expect(customer.customerIdentifier).toEqual(person.personIdentifier)
  }

});

test("Test createPerson API, to createCustomer with status default ACTIVE", async () => {

  const manager = getManager();
  const phoneNumber = `91${chance.phone({ formatted: false })}`;

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber,
    organizationId: user.organization.id,
  });

  const customer = await customerService.getCustomer(manager, {
    id: customerId
  });

  expect(customer).toBeDefined();
  expect(customer.status).toEqual(STATUS.ACTIVE);

});

test("Test createCustomer API, to throw error if its created with different phoneNumber", async () => {

  const manager = getManager();
  const phoneNumber = `+91${chance.phone({ formatted: false })}`;

  // phonenumebr = 9
  /// person - p1

  const { person, customerId } = await customerService.createPerson(manager, {
    firstName: "Test",
    phoneNumber,
    organizationId: user.organization.id,
  });

  let newCustomerPhoneNumber = `+91${chance.phone({ formatted: false })}`

  // customer = 89
  // person = p1

  try {
    const customer = await customerService.createOrUpdateCustomer(manager, {
      phoneNumber: newCustomerPhoneNumber,
      personId: person.id,
      organization: user.organization.id
    });
  } catch (error) {
    expect(error).toEqual(
      new WCoreError(WCORE_ERRORS.CUSTOMER_PHONE_NUMBER_DOES_NOT_MATCH_WITH_PERSON)
    );

  }
});

});

afterAll(async () => {
  await closeUnitTestConnection();
});
