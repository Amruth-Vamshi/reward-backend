// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { CollectionProvider } from "../collection.providers";
import { CollectionModule } from "../collection.module";
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

const collectionProvider: CollectionProvider = CollectionModule.injector.get(
  CollectionProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create a collection", () => {
  test("should Create a collection with valid values", async () => {
    const manager = getManager();
    const name = chance.string();
    const createcollection = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );

    expect(createcollection).toBeDefined();
    expect(createcollection.code).toBeDefined();
    expect(createcollection.name).toBe(name);
  });

  test("should Fail to create a collection with invalid input", async () => {
    const manager = getManager();
    const name = chance.string();
    try {
      const createcollection = await collectionProvider.createCollection(
        manager,
        {
          name
        },
        chance.guid()
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND)
      );
    }
  });
  test("should Fail to create a collection with duplicate collection name", async () => {
    const manager = getManager();
    const name = chance.string();
    const createcollection = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );
    try {
      const createcollection1 = await collectionProvider.createCollection(
        manager,
        {
          name
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should update a collection", () => {
  test("should Update a name name with valid input", async () => {
    const manager = getManager();
    const name = chance.string();
    const createcollection = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );
    const newName = chance.string();
    const updatecollectionName = await collectionProvider.updateCollection(
      manager,
      {
        id: createcollection.id,
        name: newName
      },
      user.organization.id
    );
    expect(updatecollectionName).toBeDefined();
    expect(updatecollectionName.name).toBe(newName);
    expect(updatecollectionName.code).toBeDefined();
  });

  test("should Fail to update a collection name with duplicate name", async () => {
    const manager = getManager();
    const name = chance.string();
    const createcollection = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );
    try {
      const updatecollectionName = await collectionProvider.updateCollection(
        manager,
        {
          id: createcollection.id,
          name
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_ACTIVE)
      );
    }
  });

  test("should Fail to update a collection with invalid id", async () => {
    const manager = getManager();
    const name = chance.string();
    try {
      const updatecollectionName = await collectionProvider.updateCollection(
        manager,
        {
          id: chance.guid(),
          name
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.COLLECTION_NOT_FOUND));
    }
  });
});

describe("Should Activate and deactivate a collection", () => {
  test("should deactivate a collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createcollection = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );
    const deactivatecollection = await collectionProvider.deactivateCollection(
      manager,
      {
        id: createcollection.id
      },
      user.organization.id
    );
    expect(deactivatecollection).toBeDefined();
    expect(deactivatecollection.active).toBe(false);
  });

  test("should Activate a deactivated collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createcollection = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );
    const deactivatecollection = await collectionProvider.deactivateCollection(
      manager,
      {
        id: createcollection.id
      },
      user.organization.id
    );

    const activatecollection = await collectionProvider.activateCollection(
      manager,
      {
        id: deactivatecollection.id
      },
      user.organization.id
    );

    expect(activatecollection).toBeDefined();
    expect(activatecollection.active).toBe(true);
  });

  test("should throw an error if activating an already active collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createcollection = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );
    try {
      const activatecollection = await collectionProvider.activateCollection(
        manager,
        {
          id: createcollection.id
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_ACTIVE)
      );
    }
  });

  test("should throw an error if deactivating an already deactivated collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createcollection = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );
    const deactivatecollection = await collectionProvider.deactivateCollection(
      manager,
      {
        id: createcollection.id
      },
      user.organization.id
    );

    try {
      await collectionProvider.deactivateCollection(
        manager,
        {
          id: deactivatecollection.id
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_DEACTIVATED)
      );
    }
  });
});

describe("Should fetch collections", () => {
  test("should fetch a collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createcollection = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );
    const fetchcollection = await collectionProvider.getCollection(
      manager,
      {
        id: createcollection.id
      },
      user.organization.id
    );

    expect(fetchcollection).toBeDefined();
    expect(fetchcollection.id).toBe(createcollection.id);
    expect(fetchcollection.code).toBe(createcollection.code);
  });

  test("should Fetch multiple collections", async () => {
    const manager = getManager();
    const name = chance.string();
    const collection1 = await collectionProvider.createCollection(
      manager,
      {
        name
      },
      user.organization.id
    );
    const newName = chance.string();
    const collection2 = await collectionProvider.createCollection(
      manager,
      {
        name: newName
      },
      user.organization.id
    );

    const fetchcollections: any = await collectionProvider.getCollections(
      manager,
      {
        pageSize: 10,
        page: 1
      },
      undefined,
      {
        code: [collection1.code, collection2.code]
      }
    );
    expect(fetchcollections).toBeDefined();
    expect(fetchcollections.data).toBeDefined();
  });

  test("should Fail to fetch for an invalid input", async () => {
    const manager = getManager();
    try {
      const fetchcollection = await collectionProvider.getCollection(
        manager,
        {
          id: chance.guid()
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.COLLECTION_NOT_FOUND));
    }
  });
});

afterAll(() => {
  closeUnitTestConnection();
});
