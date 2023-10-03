import { Injectable } from "@graphql-modules/di";
import { EntityManager, Not } from "typeorm";
import { TaxType, StoreFormat, StoreCharge, Store } from "../../../entity";
import { updateEntity, addPaginateInfo } from "../../common/utils/utils";
import {
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE,
  STATUS,
  STORE_CHARGE_TYPE
} from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

@Injectable()
export class StoreChargeProvider {
  @addPaginateInfo
  public async getStoreCharges(
    entityManager: EntityManager,
    {
      storeId,
      organizationId
    }: {
      storeId: string;
      organizationId: string;
    }
  ) {
    const storeCharge = await entityManager
      .getRepository(StoreCharge)
      .createQueryBuilder("storeCharge")
      .leftJoinAndSelect("storeCharge.store", "store")
      .leftJoinAndSelect("store.organization", "organization")
      .where("store.id= :storeId and organization.id= :organizationId", {
        storeId, organizationId
      }).getMany();

    // PaginationInfo needs to be returned in the response, hence storeCharge length is added as second parameter
    const storeChargeResponse = [
      storeCharge, storeCharge.length
    ];

    return storeChargeResponse;
  }

  public async createStoreCharges(
    entityManager: EntityManager,
    input: any
  ): Promise<StoreCharge> {
    const {
      chargeType,
      chargeValueType,
      storeId,
      chargeValue,
      organizationId
    } = input;

    const storeCharges = await entityManager.findOne(StoreCharge, {
      where: {
        store: storeId,
        chargeType
      }
    });

    if (storeCharges) {
      throw new WCoreError(WCORE_ERRORS.STORE_CHARGE_TYPE_ALREADY_EXISTS);
    }

    const store = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: organizationId
      },
      relations: ["organization"]
    });
    if (!store) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    const key = `${CACHING_KEYS.STORE_CHARGES}_${store.id}`;
    const storeChargeSchema = entityManager.create(StoreCharge, {
      chargeType,
      chargeValue,
      chargeValueType,
      store
    });
    removeValueFromCache([key]);
    const savedChargeValue = await entityManager.save(storeChargeSchema);
    return savedChargeValue;
  }

  public async getStoreChargesForStore(
    entityManager: EntityManager,
    storeId: string
  ): Promise<StoreCharge | any> {
    const key = `${CACHING_KEYS.STORE_CHARGES}_${storeId}`;
    let storeCharges: any = await getValueFromCache(key);
    if (!storeCharges) {
      storeCharges = await entityManager.find(StoreCharge, {
        where: {
          store: storeId
        }
      });
      if (storeCharges) {
        await setValueToCache(key, storeCharges, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
    }
    return storeCharges;
  }

  public async updateStoreCharges(
    entityManager: EntityManager,
    input: any
  ): Promise<StoreCharge> {
    const { id, chargeType, storeId, organizationId } = input;

    const storeCharge = await entityManager
      .getRepository(StoreCharge)
      .createQueryBuilder("storeCharge")
      .leftJoinAndSelect("storeCharge.store", "store")
      .leftJoinAndSelect("store.organization", "organization")
      .where("storeCharge.id= :id and store.id= :storeId and organization.id= :organizationId", {
        id, storeId, organizationId
      })
      .getOne();

    if (!storeCharge) {
      throw new WCoreError(WCORE_ERRORS.STORE_CHARGE_NOT_FOUND);
    }

    if (chargeType) {
      const existingStoreChargeType = await entityManager.find(StoreCharge, {
        where: {
          id: Not(id),
          store: storeId,
          chargeType
        }
      });
      if (existingStoreChargeType.length > 0) {
        throw new WCoreError(WCORE_ERRORS.STORE_CHARGE_TYPE_ALREADY_EXISTS);
      }
    }

    const key = `${CACHING_KEYS.STORE_CHARGES}_${storeCharge.store.id}`;
    removeValueFromCache([key]);
    const updateStoreCharge = updateEntity(storeCharge, input);
    const saveUpdatedEntity = await entityManager.save(updateStoreCharge);
    return saveUpdatedEntity;
  }
}
