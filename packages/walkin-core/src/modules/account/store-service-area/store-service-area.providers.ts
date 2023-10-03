import { Injectable, Inject } from "@graphql-modules/di";
import {
  WalkinRecordNotFoundError,
  WalkinPlatformError,
  WalkinError,
} from "../../common/exceptions/walkin-platform-error";
import { validateAndReturnEntityExtendedData } from "../../entityExtend/utils/EntityExtension";
import {
  Store
} from "../../../entity";
import { OrganizationTypeEnum } from "../../../graphql/generated-models";
import { Organizations } from "../organization/organization.providers";
import {
  ORGANIZATION_TYPES,
  STATUS,
  ENUM_DELIVERY_LOCATION_TYPE,
  AREA_TYPE,
  ENUM_DAY,
} from "../../common/constants";
import {
  executeQuery,
  frameFinalQueries,
  combineExpressions,
  updateEntity,
  frameDynamicSQLFromJexl,
  frameTextFromSQLExpresion,
  addPaginateInfo,
  removeDuplicates,
  checkTimeValidity,
} from "../../common/utils/utils";
import { EntityManager, In } from "typeorm";
import { WCoreError } from "../../common/exceptions";
import { REWARDX_ERRORS } from "@walkinserver/walkin-rewardx/src/modules/common/constants/errors";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { ChannelProvider } from "../../productcatalog/channel/channel.providers";
import {
  validationDecorator,
  isValidPhone,
  isValidEmail,
} from "../../common/validations/Validations";
import { ProductProvider } from "../../productcatalog/product/product.providers";
import { performance } from "perf_hooks";
import { forEach, find } from "lodash";
import { StoreServiceArea } from "../../../entity/StoreServiceArea";

export interface IStoreServiceArea {
  id?: string;
  storeId?: string;
  organizationId?: string;
  serviceAreaValue?: string;
  serviceAreaType?: string;
}

@Injectable()
export class StoreServiceAreaProvider {
  /**
   * addStoreServiceArea
   */
  public async addStoreServiceArea(
    entityManager: EntityManager,
    input: IStoreServiceArea
  ): Promise<StoreServiceArea> {
    const {
      storeId,
      organizationId,
      serviceAreaValue,
      serviceAreaType,
    } = input;
    const existingStore = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: {
          id: organizationId,
        },
      },
      relations: ["organization"],
    });
    if (!existingStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }

    const storeDeliverySchema = {
      areaType: serviceAreaType,
      store: existingStore,
      area: serviceAreaValue,
    };
    const createdStoreDelivery = await entityManager.create(
      StoreServiceArea,
      storeDeliverySchema
    );
    const savedCreatedStoreDelivery = await entityManager.save(
      createdStoreDelivery
    );
    return savedCreatedStoreDelivery;
  }

  /**
   * updateStoreServiceArea
   */
  public async updateStoreServiceArea(
    entityManager: EntityManager,
    input: IStoreServiceArea
  ): Promise<StoreServiceArea> {
    const { id, serviceAreaValue, serviceAreaType } = input;
    const existingServiceArea = await entityManager.findOne(StoreServiceArea, {
      where: {
        id,
      },
      relations: ["store"],
    });
    if (!existingServiceArea) {
      throw new WCoreError(WCORE_ERRORS.STORE_SERVICE_AREA_NOT_FOUND);
    }
    if (serviceAreaType) {
      existingServiceArea["areaType"] = serviceAreaType;
    }
    if (serviceAreaValue) {
      existingServiceArea["area"] = serviceAreaValue;
    }

    const saveUpdatedValues = await entityManager.save(existingServiceArea);

    return saveUpdatedValues;
  }

  /**
   * enableStoreServiceArea
   */
  public async enableStoreServiceArea(
    entityManager: EntityManager,
    input: IStoreServiceArea
  ): Promise<StoreServiceArea> {
    const { id } = input;
    const existingServiceArea = await entityManager.findOne(StoreServiceArea, {
      where: {
        id,
      },
    });
    if (!existingServiceArea) {
      throw new WCoreError(WCORE_ERRORS.STORE_SERVICE_AREA_NOT_FOUND);
    }
    if (existingServiceArea.status === STATUS.ACTIVE) {
      throw new WCoreError(WCORE_ERRORS.STORE_SERVICE_AREA_ALREADY_ACTIVE);
    }
    const updatedEntity = {
      status: STATUS.ACTIVE,
    };
    const updateStoreServiceArea = updateEntity(
      existingServiceArea,
      updatedEntity
    );
    const savedUpdatedEntity = await entityManager.save(updateStoreServiceArea);
    return savedUpdatedEntity;
  }

  /**
   * disableStoreServiceArea
   */
  public async disableStoreServiceArea(
    entityManager: EntityManager,
    input: any
  ): Promise<StoreServiceArea> {
    const { id } = input;
    const existingServiceArea = await entityManager.findOne(StoreServiceArea, {
      where: {
        id,
      },
    });
    if (!existingServiceArea) {
      throw new WCoreError(WCORE_ERRORS.STORE_SERVICE_AREA_NOT_FOUND);
    }
    if (existingServiceArea.status === STATUS.INACTIVE) {
      throw new WCoreError(WCORE_ERRORS.STORE_SERVICE_AREA_ALREADY_INACTIVE);
    }
    const updatedEntity = {
      status: STATUS.INACTIVE,
    };
    const updateStoreServiceArea = updateEntity(
      existingServiceArea,
      updatedEntity
    );
    const savedUpdatedEntity = await entityManager.save(updateStoreServiceArea);
    return savedUpdatedEntity;
  }

  /**
   * getStoreServiceArea
   */
  public async getStoreServiceArea(
    entityManager: EntityManager,
    input: any
  ): Promise<StoreServiceArea> {
    const { id } = input;
    const existingServiceArea = await entityManager.findOne(StoreServiceArea, {
      where: {
        id,
      },
      relations: ["store"],
    });
    if (!existingServiceArea) {
      throw new WCoreError(WCORE_ERRORS.STORE_SERVICE_AREA_NOT_FOUND);
    }
    return existingServiceArea;
  }

  /**
   * getStoreServiceAreas
   */
  public async getStoreServiceAreas(
    entityManager: EntityManager,
    input: any
  ): Promise<StoreServiceArea[]> {
    const { storeId } = input;
    const store = await entityManager.findOne(Store, {
      where: {
        id: storeId,
      },
      cache: 30000,
    });
    if (!store) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    const existingServiceAreas = await entityManager.find(StoreServiceArea, {
      where: {
        store: {
          id: storeId,
        },
      },
      relations: ["store"],
    });
    return existingServiceAreas;
  }
}
