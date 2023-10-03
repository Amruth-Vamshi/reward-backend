import { Injectable, Inject, Injector } from "@graphql-modules/di";
import {
  WalkinRecordNotFoundError,
  WalkinPlatformError,
  WalkinError
} from "../../../../src/modules/common/exceptions/walkin-platform-error";
import { validateAndReturnEntityExtendedData } from "../../entityExtend/utils/EntityExtension";
import {
  Organization,
  StoreAdminLevel,
  Channel,
  ProductChargeValue,
  ProductPriceValue,
  ProductTaxValue,
  Product,
  StoreFormat,
  // StoreFormatStore,
  Category,
  ProductCategory,
  Store,
  StoreDeliveryArea,
  StoreOpenTiming,
  Staff
} from "../../../entity";
import { OrganizationTypeEnum } from "../../../graphql/generated-models";
import { Organizations } from ".././organization/organization.providers";
import {
  ORGANIZATION_TYPES,
  STATUS,
  ENUM_DELIVERY_LOCATION_TYPE,
  AREA_TYPE,
  ENUM_DAY,
  STAFF_ROLE,
  CACHING_KEYS,
  CACHE_TTL,
  SHORT_CACHE_TTL,
  EXPIRY_MODE
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
  isPincodeValid,
  isValidString,
  validateStatus
} from "../../common/utils/utils";
import { EntityManager, In } from "typeorm";
import { WCoreError } from "../../common/exceptions";
import { REWARDX_ERRORS } from "@walkinserver/walkin-rewardx/src/modules/common/constants/errors";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { ChannelProvider } from "../../productcatalog/channel/channel.providers";
import {
  validationDecorator,
  isValidPhone,
  isValidEmail
} from "../../common/validations/Validations";
import { ProductProvider } from "../../productcatalog/product/product.providers";
import { performance } from "perf_hooks";
import { forEach, find } from "lodash";
import { Chance } from "chance";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

import UrlSafeString from "url-safe-string";
import { CategoryProvider } from "../../productcatalog/category/category.providers";
import { CatalogProvider } from "../../productcatalog/catalog/catalog.providers";
import { sendToWehbookSubscribers } from "../../common/utils/webhookUtils";
import { StoreModule } from "./store.module";

interface ITimings {
  openTime: number;
  closeTime: number;
}

interface IBulkStaffMember {
  name?: string;
  phone?: string;
  staff_role: string;
  email?: string;
}

interface IStaffMembersToStore {
  staffMemberIds: [string];
  storeId: string;
  organizationId: string;
}

interface IStoreTimings {
  days: string;
  data: ITimings[];
}

interface IMarkStaffBusyStatus {
  id: string;
  busy: boolean;
}

interface IBuilkStoreOpeningTimings {
  storeTimings: IStoreTimings[];
  organizationId: string;
  storeId: string;
}
interface IStore {
  id: string;
  name: string;
  STATUS: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  externalStoreId: string;
  code: string;
  extend: any;
  email: string;
  geoLocation: string;
  organization: any;
}

interface IOpeningTimings {
  id: string;
  openTime: number;
  closeTime: number;
  days: string;
  store: IStore;
}

interface IOpeningTimingsOutput extends IStoreTimings {
  id: string;
  store: IStore;
}

@Injectable()
export class Stores {
  constructor(
    @Inject(Organizations)
    private organization: Organizations,
    @Inject(ChannelProvider)
    private channelProvider: ChannelProvider,
    @Inject(ProductProvider)
    private productProvider: ProductProvider,
    @Inject(CategoryProvider)
    private categoryProvider: CategoryProvider,
    @Inject(CatalogProvider)
    private catalogProvider: CatalogProvider
  ) {}

  public async getStoreIdsForStoreFormats(entityManager, input, storeIds) {
    let storeIdsBasedOnStoreFormat = [];
    if (input.storeFormats.length > 0) {
      // Validate storeFormatCodes
      const storesBasedOnStoreFormat = await entityManager.find(Store, {
        where: {
          storeFormat: {
            code: In(input.storeFormats)
          },
          organization: {
            id: input.organizationId
          }
        },
        relations: ["organization", "storeFormats"],
        cache: 30000
      });
      if (storesBasedOnStoreFormat.length > 0) {
        storeIdsBasedOnStoreFormat = storesBasedOnStoreFormat.map(
          store => store.id
        );
        if (storeIdsBasedOnStoreFormat.length > 0) {
          storeIds.push(...storeIdsBasedOnStoreFormat);
        } else {
          throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
        }
      } else {
        throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      }
    }
    return storeIds;
  }

  public async getStoreDeliverArea(
    entityManager: EntityManager,
    storeId: string,
    organizationId: string
  ) {
    const store = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: organizationId
      },
      cache: 30000
    });
    if (!store) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    const storeDeliveryArea = await entityManager.findOne(StoreDeliveryArea, {
      where: {
        store: {
          id: storeId
        }
      },
      relations: ["store"]
    });
    return storeDeliveryArea;
  }

  public async getStoreIdsForChannels(entityManager, input, storeIds) {
    let storeIdsBasedOnChannels = [];

    if (input.channels.length > 0) {
      // Validate channelCodes
      const storesBasedOnChannels = await entityManager.find(Store, {
        where: {
          channel: {
            code: In(input.channels)
          },
          organization: {
            id: input.organizationId
          },
          cache: 30000
        },
        relations: ["organization", "channels"]
      });
      if (storesBasedOnChannels.length > 0) {
        storeIdsBasedOnChannels = storesBasedOnChannels.map(store => store.id);
        if (storeIdsBasedOnChannels.length > 0) {
          storeIds.push(...storeIdsBasedOnChannels);
        } else {
          throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
        }
      } else {
        throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      }
    }
    return storeIds;
  }

  public async getStoreIdsForDeliveryDateTime(entityManager, input, storeIds) {
    let storeIdsBasedOnOpenTime = [];
    const storesOpenTime = await entityManager.find(StoreOpenTiming, {
      relations: ["store", "store.organization"]
    });

    if (storesOpenTime.length > 0) {
      const openTimeForStoresWithinOrg = storesOpenTime.map(storeTime => {
        if (storeTime.store.organization.id === input.organizationId) {
          return storeTime;
        }
      });

      if (openTimeForStoresWithinOrg.length <= 0) {
        throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      }
      storeIdsBasedOnOpenTime = await openTimeForStoresWithinOrg
        .map(storeTime => {
          if (storeTime) {
            if (
              storeTime.openTime <= Number(input.deliveryDateTime) &&
              storeTime.closeTime >= Number(input.deliveryDateTime)
            ) {
              return storeTime.store.id;
            }
          }
        })
        .filter(element => element !== undefined);

      if (storeIdsBasedOnOpenTime.length > 0) {
        storeIds.push(...storeIdsBasedOnOpenTime);
      } else {
        throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      }
    } else {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    return storeIds;
  }

  public async getStoreIdsForGeoLocation(entityManager, input, storeIds) {
    let storesIdsBasedOnGeoLocation = [];
    const storesBasedOnGeoLocation = await entityManager.find(
      StoreDeliveryArea,
      {
        where: {
          area: input.deliveryLocationValue,
          store: {
            id: input.organizationId
          }
        },
        relations: ["store", "store.organization"]
      }
    );
    // Extract storeIds from StoreDeliveryArea
    if (storesBasedOnGeoLocation.length > 0) {
      const geoPointsBasedOnDelivery = storesBasedOnGeoLocation.map(
        storeDelivery => {
          if (storeDelivery.store.organization.id === input.organizationId) {
            return storeDelivery;
          }
        }
      );

      if (geoPointsBasedOnDelivery.length <= 0) {
        throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      }

      storesIdsBasedOnGeoLocation = storesBasedOnGeoLocation.map(
        storeBasedOnGeoLocation => storeBasedOnGeoLocation.store.id
      );
      if (storesIdsBasedOnGeoLocation.length > 0) {
        storeIds.push(...storesIdsBasedOnGeoLocation);
      }
    } else {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    return storeIds;
  }

  public async getStoreIdsForPincode(entityManager, input, storeIds) {
    let storesIdsBasedOnPincode = [];
    const storesBasedOnPincode = await entityManager.find(StoreDeliveryArea, {
      where: {
        areaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE,
        pincode: Number(input.deliveryLocationValue),
        organization: {
          id: input.organizationId
        }
      },
      relations: ["store", "store.organization"]
    });

    // Extract storeIds from StoreDeliveryArea
    if (storesBasedOnPincode.length > 0) {
      const pincodeBasedOnStoreOrg = storesBasedOnPincode.map(storeDelivery => {
        if (storeDelivery.store.organization.id === input.organizationId) {
          return storeDelivery;
        }
      });

      if (pincodeBasedOnStoreOrg.length <= 0) {
        throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      }

      storesIdsBasedOnPincode = storesBasedOnPincode.map(
        storeBasedOnPincode => storeBasedOnPincode.store.id
      );
      if (storesIdsBasedOnPincode.length > 0) {
        storeIds.push(...storesIdsBasedOnPincode);
      }
    }
    return storeIds;
  }

  public async getProductForCategoryWithChildren(
    entityManager,
    store,
    organizationId
  ) {
    const { catalog, storeFormats, channels } = store;
    if (
      storeFormats &&
      channels &&
      storeFormats.length > 0 &&
      channels.length > 0
    ) {
      const validStoreFormatIds = storeFormats.map(
        storeFormat => storeFormat.id
      );
      const validChannelIds = channels.map(channel => channel.id);
      console.log(validStoreFormatIds);
      console.log(validChannelIds);
      console.log(organizationId);

      for (let category of store.catalog.categories) {
        category = await this.productProvider.findProductsForCategoryWithChildren(
          entityManager,
          category,
          store
        );
      }
      console.log(
        "====================================END==============================================================="
      );
      return store;
    }
  }

  public async getStorebyId(entityManager, id, organizationId) {
    let query: any = {};
    if (organizationId) {
      query = {
        id,
        organization: {
          id: organizationId
        }
      };
    } else {
      query = {
        id
      };
    }
    const store = await entityManager.findOne(Store, {
      where: query,
      relations: [
        "organization"
        // "channels",
        // "storeFormats",
        // "catalog",
        // "staff",
        // "users",
        // "users.roles"
      ]
    });
    return store;
  }

  public async getStorebyStoreCode(
    entityManager,
    code,
    organizationId
  ): Promise<Store | any> {
    const key = `${CACHING_KEYS.STORE}_${code}`;
    let storeDetails = await getValueFromCache(key);
    if (!storeDetails) {
      storeDetails = await entityManager.findOne(Store, {
        where: {
          code,
          organization: organizationId
        }
        // relations: [
        // "storeOpenTimings",
        // "catalog",
        // "storeFormats",
        // "channels",
        // "organization"
        // ]
      });

      if (storeDetails) {
        // store cache related to store only for half an hour since alot of validation revolve around store and timings
        await setValueToCache(
          key,
          storeDetails,
          EXPIRY_MODE.EXPIRE,
          60 * 30 * 1
        );
        console.log("Fetched from database and Added to Cache with key: ", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    return storeDetails;
  }

  @addPaginateInfo
  public async getAllStores(entityManager, pageOptions, sortOptions, input) {
    let query: any = {};
    let storeIds = [];

    if (input.deliveryLocationValue) {
      if (input.deliveryLocationType) {
        const deliveryLocationType = input.deliveryLocationType;
        if (deliveryLocationType === ENUM_DELIVERY_LOCATION_TYPE.PINCODE) {
          // Validate pincode against the stores
          storeIds = await this.getStoreIdsForPincode(
            entityManager,
            input,
            storeIds
          );
        }

        if (deliveryLocationType === ENUM_DELIVERY_LOCATION_TYPE.GEO_POINT) {
          // Validate points against the stores
          storeIds = await this.getStoreIdsForGeoLocation(
            entityManager,
            input,
            storeIds
          );
        }
      } else {
        throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
      }
    }

    if (input.deliveryDateTime) {
      // Validate against StoreOpenTime
      storeIds = await this.getStoreIdsForDeliveryDateTime(
        entityManager,
        input,
        storeIds
      );
    }

    if (input.channel || input.storeFormat) {
      storeIds = await this.getStoreIds(entityManager, input, storeIds);
    }

    // Remove duplicates
    storeIds = removeDuplicates(storeIds);
    const options: any = {};
    if (storeIds.length > 0) {
      query = {
        id: In(storeIds),
        organization: {
          id: input.organizationId
        }
      };
    } else {
      query = {
        organization: {
          id: input.organizationId
        }
      };
    }

    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;

    options.where = query;
    // options.relations = [
    //   "storeFormats",
    //   "catalog",
    //   "channels",
    //   "organization",
    //   "staff",
    //   "users",
    //   "users.roles"
    // ];
    return entityManager.findAndCount(Store, options);
  }

  public async getStoreCatalog(
    entityManager: EntityManager,
    input,
    organizationId: string
  ) {
    const { storeId, channelIds } = input;

    const filter = {
      storeId,
      organizationId
    };
    const storeFound = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!storeFound) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }

    const store = await entityManager.findOne(Store, {
      where: {
        id: storeFound.id,
        organization: {
          id: organizationId
        },
        channel: {
          id: In(channelIds),
          organization: {
            id: organizationId
          }
        },
        storeFormat: {
          organization: {
            id: organizationId
          }
        }
      },
      // relations: ["storeFormats", "channels", "catalog", "organization"]
      relations: ["organization"]
    });

    // const { catalog, storeFormats, channels } = store;
    // const storeFormatIds = storeFormats.map(storeFormat => storeFormat.id);
    // const validChannelIds = channels.map(channel => channel.id);
    // if (!catalog) {
    //   throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
    // }
    let productCondition = {};
    if (input.listableProducts) {
      productCondition = {
        product: {
          listable: input.listableProducts
        }
      };
    }

    const products = await entityManager.find(ProductCategory, {
      where: {
        category: {
          catalog: {
            // id: catalog.id
          }
        },
        ...productCondition
      },
      relations: ["category", "category.catalog", "product"]
    });
    const categories = await entityManager.find(Category, {
      where: {
        catalog: {
          // id: catalog.id
        }
      }
      // relations: ["catalog"]
    });

    const allProducts = [];
    for (const product of products) {
      const productPriceVale = await entityManager.find(ProductPriceValue, {
        where: {
          // channel: In(validChannelIds),
          // storeFormat: In(storeFormatIds),
          product: product.id
        },
        relations: ["channel", "storeFormat", "product", "product.organization"]
      });

      const productTaxValue = await entityManager.find(ProductTaxValue, {
        where: {
          // channel: In(validChannelIds),
          // storeFormat: In(storeFormatIds),
          product: product.id,
          status: STATUS.ACTIVE
        },
        relations: ["channel", "storeFormat", "product", "product.organization"]
      });

      const productChargeValues = await entityManager.find(ProductChargeValue, {
        where: {
          // channel: In(validChannelIds),
          // storeFormat: In(storeFormatIds),
          product: product.id,
          status: STATUS.ACTIVE
        },
        relations: ["channel", "storeFormat", "product", "product.organization"]
      });

      const productValue = {
        productChargeValues,
        productTaxValue,
        productPriceVale,
        product: product.product,
        category: product.category
      };
      allProducts.push(productValue);
    }

    return {
      products: allProducts,
      store,
      // catalog,
      // storeFormat: storeFormats[0],
      categories
    };
  }

  /*  **
       1. Finds Store and Categories with storeCode
       2. Finds children of each category
       3. Each Category is looped to find its product and variants
       4. Each Product is looped to find productValues which has below
              - productChargeValues
              - productTaxValues
              - productPriceValues
       5. Stitched against product under ObjectKey `productFormats`
       ** */
  public async getStoreCatalogWithCategories(
    entityManager: EntityManager,
    input
  ) {
    const storeCode = input.code;
    const organizationId = input.organizationId;
    // Check if storeCode exists, if not throw error
    const validationPromises = [];
    if (storeCode) {
      const query = {
        store: {
          code: storeCode
        },
        organization: {
          id: organizationId
        }
      };
      const options = {
        where: query,
        relations: ["organization"]
      };
      validationPromises.push(
        Store.availableByIdForEntity(entityManager, options)
      );

      // 1. Finds Store and Categories with storeCode
      const getStoreCatalogWithCategoriesPromise = async () => {
        var store = await this.getStorebyCode(
          entityManager,
          storeCode,
          organizationId
        );
        if (!store) {
          throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
        }

        if (
          !store.catalog ||
          store.catalog.listable == false ||
          store.status == STATUS.INACTIVE
        ) {
          throw new WCoreError(WCORE_ERRORS.STORE_CATALOG_NOT_FOUND);
        }

        const categoriesLoaded = store.catalog.categories;
        store.catalog.categories = [];
        const categoryIds = categoriesLoaded.map(category => category.id);
        if (categoryIds.length > 0) {
          const categories = await this.categoryProvider.getCategoriesByIds(
            entityManager,
            categoryIds
          );

          for (const category of categories) {
            const treeRepo = await entityManager.getTreeRepository(Category);
            const catTree = await treeRepo.findDescendantsTree(category);
            store.catalog.categories.push(catTree);
          }
        }

        return this.getProductForCategoryWithChildren(
          entityManager,
          store,
          input.organizationId
        );
      };
      return validationDecorator(
        getStoreCatalogWithCategoriesPromise,
        validationPromises
      );
    }
  }

  public async getStoreAdminLevel(entityManager: EntityManager, id) {
    return entityManager.findOne(StoreAdminLevel, id, {
      relations: ["parent"]
    });
  }

  public async storeSearch(
    orgCode: string,
    filterValues: JSON,
    pageNumber,
    sort
  ) {
    const finalExpression = await combineExpressions(filterValues);
    const { finalTotalResultQuery, finalBaseQuery } = await frameFinalQueries(
      finalExpression,
      orgCode,
      pageNumber,
      sort
    );
    const totalResult: any = await executeQuery(finalTotalResultQuery);
    const data = await executeQuery(finalBaseQuery);

    return {
      data,
      total: totalResult[0].count,
      page: pageNumber
    };
  }

  public async updateStore(entityManager, input) {
    const parentId = input.organizationId;
    let store: Store = await this.getStorebyId(
      entityManager,
      input.id,
      input.organizationId
    );

    if (!store) {
      throw new WalkinRecordNotFoundError("Store not found");
    }
    if (input.pinCode) {
      if (!isPincodeValid(input.pinCode)) {
        throw new WCoreError(WCORE_ERRORS.PINCODE_NOT_VALID);
      }
    }

    if (Object.prototype.hasOwnProperty.call(input,"STATUS")) {
      const isValidStatus = validateStatus(input.STATUS);
      if (!isValidStatus) {
        throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
      }
    }

    if( (Object.prototype.hasOwnProperty.call(input,"name")) && !isValidString(input.name) ) {
      throw new WCoreError(WCORE_ERRORS.STORE_NAME_NOT_VALID)
    }
    // const existingStoreFormat = await entityManager.findOne(StoreFormatStore, {
    //   where: {
    //     storeId: store.id
    //   },
    //   relations: ["storeFormatId", "storeId"]
    // });

    // if (
    //   existingStoreFormat.storeFormatId.storeFormatCode !==
    //   input.storeFormatCode
    // ) {
    //   existingStoreFormat.status = STATUS.INACTIVE;
    //   await entityManager.save(StoreFormatStore, existingStoreFormat);
    // }

    if (input.adminLevelId) {
      const storeAdminLevel = await this.getStoreAdminLevel(
        entityManager,
        input.adminLevelId
      );
      if (!storeAdminLevel) {
        throw new WalkinRecordNotFoundError("StoreAdminLevel not found");
      }
      // store.adminLevel = storeAdminLevel;
    }
    if (input.latitude && input.longitude) {
      input["geoLocation"] = `POINT(${input.latitude} ${input.longitude})`;
    }
    let prevStatus = store["STATUS"];
    store = updateEntity(store, input);
    if (store["STATUS"] != prevStatus) {
      sendToWehbookSubscribers(
        entityManager,
        "UPDATE_STORE_STATUS",
        store,
        input.organizationId,
        StoreModule.injector
      );
    }
    const { extend } = input;
    if (extend !== undefined) {
      try {
        const extendData = await validateAndReturnEntityExtendedData(
          entityManager,
          extend,
          parentId,
          "store"
        );
        store.extend = extendData;
      } catch (e) {
        throw new WalkinPlatformError(
          "cust005",
          "entity extended data is invalid",
          e,
          400,
          ""
        );
      }
    }
    const keys = [
      `${CACHING_KEYS.STORE}_${store.id}`,
      `${CACHING_KEYS.STORE}_${store.code}`
    ];
    removeValueFromCache(keys);
    return entityManager.save(store);
  }

  public async generateStoreCode(entityManager, storeName: string, organizationId) {
    const randomNumber = new Chance()
      .integer({
        max: 40,
        min: 0
      })
      .toString();
    let storeCode = storeName.replace(/ /g, "_").concat("_" + randomNumber);
    const checkCodeAvailability = await entityManager.findOne(Store, {
      where: {
        code: storeCode,
        organization:{
          id:organizationId
        }
      }
    });
    if (checkCodeAvailability) {
      storeCode = await this.generateStoreCode(entityManager, storeName,organizationId);
    }
    return storeCode;
  }

  public async createStore(entityManager, input) {
    let parentId;

    if (input.organizationId) {
      parentId = input.organizationId;
      input.organization = {
        id: input.organizationId
      };
    }
    if (input.pinCode) {
      if (!isPincodeValid(input.pinCode)) {
        throw new WCoreError(WCORE_ERRORS.PINCODE_NOT_VALID);
      }
    }

    if (input.STATUS) {
      const isValidStatus = validateStatus(input.STATUS);
      if (!isValidStatus) {
        throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
      }
    }

    const isValidName = isValidString(input.name);
    if (!isValidName) {
      throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
    }

    if (!input.code) {
      input.code = await this.generateStoreCode(entityManager, input.name,input.organizationId);
    }

    if (!isValidString(input.externalStoreId)) {
      throw new WCoreError(WCORE_ERRORS.EXTERNAL_STORE_ID_MANDATORY);
    }
    // Making store code url-safe
    const codeGenerator = new UrlSafeString();
    input.code = codeGenerator.generate(input.code);

    const hasStoreCode = await entityManager.findOne(Store, {
      where: {
        code: input.code,
        organization: {
          id: input.organizationId
        }
      },
      relations: ["organization"]
    });
    if (hasStoreCode) {
      throw new WCoreError(WCORE_ERRORS.STORE_CODE_NOT_UNIQUE);
    }
    let store = new Store();
    if (input.latitude && input.longitude) {
      input["geoLocation"] = `POINT(${input.latitude} ${input.longitude})`;
    }
    store = updateEntity(store, input);

    // Handle Entity Extensions
    const { extend } = input;
    if (extend !== undefined) {
      try {
        const extendData = await validateAndReturnEntityExtendedData(
          entityManager,
          JSON.stringify(extend),
          parentId,
          "store"
        );
        store.extend = extendData;
      } catch (e) {
        throw new WalkinPlatformError(
          "cust005",
          "entity extended data is invalid",
          e,
          400,
          ""
        );
      }
    }
    if (input.adminLevelId) {
      const storeAdminLevel = await this.getStoreAdminLevel(
        entityManager,
        input.adminLevelId
      );
      if (!storeAdminLevel) {
        throw new WCoreError(WCORE_ERRORS.STORE_ADMIN_LEVEL_NOT_FOUND);
      }
      // store.adminLevel = storeAdminLevel;
    }

    let savedStore = await entityManager.save(store);
    savedStore = await entityManager.save(savedStore);

    sendToWehbookSubscribers(
      entityManager,
      "NEW_CUSTOMER_LOYALTY",
      savedStore,
      input.organizationId,
      StoreModule.injector
    );

    // const organizationInput = {
    //   name: savedStore.name,
    //   code: savedStore.code,
    //   status: savedStore.STATUS,
    //   organizationType: OrganizationTypeEnum.Store
    // };
    // let storeOrganization = await this.organization.createOrganization(
    //   entityManager,
    //   organizationInput,
    //   parentId
    // );
    // // storeOrganization.store = savedStore;
    // storeOrganization = await entityManager.save(storeOrganization);
    // savedStore.storeOrganization = storeOrganization;
    return entityManager.findOne(Store, {
      where: {
        id: savedStore.id
      },
      relations: ["organization"]
    });
  }

  public async createStoreAdminLevel(entityManager: EntityManager, input) {
    let adminLevel: StoreAdminLevel = StoreAdminLevel.create({});
    adminLevel = updateEntity(adminLevel, input);
    // check for parentId
    const parentAdminLevelId = input.parentId;
    if (parentAdminLevelId) {
      const parentAdminLevel: any = await this.getStoreAdminLevel(
        entityManager,
        parentAdminLevelId
      );
      if (!parentAdminLevel) {
        throw new WalkinRecordNotFoundError(
          "Parent StoreAdminLevel Id not found"
        );
      }
      adminLevel.parent = parentAdminLevel;
    }
    // save adminLevel
    return entityManager.save(adminLevel);
  }

  public async updateStoreAdminLevel(entityManager: EntityManager, input) {
    const existingAdminLevel = await this.getStoreAdminLevel(
      entityManager,
      input.id
    );
    if (!existingAdminLevel) {
      throw new WalkinRecordNotFoundError("StoreAdminLevel not found");
    }
    const adminLevel = updateEntity(existingAdminLevel, input);

    const parentAdminLevelId = input.parentId;
    if (parentAdminLevelId) {
      const parentAdminLevel: any = await this.getStoreAdminLevel(
        entityManager,
        parentAdminLevelId
      );
      if (!parentAdminLevel) {
        throw new WalkinRecordNotFoundError(
          "Parent StoreAdminLevel Id not found"
        );
      }
      adminLevel.parent = parentAdminLevel;
    }
    return entityManager.save(adminLevel);
  }

  public async updateStoreByCode(entityManager: EntityManager, input) {
    const parentId = input.parentOrganizationId;
    const codeGenerator = new UrlSafeString();
    const storeCode = codeGenerator.generate(input.code);
    const organizationId = input.organizationId;
    if (input.pinCode) {
      if (!isPincodeValid(input.pinCode)) {
        throw new WCoreError(WCORE_ERRORS.PINCODE_NOT_VALID);
      }
    }
    if (Object.prototype.hasOwnProperty.call(input,"STATUS")) {
      const isValidStatus = validateStatus(input.STATUS);
      if (!isValidStatus) {
        throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
      }
    }

    if( ( Object.prototype.hasOwnProperty.call(input,"name")) && !isValidString(input.name) ) {
      throw new WCoreError(WCORE_ERRORS.STORE_NAME_NOT_VALID)
    }
    
    const existedStore = await this.getStorebyStoreCode(
      entityManager,
      storeCode,
      organizationId
    );
    if (!existedStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    if (input.latitude && input.longitude) {
      input["geoLocation"] = `POINT(${input.latitude} ${input.longitude})`;
    }
    //remove the code from input to not update it
    delete input["code"];
    let prevStatus = existedStore["STATUS"];
    const store = updateEntity(existedStore, input);
    if (store["STATUS"] != prevStatus) {
      sendToWehbookSubscribers(
        entityManager,
        "UPDATE_STORE_STATUS",
        store,
        input.organizationId,
        StoreModule.injector
      );
    }
    const keys = [
      `${CACHING_KEYS.STORE}_${store.id}`,
      `${CACHING_KEYS.STORE}_${store.code}`
    ];
    removeValueFromCache(keys);
    return entityManager.save(store);
  }
  public async enableStore(
    entityManager: EntityManager,
    input: any
  ): Promise<Store> {
    const { storeId, organizationId } = input;
    const existingStore = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!existingStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    // if (existingStore.enable) {
    //   throw new WCoreError(WCORE_ERRORS.STORE_ALREADY_ENABLED);
    // }
    const updateSchema = {
      enable: true
    };
    const updatedStore = updateEntity(existingStore, updateSchema);
    const savedUpdatedStore = await entityManager.save(updatedStore);
    const keys = [
      `${CACHING_KEYS.STORE}_${existingStore.id}`,
      `${CACHING_KEYS.STORE}_${existingStore.code}`
    ];
    removeValueFromCache(keys);
    return savedUpdatedStore;
  }
  public async disableStore(
    entityManager: EntityManager,
    input: any
  ): Promise<Store> {
    const { storeId, organizationId } = input;
    const existingStore = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!existingStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    // if (!existingStore.enable) {
    //   throw new WCoreError(WCORE_ERRORS.STORE_ALREADY_DISABLED);
    // }
    const updateSchema = {
      enable: false
    };
    const updatedStore = updateEntity(existingStore, updateSchema);
    const savedUpdatedStore = await entityManager.save(updatedStore);
    const keys = [
      `${CACHING_KEYS.STORE}_${existingStore.id}`,
      `${CACHING_KEYS.STORE}_${existingStore.code}`
    ];
    removeValueFromCache(keys);
    return savedUpdatedStore;
  }

  public async updateStoreDelivery(
    entityManager: EntityManager,
    input: any
  ): Promise<StoreDeliveryArea> {
    const { id, deliveryAreaValue, deliveryAreaType } = input;
    const existingDeliveryArea = await entityManager.findOne(
      StoreDeliveryArea,
      {
        where: {
          id
        },
        relations: ["store"]
      }
    );
    if (!existingDeliveryArea) {
      throw new WCoreError(WCORE_ERRORS.STORE_DELIVERY_AREA_NOT_FOUND);
    }
    if (deliveryAreaType) {
      existingDeliveryArea["areaType"] = deliveryAreaType;
    }
    if (deliveryAreaValue) {
      if (existingDeliveryArea["areaType"] === AREA_TYPE.PINCODE) {
        existingDeliveryArea["pincode"] = deliveryAreaValue;
      } else {
        existingDeliveryArea["area"] = deliveryAreaValue;
      }
    }

    const saveUpdatedValues = await entityManager.save(existingDeliveryArea);

    return saveUpdatedValues;
  }

  public async addStoreDelivery(
    entityManager: EntityManager,
    input: any
  ): Promise<StoreDeliveryArea> {
    const {
      storeId,
      organizationId,
      deliveryAreaValue,
      deliveryAreaType
    } = input;
    const existingStore = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!existingStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }

    const storeDeliverySchema = {
      areaType: deliveryAreaType,
      store: existingStore
    };

    if (deliveryAreaType === AREA_TYPE.PINCODE) {
      storeDeliverySchema["pincode"] = deliveryAreaValue;
    } else {
      // https://geojson.org/geojson-spec.html ---> specs for geojson

      /**
       * For polygon data format
       * { "type": "Feature",
       * "geometry": {
       *   "type": "Polygon",
       *   "coordinates": [
       *     [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
       *       [100.0, 1.0], [100.0, 0.0] ]
       *     ]
       * }
       */

      /**
       * For Point data format
       * { "type": "Feature",
       * "geometry": {"type": "Point", "coordinates": [102.0, 0.5]}
       */
      storeDeliverySchema["area"] = deliveryAreaValue;
    }
    const createdStoreDelivery = await entityManager.create(
      StoreDeliveryArea,
      storeDeliverySchema
    );
    const savedCreatedStoreDelivery = await entityManager.save(
      createdStoreDelivery
    );
    return savedCreatedStoreDelivery;
  }

  public async removeStoreDelivery(
    entityManager: EntityManager,
    input: any
  ): Promise<StoreDeliveryArea> {
    const { storeId, organizationId, deliveryAreaId } = input;
    const existingStore = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!existingStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    const foundDeliveryArea = await entityManager.findOne(StoreDeliveryArea, {
      where: {
        id: deliveryAreaId,
        store: existingStore.id
      }
    });
    if (!foundDeliveryArea) {
      throw new WCoreError(WCORE_ERRORS.STORE_DELIVERY_AREA_NOT_FOUND);
    }
    const removedStoreDeliveryArea = await entityManager.remove(
      foundDeliveryArea
    );
    return removedStoreDeliveryArea;
  }

  public async addBulkStaffMembers(
    entityManager: EntityManager,
    input: IBulkStaffMember[],
    organizationId: string
  ) {
    const addedStaffMembers = [];
    for (const staffMember of input) {
      staffMember["organizationId"] = organizationId;
      const addStaffMember = await this.addStaff(entityManager, staffMember);
      addedStaffMembers.push(addStaffMember);
    }
    return addedStaffMembers;
  }

  public async addStaff(entityManager: EntityManager, input: any) {
    const { name, phone, staff_role, organizationId, email } = input;
    const isPhoneValid = await isValidPhone(phone);
    if (!isPhoneValid) {
      throw new WCoreError(WCORE_ERRORS.INVALID_PHONE_NUMBER);
    }
    if (email) {
      const isEmailValid = await isValidEmail(email);
      if (!isEmailValid) {
        throw new WCoreError(WCORE_ERRORS.INVALID_EMAIL);
      }
    }

    const createdStaffMember = entityManager.create(Staff, {
      name,
      phone,
      email,
      staffRole: staff_role,
      organization: {
        id: organizationId
      },
      status: STATUS.ACTIVE
    });

    const savedStaffMember = await entityManager.save(createdStaffMember);
    return savedStaffMember;
  }

  public async editStaff(entityManager: EntityManager, input: any) {
    const { id, name, phone, email, staff_role, organizationId } = input;
    const staffMember = await entityManager.findOne(Staff, {
      where: {
        id,
        organization: organizationId
      }
    });
    if (!staffMember) {
      throw new WCoreError(WCORE_ERRORS.STAFF_MEMBER_NOT_FOUND);
    }
    if (phone) {
      const isPhoneValid = await isValidPhone(phone);
      if (!isPhoneValid) {
        throw new WCoreError(WCORE_ERRORS.INVALID_PHONE_NUMBER);
      }
    }
    if (email) {
      const isEmailValid = await isValidEmail(email);
      if (!isEmailValid) {
        throw new WCoreError(WCORE_ERRORS.INVALID_EMAIL);
      }
    }

    const updatedEntity = {
      ...input,
      staffRole: staff_role
    };

    const updateStaffEntity = updateEntity(staffMember, updatedEntity);
    const savedUpdatedEntity = await entityManager.save(updateStaffEntity);
    return savedUpdatedEntity;
  }

  public async removeStaff(entityManager: EntityManager, input: any) {
    const { id, organizationId } = input;
    const staffMember = await entityManager.findOne(Staff, {
      where: {
        id,
        organization: organizationId,
        status: STATUS.ACTIVE
      }
    });
    if (!staffMember) {
      throw new WCoreError(WCORE_ERRORS.STAFF_MEMBER_NOT_FOUND);
    }
    staffMember.status = STATUS.INACTIVE;
    try {
      const removedStaffMember = await entityManager.save(staffMember);
      return true;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  public async activeStaff(entityManager: EntityManager, input: any) {
    const { id, organizationId } = input;
    const staffMember = await entityManager.findOne(Staff, {
      where: {
        id,
        organization: organizationId
      }
    });
    if (!staffMember) {
      throw new WCoreError(WCORE_ERRORS.STAFF_MEMBER_NOT_FOUND);
    }
    if (staffMember.status === STATUS.ACTIVE) {
      throw new WCoreError(WCORE_ERRORS.STAFF_MEMBER_ALREADY_ACTIVE);
    }
    const updatedEntity = {
      status: STATUS.ACTIVE
    };
    const updateStaffEntity = updateEntity(staffMember, updatedEntity);
    const savedUpdatedEntity = await entityManager.save(updateStaffEntity);
    return savedUpdatedEntity;
  }

  public async makeAllStaffMemberStatus(
    entityManager: EntityManager,
    input: any
  ) {
    const { storeId, organizationId, busy, staffRole } = input;

    const getStaff = await entityManager
      .getRepository(Staff)
      .createQueryBuilder("staff")
      .leftJoinAndSelect("staff.store", "store")
      .leftJoinAndSelect("staff.organization", "organization")
      .where(
        "store.id=:storeId  and staff.staffRole=:staffRole and organization.id=:organization",
        {
          storeId,
          staffRole,
          organization: organizationId
        }
      )
      .getMany();
    const updatedEntity = getStaff.map(staff => {
      staff.busy = busy;
      return staff;
    });
    const savedUpdatedEntity = await entityManager.save(updatedEntity);
    return savedUpdatedEntity;
  }

  public async getStoreStaffStatus(entityManager: EntityManager, input: any) {
    const { storeId, organizationId, staffRole } = input;
    const store = await entityManager.findOne(Store, {
      where: {
        id: storeId
      }
    });
    if (!store) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    let whereCondition =
      "store.id=:storeId and staff.busy=:busy and organization.id=:organization and staff.status=:status";
    const whereConditionVariables = {
      storeId,
      organization: organizationId,
      busy: false,
      status: STATUS.ACTIVE
    };
    if (staffRole) {
      whereCondition = whereCondition + " " + "and staff.staffRole=:staffRole";
      whereConditionVariables["staffRole"] = staffRole;
    }
    const getStaff = await entityManager
      .getRepository(Staff)
      .createQueryBuilder("staff")
      .leftJoinAndSelect("staff.store", "store")
      .leftJoinAndSelect("staff.organization", "organization")
      .where(whereCondition, whereConditionVariables)
      .getMany();
    if (getStaff.length > 0) {
      return false;
    }
    return true;
  }

  public async markStaffBusyStatus(
    entityManager: EntityManager,
    input: IMarkStaffBusyStatus[],
    organizationId: string
  ) {
    const staffIds = input.map(member => member.id);
    const staffMember = await entityManager.find(Staff, {
      where: {
        id: In(staffIds),
        organization: organizationId
      }
    });

    const updatedEntity = staffMember.map(member => {
      const { busy } = input.find(staff => staff.id === member.id);
      member.busy = busy;
      return member;
    });
    const savedUpdatedEntity = await entityManager.save(updatedEntity);
    return savedUpdatedEntity;
  }

  public async inactiveStaff(entityManager: EntityManager, input: any) {
    const { id, organizationId } = input;
    const staffMember = await entityManager.findOne(Staff, {
      where: {
        id,
        organization: organizationId
      }
    });
    if (!staffMember) {
      throw new WCoreError(WCORE_ERRORS.STAFF_MEMBER_NOT_FOUND);
    }
    if (staffMember.status === STATUS.INACTIVE) {
      throw new WCoreError(WCORE_ERRORS.STAFF_MEMBER_ALREADY_INACTIVE);
    }
    const updatedEntity = {
      status: STATUS.INACTIVE
    };
    const updateStaffEntity = updateEntity(staffMember, updatedEntity);
    const savedUpdatedEntity = await entityManager.save(updateStaffEntity);
    return savedUpdatedEntity;
  }

  public async addStaffMembersToStore(
    entityManager: EntityManager,
    input: IStaffMembersToStore
  ) {
    const { organizationId, staffMemberIds, storeId } = input;
    let staffMembersOfStore;
    for (const staffMemberId of staffMemberIds) {
      const staffMemberToStoreInput = {
        organizationId,
        storeId,
        staffMemberId
      };
      const staffMemberForStore = await this.addStaffMemberToStore(
        entityManager,
        staffMemberToStoreInput
      );
      staffMembersOfStore = staffMemberForStore;
    }
    return staffMembersOfStore;
  }
  public async addStaffMemberToStore(entityManager: EntityManager, input: any) {
    const { organizationId, staffMemberId, storeId } = input;
    const staffMember = await entityManager.findOne(Staff, {
      where: {
        id: staffMemberId,
        organization: organizationId
      },
      relations: ["store"]
    });
    if (!staffMember) {
      throw new WCoreError(WCORE_ERRORS.STAFF_MEMBER_NOT_FOUND);
    }
    const store = await entityManager.findOne(Store, {
      where: {
        id: storeId
      },
      relations: ["staff"]
    });
    if (!store) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    // const staffExistingInStore = await staffMember.store.find(
    //   Individualstore => Individualstore.id === store.id
    // );
    // if (staffExistingInStore) {
    //   throw new WCoreError(WCORE_ERRORS.STAFF_MEMBER_ALREADY_EXIST_IN_STORE);
    // }
    // if (store.staff) {
    //   store.staff.push(staffMember);
    // } else {
    //   store.staff = [staffMember];
    // }
    const savedStaffMember = await entityManager.save(store);
    return savedStaffMember;
  }

  @addPaginateInfo
  public async getStaffMembers(
    entityManager: EntityManager,
    storeId: string,
    organizationId: string,
    pageOptions,
    sortOptions,
    staffRole
  ) {
    const options: any = {};
    let whereClause =
      "organization.id=:organizationId and store.id=:storeId and staff.status =:status";
    const filterCondition = {
      organizationId,
      storeId,
      status: STATUS.ACTIVE
    };
    if (staffRole) {
      whereClause = whereClause + " " + "and staffRole=:staffRole";
      filterCondition["staffRole"] = staffRole;
    }

    options.order = sortOptions ? sortOptions.sortOrder : "ASC";
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    // const staffMembers = await entityManager.findAndCount(Staff, options);
    const staffMembers = await entityManager
      .getRepository(Staff)
      .createQueryBuilder("staff")
      .leftJoinAndSelect("staff.store", "store")
      .leftJoinAndSelect("staff.organization", "organization")
      .where(whereClause, filterCondition)
      .orderBy("staff.createdTime", options.order)
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount();
    return staffMembers;
  }
  public async getStaffMember(
    entityManager: EntityManager,
    staffMemberId: string,
    organizationId: string
  ) {
    const staffMember = await entityManager.findOne(Staff, {
      where: {
        id: staffMemberId,
        organization: {
          id: organizationId
        },
        status: STATUS.ACTIVE
      },
      relations: ["organization", "store"]
    });
    if (!staffMember) {
      throw new WCoreError(WCORE_ERRORS.STAFF_MEMBER_NOT_FOUND);
    }
    return staffMember;
  }
  public async getStoreIds(entityManager, input, storeIds) {
    let storeIdsData = [];
    let query: any = {};
    let options: any = {};
    if (input.channel) {
      query = {
        channel: {
          code: In(input.channel)
        },
        organization: {
          id: input.organizationId
        }
      };
      options.relations = ["organization", "channels"];
    }

    if (input.storeFormat) {
      query = {
        storeFormat: {
          code: In(input.storeFormat)
        },
        organization: {
          id: input.organizationId
        }
      };
      options.relations = ["organization", "storeFormats"];
    }

    if (input.channel && input.storeFormat) {
      query = {
        channel: {
          code: In(input.channel)
        },
        storeFormat: {
          code: In(input.storeFormat)
        },
        organization: {
          id: input.organizationId
        }
      };
      options.relations = ["organization", "channels", "storeFormats"];
    }
    options.where = query;

    const storesBasedOnQuery = await entityManager.find(Store, options);
    if (storesBasedOnQuery.length > 0) {
      storeIdsData = storesBasedOnQuery.map(store => store.id);
      if (storeIdsData.length > 0) {
        storeIds.push(...storeIdsData);
      } else {
        throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      }
    } else {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    return storeIds;
  }

  // public async getStoreFormatStoreByStoreId(entityManager, storeId) {
  //   const existingStoreFormat = await entityManager.findOne(StoreFormatStore, {
  //     where: {
  //       storeId: storeId
  //     },
  //     relations: ["storeFormatId", "storeId"]
  //   });
  //   return existingStoreFormat;
  // }

  public async getStoresWithProductId(entityManager, organization, productId) {
    const categories = await entityManager.find(ProductCategory, {
      where: {
        product: {
          id: productId
        }
      },
      relations: ["category", "category.catalog"]
    });
    var catalogIds = [];
    if (categories) {
      for (const category of categories) {
        catalogIds.push(category.category.catalogId);
      }
    }

    if (catalogIds.length > 0) {
      var store = await entityManager.findOne(Store, {
        where: {
          catalog: {
            id: In(catalogIds)
          },
          organization: {
            id: organization.id
          }
        },
        relations: ["channels", "storeFormats"]
      });
    }
    if (store) {
      return store;
    } else {
      return false;
    }
  }

  public async getStorebyCode(
    entityManager,
    storeCode,
    organizationId
  ): Promise<Store | any> {
    const storeDetails = await entityManager
      .getRepository(Store)
      .createQueryBuilder("store")
      // .leftJoinAndSelect("store.catalog", "catalog")
      .leftJoinAndSelect("catalog.categories", "categories")
      .leftJoinAndSelect("store.storeFormats", "storeFormats")
      .leftJoinAndSelect("store.channels", "channels")
      .where("store.code=:storeCode and store.organization=:organizationId", {
        storeCode,
        organizationId
      })
      .getOne();

    return storeDetails;
  }

  public async getStorebyCodes(
    entityManager,
    storeCodes,
    organizationId
  ): Promise<Store | any> {
    const storeDetails = await entityManager.find(Store, {
      where: {
        code: In(storeCodes),
        organization: organizationId
      }
      // relations: ["catalog"]
    });

    return storeDetails;
  }
}

@Injectable()
export class StoreOpenTimingProvider {
  public async formatStoreOpeningTimings(
    openingTimings: IOpeningTimings[]
  ): Promise<IOpeningTimingsOutput[]> {
    const formattedStoreTimings = [];
    for (const openingTime of openingTimings) {
      const { closeTime, days, id, openTime, store } = openingTime;
      const parseDays: [] = JSON.parse(days);
      let exists = false;
      const storeTimeData = {
        id,
        openTime,
        closeTime
      };

      forEach(formattedStoreTimings, storeTiming => {
        storeTiming.days = JSON.parse(storeTiming.days);
        const [day] = storeTiming.days;
        const dayFound = find(parseDays, foundDay => day === foundDay);
        if (dayFound) {
          const { data } = storeTiming;
          data.push(storeTimeData);
          storeTiming.data = data;
          exists = true;
        }
        storeTiming.days = JSON.stringify(storeTiming.days);
      });

      if (!exists) {
        const formatStoreTimings: IOpeningTimingsOutput = {
          data: [storeTimeData],
          days,
          id,
          store
        };
        formattedStoreTimings.push(formatStoreTimings);
      }
    }

    return formattedStoreTimings;
  }
  public async addBulkStoreOpeningTimings(
    entityManager: EntityManager,
    input: IBuilkStoreOpeningTimings
  ) {
    const { organizationId, storeId, storeTimings } = input;
    if (!storeTimings || (storeTimings && storeTimings.length === 0)) {
      throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_STORE_OPENING_TIMINGS);
    }
    const foundStore = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: organizationId
      }
    });
    if (!foundStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    let openingTimings = [];
    for (const storeTiming of storeTimings) {
      const { data, days } = storeTiming;
      for (const time of data) {
        const { closeTime, openTime } = time;
        const storeTimingsInput = {
          days: [days],
          openTime,
          closeTime,
          storeId,
          organizationId
        };
        const inputDays = JSON.stringify(storeTimingsInput.days);
        const findExistingStoreOpeningTimings = await entityManager.findOne(
          StoreOpenTiming,
          {
            where: {
              store: storeId,
              days: inputDays,
              openTime,
              closeTime
            }
          }
        );
        if (!findExistingStoreOpeningTimings) {
          const addStoreTimings = await this.addStoreOpenTiming(
            entityManager,
            storeTimingsInput
          );
          openingTimings.push(addStoreTimings);
        }
      }
    }
    openingTimings = await this.formatStoreOpeningTimings(openingTimings);
    const keys = [
      `${CACHING_KEYS.STORE}_${foundStore.code}`,
      `${CACHING_KEYS.STORE}_${foundStore.id}`
    ];
    removeValueFromCache(keys);
    console.log("openingTimings", openingTimings);
    return openingTimings;
  }
  public async getStoreOpenTiming(entityManager: EntityManager, input: any) {
    const storeId = input.storeId;
    const organizationId = input.organizationId;
    const validationPromises = [];
    const storeOpenTimingId = input.id;

    if (storeId) {
      const options: any = {};
      options.where = {
        id: storeId,
        store: {
          organization: {
            id: organizationId
          }
        }
      };
      options.relations = ["organization"];
      validationPromises.push(
        Store.availableByIdForEntity(entityManager, options)
      );
    }

    if (storeOpenTimingId) {
      const storeOpenTimingsPromise = async () => {
        const storeOpenTiming = await entityManager.findOne(StoreOpenTiming, {
          where: {
            id: storeOpenTimingId
          },
          relations: ["store", "store.organization"]
        });
        // if (storeOpenTiming.store) {
        //   if (storeOpenTiming.store.organization.id !== input.organizationId) {
        //     throw new WCoreError(WCORE_ERRORS.STORE_OPEN_TIMING_NOT_FOUND);
        //   }
        // }
        return storeOpenTiming;
      };
      return validationDecorator(storeOpenTimingsPromise, validationPromises);
    } else {
      throw new WCoreError(WCORE_ERRORS.STORE_OPEN_TIMING_NOT_FOUND);
    }
  }

  @addPaginateInfo
  public async getStoreOpenTimings(
    entityManager: EntityManager,
    input: any,
    pageOptions,
    sortOptions
  ) {
    const storeId = input.storeId;
    const organizationId = input.organizationId;
    const validationPromises = [];
    let page;
    let pageSize;
    if (storeId) {
      const opts: any = {};
      opts.where = {
        store: {
          id: storeId,
          organization: {
            id: organizationId
          }
        }
      };
      opts.relations = ["organization"];
      validationPromises.push(
        Store.availableByIdForEntity(entityManager, opts)
      );
    }
    const options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }

    if (!pageOptions) {
      page = 1;
      pageSize = 10;
    } else {
      page = pageOptions.page || 1;
      pageSize = pageOptions.pageSize || 10;
    }

    options.skip = (page - 1) * pageSize;
    options.take = pageSize;
    options.where = {
      store: {
        id: storeId,
        organization: {
          id: organizationId
        }
      }
    };
    options.relations = ["store", "store.organization"];

    const storeOpenTimingsPromise = async () => {
      return entityManager.findAndCount(StoreOpenTiming, options);
    };
    const openingTimings = await validationDecorator(
      storeOpenTimingsPromise,
      validationPromises
    );
    const [storeOpeningTime, totalItems] = openingTimings;
    const formattedStoreOpeningTimings = await this.formatStoreOpeningTimings(
      storeOpeningTime
    );
    openingTimings[0] = formattedStoreOpeningTimings;
    return openingTimings;
  }
  public async addStoreOpenTiming(entityManager: EntityManager, input: any) {
    const storeId = input.storeId;
    const organizationId = input.organizationId;
    checkTimeValidity([input.openTime, input.closeTime]);
    const validationPromises = [];
    if (storeId) {
      const options: any = {};
      options.where = {
        id: storeId,
        organization: {
          id: organizationId
        }
      };
      options.relations = ["organization"];
      validationPromises.push(
        Store.availableByIdForEntity(entityManager, options)
      );
    } else {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }

    const storeOpenTimingsPromise = async () => {
      input.store = storeId;
      input.days = JSON.stringify(input.days);
      const findExistingStoreOpeningTimings = await entityManager.findOne(
        StoreOpenTiming,
        {
          where: {
            store: storeId,
            days: input.days,
            openTime: input.openTime,
            closeTime: input.closeTime
          }
        }
      );
      if (findExistingStoreOpeningTimings) {
        throw new WCoreError(WCORE_ERRORS.STORE_OPEN_TIMING_ALREADY_EXISTS);
      }
      const storeOpenTimings = await entityManager.create(
        StoreOpenTiming,
        input
      );
      const ee = await entityManager.save(storeOpenTimings);
      return entityManager.findOne(StoreOpenTiming, {
        where: {
          id: ee.id
        },
        relations: ["store", "store.organization"]
      });
    };
    return validationDecorator(storeOpenTimingsPromise, validationPromises);
  }

  public async removeStoreOpenTiming(entityManager: EntityManager, input: any) {
    const storeId = input.storeId;
    const organizationId = input.organizationId;
    const storeOpenTimingId = input.id;

    const validationPromises = [];
    if (storeId) {
      const options: any = {};
      options.where = {
        id: storeId,
        organization: {
          id: organizationId
        }
      };
      options.relations = ["organization"];
      validationPromises.push(
        Store.availableByIdForEntity(entityManager, options)
      );
    } else {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }

    if (storeOpenTimingId) {
      validationPromises.push(
        StoreOpenTiming.availableById(entityManager, storeOpenTimingId)
      );
    } else {
      throw new WCoreError(WCORE_ERRORS.STORE_OPEN_TIMING_NOT_FOUND);
    }

    const storeOpenTimingsPromise = async () => {
      const storeOpenTimings = await entityManager.findOne(StoreOpenTiming, {
        where: {
          id: storeOpenTimingId
        },
        relations: ["store"]
      });
      return entityManager.remove(StoreOpenTiming, storeOpenTimings);
    };
    return validationDecorator(storeOpenTimingsPromise, validationPromises);
  }

  public async removeStoreOpenTimings(
    entityManager: EntityManager,
    input: any
  ) {
    const storeId = input.storeId;
    const organizationId = input.organizationId;
    const storeOpenTimingIds = input.id;
    const options: any = {};
    options.where = {
      id: storeId,
      organization: {
        id: organizationId
      }
    };
    options.relations = ["organization"];
    const store = await entityManager.findOne(Store, {
      ...options
    });
    if (!store) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }

    if (!storeOpenTimingIds && storeOpenTimingIds.length === 0) {
      throw new WCoreError(WCORE_ERRORS.STORE_OPEN_TIMING_NOT_FOUND);
    }

    const removedItems = [];
    const storeOpenTimings = await entityManager.find(StoreOpenTiming, {
      where: {
        id: In(storeOpenTimingIds)
      },
      relations: ["store"]
    });
    for (const storeOpeningTiming of storeOpenTimings) {
      const removedTiming = await entityManager.remove(
        StoreOpenTiming,
        storeOpeningTiming
      );
      removedItems.push(removedTiming);
    }
    const keys = [
      `${CACHING_KEYS.STORE}_${store.code}`,
      `${CACHING_KEYS.STORE}_${store.id}`
    ];
    removeValueFromCache(keys);
    return removedItems;
  }
}
