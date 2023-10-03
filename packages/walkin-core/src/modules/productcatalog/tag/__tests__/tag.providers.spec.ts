// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { TagProvider } from "../tag.providers";
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
    const createTag = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );

    expect(createTag).toBeDefined();
    expect(createTag.code).toBeDefined();
    expect(createTag.tagName).toBe(name);
  });

  test("should Fail to create a tag with invalid input", async () => {
    const manager = getManager();
    const name = chance.string();
    try {
      const createTag = await tagProvider.createTag(
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
  test("should Fail to create a tag with duplicate tag name", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );
    try {
      const createTag1 = await tagProvider.createTag(
        manager,
        {
          name
        },
        user.organization.id
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
    const createTag = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );
    const newName = chance.string();
    const updateTagName = await tagProvider.updateTagName(
      manager,
      {
        id: createTag.id,
        name: newName
      },
      user.organization.id
    );
    expect(updateTagName).toBeDefined();
    expect(updateTagName.tagName).toBe(newName);
    expect(updateTagName.code).toBeDefined();
  });

  test("should Fail to update a tag name with duplicate name", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );
    try {
      const updateTagName = await tagProvider.updateTagName(
        manager,
        {
          id: createTag.id,
          name
        },
        user.organization.id
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
      const updateTagName = await tagProvider.updateTagName(
        manager,
        {
          id: chance.guid(),
          name
        },
        user.organization.id
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
    const createTag = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );
    const deactivateTag = await tagProvider.deactivateTag(
      manager,
      {
        id: createTag.id
      },
      user.organization.id
    );
    expect(deactivateTag).toBeDefined();
    expect(deactivateTag.active).toBe(false);
  });

  test("should Activate a deactivated tag", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );
    const deactivateTag = await tagProvider.deactivateTag(
      manager,
      {
        id: createTag.id
      },
      user.organization.id
    );

    const activateTag = await tagProvider.reActivateTag(
      manager,
      {
        id: deactivateTag.id
      },
      user.organization.id
    );

    expect(activateTag).toBeDefined();
    expect(activateTag.active).toBe(true);
  });

  test("should throw an error if activating an already active tag", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );
    try {
      const activateTag = await tagProvider.reActivateTag(
        manager,
        {
          id: createTag.id
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAG_ALREADY_ACTIVE));
    }
  });

  test("should throw an error if deactivating an already deactivated tag", async () => {
    const manager = getManager();
    const name = chance.string();
    const createTag = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );
    const deactivateTag = await tagProvider.deactivateTag(
      manager,
      {
        id: createTag.id
      },
      user.organization.id
    );

    try {
      await tagProvider.deactivateTag(
        manager,
        {
          id: deactivateTag.id
        },
        user.organization.id
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
    const createTag = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );
    const fetchTag = await tagProvider.getTag(
      manager,
      {
        id: createTag.id
      },
      user.organization.id
    );

    expect(fetchTag).toBeDefined();
    expect(fetchTag.id).toBe(createTag.id);
    expect(fetchTag.code).toBe(createTag.code);
  });

  test("should Fetch multiple tags", async () => {
    const manager = getManager();
    const name = chance.string();
    const tag1 = await tagProvider.createTag(
      manager,
      {
        name
      },
      user.organization.id
    );
    const newName = chance.string();
    const tag2 = await tagProvider.createTag(
      manager,
      {
        name: newName
      },
      user.organization.id
    );

    const fetchTags = await tagProvider.getTags(
      manager,
      {
        code: [tag1.code, tag2.code]
      },
      user.organization.id,
      {
        pageSize: 10,
        page: 1
      }
    );
    expect(fetchTags).toBeDefined();
    expect(fetchTags.data).toBeDefined();
  });

  test("should Fail to fetch for an invalid input", async () => {
    const manager = getManager();
    try {
      const fetchTag = await tagProvider.getTag(
        manager,
        {
          id: chance.guid()
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.TAG_NOT_FOUND));
    }
  });
});

afterAll(() => {
  closeUnitTestConnection();
});
