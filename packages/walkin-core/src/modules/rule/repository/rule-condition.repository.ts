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
import { RuleCondition } from "../../../entity";

@Injectable()
export class RuleConditionRepository {
  public async createRuleCondition(
    transactionalEntityManager: EntityManager,
    body: any,
    relations: Array<string>
  ): Promise<RuleCondition> {
    const key = `${CACHING_KEYS.RULE_CONDITION}_${body.id}`;
    let ruleCondition: any = await getValueFromCache(key);
    if (!ruleCondition) {
      ruleCondition = await transactionalEntityManager.findOne(RuleCondition, {
        where: {
          id: body.id
        },
        relations
      });
      if (ruleCondition) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    if (ruleCondition) {
      await setValueToCache(
        key,
        ruleCondition,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated Cache with key :", key);
    } else {
      ruleCondition = await transactionalEntityManager.create(
        RuleCondition,
        body
      );
      ruleCondition = await transactionalEntityManager.save(ruleCondition);
      await setValueToCache(
        key,
        ruleCondition,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Created a new record in Database and added to Cache with key :",
        key
      );
    }
    return ruleCondition;
  }

  public async getRuleConditionById(
    transactionalEntityManager: EntityManager,
    ruleConditionId: string,
    relations: [string]
  ): Promise<RuleCondition> {
    const key = `${CACHING_KEYS.RULE_CONDITION}_${ruleConditionId}`;
    let ruleCondition: any = await getValueFromCache(key);

    if (!ruleCondition) {
      ruleCondition = await transactionalEntityManager.findOne(RuleCondition, {
        where: {
          id: ruleConditionId
        },
        relations
      });

      if (ruleCondition) {
        await setValueToCache(
          key,
          ruleCondition,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return ruleCondition;
  }

  public async updateRuleConditionById(
    transactionalEntityManager: EntityManager,
    ruleConditionId: string,
    body: any
  ): Promise<RuleCondition> {
    const key = `${CACHING_KEYS.RULE_CONDITION}_${ruleConditionId}`;
    let ruleCondition: any = await getValueFromCache(key);

    if (!ruleCondition) {
      ruleCondition = await transactionalEntityManager.findOne(RuleCondition, {
        where: {
          id: ruleConditionId
        }
      });
      if (ruleCondition) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    if (!ruleCondition) return null;

    ruleCondition = await transactionalEntityManager.update(
      RuleCondition,
      { id: ruleConditionId },
      body
    );

    if (ruleCondition) {
      await setValueToCache(
        key,
        ruleCondition,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Updated the record in Database and updated Cache with key :",
        key
      );
    }
    return ruleCondition;
  }

  public async deleteRuleConditionById(
    transactionalEntityManager: EntityManager,
    ruleConditionId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from rule_condition where id=${ruleConditionId}`
      );
      queryRunner.release();
      console.log(
        "Deleted a ruleCondition record from database with id: ",
        ruleConditionId
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
