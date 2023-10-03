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
import { LoyaltyProgramDetail } from "../../entity";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { Service } from "typedi";

@Service()
export class LoyaltyProgramDetailRepository {
  public async createLoyaltyProgramDetail(
    transactionalEntityManager: EntityManager,
    body: any
  ): Promise<LoyaltyProgramDetail> {
    const key = `${CACHING_KEYS.LOYALTY_PROGRAM_DETAIL}_${body.detailId}`;
    let loyaltyProgramDetail: any = await getValueFromCache(key);
    if (!loyaltyProgramDetail) {
      loyaltyProgramDetail = await transactionalEntityManager
        .getRepository(LoyaltyProgramDetail)
        .createQueryBuilder("detail")
        .leftJoinAndSelect("detail.organization", "organization")
        .leftJoinAndSelect(
          "detail.loyaltyProgramConfig",
          "loyaltyProgramConfig"
        )
        .leftJoinAndSelect("detail.loyaltyEarnRuleSet", "loyaltyEarnRuleSet")
        .where("detail.organization = :orgId", { orgId: body.organizationId })
        .andWhere("detail.id = :id", { id: body.detailId })
        .getOne();
      if (loyaltyProgramDetail) console.log("Fetched from database.");
    } else {
      console.log("Fetched lpd from Cache with key :", key);
    }
    if (loyaltyProgramDetail) {
      await setValueToCache(
        key,
        loyaltyProgramDetail,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated lpd Cache with key :", key);
    } else {
      loyaltyProgramDetail = await transactionalEntityManager.create(
        LoyaltyProgramDetail,
        body
      );
      loyaltyProgramDetail = await transactionalEntityManager.save(
        loyaltyProgramDetail
      );
      loyaltyProgramDetail = await transactionalEntityManager
        .getRepository(LoyaltyProgramDetail)
        .createQueryBuilder("detail")
        .leftJoinAndSelect("detail.organization", "organization")
        .leftJoinAndSelect(
          "detail.loyaltyProgramConfig",
          "loyaltyProgramConfig"
        )
        .leftJoinAndSelect("detail.loyaltyEarnRuleSet", "loyaltyEarnRuleSet")
        .where("detail.organization = :orgId", { orgId: body.organizationId })
        .andWhere("detail.id = :id", { id: body.detailId })
        .getOne();
      await setValueToCache(
        key,
        loyaltyProgramDetail,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Created a new lpd record in Database and added to Cache with key :",
        key
      );
    }
    return loyaltyProgramDetail;
  }

  public async updateLoyaltyProgramDetailById(
    transactionalEntityManager: EntityManager,
    loyaltyProgramDetailId: string,
    body: any
  ): Promise<LoyaltyProgramDetail | null> {
    const key = `${CACHING_KEYS.LOYALTY_PROGRAM_DETAIL}_${loyaltyProgramDetailId}`;
    let loyaltyProgramDetail: any = await getValueFromCache(key);

    if (!loyaltyProgramDetail) {
      loyaltyProgramDetail = await transactionalEntityManager.findOne(
        LoyaltyProgramDetail,
        {
          where: {
            id: loyaltyProgramDetailId
          }
        }
      );
      if (loyaltyProgramDetail) console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    if (!loyaltyProgramDetail) return null;

    await transactionalEntityManager.update(
      LoyaltyProgramDetail,
      { id: loyaltyProgramDetailId },
      body
    );
    loyaltyProgramDetail = await transactionalEntityManager
      .getRepository(LoyaltyProgramDetail)
      .createQueryBuilder("detail")
      .leftJoinAndSelect("detail.organization", "organization")
      .leftJoinAndSelect("detail.loyaltyProgramConfig", "loyaltyProgramConfig")
      .leftJoinAndSelect("detail.loyaltyEarnRuleSet", "loyaltyEarnRuleSet")
      .where("detail.organization = :orgId", { orgId: body.organizationId })
      .andWhere("detail.id = :id", { id: loyaltyProgramDetailId })
      .getOne();

    if (loyaltyProgramDetail) {
      await setValueToCache(
        key,
        loyaltyProgramDetail,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Updated the record in Database and updated Cache with key :",
        key
      );
    }
    return loyaltyProgramDetail;
  }

  public async deleteLoyaltyProgramDetailById(
    transactionalEntityManager: EntityManager,
    loyaltyProgramDetailId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from loyalty_program_detail where id=${loyaltyProgramDetailId}`
      );
      queryRunner.release();
      console.log(
        "Deleted a loyaltyProgramDetail record from database with id: ",
        loyaltyProgramDetailId
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async getLoyaltyProgramDetail_rawQuery(
    transactionalEntityManager: EntityManager,
    whereOptions: Object
  ) {
    let key = `${CACHING_KEYS.LOYALTY_PROGRAM_DETAIL}`;
    for (let where in whereOptions) key += `_${whereOptions[where]}`;
    let loyaltyProgramDetail: any = await getValueFromCache(key);
    if (!loyaltyProgramDetail || JSON.stringify(loyaltyProgramDetail) == "[]") {
      let query =
        "SELECT rule_set.*,loyalty_program_detail.* FROM loyalty_program_detail LEFT JOIN rule_set ON loyalty_program_detail.loyalty_earn_rule_set_id = rule_set.id";
      let i = 0;
      for (const key in whereOptions) {
        if (key == "collection_id") continue;
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
      if ("collection_id" in whereOptions) {
        query += ` ${i > 0 ? "AND" : ""} JSON_CONTAINS(collection_ids, '"${
          whereOptions["collection_id"]
        }"', '$')`;
      }
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      loyaltyProgramDetail = await queryRunner.manager.query(query);
      await queryRunner.release();
      if (loyaltyProgramDetail) {
        await setValueToCache(
          key,
          loyaltyProgramDetail,
          EXPIRY_MODE.EXPIRE,
          ENTITY_CACHING_PERIOD.LOYALTY_PROGRAM_DETAIL
        );
        console.log(
          "Fetched lpd_raw from Database and added to Cache with key :",
          key
        );
      }
    } else {
      console.log("Fetched lpd_raw from Cache with key :", key);
    }
    return loyaltyProgramDetail;
  }
  public async getLoyaltyProgramDetailById(manager, injector, input) {
    const lpDetail = await manager
      .getRepository(LoyaltyProgramDetail)
      .createQueryBuilder("detail")
      .leftJoinAndSelect("detail.organization", "organization")
      .leftJoinAndSelect("detail.loyaltyProgramConfig", "loyaltyProgramConfig")
      .leftJoinAndSelect("detail.loyaltyEarnRuleSet", "loyaltyEarnRuleSet")
      .where("detail.organization = :orgId", { orgId: input.organizationId })
      .andWhere("detail.id = :id", { id: input.detailId })
      .getOne();

    if (!lpDetail) {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_DETAIL_NOT_FOUND);
    }
    return lpDetail;
  }
}
