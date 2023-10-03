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
import { RuleEffect } from "../../../entity";

@Injectable()
export class RuleEffectRepository {
  public async createRuleEffect(
    transactionalEntityManager: EntityManager,
    body: any,
    relations: Array<string>
  ): Promise<RuleEffect> {
    const key = `${CACHING_KEYS.RULE_EFFECT}_${body.id}`;
    let ruleEffect: any = await getValueFromCache(key);
    if (!ruleEffect) {
      ruleEffect = await transactionalEntityManager.findOne(RuleEffect, {
        where: {
          id: body.id
        },
        relations
      });
      if (ruleEffect) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    if (ruleEffect) {
      await setValueToCache(
        key,
        ruleEffect,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated Cache with key :", key);
    } else {
      ruleEffect = await transactionalEntityManager.create(RuleEffect, body);
      ruleEffect = await transactionalEntityManager.save(ruleEffect);
      await setValueToCache(
        key,
        ruleEffect,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Created a new record in Database and added to Cache with key :",
        key
      );
    }
    return ruleEffect;
  }

  public async getRuleEffectById(
    transactionalEntityManager: EntityManager,
    ruleEffectId: string,
    relations: [string]
  ): Promise<RuleEffect> {
    const key = `${CACHING_KEYS.RULE_EFFECT}_${ruleEffectId}`;
    let ruleEffect: any = await getValueFromCache(key);

    if (!ruleEffect) {
      ruleEffect = await transactionalEntityManager.findOne(RuleEffect, {
        where: {
          id: ruleEffectId
        },
        relations
      });

      if (ruleEffect) {
        await setValueToCache(
          key,
          ruleEffect,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return ruleEffect;
  }

  public async updateRuleEffectById(
    transactionalEntityManager: EntityManager,
    ruleEffectId: string,
    body: any
  ): Promise<RuleEffect> {
    const key = `${CACHING_KEYS.RULE_EFFECT}_${ruleEffectId}`;
    let ruleEffect: any = await getValueFromCache(key);

    if (!ruleEffect) {
      ruleEffect = await transactionalEntityManager.findOne(RuleEffect, {
        where: {
          id: ruleEffectId
        }
      });
      if (ruleEffect) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    if (!ruleEffect) return null;

    ruleEffect = await transactionalEntityManager.update(
      RuleEffect,
      { id: ruleEffectId },
      body
    );

    if (ruleEffect) {
      await setValueToCache(
        key,
        ruleEffect,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Updated the record in Database and updated Cache with key :",
        key
      );
    }
    return ruleEffect;
  }

  public async deleteRuleEffectById(
    transactionalEntityManager: EntityManager,
    ruleEffectId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from rule_effect where id=${ruleEffectId}`
      );
      queryRunner.release();
      console.log(
        "Deleted a ruleEffect record from database with id: ",
        ruleEffectId
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
