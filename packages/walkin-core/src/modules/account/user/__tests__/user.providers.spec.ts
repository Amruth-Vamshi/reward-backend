import * as CoreEntities from "../../../../entity";
import {
  closeUnitTestConnection,
  createUnitTestConnection,
  getAdminUser
} from "../../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { Chance } from "chance";
import { UserModule } from "../user.module";
import { Users } from "../user.providers";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import {
  CACHING_KEYS,
  DEFAULT_TEMPLATES,
  ORGANIZATION_TYPES,
  SORTING_DIRECTIONS,
  STATUS
} from "../../../common/constants";
import { StoreFormatModule } from "../../../productcatalog/storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../../productcatalog/storeformat/storeFormat.providers";
import { TaxTypeModule } from "../../../productcatalog/taxtype/taxtype.module";
import { TaxTypeProvider } from "../../../productcatalog/taxtype/taxtype.providers";
import { ChannelModule } from "../../../productcatalog/channel/channel.module";
import { CatalogModule } from "../../../productcatalog/catalog/catalog.module";
import { StoreModule } from "../../store/store.module";
import { Stores } from "../../store/store.providers";
import { CatalogProvider } from "../../../productcatalog/catalog/catalog.providers";
import { ChannelProvider } from "../../../productcatalog/channel/channel.providers";
import { Organizations } from "../../organization/organization.providers";
import { OrganizationModule } from "../../organization/organization.module";
import { AccessControlModule } from "../../access-control/access-control.module";
import { AccessControls } from "../../access-control/access-control.providers";
import { getValueFromCache } from "../../../common/utils/redisUtils";
import * as resolvers from "../user.resolvers";
import {
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_ENTITY,
  POLICY_TYPE
} from "../../../common/permissions";
let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const userProvider: Users = UserModule.injector.get(Users);
const storeFormatProvider = StoreFormatModule.injector.get(StoreFormatProvider);
const taxTypeProvider = TaxTypeModule.injector.get(TaxTypeProvider);
const channelProvider = ChannelModule.injector.get(ChannelProvider);
const catalogProvider = CatalogModule.injector.get(CatalogProvider);
const storeProvider: Stores = StoreModule.injector.get(Stores);
const organizationProvider = OrganizationModule.injector.get(Organizations);
const accessControlProvider = AccessControlModule.injector.get(AccessControls);
const chance = new Chance();

describe("Should fetch all users", () => {
  test("Fetch all users", async () => {
    const entityManager = getManager();
    const result = await userProvider.getAllUsers(
      entityManager,
      {
        page: 1,
        pageSize: 10
      },
      {
        sortBy: "email",
        sortOrder: "ASC"
      },
      user.organization.id
    );
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data).toHaveLength(1);
    expect(result.paginationInfo).toBeDefined();
    expect(result.paginationInfo.totalPages).toEqual(1);
    expect(result.paginationInfo.totalItems).toEqual(1);
  });
});

describe("Should fetch user", () => {
  test("Fetch user with valid user id", async () => {
    const entityManager = getManager();
    const Fetcheduser = await userProvider.getUserById(entityManager, user.id);
    expect(Fetcheduser.id).toBe(user.id);
    expect(Fetcheduser.firstName).toBe(user.firstName);
  });
  test.skip("Fetch user with invalid user id", async () => {
    const entityManager = getManager();
    try {
      const Fetcheduser = await userProvider.getUserById(
        entityManager,
        chance.guid()
      );
    } catch (err) {
      expect(err).toBeInstanceOf(WCoreError);
      expect(err).toMatchObject(new WCoreError(WCORE_ERRORS.USER_NOT_FOUND));
    }
  });
});
describe("Should fetch user with org id", () => {
  test("Fetch user with valid user id with organization id", async () => {
    const entityManager = getManager();
    const Fetcheduser = await userProvider.getUserByIdWithOrgId(
      entityManager,
      user.id,
      user.organization.id
    );
    expect(Fetcheduser.id).toBe(user.id);
    expect(Fetcheduser.firstName).toBe(user.firstName);
  });
});
describe("Should Create User", () => {
  test("Create a user with valid inputs", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.google_analytics()
    };
    const createdUser = await userProvider.createUser(
      entityManager,
      userDetails
    );
    expect(createdUser.lastName).toBe(userDetails.lastName);
    expect(createdUser.firstName).toBe(userDetails.firstName);
  });

  test("Create a user with username inputs", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.google_analytics(),
      userName: chance.word()
    };
    const createdUser = await userProvider.createUser(
      entityManager,
      userDetails
    );
    expect(createdUser.lastName).toBe(userDetails.lastName);
    expect(createdUser.firstName).toBe(userDetails.firstName);
    expect(createdUser.userName).toBe(userDetails.userName);
  });
});

describe("Should Create User and add to a store", () => {
  test("Should Create User and add to a store", async () => {
    const manager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.google_analytics()
    };
    const createdUser = await userProvider.createUser(manager, userDetails);
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeToUser = await userProvider.linkUserToStore(manager, {
      organizationId: user.organization.id,
      storeId: store.id,
      userId: user.id
    });

    const key = `${CACHING_KEYS.USER}_${user.id}`;
    const cacheValue = await getValueFromCache(key);

    expect(cacheValue).toBeNull();

    expect(storeToUser).toBeDefined();
    expect(storeToUser.id).toBeDefined();
    expect(storeToUser.store).toBeDefined();
    expect(storeToUser.store).toHaveLength(1);
  });

  test("Should Create User, add to a store and remove from store", async () => {
    const manager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.google_analytics()
    };
    const createdUser = await userProvider.addUserToOrganization(
      manager,
      userDetails,
      user.organization.id,
      user.roles[0].id
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    console.log("createdUser", createdUser);
    const storeToUser = await userProvider.linkUserToStore(manager, {
      organizationId: user.organization.id,
      storeId: store.id,
      userId: createdUser.id
    });

    const removeUserFromStore = await userProvider.removeUserFromStore(
      manager,
      {
        organizationId: user.organization.id,
        storeId: store.id,
        userId: createdUser.id
      }
    );

    const key = `${CACHING_KEYS.USER}_${createdUser.id}`;
    const cacheValue = await getValueFromCache(key);

    expect(cacheValue).toBeNull();

    const getUserDetails = await userProvider.getUserById(
      manager,
      createdUser.id
    );
    expect(getUserDetails).toBeDefined();
    expect(getUserDetails.store).toBeDefined();
    expect(getUserDetails.store).toHaveLength(0);
  });
});

describe("Should Update a User", () => {
  test("Update a user with valid inputs", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.google_analytics()
    };
    const createdUser = await userProvider.createUser(
      entityManager,
      userDetails
    );
    expect(createdUser.lastName).toBe(userDetails.lastName);
    expect(createdUser.firstName).toBe(userDetails.firstName);
    const updateDetails = {
      email: chance.email()
    };
    const updateUser = await userProvider.updateUser(
      entityManager,
      updateDetails
    );

    const key = `${CACHING_KEYS.USER}_${updateUser.id}`;
    const cacheValue = await getValueFromCache(key);
    expect(cacheValue).toBeNull();
    expect(updateUser.email).toBe(updateDetails.email);
  });
});

describe("Should delete a User", () => {
  test("delete a user with valid inputs", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.google_analytics()
    };
    const createdUser = await userProvider.createUser(
      entityManager,
      userDetails
    );
    expect(createdUser.lastName).toBe(userDetails.lastName);
    expect(createdUser.firstName).toBe(userDetails.firstName);

    const deletedUser = await userProvider.deleteUserById(
      entityManager,
      createdUser.id
    );

    const key = `${CACHING_KEYS.USER}_${createdUser.id}`;
    const cacheValue = await getValueFromCache(key);
    expect(cacheValue).toBeNull();
    expect(deletedUser.email).toBe(userDetails.email);
  });
});

describe("Should add a User to an Organization", () => {
  test("Add a user to an organization", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.string()
    };
    const roleId = user.roles[0].id;

    const addUser = await userProvider.addUserToOrganization(
      entityManager,
      userDetails,
      user.organization.id,
      roleId
    );

    expect(addUser.email).toBe(userDetails.email);
    expect(addUser.firstName).toBe(userDetails.firstName);
  });

  test.skip("Add a user to an organization with invalid role id", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.google_analytics()
    };
    const roleId = chance.guid();
    const addUser = await userProvider.addUserToOrganization(
      entityManager,
      userDetails,
      user.organization.id,
      roleId
    );
    expect(addUser).rejects.toThrowError();
  });

  test("Fetch user - Check for autoEmailConfirmed", async () => {
    const entityManager = getManager();
    const result = await userProvider.getUserById(entityManager, user.id);
    expect(result).toBeDefined();
    expect(result.emailConfirmed).toBe(true);
  });

  test("test createUser with valid inputs - confirmation email not set", async () => {
    const entityManager = getManager();
    const input: any = {
      email: `admin_${chance.string({ length: 3 })}@getwalk.in`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const newUser = await userProvider.createUser(entityManager, input);

    expect(newUser).toBeDefined();
    expect(newUser.emailConfirmed).toBe(true);
  });
  test("should create or update the user device", async () => {
    const entityManager = getManager();

    const input: any = {
      email: `${chance.string({ length: 3 })}@getwalk.in`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    const newUser = await userProvider.createUser(entityManager, input);

    const deviceInput: any = {
      fcmToken: chance.string({ length: 15 }),
      deviceId: chance.string({ length: 6 }),
      os: chance.string({ length: 5 }),
      osVersion: chance.string({ length: 5 }),
      userId: newUser.id,
      status: true
    };

    const newUserDevice = await userProvider.createUpdateDeviceInfo(
      entityManager,
      deviceInput
    );

    expect(newUserDevice).toBeDefined();
    expect(newUserDevice.user.id).toEqual(newUser.id);
  });
});

describe("Should update Password for a user", () => {
  test("Should fail to update password for a admin user", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.string()
    };
    const roleId = user.roles[0].id;

    const addUser = await userProvider.addUserToOrganization(
      entityManager,
      userDetails,
      user.organization.id,
      roleId
    );
    try {
      const changeUserPassword = await userProvider.updateUserPassword(
        entityManager,
        {
          adminUserId: user.id,
          organizationId: user.organization.id,
          password: chance.string(),
          userId: addUser.id
        }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.OPERATION_NOT_ALLOWED));
    }
  });

  test("Should fail to update password for a user in different org", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.string()
    };
    const roleId = user.roles[0].id;
    const organization = await organizationProvider.createOrganization(
      entityManager,
      {
        name: chance.company(),
        organizationType: ORGANIZATION_TYPES.ORGANIZATION,
        status: STATUS.ACTIVE,
        code: chance.string({ length: 5 })
      }
    );
    const addUser = await userProvider.addUserToOrganization(
      entityManager,
      userDetails,
      organization.id,
      roleId
    );
    try {
      const changeUserPassword = await userProvider.updateUserPassword(
        entityManager,
        {
          adminUserId: user.id,
          organizationId: user.organization.id,
          password: chance.string(),
          userId: addUser.id
        }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.OPERATION_NOT_ALLOWED));
    }
  });

  test("Should update password for a user", async () => {
    const entityManager = getManager();
    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(entityManager, role);
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.string()
    };
    const roleId = role.id;
    const addUser = await userProvider.addUserToOrganization(
      entityManager,
      userDetails,
      user.organization.id,
      roleId
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(
      entityManager,
      catalogInput
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      entityManager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(
      entityManager,
      taxTypeInput
    );

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      entityManager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(entityManager, storeInput);
    const storeToUser = await userProvider.linkUserToStore(entityManager, {
      organizationId: user.organization.id,
      storeId: store.id,
      userId: user.id
    });

    const storeToUser1 = await userProvider.linkUserToStore(entityManager, {
      organizationId: user.organization.id,
      storeId: store.id,
      userId: addUser.id
    });

    const changeUserPassword = await userProvider.updateUserPassword(
      entityManager,
      {
        adminUserId: user.id,
        organizationId: user.organization.id,
        password: chance.string(),
        userId: addUser.id
      }
    );
    const keys = `${CACHING_KEYS.USER}_${addUser.id}_${user.organization.id}`;
    const cacheValue = await getValueFromCache(keys);
    expect(changeUserPassword).toBeDefined();
    expect(changeUserPassword.updated).toBeTruthy();
    expect(cacheValue).toBeNull();
  });
  test("Should fail to update password for invalid user id", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.string()
    };
    const roleId = user.roles[0].id;
    const organization = await organizationProvider.createOrganization(
      entityManager,
      {
        name: chance.company(),
        organizationType: ORGANIZATION_TYPES.ORGANIZATION,
        status: STATUS.ACTIVE,
        code: chance.string({ length: 5 })
      }
    );
    const addUser = await userProvider.addUserToOrganization(
      entityManager,
      userDetails,
      organization.id,
      roleId
    );
    try {
      const changeUserPassword = await userProvider.updateUserPassword(
        entityManager,
        {
          adminUserId: user.id,
          organizationId: user.organization.id,
          password: chance.string(),
          userId: chance.string()
        }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.USER_NOT_FOUND));
    }
  });
  test("Should fail to update password for empty password", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.string()
    };
    const roleId = user.roles[0].id;
    const organization = await organizationProvider.createOrganization(
      entityManager,
      {
        name: chance.company(),
        organizationType: ORGANIZATION_TYPES.ORGANIZATION,
        status: STATUS.ACTIVE,
        code: chance.string({ length: 5 })
      }
    );
    const addUser = await userProvider.addUserToOrganization(
      entityManager,
      userDetails,
      organization.id,
      roleId
    );
    try {
      const changeUserPassword = await userProvider.updateUserPassword(
        entityManager,
        {
          adminUserId: user.id,
          organizationId: user.organization.id,
          password: "",
          userId: chance.string()
        }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PASSWORD_CANNOT_BE_EMPTY)
      );
    }
  });

  test("Should return false with user not found in store", async () => {
    const entityManager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.string()
    };
    const roleId = user.roles[0].id;
    const organization = await organizationProvider.createOrganization(
      entityManager,
      {
        name: chance.company(),
        organizationType: ORGANIZATION_TYPES.ORGANIZATION,
        status: STATUS.ACTIVE,
        code: chance.string({ length: 5 })
      }
    );
    const addUser = await userProvider.addUserToOrganization(
      entityManager,
      userDetails,
      organization.id,
      roleId
    );
    const sendNotification = await userProvider.sendNotification(
      {
        order: { id: chance.string() },
        store: { id: chance.string() },
        organization: { id: organization.id },
        type: "ORDER_UPDATE"
      },
      DEFAULT_TEMPLATES.NEW_ORDER_CREATION_TEMPLATE
    );

    expect(sendNotification).toBeDefined();
    expect(sendNotification).toBeFalsy();
  });

  test("Should return true with correct message template", async () => {
    const manager = getManager();
    const userDetails = {
      email: chance.email(),
      firstName: chance.name_prefix(),
      lastName: chance.name_suffix(),
      password: chance.google_analytics()
    };
    const createdUser = await userProvider.createUser(manager, userDetails);
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeToUser = await userProvider.linkUserToStore(manager, {
      organizationId: user.organization.id,
      storeId: store.id,
      userId: user.id
    });

    const sendUserNotification = await userProvider.sendNotification(
      {
        order: { id: chance.string() },
        store: { id: store.id },
        organization: { id: user.organization.id },
        type: "ORDER_UPDATE"
      },
      DEFAULT_TEMPLATES.NEW_ORDER_CREATION_TEMPLATE
    );

    expect(sendUserNotification).toBeDefined();
    expect(sendUserNotification).toBeTruthy();
  });
});

describe("Should have field checks based on user roles", () => {
  test("test the user roles based access control checks", async () => {
    const manager = getManager();

    const input: any = {
      email: `user01_${chance.string({ length: 3 })}@test.com`,
      password: chance.string({ length: 6 }),
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 })
    };

    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);

    const roleId = role.id;
    const createdUser = await userProvider.addUserToOrganization(
      manager,
      input,
      user.organization.id,
      roleId
    );

    let policy1: any = {};
    policy1.type = POLICY_TYPE.ENTITY;
    policy1.permission = POLICY_PERMISSION_ENTITY.READ;
    policy1.resource = POLICY_RESOURCES_ENTITY.USER;
    policy1 = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy1
    );
    let policy2: any = {};
    policy2.type = POLICY_TYPE.ENTITY;
    policy2.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy2.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy2 = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy2
    );
    let policy3: any = {};
    policy3.type = POLICY_TYPE.ENTITY;
    policy3.permission = POLICY_PERMISSION_ENTITY.READ;
    policy3.resource = POLICY_RESOURCES_ENTITY.ORGANIZATION;
    policy3 = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy3
    );

    const savedRole = await accessControlProvider.getRole(manager, role.id);

    const linkedUser = await accessControlProvider.linkUserToRole(
      manager,
      createdUser.id,
      role.id
    );

    const getUser = await userProvider.getUserByIdWithOrgId(
      manager,
      user.id,
      user.organization.id
    );

    expect(createdUser).toBeDefined();
    expect(getUser).toBeDefined();
    expect(getUser.organization).toBeDefined();
    expect(getUser.roles).toBeDefined();
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
