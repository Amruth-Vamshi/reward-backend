import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { Organization } from "../../../entity";
import {
  CACHING_KEYS,
  CACHING_PERIOD,
  EXPIRY_MODE
} from "../../common/constants";
import {
  getValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

@Injectable()
export class OrganizationRepository {
  public async createOrganization(
    transactionalEntityManager: EntityManager,
    body: any,
    relations: Array<string>
  ): Promise<Organization> {
    const key = `${CACHING_KEYS.ORGANIZATION}_${body.id}`;
    let organization: any = await getValueFromCache(key);
    if (!organization) {
      organization = await transactionalEntityManager.findOne(Organization, {
        where: {
          id: body.id
        },
        relations
      });
      console.log("Fetched from database.");
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    if (organization) {
      await setValueToCache(
        key,
        organization,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated to Cache with key :", key);
    } else {
      organization = await transactionalEntityManager.create(
        Organization,
        body
      );
      organization = await transactionalEntityManager.save(organization);
      await setValueToCache(
        key,
        organization,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log(
        "Created a new Record in database and updated it to cache with key: ",
        key
      );
    }
    return organization;
  }

  public async getOrganizationById(
    transactionalEntityManager: EntityManager,
    orgId: string,
    relations: [string]
  ): Promise<Organization> {
    const key = `${CACHING_KEYS.ORGANIZATION}_${orgId}`;
    let organization: any = await getValueFromCache(key);

    if (!organization) {
      organization = await transactionalEntityManager.findOne(Organization, {
        where: {
          id: orgId
        },
        relations
      });

      if (organization) {
        await setValueToCache(
          key,
          organization,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log("Fetched from database and Added to Cache with key: ", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return organization;
  }

  public async updateOrganizationById(
    transactionalEntityManager: EntityManager,
    orgId: string,
    body: any
  ): Promise<Organization> {
    const key = `${CACHING_KEYS.ORGANIZATION}_${orgId}`;
    let organization: any = await getValueFromCache(key);

    if (!organization) {
      organization = await transactionalEntityManager.findOne(Organization, {
        where: {
          id: orgId
        }
      });
      console.log("Fetched from database. organizationId: ", orgId);
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    if (!organization) return null;

    organization = await transactionalEntityManager.update(
      Organization,
      { id: orgId },
      body
    );

    if (organization) {
      await setValueToCache(
        key,
        organization,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated the record in database and cache with key: ", key);
    }
    return organization;
  }

  public async deleteOrganizationById(
    transactionalEntityManager: EntityManager,
    orgId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from organization where id=${orgId}`
      );
      console.log("Deleted the record in database. organizationId: ", orgId);
      queryRunner.release();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
