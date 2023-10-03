// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ChannelProvider } from "../channel.providers";
import { ChannelModule } from "../channel.module";
import { resolvers } from "../channel.resolvers";
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
    const createChannel = await resolvers.Mutation.createChannel(
      { user },
      {
        input: {
          name,
          channelCode: chance.string()
        }
      },
      { injector: ChannelModule.injector }
    );

    expect(createChannel.name).toBe(name);
  });
  test("should create channel with incorrect inputs", async () => {
    const manager = getManager();
    const name = chance.guid();
    try {
      await resolvers.Mutation.createChannel(
        { user },
        {
          input: {
            name,
            channelCode: chance.string()
          }
        },
        { injector: ChannelModule.injector }
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
    const createChannel = await resolvers.Mutation.createChannel(
      { user },
      {
        input: {
          name,
          channelCode: chance.string()
        }
      },
      { injector: ChannelModule.injector }
    );
    const updatedName = chance.string();
    const updateChannel = await resolvers.Mutation.updateChannel(
      { user },
      {
        input: {
          id: createChannel.id,
          name: updatedName
        }
      },
      { injector: ChannelModule.injector }
    );

    expect(updateChannel.name).toBe(updatedName);
  });

  test("should throw an error for udating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();
    try {
      const updateChannel = await resolvers.Mutation.updateChannel(
        { user },
        {
          input: {
            id: chance.guid(),
            name: updatedName
          }
        },
        { injector: ChannelModule.injector }
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
    const createChannel = await resolvers.Mutation.createChannel(
      { user },
      {
        input: {
          name,
          channelCode: chance.string()
        }
      },
      { injector: ChannelModule.injector }
    );

    const getChannel = await resolvers.Query.channel(
      { user },
      {
        input: {
          id: createChannel.id
        }
      },
      { injector: ChannelModule.injector }
    );
    expect(getChannel).toBeDefined();
    expect(getChannel.name).toBe(name);
  });

  test("should throw an error ofr invalid channel", async () => {
    const manager = getManager();

    try {
      const getChannel = await resolvers.Query.channel(
        { user },
        {
          input: {
            id: chance.guid()
          }
        },
        { injector: ChannelModule.injector }
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
    const createChannel = await resolvers.Mutation.createChannel(
      { user },
      {
        input: {
          name,
          channelCode: chance.string()
        }
      },
      { injector: ChannelModule.injector }
    );

    const deleteChannel = await resolvers.Mutation.deleteChannel(
      { user },
      { id: createChannel.id },
      { injector: ChannelModule.injector }
    );

    expect(deleteChannel).toBe(true);
  });

  test("should throw an error for deleting a invalid channel", async () => {
    const manager = getManager();
    try {
      const deleteChannel = await resolvers.Mutation.deleteChannel(
        { user },
        { id: chance.guid() },
        { injector: ChannelModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND));
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
