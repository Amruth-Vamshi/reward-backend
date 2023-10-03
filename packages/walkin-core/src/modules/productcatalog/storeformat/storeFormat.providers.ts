import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { TaxType, StoreFormat } from "../../../entity";
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
  clearEntityCache,
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

@Injectable()
export class StoreFormatProvider {
  public async getStoreFormat(
    entityManager: EntityManager,
    {
      id,
      organizationId
    }: {
      id: string;
      organizationId: string;
    }
  ): Promise<StoreFormat> {
    const query = {
      id,
      organization: {
        id: organizationId
      }
    };
    const options: any = {};
    options.where = query;
    options.relations = ["organization", "taxTypes"];
    const storeFormat = await entityManager.findOne(StoreFormat, options);
    if (!storeFormat) {
      throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
    }
    return storeFormat;
  }

  public async getStoreFormatByCode(
    entityManager: EntityManager,
    {
      storeFormatCode,
      organizationId
    }: {
      storeFormatCode: string;
      organizationId: string;
    }
  ) {
    const query = {
      storeFormatCode,
      organization: {
        id: organizationId
      }
    };
    const options: any = {};
    options.where = query;
    options.relations = ["organization"];

    const storeFormat = await entityManager.findOne(StoreFormat, options);

    if (storeFormat === undefined || storeFormat.status === STATUS.INACTIVE) {
      throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
    }
    return storeFormat;
  }

  @addPaginateInfo
  public async getStoreFormats(
    entityManager: EntityManager,
    pageOptions,
    sortOptions,
    {
      organizationId,
      name,
      description,
      storeFormatCode,
      status
    }: {
      organizationId: string;
      name?: string;
      description?: string;
      storeFormatCode?: string;
      status?: string;
    }
  ): Promise<[StoreFormat[], number]> {
    const query = { organization: organizationId };
    if (name) {
      query["name"] = name;
    }
    if (storeFormatCode) {
      query["storeFormatCode"] = storeFormatCode;
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

    const storeFormats: any = await entityManager.findAndCount(
      StoreFormat,
      options
    );

    return storeFormats;
  }

  public async createStoreFormat(
    entityManager: EntityManager,
    {
      organizationId,
      storeFormatCode,
      name,
      description,
      status,
      taxTypeCodes
    }: {
      organizationId: string;
      storeFormatCode: string;
      name: string;
      description: string;
      status: string;
      taxTypeCodes: string[];
    }
  ) {
    const taxTypes = [];
    if (taxTypeCodes && taxTypeCodes.length > 0) {
      for (const taxTypeCode of taxTypeCodes) {
        let taxTypeFound;
        if (taxTypeCode !== "") {
          taxTypeFound = await entityManager.findOne(TaxType, {
            where: {
              taxTypeCode,
              organization: {
                id: organizationId
              }
            },
            relations: ["organization"]
          });
        }
        if (!taxTypeFound) {
          throw new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND);
        }
        taxTypes.push(taxTypeFound);
      }
    } else {
      throw new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND);
    }
    if (!status) {
      status = STATUS.ACTIVE;
    }
    const input = {
      name,
      description,
      storeFormatCode,
      status,
      organization: {
        id: organizationId
      },
      taxTypes
    };
    const storeFormat = await entityManager.create(StoreFormat, input);
    const options: any = {};
    options.relations = ["organization", "taxTypes"];
    const savedStoreFormat = await entityManager.save(storeFormat, options);
    return savedStoreFormat;
  }

  public async updateStoreFormat(
    entityManager: EntityManager,
    {
      id,
      organizationId,
      name,
      description,
      storeFormatCode,
      status,
      taxTypeCodes
    }: {
      id: string;
      organizationId: string;
      name?: string;
      description?: string;
      storeFormatCode?: string;
      status?: string;
      taxTypeCodes?: string[];
    }
  ): Promise<StoreFormat> {
    const storeFormatFound = await entityManager.findOne(StoreFormat, {
      where: {
        id
      },
      relations: ["organization", "taxTypes"]
    });

    if (!storeFormatFound) {
      throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
    }
    const taxTypes = [];
    if (taxTypeCodes && taxTypeCodes.length > 0) {
      for (const taxTypeCode of taxTypeCodes) {
        const taxTypeFound = await entityManager.findOne(TaxType, {
          where: {
            taxTypeCode,
            organization: {
              id: organizationId
            }
          },
          relations: ["organization"]
        });
        if (!taxTypeFound) {
          throw new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND);
        }
        taxTypes.push(taxTypeFound);
      }
    }

    await clearEntityCache("store", () => {
      console.log("Store Cache removed");
    });
    const keys = [`${CACHING_KEYS.STORE_FORMAT}_${id}`];
    removeValueFromCache(keys);

    const input = {
      name,
      description,
      storeFormatCode,
      status,
      organization: {
        id: organizationId
      },
      taxTypes
    };

    const options = {
      relations: ["organization", "taxTypes"]
    };
    const updatedTaxType = updateEntity(storeFormatFound, input);

    await entityManager.save(updatedTaxType, options);
    return entityManager.findOne(StoreFormat, id, options);
  }

  public async getStoreFormatById(
    entityManager,
    storeFormatId,
    organizationId
  ) {
    const key = `${CACHING_KEYS.STORE_FORMAT}_${storeFormatId}`;
    let foundstoreFormat: any = await getValueFromCache(key);
    if (!foundstoreFormat) {
      foundstoreFormat = await entityManager.findOne(StoreFormat, {
        where: {
          id: storeFormatId,
          organization: organizationId
        }
      });
      if (foundstoreFormat) {
        await setValueToCache(
          key,
          foundstoreFormat,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    return foundstoreFormat;
  }
}
