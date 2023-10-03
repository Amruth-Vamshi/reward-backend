import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import {
  CACHING_KEYS,
  ENTITY_CACHING_PERIOD,
  EXPIRY_MODE
} from "@walkinserver/walkin-core/src/modules/common/constants";
import {
  getValueFromCache,
  setValueToCache
} from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";

@Injectable()
export class CollectionsRepository {
  public async getCollections_rawQuery(
    transactionalEntityManager: EntityManager,
    whereOptions: Object
  ) {
    let key = `${CACHING_KEYS.COLLECTIONS}`;
    for (let where in whereOptions) key += `_${whereOptions[where]}`;
    let collections: any = await getValueFromCache(key);

    if (!collections || JSON.stringify(collections) == "[]") {
      let query = "SELECT * FROM collections";
      let i = 0;
      for (const key in whereOptions) {
        const value = whereOptions[`${key}`];
        if (i == 0)
          query += ` WHERE ${key}=${
            typeof value == "string" ? `'${value}'` : value
          }`;
        else
          query += ` and ${key}=${
            typeof value == "string" ? `'${value}'` : value
          }`;
        i++;
      }
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      collections = await queryRunner.manager.query(query);
      await queryRunner.release();
      if (collections) {
        await setValueToCache(
          key,
          collections,
          EXPIRY_MODE.EXPIRE,
          ENTITY_CACHING_PERIOD.COLLECTIONS
        );
        console.log(
          "Fetched Collections from Database and added to Cache with key :",
          key
        );
      }
    } else {
      console.log("Fetched Collections from Cache with key :", key);
    }
    return collections;
  }
}
