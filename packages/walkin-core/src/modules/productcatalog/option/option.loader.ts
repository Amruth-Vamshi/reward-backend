import Dataloader from "dataloader";
import { getManager, In } from "typeorm";
import { Option, OptionValue } from "../../../entity";
import { CACHE_TTL, CACHING_KEYS, EXPIRY_MODE } from "../../common/constants";
import { getValueFromCache, setValueToCache } from "../../common/utils/redisUtils";

export const optionValuesLoader = () => {
  return new Dataloader(getOptionValues);
};

async function getOptionValues(options: any) {
  const optionIds = options.map(option => option.id);
  const optionValuesMapping = {};

  const optionValues = await getManager().find(OptionValue, {
    where: {
      option: {
        id: In(optionIds)
      }
    },
    order: {
      sortSeq: "ASC"
    },
    relations: ["option"]
  });

  for (const optionValue of optionValues) {
    const optionId = optionValue.option.id;

    if (optionValuesMapping[optionId]) {
      optionValuesMapping[optionId].push(optionValue);
    } else {
      optionValuesMapping[optionId] = [optionValue];
    }
  }

  return optionIds.map(id =>
    optionValuesMapping[id] ? optionValuesMapping[id] : []
  );
}

export const optionValuesByIdLoader = () => {
  return new Dataloader(getOptionValuesById);
};

async function getOptionValuesById(optionValueIds: any) {
  const optionValuesMap = {};
  const optionValues = await getManager().find(OptionValue, {
    where: {
      id: In(optionValueIds)
    }
  });

  for (const optionValue of optionValues) {
    optionValuesMap[optionValue.id] = optionValue;
  }
  return optionValueIds.map(id => optionValuesMap[id]);
}

export const optionsLoader = () => {
  return new Dataloader(getOptions);
};

async function getOptions(optionValues: any) {
  const optionIds = optionValues.map(optionValue => optionValue.optionId);
  const optionIdsMapping = {};
  const foundOptions = {};
  const optionIdsTobeFetched = [];
  const organizationId = optionValues[0].organizationId;


  for (const optionId of optionIds) {
    const key = `${CACHING_KEYS.OPTION}_${optionId}`;
    let option: any = await getValueFromCache(key);
    if (option) {
      foundOptions[optionId] = option;
    } else {
      optionIdsTobeFetched.push(optionId);
    }
  }

  if (optionIdsTobeFetched.length > 0) {
    const options = await getManager().find(Option, {
      where: {
        id: In(optionIdsTobeFetched),
        organization: organizationId
      },
      relations: ["organization"]
    });

    for (const option of options) {
      const optionId = option.id;

      // Set option details in Mapping object
      optionIdsMapping[optionId] = option;

      // Set option details in Memory
      const key: any = `${CACHING_KEYS.OPTION}_${optionId}`;
      const value: any = option;
      await setValueToCache(key, value, EXPIRY_MODE.EXPIRE, CACHE_TTL);
    }
  }

  const combinedOptions = { ...foundOptions, ...optionIdsMapping };
  return optionIds.map(id => combinedOptions[id]);
}
