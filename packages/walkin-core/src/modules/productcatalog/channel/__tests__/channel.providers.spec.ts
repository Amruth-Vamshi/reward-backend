// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ChannelProvider } from "../channel.providers";
import { ChannelModule } from "../channel.module";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { CACHING_KEYS, STATUS } from "../../../common/constants";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { getValueFromCache } from "../../../common/utils/redisUtils";
let user: WCoreEntities.User;
let customerForCustomerDeviceTests: WCoreEntities.Customer;
var chance = new Chance();

const channelProvider: ChannelProvider = ChannelModule.injector.get(
  ChannelProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create Channel name", () => {
  test("should create channel name with correct inputs", async () => {
    const manager = getManager();
    const name = chance.string();
    const createChannel = await channelProvider.createChannel(
      manager,
      {
        name: name,
        channelCode: chance.string()
      },
      user.organization.id
    );

    expect(createChannel.name).toBe(name);
  });
  test("should create channel with incorrect inputs", async () => {
    const manager = getManager();
    const name = chance.guid();
    try {
      await channelProvider.createChannel(
        manager,
        {
          name: name,
          channelCode: chance.string()
        },
        chance.guid()
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND));
    }
  });
});

describe("Update a channel name", () => {
  test("should update a channel with valid info", async () => {
    const manager = getManager();
    const name = chance.string();
    const createChannel = await channelProvider.createChannel(
      manager,
      {
        name: name,
        channelCode: chance.string()
      },
      user.organization.id
    );
    const updatedName = chance.string();
    const updateChannel = await channelProvider.updateChannel(
      manager,
      {
        id: createChannel.id,
        name: updatedName
      },
      user.organization.id
    );

    const key = `${CACHING_KEYS.CHANNEL}_${createChannel.id}`;
    const cacheValue = await getValueFromCache(key);

    expect(updateChannel.name).toBe(updatedName);
    expect(cacheValue).toBeNull();
  });

  test("should throw an error for udating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();
    try {
      const updateChannel = await channelProvider.updateChannel(
        manager,
        {
          id: chance.guid(),
          name: updatedName
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND));
    }
  });
});

describe("Should fetch a channel", () => {
  test("should be able to fech a valid channel", async () => {
    const manager = getManager();
    const name = chance.string();
    const createChannel = await channelProvider.createChannel(
      manager,
      {
        name: name,
        channelCode: chance.string()
      },
      user.organization.id
    );

    const getChannel = await channelProvider.getChannel(
      manager,
      {
        id: createChannel.id
      },
      user.organization.id
    );
    expect(getChannel).toBeDefined();
    expect(getChannel.name).toBe(name);
  });

  test("should throw an error ofr invalid channel", async () => {
    const manager = getManager();

    try {
      const getChannel = await channelProvider.getChannel(
        manager,
        {
          id: chance.guid()
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND));
    }
  });
});

describe("Should be able to delete a channel ", () => {
  test("Delete a valid channel ", async () => {
    const manager = getManager();
    const name = chance.string();
    const createChannel = await channelProvider.createChannel(
      manager,
      {
        name: name,
        channelCode: chance.string()
      },
      user.organization.id
    );

    const deleteChannel = await channelProvider.deleteChannel(
      manager,
      createChannel.id,
      user.organization.id
    );

    const cacheKey = `${CACHING_KEYS.CHANNEL}_${createChannel.id}`;
    const cacheValue = await getValueFromCache(cacheKey);

    expect(deleteChannel).toBe(true);
    expect(cacheValue).toBeNull();
  });

  test("should throw an error for deleting a invalid channel", async () => {
    const manager = getManager();
    try {
      const deleteChannel = await channelProvider.deleteChannel(
        manager,
        chance.guid(),
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND));
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
