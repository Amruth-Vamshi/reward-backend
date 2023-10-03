// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { TagProvider } from "../tag.providers";
import { resolvers } from "../tag.resolvers";
import { TagModule } from "../tag.module";
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

const tagProvider: TagProvider = TagModule.injector.get(TagProvider);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create a tag", () => {
  test("should Create a tag with valid values", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await resolvers.Mutation.createTag(
      { user },
      {
        input: {
          name
        }
      },
      { injector: TagModule.injector }
    );

    expect(createTag).toBeDefined();
    expect(createTag.code).toBeDefined();
    expect(createTag.tagName).toBe(name);
  });

  test("should Fail to create a tag with duplicate tag name", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await resolvers.Mutation.createTag(
      { user },
      {
        input: {
          name
        }
      },
      { injector: TagModule.injector }
    );
    try {
      const createTag1 = await resolvers.Mutation.createTag(
        { user },
        {
          input: {
            name
          }
        },
        { injector: TagModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.TAG_NAME_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should update a tag", () => {
  test("should Update a name name with valid input", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await resolvers.Mutation.createTag(
      { user },
      {
        input: {
          name
        }
      },
      { injector: TagModule.injector }
    );
    const newName = chance.string();
    const updateTagName = await resolvers.Mutation.updateTagName(
      { user },
      {
        input: {
          id: createTag.id,
          name: newName
        }
      },
      { injector: TagModule.injector }
    );
    expect(updateTagName).toBeDefined();
    expect(updateTagName.tagName).toBe(newName);
    expect(updateTagName.code).toBeDefined();
  });

  test("should Fail to update a tag name with duplicate name", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await resolvers.Mutation.createTag(
      { user },
      {
        input: {
          name
        }
      },
      { injector: TagModule.injector }
    );
    try {
      const updateTagName = await resolvers.Mutation.updateTagName(
        { user },
        {
          input: {
            id: createTag.id,
            name
          }
        },
        { injector: TagModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.TAG_NAME_ALREADY_EXISTS)
      );
    }
  });

  test("should Fail to update a tag with invalid id", async () => {
    const manager = getManager();
    const name = chance.string();
    try {
      const updateTagName = await resolvers.Mutation.updateTagName(
        { user },
        {
          input: {
            id: chance.guid(),
            name
          }
        },
        { injector: TagModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAG_NOT_FOUND));
    }
  });
});

describe("Should Activate and deactivate a tag", () => {
  test("should deactivate a tag", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await resolvers.Mutation.createTag(
      { user },
      {
        input: { name }
      },
      { injector: TagModule.injector }
    );
    const deactivateTag = await resolvers.Mutation.deactivateTag(
      { user },
      {
        input: { id: createTag.id }
      },
      { injector: TagModule.injector }
    );
    expect(deactivateTag).toBeDefined();
    expect(deactivateTag.active).toBe(false);
  });

  test("should Activate a deactivated tag", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await resolvers.Mutation.createTag(
      { user },
      {
        input: { name }
      },
      { injector: TagModule.injector }
    );
    const deactivateTag = await resolvers.Mutation.deactivateTag(
      { user },
      {
        input: { id: createTag.id }
      },
      { injector: TagModule.injector }
    );

    const activateTag = await resolvers.Mutation.activateTag(
      { user },
      {
        input: { id: deactivateTag.id }
      },
      { injector: TagModule.injector }
    );

    expect(activateTag).toBeDefined();
    expect(activateTag.active).toBe(true);
  });

  test("should throw an error if activating an already active tag", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await resolvers.Mutation.createTag(
      { user },
      {
        input: { name }
      },
      { injector: TagModule.injector }
    );
    try {
      const activateTag = await resolvers.Mutation.activateTag(
        { user },
        {
          input: { id: createTag.id }
        },
        { injector: TagModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAG_ALREADY_ACTIVE));
    }
  });

  test("should throw an error if deactivating an already deactivated tag", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await resolvers.Mutation.createTag(
      { user },
      {
        input: { name }
      },
      { injector: TagModule.injector }
    );
    const deactivateTag = await resolvers.Mutation.deactivateTag(
      { user },
      {
        input: { id: createTag.id }
      },
      { injector: TagModule.injector }
    );

    try {
      await resolvers.Mutation.deactivateTag(
        { user },
        {
          input: { id: deactivateTag.id }
        },
        { injector: TagModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.TAG_ALREADY_DEACTIVATED)
      );
    }
  });
});

describe("Should fetch tags", () => {
  test("should fetch a tag", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await resolvers.Mutation.createTag(
      { user },
      {
        input: { name }
      },
      { injector: TagModule.injector }
    );
    const fetchTag = await resolvers.Query.getTag(
      { user },
      {
        filter: { id: createTag.id }
      },
      { injector: TagModule.injector }
    );

    expect(fetchTag).toBeDefined();
    expect(fetchTag.id).toBe(createTag.id);
    expect(fetchTag.code).toBe(createTag.code);
  });

  test("should Fetch multiple tags", async () => {
    const manager = getManager();
    const name = chance.string();
    const tag1 = await resolvers.Mutation.createTag(
      { user },
      {
        input: { name }
      },
      { injector: TagModule.injector }
    );
    const newName = chance.string();
    const tag2 = await resolvers.Mutation.createTag(
      { user },
      {
        input: { name: newName }
      },
      { injector: TagModule.injector }
    );

    const fetchTags: any = await resolvers.Query.getTags(
      { user },
      {
        filter: { code: [tag1.code, tag2.code] },
        pageOptions: {
          pageSize: 10,
          page: 1
        }
      },
      { injector: TagModule.injector }
    );
    expect(fetchTags).toBeDefined();
    expect(fetchTags.data).toBeDefined();
  });

  test("should Fail to fetch for an invalid input", async () => {
    const manager = getManager();
    try {
      const fetchTag = await resolvers.Query.getTag(
        { user },
        {
          filter: { id: chance.guid() }
        },
        { injector: TagModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAG_NOT_FOUND));
    }
  });
});

afterAll(() => {
  closeUnitTestConnection();
});
