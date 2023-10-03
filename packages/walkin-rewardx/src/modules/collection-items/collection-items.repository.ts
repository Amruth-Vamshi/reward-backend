import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import {
  CACHING_KEYS,
  CACHING_PERIOD,
  ENTITY_CACHING_PERIOD,
  EXPIRY_MODE
} from "@walkinserver/walkin-core/src/modules/common/constants";
import {
  getValueFromCache,
  setValueToCache
} from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";

@Injectable()
export class CollectionItemsRepository {
  public async getCollectionItems_rawQuery(
    transactionalEntityManager: EntityManager,
    whereOptions: Object
  ) {
    let key = `${CACHING_KEYS.COLLECTIONS_ITEMS}`;
    for (let where in whereOptions) key += `_${whereOptions[where]}`;
    let collectionsItems: any = await getValueFromCache(key);

    if (
      !collectionsItems ||
      JSON.stringify(collectionsItems) == "[]" ||
      collectionsItems.length == 0
    ) {
      let query = "SELECT * FROM collections_items";
      let i = 0;
      for (const key in whereOptions) {
        if (key == "item_ids") continue;
        if (key == "collections_id") continue;
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
      if ("item_ids" in whereOptions) {
        query += ` WHERE item_id in (${whereOptions["item_ids"]})`;
        i++;
      }
      if ("collections_id" in whereOptions)
        query += ` ${i > 0 ? "AND" : ""} collections_id in (${
          whereOptions["collections_id"]
        })`;
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      collectionsItems = await queryRunner.manager.query(query);
      await queryRunner.release();
      if (JSON.stringify(collectionsItems) != "[]") {
        await setValueToCache(
          key,
          collectionsItems,
          EXPIRY_MODE.EXPIRE,
          ENTITY_CACHING_PERIOD.COLLECTIONS_ITEMS
        );
        console.log(
          "Fetched Collections_Items from Database and added to Cache with key :",
          key
        );
      }
    } else {
      console.log("Fetched Collections_Items from Cache with key :", key);
    }
    return collectionsItems;
  }
}
