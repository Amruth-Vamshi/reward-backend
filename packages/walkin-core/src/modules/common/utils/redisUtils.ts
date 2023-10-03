import Redis from "ioredis";

const client: Redis.Redis = new Redis({
  host: process.env.REDIS_HOST,
  // tslint:disable-next-line:radix
  port: parseInt(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  db: process.env.REDIS_CACHE_DB ? Number(process.env.REDIS_CACHE_DB) : 1
});

export const getValueFromCache = async (key: string) => {
  let cachedValue = await client.get(key);
  if (cachedValue) {
    cachedValue = JSON.parse(cachedValue);
    return cachedValue;
  }
  return cachedValue;
};

export const removeValueFromCache = async (key: Redis.KeyType[]) => {
  const removedValue = await client.del(...key);
  return removedValue;
};

/**
 * This function remove all values from the cache for an entity
 * pass store and it will remove all cached entries related to store
 *
 */
export const clearEntityCache = async (entity: string, callback) => {
  const dataStream = client.scanStream({
    match: `${entity}_*`
  });
  dataStream.on("data", keys => {
    // `keys` is an array of strings representing key names
    const pipeline = client.pipeline();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < keys.length; i++) {
      const key: any = keys[i];
      console.log("data", key);
      pipeline.del(key);
    }
    pipeline.exec();
  });
  dataStream.on("end", callback);
};

export const clearAllKeys = () => {
  client.flushdb(function(err, succeeded) {
    console.log("Cleared entire cache successfully", succeeded); // will be true if successfull
  });
};

export const clearKeysByPattern = (pattern: string) => {
  client.keys(pattern).then(function(keys) {
    var pipeline = client.pipeline();
    keys.forEach(function(key) {
      pipeline.del(key);
    });
    return pipeline.exec();
  });
};

export const setValueToCache = async (
  key: Redis.KeyType,
  value: Redis.ValueType,
  expiryMode?: string,
  ttl?: string | number
) => {
  const cacheValue = JSON.stringify(value);
  let setCachedValue;
  if (expiryMode && ttl) {
    setCachedValue = await client.set(key, cacheValue, expiryMode, ttl);
  } else {
    setCachedValue = await client.set(key, cacheValue);
  }
  return setCachedValue;
};

export const setHashValueToCache = async (
  key: Redis.KeyType,
  field: string,
  value: Redis.ValueType
) => {
  const cachedValue = await client.hset(key, field, value);
  return cachedValue;
};

export const getHashValueFromCache = async (
  key: Redis.KeyType,
  field: string
) => {
  const cachedValue = await client.hget(key, field);
  return cachedValue;
};
