import { Injectable } from "@graphql-modules/di";
import { DiscountType, Organization } from "../../../entity";
import { EntityManager, In } from "typeorm";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { updateEntity } from "../../common/utils/utils";
import {
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE,
  STATUS,
} from "../../common/constants";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache,
} from "../../common/utils/redisUtils";
@Injectable()
class DiscountTypeProvider {
  public async getDiscountType(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<DiscountType> {
    const { id, name, discountTypeCode } = input;
    const filterValues = { organization: organizationId };
    if (id) {
      filterValues["id"] = id;
    }
    if (name) {
      filterValues["name"] = name;
    }

    if (discountTypeCode) {
      filterValues["discountTypeCode"] = discountTypeCode;
    }
    const foundDiscountType = await entityManager.findOne(DiscountType, {
      where: {
        ...filterValues,
        status: STATUS.ACTIVE,
      },
    });
    if (!foundDiscountType) {
      throw new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_NOT_FOUND);
    }
    return foundDiscountType;
  }

  public async getDiscountTypeForOrganization(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<DiscountType[]> {
    const { discountTypeCode = [] } = input;
    const filter = {
      organization: organizationId,
    };
    for (const ctc of discountTypeCode) {
      if (ctc === "") {
        throw new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_NOT_FOUND);
      }
    }

    if (discountTypeCode && discountTypeCode.length > 0) {
      filter["discountTypeCode"] = In(discountTypeCode);
    }

    const foundDiscountTypes = await entityManager.find(DiscountType, {
      where: {
        ...filter,
        status: STATUS.ACTIVE,
      },
    });

    return foundDiscountTypes;
  }

  public async createDiscountType(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<DiscountType> {
    const { name, discountTypeCode } = input;
    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId,
      },
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const DiscountTypeSchema = {
      name,
      organization,
      discountTypeCode,
      status: STATUS.ACTIVE,
      enabled: true,
    };
    const discountType = entityManager.create(DiscountType, DiscountTypeSchema);
    try {
      const savedDiscountType = await entityManager.save(discountType);
      return entityManager.findOne(DiscountType, {
        where: {
          id: savedDiscountType.id,
        },
        relations: ["organization"],
      });
    } catch (error) {
      console.log("error", error);
      throw new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_VALUE_INVALID);
    }
  }

  public async updateDiscountType(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<DiscountType> {
    const { id, name, discountTypeCode } = input;
    const updateEntitySchema = {};
    if (name) {
      updateEntitySchema["name"] = name;
    }
    if (discountTypeCode) {
      updateEntitySchema["discountTypeCode"] = discountTypeCode;
    }
    const DiscountTypeFound = await entityManager.findOne(DiscountType, {
      where: {
        id,
        organization: organizationId,
      },
      relations: ["organization"],
    });
    if (!DiscountTypeFound) {
      throw new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_NOT_FOUND);
    }

    const keys = [`${CACHING_KEYS.DISCOUNT_TYPE}_${id}`];
    removeValueFromCache(keys);

    const updatedDiscountType = updateEntity(
      DiscountTypeFound,
      updateEntitySchema
    );
    const savedUpdatedDiscountType = await entityManager.save(
      updatedDiscountType
    );
    return savedUpdatedDiscountType;
  }

  public async deleteDiscountType(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<boolean> {
    const foundDiscountType = await entityManager.findOne(DiscountType, {
      where: {
        id,
        organization: organizationId,
      },
    });
    if (!foundDiscountType) {
      throw new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_NOT_FOUND);
    }
    const keys = [`${CACHING_KEYS.DISCOUNT_TYPE}_${id}`];
    removeValueFromCache(keys);
    try {
      foundDiscountType.status = STATUS.INACTIVE;
      const deleteDiscountType = await entityManager.save(foundDiscountType);
      return true;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  public async disableDiscountType(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<DiscountType> {
    const foundDiscountType = await entityManager.findOne(DiscountType, {
      where: {
        id,
        organization: organizationId,
      },
    });
    if (!foundDiscountType) {
      throw new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_NOT_FOUND);
    }
    const keys = [`${CACHING_KEYS.DISCOUNT_TYPE}_${id}`];
    removeValueFromCache(keys);
    try {
      foundDiscountType.enabled = false;
      const disabledDiscountType = await entityManager.save(foundDiscountType);
      return disabledDiscountType;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
  public async getDiscountTypeById(
    entityManager: EntityManager,
    DiscountTypeId: string,
    organizationId: string
  ) {
    const key = `${CACHING_KEYS.DISCOUNT_TYPE}_${DiscountTypeId}`;
    let foundDiscountType: any = await getValueFromCache(key);
    if (!foundDiscountType) {
      foundDiscountType = await entityManager.findOne(DiscountType, {
        where: {
          id: DiscountTypeId,
          organization: organizationId,
          status: STATUS.ACTIVE,
        },
      });
      if (foundDiscountType) {
        await setValueToCache(
          key,
          foundDiscountType,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    return foundDiscountType;
  }
}
export { DiscountTypeProvider };
