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
import { Customer } from "../../entity";

@Injectable()
export class CustomerRepository {
  public async createCustomer(
    transactionalEntityManager: EntityManager,
    body: any,
    relations: Array<string>
  ): Promise<Customer> {
    const key = `${CACHING_KEYS.CUSTOMER}_${body.externalCustomerId}_${body.phoneNumber}_${body.customerIdentifier}`;
    let customer: any = await getValueFromCache(key);
    if (!customer) {
      customer = await transactionalEntityManager.findOne(Customer, {
        where: {
          id: body.id
        },
        relations
      });
      console.log("Fetched from database");
    } else {
      console.log("Fetched form Cache with key : ", key);
    }
    if (customer) {
      await setValueToCache(
        key,
        customer,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updating cache with key: ", key);
    } else {
      customer = await transactionalEntityManager.create(Customer, body);
      customer = await transactionalEntityManager.save(customer);
      await setValueToCache(
        key,
        customer,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Created new record in database and added it to cache with key: ",
        key
      );
    }
    return customer;
  }

  public async getCustomerById(
    transactionalEntityManager: EntityManager,
    customerId: string,
    relations: [string]
  ): Promise<Customer> {
    const key = `${CACHING_KEYS.CUSTOMER}_${customerId}`;
    let customer: any = await getValueFromCache(key);

    if (!customer) {
      customer = await transactionalEntityManager.findOne(Customer, {
        where: {
          id: customerId
        },
        relations
      });

      if (customer) {
        await setValueToCache(
          key,
          customer,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log(
          "Fetched from database and added it to cache with key: ",
          key
        );
      }
      return customer;
    } else {
      console.log("Fetched form Cache with key : ", key);
    }
    return customer;
  }

  public async getCustomerByExternalCustomerId_rawQuery(
    transactionalEntityManager: EntityManager,
    externalCustomerId: string,
    organizationId: string
  ) {
    const key = `${CACHING_KEYS.CUSTOMER}_${externalCustomerId}_${organizationId}`;
    let customer: any = await getValueFromCache(key);
    if (!customer || JSON.stringify(customer) == "[]") {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      customer = await queryRunner.manager.query(
        `select * from customer where externalCustomerId='${externalCustomerId}' and organization_id='${organizationId}'`
      );
      await queryRunner.release();
      customer = customer && customer.length ? customer : null;

      if (customer) {
        await setValueToCache(
          key,
          customer,
          EXPIRY_MODE.EXPIRE,
          ENTITY_CACHING_PERIOD.CUSTOMER_LOYALTY
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return customer;
  }

  public async updateCustomerById(
    transactionalEntityManager: EntityManager,
    customerId: string,
    body: any
  ): Promise<Customer> {
    const key = `${CACHING_KEYS.CUSTOMER}_${customerId}`;
    let customer: any = await getValueFromCache(key);

    if (!customer) {
      customer = await transactionalEntityManager.findOne(Customer, {
        where: {
          id: customerId
        }
      });
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    if (!customer) return null;

    customer = await transactionalEntityManager.update(
      Customer,
      { id: customerId },
      body
    );

    if (customer) {
      await setValueToCache(
        key,
        customer,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated the Record in database and cache with key: ", key);
    }
    return customer;
  }

  public async deleteCustomerById(
    transactionalEntityManager: EntityManager,
    customerId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from customer where id=${customerId}`
      );
      console.log(
        `deleted customer record from database. customerId: ${customerId}`
      );
      queryRunner.release();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async getCustomer_rawQuery(
    transactionalEntityManager: EntityManager,
    whereOptions: Object
  ) {
    let key = `${CACHING_KEYS.CUSTOMER}`;
    for (let where in whereOptions) key += `_${whereOptions[where]}`;
    let customer: any = await getValueFromCache(key);

    if (!customer || JSON.stringify(customer) == "[]") {
      let query = "SELECT * FROM customer";
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
      customer = await queryRunner.manager.query(query);
      await queryRunner.release();
      if (customer) {
        await setValueToCache(
          key,
          customer,
          EXPIRY_MODE.EXPIRE,
          ENTITY_CACHING_PERIOD.CUSTOMER
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return customer;
  }
}
