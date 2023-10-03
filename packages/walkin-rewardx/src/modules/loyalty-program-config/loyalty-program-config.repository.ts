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
import { LoyaltyProgramConfig } from "../../entity";

@Injectable()
export class LoyaltyProgramConfigRepository {
  public async createLoyaltyProgramConfig(
    transactionalEntityManager: EntityManager,
    body: any
  ): Promise<LoyaltyProgramConfig> {
    const key = `${CACHING_KEYS.LOYALTY_PROGRAM_CONFIG}_${body.configId}`;
    let loyaltyProgramConfig: any = await getValueFromCache(key);
    if (!loyaltyProgramConfig) {
      loyaltyProgramConfig = await transactionalEntityManager
        .getRepository(LoyaltyProgramConfig)
        .createQueryBuilder("config")
        .leftJoinAndSelect("config.organization", "organization")
        .leftJoinAndSelect("config.campaign", "campaign")
        .leftJoinAndSelect("config.loyaltyCard", "loyaltyCard")
        .leftJoinAndSelect("config.loyaltyBurnRuleSet", "loyaltyBurnRuleSet")
        .where("config.organization = :orgId", { orgId: body.organizationId })
        .andWhere("config.id = :id", { id: body.configId })
        .getOne();
      if(loyaltyProgramConfig) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    if (loyaltyProgramConfig) {
      await setValueToCache(
        key,
        loyaltyProgramConfig,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated Cache with key :", key);
    } else {
      loyaltyProgramConfig = await transactionalEntityManager.create(LoyaltyProgramConfig, body);
      loyaltyProgramConfig = await transactionalEntityManager.save(loyaltyProgramConfig);
      loyaltyProgramConfig = await transactionalEntityManager
        .getRepository(LoyaltyProgramConfig)
        .createQueryBuilder("config")
        .leftJoinAndSelect("config.organization", "organization")
        .leftJoinAndSelect("config.campaign", "campaign")
        .leftJoinAndSelect("config.loyaltyCard", "loyaltyCard")
        .leftJoinAndSelect("config.loyaltyBurnRuleSet", "loyaltyBurnRuleSet")
        .where("config.organization = :orgId", { orgId: body.organizationId })
        .andWhere("config.id = :id", { id: body.configId })
        .getOne();
      console.log("Fetched from database.")
      await setValueToCache(
        key,
        loyaltyProgramConfig,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Created a new record in Database and added to Cache with key :", key);
    }
    return loyaltyProgramConfig;
  }

  public async getLoyaltyProgramConfigById(
    transactionalEntityManager: EntityManager,
    loyaltyProgramConfigId: string,
    organizationId: string
  ): Promise<LoyaltyProgramConfig> {
    const key = `${CACHING_KEYS.LOYALTY_PROGRAM_CONFIG}_${loyaltyProgramConfigId}`;
    let loyaltyProgramConfig: any = await getValueFromCache(key);

    if (!loyaltyProgramConfig) {
      loyaltyProgramConfig = await transactionalEntityManager
        .getRepository(LoyaltyProgramConfig)
        .createQueryBuilder("config")
        .leftJoinAndSelect("config.organization", "organization")
        .leftJoinAndSelect("config.campaign", "campaign")
        .leftJoinAndSelect("config.loyaltyCard", "loyaltyCard")
        .leftJoinAndSelect("config.loyaltyBurnRuleSet", "loyaltyBurnRuleSet")
        .where("config.organization = :orgId", { orgId: organizationId })
        .andWhere("config.id = :id", { id: loyaltyProgramConfigId })
        .getOne();

      if (loyaltyProgramConfig) {
        await setValueToCache(
          key,
          loyaltyProgramConfig,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return loyaltyProgramConfig;
  }

  public async updateLoyaltyProgramConfigById(
    transactionalEntityManager: EntityManager,
    loyaltyProgramConfigId: string,
    body: any
  ): Promise<LoyaltyProgramConfig | null> {
    const key = `${CACHING_KEYS.LOYALTY_PROGRAM_CONFIG}_${loyaltyProgramConfigId}`;
    let loyaltyProgramConfig: any = await getValueFromCache(key);

    if (!loyaltyProgramConfig) {
      loyaltyProgramConfig = await transactionalEntityManager.findOne(
        LoyaltyProgramConfig,
        {
          where: {
            id: loyaltyProgramConfigId
          }
        }
      );
      if(loyaltyProgramConfig) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    if (!loyaltyProgramConfig) return null;

    await transactionalEntityManager.update(
      LoyaltyProgramConfig,
      { id: loyaltyProgramConfigId },
      body
    );
    loyaltyProgramConfig = await transactionalEntityManager
      .getRepository(LoyaltyProgramConfig)
      .createQueryBuilder("config")
      .leftJoinAndSelect("config.organization", "organization")
      .leftJoinAndSelect("config.campaign", "campaign")
      .leftJoinAndSelect("config.loyaltyCard", "loyaltyCard")
      .leftJoinAndSelect("config.loyaltyBurnRuleSet", "loyaltyBurnRuleSet")
      .where("config.organization = :orgId", { orgId: body.organizationId })
      .andWhere("config.id = :id", { id: loyaltyProgramConfigId })
      .getOne();

    if (loyaltyProgramConfig) {
      await setValueToCache(
        key,
        loyaltyProgramConfig,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated the record in Database and updated Cache with key :", key);
    }
    return loyaltyProgramConfig;
  }

  public async deleteLoyaltyProgramConfigById(
    transactionalEntityManager: EntityManager,
    loyaltyProgramConfigId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from loyalty_program_config where id=${loyaltyProgramConfigId}`
      );
      queryRunner.release();
      console.log("Deleted a loyaltyProgramConfig record from database with id: ",loyaltyProgramConfigId);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async getLoyaltyProgramConfig_rawQuery(
    transactionalEntityManager: EntityManager,
    whereOptions: Object
  ) {
    let key = `${CACHING_KEYS.LOYALTY_PROGRAM_CONFIG}`;
    for (let where in whereOptions) key += `_${whereOptions[where]}`;
    let loyaltyProgramConfig: any = await getValueFromCache(key);

    if (!loyaltyProgramConfig || JSON.stringify(loyaltyProgramConfig) == "[]") {
      let query =
        "SELECT * FROM loyalty_program_config LEFT JOIN rule_set ON loyalty_program_config.loyalty_burn_rule_set_id = rule_set.id";
      let i = 0;
      for (const key in whereOptions) {
        if (key == "applicable_events") continue;
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
      if ("applicable_events" in whereOptions)
        query += ` ${i > 0 ? "AND" : ""} JSON_CONTAINS(applicable_events, '"${
          whereOptions["applicable_events"]
        }"', '$')`;
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      loyaltyProgramConfig = await queryRunner.manager.query(query);
      await queryRunner.release();
      if (loyaltyProgramConfig) {
        await setValueToCache(
          key,
          loyaltyProgramConfig,
          EXPIRY_MODE.EXPIRE,
          ENTITY_CACHING_PERIOD.LOYALTY_PROGRAM_CONFIG
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return loyaltyProgramConfig;
  }
}
