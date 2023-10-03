import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import {
  CACHING_KEYS,
  CACHING_PERIOD,
  EXPIRY_MODE
} from "@walkinserver/walkin-core/src/modules/common/constants";
import {
  getValueFromCache,
  setValueToCache
} from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
import { BusinessRule } from "../../../entity";

@Injectable()
export class BusinessRuleRepository {
  public async createBusinessRule(
    transactionalEntityManager: EntityManager,
    body: any,
    relations: Array<string>
  ): Promise<BusinessRule> {
    const key = `${CACHING_KEYS.LOYALTY_CARD}_${body.id}`;
    let businessRule: any = await getValueFromCache(key);
    if (!businessRule) {
      businessRule = await transactionalEntityManager.findOne(BusinessRule, {
        where: {
          id: body.id
        },
        relations
      });
      if (businessRule) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    if (businessRule) {
      await setValueToCache(
        key,
        businessRule,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated Cache with key :", key);
    } else {
      businessRule = await transactionalEntityManager.create(
        BusinessRule,
        body
      );
      businessRule = await transactionalEntityManager.save(businessRule);
      await setValueToCache(
        key,
        businessRule,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Created a new record in Database and added to Cache with key :",
        key
      );
    }
    return businessRule;
  }

  public async getBusinessRuleById(
    transactionalEntityManager: EntityManager,
    businessRuleId: string,
    relations: [string]
  ): Promise<BusinessRule> {
    const key = `${CACHING_KEYS.LOYALTY_CARD}_${businessRuleId}`;
    let businessRule: any = await getValueFromCache(key);

    if (!businessRule) {
      businessRule = await transactionalEntityManager.findOne(BusinessRule, {
        where: {
          id: businessRuleId
        },
        relations
      });

      if (businessRule) {
        await setValueToCache(
          key,
          businessRule,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return businessRule;
  }

  public async updateBusinessRuleById(
    transactionalEntityManager: EntityManager,
    businessRuleId: string,
    body: any
  ): Promise<BusinessRule> {
    const key = `${CACHING_KEYS.LOYALTY_CARD}_${businessRuleId}`;
    let businessRule: any = await getValueFromCache(key);

    if (!businessRule) {
      businessRule = await transactionalEntityManager.findOne(BusinessRule, {
        where: {
          id: businessRuleId
        }
      });
      if (businessRule) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    if (!businessRule) return null;

    businessRule = await transactionalEntityManager.update(
      BusinessRule,
      { id: businessRuleId },
      body
    );

    if (businessRule) {
      await setValueToCache(
        key,
        businessRule,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Updated the record in Database and updated Cache with key :",
        key
      );
    }
    return businessRule;
  }

  public async deleteBusinessRuleById(
    transactionalEntityManager: EntityManager,
    businessRuleId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from business_rule where id=${businessRuleId}`
      );
      queryRunner.release();
      console.log(
        "Deleted a businessRule record from database with id: ",
        businessRuleId
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
