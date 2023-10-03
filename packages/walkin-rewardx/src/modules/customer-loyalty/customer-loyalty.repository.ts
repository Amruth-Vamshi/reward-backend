import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import {
  CACHING_KEYS,
  CACHING_PERIOD,
  ENTITY_CACHING_PERIOD,
  EXPIRY_MODE
} from "@walkinserver/walkin-core/src/modules/common/constants";
import {
  clearAllKeys,
  clearKeysByPattern,
  getValueFromCache,
  setValueToCache
} from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
import { CustomerLoyalty } from "../../entity";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../common/constants/errors";
import { LoyaltyCardRepository } from "../loyalty-card/loyalty-card.repository";
@Injectable()
export class CustomerLoyaltyRepository {
  public async createCustomerLoyalty(
    transactionalEntityManager: EntityManager,
    body: any
  ): Promise<CustomerLoyalty> {
    let key = `${CACHING_KEYS.CUSTOMER_LOYALTY}`;
    for (let item in body) key += `_${body[item]}`;
    let customerLoyalty: any = await getValueFromCache(key);
    let customer, loyaltyCard;
    if (!customerLoyalty || JSON.stringify(customerLoyalty) == "[]") {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      if (body.externalCustomerId && body.loyaltyCardCode) {
        customer = await queryRunner.manager.query(
          `SELECT * FROM customer WHERE externalCustomerId = '${body.externalCustomerId}' AND organization_id = '${body.organization_id}'`
        );
        loyaltyCard = await queryRunner.manager.query(
          `SELECT * FROM loyalty_card WHERE code = '${body.loyaltyCardCode}' AND organization_id = '${body.organization_id}'`
        );
      }
      key = `${CACHING_KEYS.CUSTOMER_LOYALTY}_${customer[0].id}_${loyaltyCard[0].id}`;
      customerLoyalty = await getValueFromCache(key);
      if (!customerLoyalty || JSON.stringify(customerLoyalty) == "[]") {
        customerLoyalty = await queryRunner.manager.query(
          `SELECT * FROM customer_loyalty WHERE customer_id = '${
            body.externalCustomerId ? customer[0].id : body.customer_id
          }' AND loyalty_card_id = '${
            body.loyaltyCardCode ? loyaltyCard[0].id : body.loyalty_card_id
          }'`
        );
      } else {
        console.log("Fetched CL from Cache with key :", key);
      }
      queryRunner.release();
    } else {
      console.log("Fetched CL from Cache with key :", key);
    }
    if (customerLoyalty && customerLoyalty.length) {
      await setValueToCache(
        key,
        customerLoyalty,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Fetched CL from Database and added to Cache with key :",
        key
      );
    } else {
      customerLoyalty = await transactionalEntityManager.create(
        CustomerLoyalty,
        {
          customer: body.externalCustomerId ? customer[0].id : body.customer_id,
          loyaltyCard: body.loyaltyCardCode
            ? loyaltyCard[0].id
            : body.loyalty_card_id
        }
      );
      customerLoyalty = await transactionalEntityManager.save(
        CustomerLoyalty,
        customerLoyalty
      );
      customerLoyalty = [{ ...customerLoyalty }];
      await setValueToCache(
        key,
        customerLoyalty,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Created a new record in Database and added to Cache with key :",
        key
      );
    }
    return customerLoyalty;
  }

  public async getCustomerLoyaltyLoyaltyById(
    transactionalEntityManager: EntityManager,
    CustomerLoyaltyLoyaltyId: string,
    relations: [string]
  ): Promise<CustomerLoyalty> {
    const key = `${CACHING_KEYS.CUSTOMER_LOYALTY}_${CustomerLoyaltyLoyaltyId}`;
    let customerLoyalty: any = await getValueFromCache(key);

    if (!customerLoyalty) {
      customerLoyalty = await transactionalEntityManager.findOne(
        CustomerLoyalty,
        {
          where: {
            id: CustomerLoyaltyLoyaltyId
          },
          relations
        }
      );

      if (customerLoyalty) {
        await setValueToCache(
          key,
          customerLoyalty,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return customerLoyalty;
  }

  public async updateCustomerLoyaltyById(
    transactionalEntityManager: EntityManager,
    CustomerLoyaltyLoyaltyId: string,
    body: any
  ): Promise<CustomerLoyalty> {
    const key = `${CACHING_KEYS.CUSTOMER_LOYALTY}_${CustomerLoyaltyLoyaltyId}`;
    let customerLoyalty: any = await getValueFromCache(key);
    if (!customerLoyalty) {
      customerLoyalty = await transactionalEntityManager.findOne(
        CustomerLoyalty,
        {
          where: {
            id: CustomerLoyaltyLoyaltyId
          }
        }
      );
    } else {
      console.log("Fetched form Cache with key : ", key);
    }
    if (!customerLoyalty) return null;
    let res = await transactionalEntityManager.update(
      CustomerLoyalty,
      { id: CustomerLoyaltyLoyaltyId },
      body
    );
    customerLoyalty = await transactionalEntityManager.findOne(
      CustomerLoyalty,
      {
        where: {
          id: CustomerLoyaltyLoyaltyId
        }
      }
    );
    await clearKeysByPattern(`${CACHING_KEYS.CUSTOMER_LOYALTY}_*`);
    if (customerLoyalty) {
      await setValueToCache(
        key,
        customerLoyalty,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated the record in Database and cache with key: ", key);
    }
    return customerLoyalty;
  }

  public async deleteCustomerLoyaltyLoyaltyById(
    transactionalEntityManager: EntityManager,
    CustomerLoyaltyLoyaltyId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from CustomerLoyalty_loyalty where id=${CustomerLoyaltyLoyaltyId}`
      );
      await clearKeysByPattern(`${CACHING_KEYS.CUSTOMER_LOYALTY}_*`);
      console.log(
        "Deleted the record in database and cleared all cache with key-pattern: ",
        CACHING_KEYS.CUSTOMER_LOYALTY
      );
      queryRunner.release();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async getCustomerLoyalty_rawQueryWithRecordLock(
    transactionalEntityManager: EntityManager,
    whereOptions: Object
  ) {
    let customerLoyalty: any;
    let query = "SELECT * FROM customer_loyalty";
    let i = 0;
    for (const key in whereOptions) {
      const value = whereOptions[`${key}`];
      if (i == 0)
        query += ` WHERE ${key}=${
          typeof value == "string" ? `'${value}'` : value
        }`;
      else
        query += ` AND ${key}=${
          typeof value == "string" ? `'${value}'` : value
        }`;
      i++;
    }

    query += " FOR UPDATE;";
    customerLoyalty = await transactionalEntityManager.query(query);
    return customerLoyalty;
  }

  public async getCustomerLoyalty_rawQuery(
    transactionalEntityManager: EntityManager,
    whereOptions: Object
  ) {
    let key = `${CACHING_KEYS.CUSTOMER_LOYALTY}`;
    for (let where in whereOptions) key += `_${whereOptions[where]}`;
    let customerLoyalty: any = await getValueFromCache(key);

    if (!customerLoyalty || JSON.stringify(customerLoyalty) == "[]") {
      let query = "SELECT * FROM customer_loyalty";
      let i = 0;
      for (const key in whereOptions) {
        const value = whereOptions[`${key}`];
        if (i == 0)
          query += ` WHERE ${key}=${
            typeof value == "string" ? `'${value}'` : value
          }`;
        else
          query += ` AND ${key}=${
            typeof value == "string" ? `'${value}'` : value
          }`;
        i++;
      }
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      customerLoyalty = await queryRunner.manager.query(query);
      await queryRunner.release();
      if (customerLoyalty) {
        await setValueToCache(
          key,
          customerLoyalty,
          EXPIRY_MODE.EXPIRE,
          ENTITY_CACHING_PERIOD.CUSTOMER_LOYALTY
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched form Cache with key : ", key);
    }
    return customerLoyalty;
  }

  public async updateCustomerLoyaltyStatus_rawQuery(
    transactionalEntityManager: EntityManager,
    injector,
    input
  ) {
    const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
    let { externalCustomerId, organizationId, status, loyaltyCardCode } = input,
      loyaltyCard;

    if (loyaltyCardCode != null || loyaltyCardCode != undefined) {
      loyaltyCard = await injector
        .get(LoyaltyCardRepository)
        .getLoyaltyCard_rawQuery(transactionalEntityManager, {
          code: loyaltyCardCode,
          organization_id: organizationId
        });
    } else {
      loyaltyCard = await injector
        .get(LoyaltyCardRepository)
        .getLoyaltyCard_rawQuery(transactionalEntityManager, {
          organization_id: organizationId
        });
    }
    if (loyaltyCard.length < 1) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }
    let customerLoyalty = await queryRunner.manager.query(
      `SELECT * FROM customer_loyalty WHERE customer_id = (SELECT id FROM customer WHERE externalCustomerId = '${externalCustomerId}' AND organization_id = '${organizationId}') AND loyalty_card_id = '${loyaltyCard[0].id}'`
    );
    if (customerLoyalty && customerLoyalty.length) {
      if (
        status.toUpperCase() === "ACTIVE" ||
        status.toUpperCase() === "INACTIVE"
      ) {
        status = status.toUpperCase();
      } else {
        throw new WCoreError({
          HTTP_CODE: 404,
          MESSAGE: "Invalid status.",
          CODE: "IS"
        });
      }
      await queryRunner.manager.query(
        `UPDATE customer_loyalty SET status = '${status}' WHERE id = '${customerLoyalty[0].id}'`
      );
      customerLoyalty = await queryRunner.manager.query(
        `SELECT * FROM customer_loyalty WHERE id = '${customerLoyalty[0].id}'`
      );
      await queryRunner.release();
      return { ...customerLoyalty[0] };
    } else {
      await queryRunner.release();
      throw new WCoreError({
        HTTP_CODE: 404,
        MESSAGE: "Customer Loyalty  not found.",
        CODE: "CLNF"
      });
    }
  }
}
