import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser,
  loadTestKeys
} from "../../../../../__tests__/utils/unit";
import { WCoreEntities } from "../../../../index";
import { getConnection, getManager } from "typeorm";
import { User, Organization } from "../../../../entity";
import { Chance } from "chance";
import { UserModule } from "../../user/user.module";
import { Users } from "../../user/user.providers";
import { IUserInput } from "../../../../../__tests__/utils/unit/UnitfactorySetup";
import { unloadTestKeys } from "../../../../../__tests__/utils/unit/loadKeys";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { decode } from "jsonwebtoken";
import { OrganizationModule } from "../organization.module";
import { Organizations } from "../organization.providers";
import { ORGANIZATION_TYPES, STATUS } from "../../../common/constants";
import { StoreFormatModule } from "../../../productcatalog/storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../../productcatalog/storeformat/storeFormat.providers";
import { TaxTypeModule } from "../../../productcatalog/taxtype/taxtype.module";
import { TaxTypeProvider } from "../../../productcatalog/taxtype/taxtype.providers";
import { CatalogProvider } from "../../../productcatalog/catalog/catalog.providers";
import { CatalogModule } from "../../../productcatalog/catalog/catalog.module";
import { ChannelProvider } from "../../../productcatalog/channel/channel.providers";
import { ChannelModule } from "../../../productcatalog/channel/channel.module";

let user: User;
let userInput: IUserInput;

const chance = new Chance();
const organizationProvider = OrganizationModule.injector.get(Organizations);
const storeFormatProvider = StoreFormatModule.injector.get(StoreFormatProvider);
const taxTypeProvider = TaxTypeModule.injector.get(TaxTypeProvider);
const catalogProvider = CatalogModule.injector.get(CatalogProvider);
const channelProvider = ChannelModule.injector.get(ChannelProvider);
const userProvider = UserModule.injector.get(Users);
beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user, userInput } = await getAdminUser(getConnection()));
  loadTestKeys();
});

describe("addAdmin", () => {
  test("should addAdmin", async () => {
    const manager = getManager();
    const organization = await organizationProvider.createOrganization(
      manager,
      {
        name: chance.company(),
        organizationType: ORGANIZATION_TYPES.ORGANIZATION,
        status: STATUS.ACTIVE,
        code: chance.string({ length: 5 })
      }
    );
    const newUser = await userProvider.createUser(manager, {
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });
    const organizationWithAdmin = await organizationProvider.addAdmin(
      manager,
      organization,
      newUser
    );
    const fetchedUser = await userProvider.getUserById(manager, newUser.id);
    expect(organizationWithAdmin.users[0]).toMatchObject(newUser);
  });
});
describe("createOrganization", () => {
  test("should createOrganization", async () => {
    const manager = getManager();
    const organizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdOrganization = await organizationProvider.createOrganization(
      manager,
      organizationInput
    );
    expect(createdOrganization.id).toBeDefined();
    expect(createdOrganization.name).toBe(organizationInput.name);
    expect(createdOrganization.code).toBe(organizationInput.code);
    expect(createdOrganization.status).toBe(organizationInput.status);
    expect(createdOrganization.organizationType).toBe(
      organizationInput.organizationType
    );
  });
  test("should child createOrganization", async () => {
    const manager = getManager();
    const rootOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdRootOrganization = await organizationProvider.createOrganization(
      manager,
      rootOrganizationInput
    );
    const childOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdChildOrganization = await organizationProvider.createOrganization(
      manager,
      childOrganizationInput,
      createdRootOrganization.id
    );
    const fetchedChildOrganization = await organizationProvider.getOrganization(
      manager,
      createdChildOrganization.id
    );
    expect(fetchedChildOrganization.parent).toMatchObject(
      createdRootOrganization
    );
  });
});
describe("createStore", () => {
  test("should createStore", async () => {
    const manager = getManager();
    const rootOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };

    const createdRootOrganization = await organizationProvider.createOrganization(
      manager,
      rootOrganizationInput
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      createdRootOrganization.id
    );

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      organizationId: createdRootOrganization.id,
      catalogCode: chance.string({ length: 5 }),
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      description: "",
      status: STATUS.ACTIVE,
      organizationId: createdRootOrganization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.company(),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: createdRootOrganization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const store = await organizationProvider.createStore(
      manager,
      createdRootOrganization,
      {
        storeFormat,
        catalog,
        channels: [channel]
      }
    );
    expect(store.id).toBeDefined();
    expect(store.name).toBe(createdRootOrganization.name);
  });
});
describe("deleteOrganization", () => {
  test.skip("should deleteOrganization", async () => {
    const manager = getManager();
    const rootOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdRootOrganization = await organizationProvider.createOrganization(
      manager,
      rootOrganizationInput
    );
    const fetchedOrganization = await organizationProvider.getOrganization(
      manager,
      createdRootOrganization.id
    );
    expect(fetchedOrganization).toMatchObject(createdRootOrganization);
    const deletedOrganization = await organizationProvider.deleteOrganization(
      manager,
      fetchedOrganization.id
    );
    expect(deletedOrganization.id).toBeUndefined();
    try {
      const fetchedDeletedOrganization = await organizationProvider.getOrganization(
        manager,
        createdRootOrganization.id
      );
    } catch (error) {
      console.log(error);

      expect(error).toBeInstanceOf(WCoreError);
      expect(error).toMatchObject(
        new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND)
      );
    }
  });
});
describe("deleteOrganizationHierarchy", () => {
  test.skip("should deleteOrganizationHierarchy", async () => {
    const manager = getManager();
    const rootOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdRootOrganization = await organizationProvider.createOrganization(
      manager,
      rootOrganizationInput
    );
    for (let i = 0; i < 5; i++) {
      const childOrganizationInput: Partial<Organization> = {
        name: chance.company(),
        code: chance.string({ length: 5 }),
        status: STATUS.ACTIVE,
        organizationType: ORGANIZATION_TYPES.ORGANIZATION
      };
      const createdChildOrganization = await organizationProvider.createOrganization(
        manager,
        childOrganizationInput,
        createdRootOrganization.id
      );
    }

    const deletedHierarchy = await organizationProvider.deleteOrganizationHierarchy(
      manager,
      createdRootOrganization.id
    );
    console.log(deletedHierarchy);

    expect(deletedHierarchy).toHaveLength(6);
  });
});
describe("getOrganization", () => {
  test("should getOrganization", async () => {
    const manager = getManager();
    const rootOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdRootOrganization = await organizationProvider.createOrganization(
      manager,
      rootOrganizationInput
    );
    const fetchedOganization = await organizationProvider.getOrganization(
      manager,
      createdRootOrganization.id
    );
    expect(fetchedOganization).toMatchObject(createdRootOrganization);
  });
  test.skip("should not getOrganization", async () => {
    const manager = getManager();
    try {
      const fetchedOganization = await organizationProvider.getOrganization(
        manager,
        chance.string({ length: 5 })
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error).toMatchObject(
        new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND)
      );
    }
  });
});
describe("getOrganizationById", () => {
  test("should getOrganizationById", async () => {
    const manager = getManager();
    const rootOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdRootOrganization = await organizationProvider.createOrganization(
      manager,
      rootOrganizationInput
    );
    const fetchedOganization = await organizationProvider.getOrganizationById(
      manager,
      createdRootOrganization.id
    );
    expect(fetchedOganization).toMatchObject(createdRootOrganization);
  });
  test.skip("should not getOrganizationID", async () => {
    const manager = getManager();
    try {
      const fetchedOganization = await organizationProvider.getOrganization(
        manager,
        chance.string({ length: 5 })
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error).toMatchObject(
        new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND)
      );
    }
  });
});
describe("getOrganizationHierarchies", () => {
  test.skip("should getOrganizationHierarchies", async () => {
    const manager = getManager();
    const rootOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdRootOrganization = await organizationProvider.createOrganization(
      manager,
      rootOrganizationInput
    );
    const childrenArray = [];
    for (let i = 0; i < 5; i++) {
      const childOrganizationInput: Partial<Organization> = {
        name: chance.company(),
        code: chance.string({ length: 5 }),
        status: STATUS.ACTIVE,
        organizationType: ORGANIZATION_TYPES.ORGANIZATION
      };
      const createdChildOrganization = await organizationProvider.createOrganization(
        manager,
        childOrganizationInput,
        createdRootOrganization.id
      );
      childrenArray.push(createdChildOrganization);
    }
    const organizationHierarhies = await organizationProvider.getOrganizationHierarchies(
      manager
    );
    expect(organizationHierarhies[0].children).toHaveLength(5);
  });
});
describe("getOrganizationHierarchy", () => {
  test("should getOrganizationHierarchy", async () => {
    const manager = getManager();
    const rootOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdRootOrganization = await organizationProvider.createOrganization(
      manager,
      rootOrganizationInput
    );
    const childrenArray = [];
    for (let i = 0; i < 5; i++) {
      const childOrganizationInput: Partial<Organization> = {
        name: chance.company(),
        code: chance.string({ length: 5 }),
        status: STATUS.ACTIVE,
        organizationType: ORGANIZATION_TYPES.ORGANIZATION
      };
      const createdChildOrganization = await organizationProvider.createOrganization(
        manager,
        childOrganizationInput,
        createdRootOrganization.id
      );
      childrenArray.push(createdChildOrganization);
    }
    const organizationHierarhy = await organizationProvider.getOrganizationHierarchy(
      manager,
      createdRootOrganization.id
    );
    expect(organizationHierarhy.children).toHaveLength(5);
  });
});
describe.skip("getOrganizationRoots", () => {
  test("should getOrganizationRoots", async () => {
    const manager = getManager();
    for (let i = 0; i < 5; i++) {
      const rootOrganizationInput: Partial<Organization> = {
        name: chance.company(),
        code: chance.string({ length: 5 }),
        status: STATUS.ACTIVE,
        organizationType: ORGANIZATION_TYPES.ORGANIZATION
      };
      const createdRootOrganization = await organizationProvider.createOrganization(
        manager,
        rootOrganizationInput
      );
    }

    const organizationRoots = await organizationProvider.getOrganizationRoots(
      manager
    );
    expect(organizationRoots).toHaveLength(5);
  });
});
describe.skip("getOrganizations", () => {
  test("should getOrganizations", async () => {
    const manager = getManager();
    for (let i = 0; i < 2; i++) {
      const rootOrganizationInput: Partial<Organization> = {
        name: chance.company(),
        code: chance.string({ length: 5 }),
        status: STATUS.ACTIVE,
        organizationType: ORGANIZATION_TYPES.ORGANIZATION
      };
      const createdRootOrganization = await organizationProvider.createOrganization(
        manager,
        rootOrganizationInput
      );
      for (let i = 0; i < 2; i++) {
        const childOrganizationInput: Partial<Organization> = {
          name: chance.company(),
          code: chance.string({ length: 5 }),
          status: STATUS.ACTIVE,
          organizationType: ORGANIZATION_TYPES.ORGANIZATION
        };
        const createdChildOrganization = await organizationProvider.createOrganization(
          manager,
          childOrganizationInput,
          createdRootOrganization.id
        );
      }
    }

    const allOrganizations = await organizationProvider.getOrganizations(
      manager
    );
    expect(allOrganizations).toHaveLength(4);
  });
});
describe.skip("getOrganizationRoots", () => {
  test("should getOrganizationRoots", async () => {
    organizationProvider.getOrganizationRoots;
  });
});
describe.skip("linkOrganizationToMetrics", () => {
  test("should linkOrganizationToMetrics", async () => {
    organizationProvider.linkOrganizationToMetrics;
  });
});
describe.skip("linkOrganizationToWalkinProducts", () => {
  test("should linkOrganizationToWalkinProducts", async () => {
    organizationProvider.linkOrganizationToWalkinProducts;
  });
});
describe.skip("linkUserToOrganization", () => {
  test("should linkUserToOrganization", async () => {
    organizationProvider.linkUserToOrganization;
  });
});
describe.skip("subOrganizations", () => {
  test("should subOrganizations", async () => {
    organizationProvider.subOrganizations;
  });
});
describe.skip("updateOrganization", () => {
  test("should updateOrganization", async () => {
    organizationProvider.updateOrganization;
  });
});

describe("Update Organization", () => {
  test("should update Organization", async () => {
    const manager = getManager();
    const createOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdOrganization = await organizationProvider.createOrganization(
      manager,
      createOrganizationInput
    );

    const updateOrganizationInput = {
      id: createdOrganization.id,
      name: chance.company(),
      code: "updated_code"
    };
    const updateOrganization = await organizationProvider.updateOrganization(
      manager,
      updateOrganizationInput
    );

    expect(updateOrganization.id).toEqual(createdOrganization.id);
    expect(updateOrganization.code).toEqual("updated_code");
  });
  test("should throw error Org code exist", async () => {
    const manager = getManager();
    const createOrganizationInput: Partial<Organization> = {
      name: chance.company(),
      code: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };
    const createdOrganization = await organizationProvider.createOrganization(
      manager,
      createOrganizationInput
    );

    const createOrganizationInput2: Partial<Organization> = {
      name: chance.company(),
      code: "new_code",
      status: STATUS.ACTIVE,
      organizationType: ORGANIZATION_TYPES.ORGANIZATION
    };

    const createdOrganization2 = await organizationProvider.createOrganization(
      manager,
      createOrganizationInput2
    );

    const updateOrganizationInput2 = {
      id: createdOrganization.id,
      name: chance.company(),
      code: "new_code"
    };
    try {
      const updateOrganization2 = await organizationProvider.updateOrganization(
        manager,
        updateOrganizationInput2
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error).toMatchObject(new WCoreError(WCORE_ERRORS.ORG_CODE_EXISTS));
    }
  });
});

afterAll(async () => {
  unloadTestKeys();
  await closeUnitTestConnection();
});
