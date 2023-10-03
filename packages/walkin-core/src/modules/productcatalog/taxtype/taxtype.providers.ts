import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { TaxType } from "../../../entity";
import { updateEntity, addPaginateInfo } from "../../common/utils/utils";
import {
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE,
  STATUS
} from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

@Injectable()
export class TaxTypeProvider {
  public async getTaxType(
    entityManager: EntityManager,
    {
      id,
      organizationId
    }: {
      id: string;
      organizationId: string;
    }
  ): Promise<TaxType> {
    const query = {
      id,
      organization: {
        id: organizationId
      }
    };
    const options: any = {};
    options.where = query;
    options.relations = ["organization"];

    return entityManager.findOne(TaxType, options);
  }

  @addPaginateInfo
  public async getTaxTypes(
    entityManager: EntityManager,
    pageOptions,
    sortOptions,
    {
      organizationId,
      name,
      description,
      status
    }: {
      organizationId: string;
      name?: string;
      description?: string;
      status?: string;
    }
  ): Promise<[TaxType[], number]> {
    const query = { organization: organizationId };
    if (name) {
      query["name"] = name;
    }
    if (status) {
      query["status"] = STATUS.ACTIVE;
    }
    if (description) {
      query["description"] = description;
    }
    const options: any = {};

    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    options.where = query;
    options.relations = ["organization"];

    return entityManager.findAndCount(TaxType, options);
  }

  public async createTaxType(
    entityManager: EntityManager,
    { name, description, taxTypeCode, status, organizationId }
  ) {
    if (!status) {
      status = STATUS.ACTIVE;
    }
    const input = {
      name,
      description,
      taxTypeCode,
      status,
      organization: {
        id: organizationId
      }
    };
    const taxType = await entityManager.create(TaxType, input);
    const options: any = {};
    options.relations = ["organization"];
    return entityManager.save(taxType, options);
  }

  public async updateTaxType(
    entityManager: EntityManager,
    {
      id,
      organizationId,
      name,
      description,
      taxTypeCode,
      status
    }: {
      id: string;
      organizationId: string;
      name?: string;
      description?: string;
      taxTypeCode?: string;
      status?: string;
    }
  ): Promise<TaxType> {
    let query: any;
    if (id) {
      query = {
        where: {
          id
        },
        relations: ["organization"]
      };
    } else if (taxTypeCode) {
      query = {
        where: {
          taxTypeCode
        },
        relations: ["organization"]
      };
    }

    const taxTypeFound = await entityManager.findOne(TaxType, query);

    const input = {
      name,
      description,
      taxTypeCode,
      status,
      organization: {
        id: organizationId
      }
    };

    if (!taxTypeFound) {
      throw new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND);
    }

    const options = {
      relations: ["organization"]
    };
    const updatedTaxType = updateEntity(taxTypeFound, input);

    await entityManager.save(updatedTaxType, options);

    const keys = [`${CACHING_KEYS.TAX_TYPE}_${taxTypeFound.id}`];
    removeValueFromCache(keys);

    return entityManager.findOne(TaxType, id, {
      relations: ["organization"]
    });
  }

  public async getTaxTypeById(entityManager, taxTypeId, organizationId) {
    const key = `${CACHING_KEYS.TAX_TYPE}_${taxTypeId}`;
    let foundTaxType: any = await getValueFromCache(key);
    if (!foundTaxType) {
      foundTaxType = await entityManager.findOne(TaxType, {
        where: {
          id: taxTypeId,
          organization: organizationId
        }
      });
      if (foundTaxType) {
        await setValueToCache(key, foundTaxType, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
    }
    return foundTaxType;
  }
}
