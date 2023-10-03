import { Service } from "typedi";
import { EntityManager } from "typeorm";
import { Tier } from "../../entity/Tier";
import { CACHING_KEYS, CACHING_PERIOD, EXPIRY_MODE } from "../common/constants";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";
import {
  getValueFromCache,
  setValueToCache,
  clearEntityCache
} from "../common/utils/redisUtils";
import {
  camelizeKeys,
  formatLoyaltyProgramCode,
  isValidString
} from "../common/utils/utils";

@Service()
export class TierRepository {
  public async getTier(entityManager: EntityManager, getOptions: any) {
    let { organizationId, id, code } = getOptions;

    let key = `${CACHING_KEYS.TIER}`;
    for (let where in getOptions) key += `_${getOptions[where]}`;
    let tier: any = await getValueFromCache(key);

    if (!tier) {
      if (!id && !code) {
        throw new WCoreError(WCORE_ERRORS.PROVIDE_CODE_OR_ID_FOR_TIER);
      }
      const queryRunner = await entityManager.connection.createQueryRunner();
      let organization = await queryRunner.manager.query(
        `SELECT * FROM organization WHERE id = '${organizationId}'`
      );
      if (organization.length > 0)
        organization = await camelizeKeys(organization[0]);
      delete getOptions.organizationId;
      getOptions.organization_id = organizationId;
      let query = "SELECT * FROM tier";
      let i = 0;
      for (const key in getOptions) {
        const value = getOptions[`${key}`];
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
      tier = await queryRunner.manager.query(query);
      await queryRunner.release();
      if (tier && tier.length == 1) {
        tier = await camelizeKeys(tier[0]);
        delete tier.organizationId;
        tier.organization = organization;
        await setValueToCache(
          key,
          tier,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_SHORT_CACHING_PERIOD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      } else {
        throw new WCoreError(WCORE_ERRORS.TIER_NOT_FOUND);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return tier;
  }

  public async getTiers(entityManager: EntityManager, getOptions: any) {
    const { organizationId } = getOptions;

    const queryRunner = await entityManager.connection.createQueryRunner();
    let query = `SELECT * FROM tier WHERE organization_id = '${organizationId}'`;
    let tiers = await queryRunner.manager.query(query);
    await queryRunner.release();
    if (tiers && tiers.length > 0) {
      tiers = await camelizeKeys(tiers);
    }

    return tiers;
  }

  public async createTier(entityManager: EntityManager, createOptions: any) {
    if (createOptions.code) {
      if (!isValidString(createOptions.code)) {
        throw new WCoreError(WCORE_ERRORS.INVALID_CODE);
      }
      createOptions.code = formatLoyaltyProgramCode(createOptions.code);
    } else {
      throw new WCoreError(WCORE_ERRORS.PROVIDE_CODE_FOR_TIER);
    }
    let { organizationId, code } = createOptions;

    let key = `${CACHING_KEYS.TIER}`;
    for (let where in createOptions) {
      if (where == "description") continue;
      key += `_${createOptions[where]}`;
    }
    let tier: any = await getValueFromCache(key);

    if (!tier) {
      const queryRunner = await entityManager.connection.createQueryRunner();
      let ifTierExists = await queryRunner.manager.query(
        `SELECT * FROM tier WHERE organization_id = '${organizationId}' AND code = '${code}'`
      );
      if (ifTierExists.length) {
        delete ifTierExists[0].organization_id;
        let organization = await queryRunner.manager.query(
          `SELECT * FROM organization WHERE id = '${organizationId}'`
        );
        ifTierExists[0].organization = organization[0];
      }
      await queryRunner.release();
      if (ifTierExists.length == 1) {
        tier = await camelizeKeys(ifTierExists[0]);
        await setValueToCache(
          key,
          tier,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_SHORT_CACHING_PERIOD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      } else {
        createOptions.organization = organizationId;
        const tierSchema = await entityManager.create(Tier, createOptions);
        tier = await entityManager.save(tierSchema);
        tier = await entityManager.findOne(Tier, {
          where: { id: tier.id },
          relations: ["organization"]
        });
        await setValueToCache(
          key,
          tier,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_SHORT_CACHING_PERIOD
        );
        console.log(
          "Created a new record in Database and added to Cache with key :",
          key
        );
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return tier;
  }

  public async deleteTier(entityManager: EntityManager, deleteOptions: any) {
    let { organizationId, id, code } = deleteOptions;

    const queryRunner = await entityManager.connection.createQueryRunner();
    let query = `SELECT * FROM tier WHERE organization_id = '${organizationId}'`;

    if (
      (id == null || id == undefined) &&
      (code == null || code == undefined)
    ) {
      throw new WCoreError(WCORE_ERRORS.PROVIDE_CODE_OR_ID_FOR_TIER);
    } else {
      if (id) {
        query += ` AND id = '${id}'`;
      }
      if (code) {
        query += ` AND code = '${code}'`;
      }
    }

    // find if the tier to be deleted actually exists for the organization.
    let tier: any = await queryRunner.manager.query(query);
    if (tier.length == 0) {
      await queryRunner.release();
      throw new WCoreError(WCORE_ERRORS.TIER_NOT_FOUND);
    }
    tier = tier[0];

    // check if any customer belongs to the tier that is about to be deleted.
    const customers = await queryRunner.manager.query(
      `SELECT * FROM customer WHERE organization_id='${organizationId}' AND tier='${tier.code}'`
    );
    if (customers.length > 0) {
      // update the tier of the customers who belong to the same tier that is about to be deleted.
      const updatedCustomers = await queryRunner.manager.query(
        `UPDATE customer SET tier=NULL WHERE organization_id='${organizationId}' AND tier='${tier.code}'`
      );
      console.log(
        `Number of customers whose tier has been updated: ${updatedCustomers.affectedRows}`
      );
    }
    await queryRunner.manager.query(
      `DELETE FROM tier WHERE organization_id='${organizationId}' AND code = '${tier.code}'`
    );
    await clearEntityCache(CACHING_KEYS.TIER, () => {
      console.log("cleared cache data for tier");
    });
    tier = await queryRunner.manager.query(
      `SELECT * FROM tier WHERE organization_id='${organizationId}' AND code = '${tier.code}'`
    );
    await queryRunner.release();
    if (tier.length == 0) return true;
    else return false;
  }
}
