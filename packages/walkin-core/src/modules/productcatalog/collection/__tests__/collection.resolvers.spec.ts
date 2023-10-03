// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { CollectionProvider } from "../collection.providers";
import { resolvers } from "../collection.resolvers";
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

describe("Should Create a Collection", () => {
  test("should Create a Collection with valid values", async () => {
    const manager = getManager();
    const name = chance.string();
    const createCollection = await resolvers.Mutation.createCollection(
      { user },
      {
        input: {
          name
        }
      },
      { injector: CollectionModule.injector }
    );

    expect(createCollection).toBeDefined();
    expect(createCollection.code).toBeDefined();
    expect(createCollection.name).toBe(name);
  });

  test("should Fail to create a Collection with duplicate Collection name", async () => {
    const manager = getManager();
    const name = chance.string();
    const createCollection = await resolvers.Mutation.createCollection(
      { user },
      {
        input: {
          name
        }
      },
      { injector: CollectionModule.injector }
    );
    try {
      const createCollection1 = await resolvers.Mutation.createCollection(
        { user },
        {
          input: {
            name
          }
        },
        { injector: CollectionModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should update a Collection", () => {
  test("should Update a name name with valid input", async () => {
    const manager = getManager();
    const name = chance.string();
    const createCollection = await resolvers.Mutation.createCollection(
      { user },
      {
        input: {
          name
        }
      },
      { injector: CollectionModule.injector }
    );
    const newName = chance.string();
    const updateCollectionName = await resolvers.Mutation.updateCollection(
      { user },
      {
        input: {
          id: createCollection.id,
          name: newName
        }
      },
      { injector: CollectionModule.injector }
    );
    expect(updateCollectionName).toBeDefined();
    expect(updateCollectionName.name).toBe(newName);
    expect(updateCollectionName.code).toBeDefined();
  });

  test("should Fail to update a Collection name with duplicate name", async () => {
    const manager = getManager();
    const name = chance.string();
    const createCollection = await resolvers.Mutation.createCollection(
      { user },
      {
        input: {
          name
        }
      },
      { injector: CollectionModule.injector }
    );
    try {
      const updateCollectionName = await resolvers.Mutation.updateCollection(
        { user },
        {
          input: {
            id: createCollection.id,
            name
          }
        },
        { injector: CollectionModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_EXISTS)
      );
    }
  });

  test("should Fail to update a Collection with invalid id", async () => {
    const manager = getManager();
    const name = chance.string();
    try {
      const updateCollectionName = await resolvers.Mutation.updateCollection(
        { user },
        {
          input: {
            id: chance.guid(),
            name
          }
        },
        { injector: CollectionModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.COLLECTION_NOT_FOUND));
    }
  });
});

describe("Should Activate and deactivate a Collection", () => {
  test("should deactivate a Collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createCollection = await resolvers.Mutation.createCollection(
      { user },
      {
        input: { name }
      },
      { injector: CollectionModule.injector }
    );
    const deactivateCollection = await resolvers.Mutation.deactivateCollection(
      { user },
      {
        input: { id: createCollection.id }
      },
      { injector: CollectionModule.injector }
    );
    expect(deactivateCollection).toBeDefined();
    expect(deactivateCollection.active).toBe(false);
  });

  test("should Activate a deactivated Collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createCollection = await resolvers.Mutation.createCollection(
      { user },
      {
        input: { name }
      },
      { injector: CollectionModule.injector }
    );
    const deactivateCollection = await resolvers.Mutation.deactivateCollection(
      { user },
      {
        input: { id: createCollection.id }
      },
      { injector: CollectionModule.injector }
    );

    const activateCollection = await resolvers.Mutation.activateCollection(
      { user },
      {
        input: { id: deactivateCollection.id }
      },
      { injector: CollectionModule.injector }
    );

    expect(activateCollection).toBeDefined();
    expect(activateCollection.active).toBe(true);
  });

  test("should throw an error if activating an already active Collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createCollection = await resolvers.Mutation.createCollection(
      { user },
      {
        input: { name }
      },
      { injector: CollectionModule.injector }
    );
    try {
      const activateCollection = await resolvers.Mutation.activateCollection(
        { user },
        {
          input: { id: createCollection.id }
        },
        { injector: CollectionModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_ACTIVE)
      );
    }
  });

  test("should throw an error if deactivating an already deactivated Collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createCollection = await resolvers.Mutation.createCollection(
      { user },
      {
        input: { name }
      },
      { injector: CollectionModule.injector }
    );
    const deactivateCollection = await resolvers.Mutation.deactivateCollection(
      { user },
      {
        input: { id: createCollection.id }
      },
      { injector: CollectionModule.injector }
    );

    try {
      await resolvers.Mutation.deactivateCollection(
        { user },
        {
          input: { id: deactivateCollection.id }
        },
        { injector: CollectionModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_DEACTIVATED)
      );
    }
  });
});

describe("Should fetch Collections", () => {
  test("should fetch a Collection", async () => {
    const manager = getManager();
    const name = chance.string();
    const createCollection = await resolvers.Mutation.createCollection(
      { user },
      {
        input: { name }
      },
      { injector: CollectionModule.injector }
    );
    const fetchCollection = await resolvers.Query.getCollection(
      { user },
      {
        filter: { id: createCollection.id }
      },
      { injector: CollectionModule.injector }
    );

    expect(fetchCollection).toBeDefined();
    expect(fetchCollection.id).toBe(createCollection.id);
    expect(fetchCollection.code).toBe(createCollection.code);
  });

  test("should Fetch multiple Collections", async () => {
    const manager = getManager();
    const name = chance.string();
    const Collection1 = await resolvers.Mutation.createCollection(
      { user },
      {
        input: { name }
      },
      { injector: CollectionModule.injector }
    );
    const newName = chance.string();
    const Collection2 = await resolvers.Mutation.createCollection(
      { user },
      {
        input: { name: newName }
      },
      { injector: CollectionModule.injector }
    );

    const fetchCollections: any = await resolvers.Query.getCollections(
      { user },
      {
        filter: { code: [Collection1.code, Collection2.code] },
        pageOptions: {
          pageSize: 10,
          page: 1
        }
      },
      { injector: CollectionModule.injector }
    );
    expect(fetchCollections).toBeDefined();
    expect(fetchCollections.data).toBeDefined();
  });

  test("should Fail to fetch for an invalid input", async () => {
    const manager = getManager();
    try {
      const fetchCollection = await resolvers.Query.getCollection(
        { user },
        {
          filter: { id: chance.guid() }
        },
        { injector: CollectionModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.COLLECTION_NOT_FOUND));
    }
  });
});

afterAll(() => {
  closeUnitTestConnection();
});
