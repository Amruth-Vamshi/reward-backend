import { Injectable } from "@graphql-modules/di";
import { ChargeType, Organization } from "../../../entity";
import { EntityManager, In } from "typeorm";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { updateEntity } from "../../common/utils/utils";
import { CACHE_TTL, CACHING_KEYS, EXPIRY_MODE } from "../../common/constants";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
@Injectable()
class ChargeTypeProvider {
  public async getChargeType(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ChargeType> {
    const { id, name, chargeTypeCode } = input;
    let filterValues = { organization: organizationId };
    if (id) {
      filterValues["id"] = id;
    }
    if (name) {
      filterValues["name"] = name;
    }

    if (chargeTypeCode) {
      filterValues["chargeTypeCode"] = chargeTypeCode;
    }
    const foundChargeType = await entityManager.findOne(ChargeType, {
      where: {
        ...filterValues
      }
    });
    if (!foundChargeType) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
    }
    return foundChargeType;
  }

  public async getChargeTypeForOrganization(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ChargeType[]> {
    const { chargeTypeCode = [] } = input;
    const filter = {
      organization: organizationId
    };
    for (const ctc of chargeTypeCode) {
      if (ctc === "") {
        throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
      }
    }

    if (chargeTypeCode && chargeTypeCode.length > 0) {
      filter["chargeTypeCode"] = In(chargeTypeCode);
    }

    const foundChargeTypes = await entityManager.find(ChargeType, {
      where: {
        ...filter
      }
    });
    if (foundChargeTypes.length === 0) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
    }
    return foundChargeTypes;
  }

  public async createChargeType(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ChargeType> {
    const { name, chargeTypeCode } = input;
    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId
      }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const chargeTypeSchema = {
      name: name,
      organization: organization,
      chargeTypeCode: chargeTypeCode
    };
    const chargeType = entityManager.create(ChargeType, chargeTypeSchema);
    try {
      const savedChargeType = await entityManager.save(chargeType);
      return entityManager.findOne(ChargeType, {
        where: {
          id: savedChargeType.id
        },
        relations: ["organization"]
      });
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_VALUE_INVALID);
    }
  }

  public async updateChargeType(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ChargeType> {
    const { id, name, chargeTypeCode } = input;
    let updateEntitySchema = {};
    if (name) {
      updateEntitySchema["name"] = name;
    }
    if (chargeTypeCode) {
      updateEntitySchema["chargeTypeCode"] = chargeTypeCode;
    }
    const chargeTypeFound = await entityManager.findOne(ChargeType, {
      where: {
        id: id,
        organization: organizationId
      },
      relations: ["organization"]
    });
    if (!chargeTypeFound) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
    }

    const keys = [`${CACHING_KEYS.CHARGE_TYPE}_${id}`];
    removeValueFromCache(keys);

    const updatedChargeType = updateEntity(chargeTypeFound, updateEntitySchema);
    const savedUpdatedChargeType = await entityManager.save(updatedChargeType);
    return savedUpdatedChargeType;
  }

  public async deleteChargeType(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<boolean> {
    const foundChargeType = await entityManager.findOne(ChargeType, {
      where: {
        id: id,
        organization: organizationId
      }
    });
    if (!foundChargeType) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
    }
    const keys = [`${CACHING_KEYS.CHARGE_TYPE}_${id}`];
    removeValueFromCache(keys);
    try {
      const deleteChargeType = await entityManager.remove(foundChargeType);
      return true;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
  public async getChargeTypeById(
    entityManager: EntityManager,
    chargeTypeId: string,
    organizationId: string
  ) {
    const key = `${CACHING_KEYS.CHARGE_TYPE}_${chargeTypeId}`;
    let foundChargeType: any = await getValueFromCache(key);
    if (!foundChargeType) {
      foundChargeType = await entityManager.findOne(ChargeType, {
        where: {
          id: chargeTypeId,
          organization: organizationId
        }
      });
      if (foundChargeType) {
        await setValueToCache(
          key,
          foundChargeType,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    return foundChargeType;
  }
}
export { ChargeTypeProvider };
