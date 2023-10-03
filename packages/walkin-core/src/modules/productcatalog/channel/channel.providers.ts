import { Injectable, Inject } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import { Channel, Organization, ChargeType } from "../../../entity";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { updateEntity, addPaginateInfo } from "../../common/utils/utils";
import { ChargeTypeProvider } from "../chargeType/chargeType.providers";
import {
  clearEntityCache,
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import { CACHE_TTL, CACHING_KEYS, EXPIRY_MODE } from "../../common/constants";
@Injectable()
class ChannelProvider {
  constructor(
    @Inject(ChargeTypeProvider) private chargeTypeProvider: ChargeTypeProvider
  ) {}

  public async getChannel(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<Channel> {
    const { name, id, channelCode } = input;
    const filter = {
      organization: organizationId
    };
    if (id) {
      filter["id"] = id;
    }
    if (name) {
      filter["name"] = name;
    }
    if (channelCode) {
      filter["channelCode"] = channelCode;
    }
    console.log(filter);
    let foundChannel;
    try {
      foundChannel = await entityManager.findOne(Channel, {
        where: {
          ...filter
        },
        relations: ["organization", "chargeTypes"]
      });
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
    console.log(foundChannel);
    if (!foundChannel) {
      throw new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND);
    }
    return foundChannel;
  }

  @addPaginateInfo
  public async getChannelsForOrganization(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<[Channel[], number]> {
    const filter = {
      organization: organizationId
    };
    if (input && input.id) {
      filter["id"] = In(input.id);
    }
    if (input && input.name) {
      filter["name"] = In(input.name);
    }
    if (input && input.channelCode) {
      filter["channelCode"] = In(input.channelCode);
    }
    let foundChannels;
    try {
      foundChannels = await entityManager.findAndCount(Channel, {
        where: {
          ...filter
        },
        relations: ["organization", "chargeTypes"]
      });
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
    if (foundChannels.length === 0) {
      throw new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND);
    }
    return foundChannels;
  }

  public async createChannel(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<Channel> {
    const { name, channelCode, chargeTypeCode } = input;
    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId
      }
    });
    const channelSchema = {
      name,
      organization,
      channelCode
    };
    if (chargeTypeCode) {
      for (const ctc of chargeTypeCode) {
        if (ctc === "") {
          throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
        }
      }
      if (chargeTypeCode.length > 0) {
        const chargeTypeCodes = await this.chargeTypeProvider.getChargeTypeForOrganization(
          entityManager,
          {
            chargeTypeCode
          },
          organizationId
        );
        channelSchema["chargeTypes"] = chargeTypeCodes;
      }
    }

    const channel = entityManager.create(Channel, channelSchema);
    try {
      const savedChannel = await entityManager.save(channel);
      return entityManager.findOne(Channel, {
        where: {
          id: savedChannel.id
        },
        relations: ["organization", "chargeTypes", "chargeTypes.organization"]
      });
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.CHANNEL_CODE_EXISTS);
    }
  }

  public async updateChannel(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<Channel> {
    const { id, name, channelCode, chargeTypeCode } = input;
    const update = {};
    if (name) {
      update["name"] = name;
    }
    if (channelCode) {
      update["channelCode"] = channelCode;
    }
    const foundChannelCode = await entityManager.findOne(Channel, {
      where: {
        channelCode,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (foundChannelCode) {
      throw new WCoreError(WCORE_ERRORS.CHANNEL_CODE_EXISTS);
    }
    if (chargeTypeCode && chargeTypeCode.length > 0) {
      const chargeTypeCodes = await this.chargeTypeProvider.getChargeTypeForOrganization(
        entityManager,
        {
          chargeTypeCode
        },
        organizationId
      );
      update["chargeTypes"] = chargeTypeCodes;
    }

    const filterOptions = { id, organization: organizationId };
    const foundChannel = await entityManager.findOne(Channel, {
      where: {
        ...filterOptions
      }
    });
    if (!foundChannel) {
      throw new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND);
    }
    await clearEntityCache("store", () => {
      console.log("Store Cache removed");
    });
    const keys = [`${CACHING_KEYS.CHANNEL}_${foundChannel.id}`];
    removeValueFromCache(keys);
    const updatedEntity = await updateEntity(foundChannel, update);
    const savedUpdatedEntity = await entityManager.save(updatedEntity);
    return savedUpdatedEntity;
  }

  public async deleteChannel(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<boolean> {
    const findChannel = await entityManager.findOne(Channel, {
      where: {
        id,
        organization: organizationId
      }
    });
    if (!findChannel) {
      throw new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND);
    }
    await clearEntityCache("store", () => {
      console.log("Store Cache removed");
    });
    const keys = [`${CACHING_KEYS.CHANNEL}_${findChannel.id}`];
    removeValueFromCache(keys);
    try {
      const deleteChannel = await entityManager.remove(findChannel);
      return true;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  public async getChannelByCode(
    entityManager,
    input,
    organizationId
  ): Promise<Channel | any> {
    const { channelCode } = input;
    const key = `${CACHING_KEYS.CHANNEL}_${channelCode}_${organizationId}`;

    let channel = await getValueFromCache(key);
    if (!channel) {
      channel = await entityManager.findOne(Channel, {
        where: {
          channelCode,
          organization: organizationId
        },
        relations: ["organization", "chargeTypes"]
      });
      if (channel) {
        await setValueToCache(key, channel, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
    }
    return channel;
  }

  public async getChannelById(
    entityManager,
    channelId,
    organizationId
  ): Promise<Channel | any> {
    const key = `${CACHING_KEYS.CHANNEL}_${channelId}`;
    let foundChannel: any = await getValueFromCache(key);
    if (!foundChannel) {
      foundChannel = await entityManager.findOne(Channel, {
        where: {
          id: channelId,
          organization: organizationId
        }
      });
      if (foundChannel) {
        await setValueToCache(key, foundChannel, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
    }
    return foundChannel;
  }
}
export { ChannelProvider };
