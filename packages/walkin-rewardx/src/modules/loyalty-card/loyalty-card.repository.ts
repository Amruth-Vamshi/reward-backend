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
import { LoyaltyCard } from "../../entity";

@Injectable()
export class LoyaltyCardRepository {
  public async createLoyaltyCard(
    transactionalEntityManager: EntityManager,
    body: any,
    relations: Array<string>
  ): Promise<LoyaltyCard> {
    const key = `${CACHING_KEYS.LOYALTY_CARD}_${body.id}`;
    let loyaltyCard: any = await getValueFromCache(key);
    if (!loyaltyCard) {
      loyaltyCard = await transactionalEntityManager.findOne(LoyaltyCard, {
        where: {
          id: body.id
        },
        relations
      });
      if (loyaltyCard) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    if (loyaltyCard) {
      await setValueToCache(
        key,
        loyaltyCard,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated Cache with key :", key);
    } else {
      loyaltyCard = await transactionalEntityManager.create(LoyaltyCard, body);
      loyaltyCard = await transactionalEntityManager.save(loyaltyCard);
      await setValueToCache(
        key,
        loyaltyCard,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Created a new record in Database and added to Cache with key :",
        key
      );
    }
    return loyaltyCard;
  }

  public async getLoyaltyCardById(
    transactionalEntityManager: EntityManager,
    loyaltyCardId: string,
    relations: [string]
  ): Promise<LoyaltyCard> {
    const key = `${CACHING_KEYS.LOYALTY_CARD}_${loyaltyCardId}`;
    let loyaltyCard: any = await getValueFromCache(key);

    if (!loyaltyCard) {
      loyaltyCard = await transactionalEntityManager.findOne(LoyaltyCard, {
        where: {
          id: loyaltyCardId
        },
        relations
      });

      if (loyaltyCard) {
        await setValueToCache(
          key,
          loyaltyCard,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return loyaltyCard;
  }

  public async updateLoyaltyCardById(
    transactionalEntityManager: EntityManager,
    loyaltyCardId: string,
    body: any
  ): Promise<LoyaltyCard> {
    const key = `${CACHING_KEYS.LOYALTY_CARD}_${loyaltyCardId}`;
    let loyaltyCard: any = await getValueFromCache(key);

    if (!loyaltyCard) {
      loyaltyCard = await transactionalEntityManager.findOne(LoyaltyCard, {
        where: {
          id: loyaltyCardId
        }
      });
      if (loyaltyCard) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    if (!loyaltyCard) return null;

    loyaltyCard = await transactionalEntityManager.update(
      LoyaltyCard,
      { id: loyaltyCardId },
      body
    );

    if (loyaltyCard) {
      await setValueToCache(
        key,
        loyaltyCard,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Updated the record in Database and updated Cache with key :",
        key
      );
    }
    return loyaltyCard;
  }

  public async deleteLoyaltyCardById(
    transactionalEntityManager: EntityManager,
    loyaltyCardId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from loyalty_card where id=${loyaltyCardId}`
      );
      console.log(
        "Deleted a loyaltyCard record from database with id: ",
        loyaltyCardId
      );
      queryRunner.release();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async getLoyaltyCard_rawQuery(
    transactionalEntityManager: EntityManager,
    whereOptions: Object
  ) {
    let key = `${CACHING_KEYS.LOYALTY_CARD}`;
    for (let where in whereOptions) key += `_${whereOptions[where]}`;
    let LoyaltyCard: any = await getValueFromCache(key);

    if (!LoyaltyCard || JSON.stringify(LoyaltyCard) == "[]") {
      let query = "SELECT * FROM loyalty_card";
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
      LoyaltyCard = await queryRunner.manager.query(query);
      await queryRunner.release();
      if (LoyaltyCard && LoyaltyCard.length) {
        await setValueToCache(
          key,
          LoyaltyCard,
          EXPIRY_MODE.EXPIRE,
          ENTITY_CACHING_PERIOD.LOYALTY_CARD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return LoyaltyCard;
  }
}
