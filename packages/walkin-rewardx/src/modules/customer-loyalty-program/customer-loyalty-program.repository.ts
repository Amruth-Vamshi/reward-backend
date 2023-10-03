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
import { CustomerLoyaltyProgram } from "../../entity";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";

@Injectable()
export class CustomerLoyaltyProgramRepository {
  public async createCustomerLoyaltyProgram(
    transactionalEntityManager: EntityManager,
    body: any
  ): Promise<CustomerLoyaltyProgram> {
    let key = `${CACHING_KEYS.CUSTOMER_LOYALTY_PROGRAM}`;
    for (let item in body) key += `_${body[item]}`;
    let customerLoyaltyProgram: any = await getValueFromCache(key);
    if (
      !customerLoyaltyProgram ||
      JSON.stringify(customerLoyaltyProgram) == "[]"
    ) {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      customerLoyaltyProgram = await queryRunner.manager.query(
        `SELECT * FROM customer_loyalty_program WHERE customer_loyalty_id = '${body.customer_loyalty_id}' AND loyalty_experiment_code = '${body.loyalty_experiment_code}' and loyalty_program_code='${body.loyalty_program_code}'`
      );
      queryRunner.release();
      if (
        customerLoyaltyProgram ||
        JSON.stringify(customerLoyaltyProgram) != "[]"
      )
        console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    if (customerLoyaltyProgram.length > 0) {
      await setValueToCache(
        key,
        customerLoyaltyProgram,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated Cache with key :", key);
    } else {
      customerLoyaltyProgram = await transactionalEntityManager.create(
        CustomerLoyaltyProgram,
        {
          loyaltyProgramCode: body.loyalty_program_code,
          loyaltyExperimentCode: body.loyalty_experiment_code,
          customerLoyalty: body.customer_loyalty_id
        }
      );
      customerLoyaltyProgram = await transactionalEntityManager.save(
        customerLoyaltyProgram
      );
      customerLoyaltyProgram = [{ ...customerLoyaltyProgram }];
      await setValueToCache(
        key,
        customerLoyaltyProgram,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Created a new record in Database and added to Cache with key :",
        key
      );
    }
    return customerLoyaltyProgram;
  }

  public async getCustomerLoyaltyProgramById(
    transactionalEntityManager: EntityManager,
    customerLoyaltyProgramId: string,
    relations: [string]
  ): Promise<CustomerLoyaltyProgram> {
    const key = `${CACHING_KEYS.CUSTOMER_LOYALTY_PROGRAM}_${customerLoyaltyProgramId}`;
    let customerLoyaltyProgram: any = await getValueFromCache(key);

    if (
      !customerLoyaltyProgram ||
      JSON.stringify(customerLoyaltyProgram) == "[]"
    ) {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      customerLoyaltyProgram = await queryRunner.manager.query(
        `SELECT * FROM customer_loyalty_program WHERE id = '${customerLoyaltyProgramId}'`
      );
      await queryRunner.release();

      if (JSON.stringify(customerLoyaltyProgram) != "[]") {
        await setValueToCache(
          key,
          customerLoyaltyProgram,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log(
          "Fetched clp from Database and added to Cache with key :",
          key
        );
      }
      return customerLoyaltyProgram;
    } else {
      console.log("Fetched clp from Cache with key :", key);
      return customerLoyaltyProgram;
    }
  }

  public async updateCustomerLoyaltyProgramById(
    transactionalEntityManager: EntityManager,
    customerLoyaltyProgramId: string,
    body: any
  ): Promise<CustomerLoyaltyProgram> {
    const key = `${CACHING_KEYS.CUSTOMER_LOYALTY_PROGRAM}_${customerLoyaltyProgramId}`;
    let customerLoyaltyProgram: any = await getValueFromCache(key);

    if (
      !customerLoyaltyProgram ||
      JSON.stringify(customerLoyaltyProgram) == "[]"
    ) {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      customerLoyaltyProgram = await queryRunner.manager.query(
        `SELECT * FROM customer_loyalty_program WHERE id = '${customerLoyaltyProgramId}'`
      );
      await queryRunner.release();
    }

    if (!customerLoyaltyProgram) return null;

    customerLoyaltyProgram = await transactionalEntityManager.update(
      CustomerLoyaltyProgram,
      { id: customerLoyaltyProgramId },
      body
    );

    if (JSON.stringify(customerLoyaltyProgram) != "[]") {
      await setValueToCache(
        key,
        customerLoyaltyProgram,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Updated the record in Database and updated Cache with key :",
        key
      );
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return customerLoyaltyProgram;
  }

  public async deleteCustomerLoyaltyProgramById(
    transactionalEntityManager: EntityManager,
    customerLoyaltyProgramId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from customer_loyalty_program where id=${customerLoyaltyProgramId}`
      );
      console.log(
        "Deleted customerLoyaltyProgram record from database with id: ",
        customerLoyaltyProgramId
      );
      queryRunner.release();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async getCustomerLoyaltyProgram_rawQuery(
    transactionalEntityManager: EntityManager,
    whereOptions: Object
  ) {
    let key = `${CACHING_KEYS.CUSTOMER_LOYALTY_PROGRAM}`;
    for (let where in whereOptions) key += `_${whereOptions[where]}`;
    let customerLoyaltyProgram: any = await getValueFromCache(key);

    if (
      !customerLoyaltyProgram ||
      JSON.stringify(customerLoyaltyProgram) == "[]"
    ) {
      let query = "SELECT * FROM customer_loyalty_program";
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
      customerLoyaltyProgram = await queryRunner.manager.query(query);
      await queryRunner.release();
      if (JSON.stringify(customerLoyaltyProgram) != "[]") {
        await setValueToCache(
          key,
          customerLoyaltyProgram,
          EXPIRY_MODE.EXPIRE,
          ENTITY_CACHING_PERIOD.CUSTOMER_LOYALTY_PROGRAM
        );
        console.log(
          "Fetched clp_raw_query from Database and added to Cache with key :",
          key
        );
      }
    } else {
      console.log("Fetched clp_raw_query from Cache with key :", key);
    }
    return customerLoyaltyProgram;
  }

  public async updateCustomerLoyaltyProgramStatus_rawQuery(
    transactionalEntityManager: EntityManager,
    input
  ) {
    const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
    let { externalCustomerId, organizationId, status, experimentCode } = input;

    let customerLoyaltyProgram = await queryRunner.manager.query(
      `SELECT * FROM customer_loyalty_program WHERE customer_loyalty_id in 
          (SELECT id FROM customer_loyalty WHERE customer_id =
            (SELECT id FROM customer WHERE externalCustomerId = '${externalCustomerId}' AND organization_id = '${organizationId}')) 
        AND loyalty_experiment_code = '${experimentCode}'`
    );
    if (
      JSON.stringify(customerLoyaltyProgram) != "[]" &&
      customerLoyaltyProgram.length
    ) {
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
        `UPDATE customer_loyalty_program SET status = '${status}' WHERE id = '${customerLoyaltyProgram[0].id}'`
      );
      customerLoyaltyProgram = await queryRunner.manager.query(
        `SELECT * FROM customer_loyalty_program WHERE id = '${customerLoyaltyProgram[0].id}'`
      );
      await queryRunner.release();
      return { ...customerLoyaltyProgram[0] };
    } else {
      await queryRunner.release();
      throw new WCoreError(WCORE_ERRORS.CUSTOMER_LOYALTY_PROGRAM_NOT_FOUND);
    }
  }
}
