import { Injectable } from "@graphql-modules/di";
import { EntityManager, In, getManager } from "typeorm";
import { updateEntity, addPaginateInfo } from "../../common/utils/utils";
import {
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE,
  SHORT_CACHE_TTL,
  STATUS
} from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  StoreFormat,
  Product,
  Channel,
  ProductChargeValue,
  ChargeType,
  ProductPriceValue,
  Store,
  StoreInventory,
  ProductCategory
} from "../../../entity";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

interface IStoreInventory {
  productId: string;
  available: boolean;
}
interface IStoreProductAvailability extends IStoreInventory {
  storeId: string;
  organizationId: string;
}

interface IStoreProductsAvailability {
  storeId: string;
  storeInventory: IStoreInventory[];
}

interface IAddStoreInventory {
  storeFormat: [string];
  channel: [string];
  productId: string;
}

interface IAddInventory {
  storeId: string;
  organizationId: string;
}

interface IFindStoreProductInventory {
  storeId: string;
  productId: string;
}

interface IFindStoreInventory {
  storeId: string;
  productId?: string[];
}

@Injectable()
export class StoreInventoryProvider {
  public async storeInventory(
    entityManager: EntityManager,
    input: IFindStoreInventory
  ): Promise<StoreInventory[]> {
    const { productId, storeId } = input;
    const filter = {
      store: storeId
    };
    const foundStore = await entityManager.findOne(Store, {
      where: {
        id: storeId
      },
      // relations: ["catalog", "organization"]
      relations: ["organization"]
    });
    // const { catalog, organization } = foundStore;
    const { organization } = foundStore;
    if (!foundStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    let productIds = [];
    if (productId && productId.length > 0) {
      // filter based on the products provided through API's
      productIds = [...productId];
    } else {
      // get all listed and active products to show as inventory for store managers
      const productCategories = await entityManager
        .getRepository(ProductCategory)
        .createQueryBuilder("productCategory")
        .leftJoinAndSelect("productCategory.product", "product")
        .leftJoinAndSelect("productCategory.category", "category")
        // .leftJoinAndSelect("category.catalog", "catalog")
        .where(
          // "catalog.id=:catalogId and catalog.organization_id=:organizationId and product.listable=:listable and category.listable=:listable and product.status=:status and category.status=:status",
          "product.organization_id=:organizationId and product.listable=:listable and category.listable=:listable and product.status=:status and category.status=:status",
          {
            // catalogId: catalog.id,
            organizationId: organization.id,
            status: STATUS.ACTIVE,
            listable: true
          }
        )
        .getMany();
      productIds = productCategories.map(
        productCategory => productCategory.product.id
      );
    }

    if (productIds.length === 0) {
      return [];
    }
    filter["product"] = In(productIds);
    const foundStoreInventory = await entityManager.find(StoreInventory, {
      where: {
        ...filter
      },
      relations: ["store", "product"]
    });
    return foundStoreInventory;
  }
  public async storeProductInventory(
    entityManager: EntityManager,
    input: IFindStoreProductInventory
  ): Promise<StoreInventory> {
    const { productId, storeId } = input;
    const productKey = `${CACHING_KEYS.PRODUCT}_${productId}`;
    let foundProduct: any = await getValueFromCache(productKey);
    if (!foundProduct) {
      foundProduct = await entityManager.findOne(Product, {
        where: {
          id: productId
        }
      });
      if (foundProduct) {
        await setValueToCache(
          productKey,
          foundProduct,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      } else {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
      }
    }
    // if (!foundProduct) {
    //   throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    // }
    const storeKey = `${CACHING_KEYS.STORE}_${storeId}`;
    let foundStore: any = await getValueFromCache(storeKey);
    if (!foundStore) {
      foundStore = await entityManager.findOne(Store, {
        where: {
          id: storeId
        }
      });
      if (foundStore) {
        await setValueToCache(
          storeKey,
          foundStore,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      } else {
        throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      }
    }
    // if (!foundStore) {
    //   throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    // }

    const storeInventoryKey = `${CACHING_KEYS.STORE_INVENTORY}_${foundStore.id}_${productId}`;
    let storeInventory: any = await getValueFromCache(storeInventoryKey);
    if (!storeInventory) {
      storeInventory = await entityManager.findOne(StoreInventory, {
        where: {
          store: foundStore.id,
          product: foundProduct.id
        },
        relations: ["store", "product"]
      });
      if (storeInventory) {
        await setValueToCache(
          storeInventoryKey,
          storeInventory,
          EXPIRY_MODE.EXPIRE,
          SHORT_CACHE_TTL
        );
      }
    }
    return storeInventory;
  }

  public async getStoreProductInventory(entityManager: EntityManager, input) {
    const { productIds } = input;
    const storeKey = `${CACHING_KEYS.STORE}_${input.storeId}`;
    let foundStore: any = await getValueFromCache(storeKey);
    if (!foundStore) {
      foundStore = await entityManager.findOne(Store, {
        where: {
          id: input.storeId
        }
      });
      if (foundStore) {
        await setValueToCache(
          storeKey,
          foundStore,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      } else {
        throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      }
    }
    const productIdsTobeFetched: any = [];
    const foundInventoryData = [];
    for (const productId of productIds) {
      const productKey = `${CACHING_KEYS.STORE_INVENTORY}_${foundStore.id}_${productId}`;
      let foundInventory: any = await getValueFromCache(productKey);
      if (foundInventory) {
        foundInventoryData.push(foundInventory);
      } else {
        productIdsTobeFetched.push(productId);
      }
    }

    let storeInventory = [];
    if (productIdsTobeFetched.length > 0) {
      storeInventory = await entityManager
        .createQueryBuilder(StoreInventory, "storeInventory")
        .leftJoinAndSelect("storeInventory.product", "product")
        .where(
          "storeInventory.product_id IN (:productIds) and storeInventory.store_id=:storeId",
          { productIds: productIdsTobeFetched, storeId: foundStore.id }
        )
        .getMany();
      for (const inventory of storeInventory) {
        const inventoryKey = `${CACHING_KEYS.STORE_INVENTORY}_${foundStore.id}_${inventory.product.id}`;
        await setValueToCache(
          inventoryKey,
          inventory,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    storeInventory = [...foundInventoryData, ...storeInventory];
    return storeInventory;
  }

  public async addStoreInventoryForAllProductsAsync(input: IAddInventory) {
    const transactionManager = getManager();
    this.addStoreInventoryForAllProducts(transactionManager, input);
  }
  public async addStoreInventoryForAllProducts(
    entityManager: EntityManager,
    input: IAddInventory
  ): Promise<StoreInventory[]> {
    const { storeId, organizationId } = input;
    const foundStore = await entityManager.findOne(Store, {
      where: {
        id: storeId
      },
      // relations: ["catalog"],
      cache: true
    });
    if (!foundStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    // const { catalog } = foundStore;
    // const catalogId = catalog.id;
    const productCategories = await entityManager
      .getRepository(ProductCategory)
      .createQueryBuilder("productCategory")
      .leftJoinAndSelect("productCategory.product", "product")
      .leftJoinAndSelect("productCategory.category", "category")
      // .leftJoinAndSelect("category.catalog", "catalog")
      .where(
        "product.organization_id=:organizationId",
        // "catalog.id=:catalogId and catalog.organization_id=:organizationId",
        {
          // catalogId,
          organizationId
        }
      )
      .cache(true)
      .getMany();
    const products = productCategories.map(
      productCategory => productCategory.product
    );
    const createdStoreInventories = [];
    for (const product of products) {
      const foundStoreInventory = await entityManager.findOne(StoreInventory, {
        where: {
          store: foundStore.id,
          product: product.id
        }
      });
      if (!foundStoreInventory) {
        const storeInventorySchema = {
          product,
          store: foundStore,
          inventoryAvailable: true
        };
        const createStoreInventory = await entityManager.create(
          StoreInventory,
          storeInventorySchema
        );
        createdStoreInventories.push(createStoreInventory);
      }
      this.clearStoreInventoryCache(foundStore.id, product.id);
    }
    const savedStoreInventory = await entityManager.save(
      createdStoreInventories
    );
    return savedStoreInventory;
  }
  public async addStoreInventory(
    entityManager: EntityManager,
    input: IAddStoreInventory,
    organizationId: string
  ): Promise<StoreInventory[]> {
    const { channel, productId, storeFormat } = input;
    const foundProduct = await entityManager.findOne(Product, {
      where: {
        id: productId,
        organization: organizationId
      }
    });
    if (!foundProduct) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }
    console.log("foundStores");

    const foundStores = await entityManager
      .getRepository(Store)
      .createQueryBuilder("store")
      .leftJoinAndSelect("store.channels", "channels")
      .leftJoinAndSelect("store.storeFormats", "storeFormats")
      .where(
        "channels.id in (:...channel) and storeFormats.id in (:...storeFormat)",
        {
          channel,
          storeFormat
        }
      )
      .getMany();
    console.log("foundStores", foundStores);
    const createdInventory = [];
    for (const store of foundStores) {
      const foundStoreInventory = await this.storeProductInventory(
        entityManager,
        {
          productId: foundProduct.id,
          storeId: store.id
        }
      );
      if (!foundStoreInventory) {
        const storeInventorySchema = {
          product: foundProduct,
          store,
          inventoryAvailable: true
        };
        const createStoreInventory = await entityManager.create(
          StoreInventory,
          storeInventorySchema
        );

        createdInventory.push(createStoreInventory);
      }
      this.clearStoreInventoryCache(store.id, foundProduct.id);
    }
    const savedStoreInventory = await entityManager.save(createdInventory);
    return savedStoreInventory;
  }

  public async storeProductsAvailability(
    entityManager: EntityManager,
    input: Partial<IStoreProductsAvailability>,
    organizationId: string
  ) {
    const storeId = input.storeId;
    const { storeInventory } = input;
    const store = await entityManager.findOne(Store, {
      where: {
        id: storeId,
        organization: organizationId
      }
    });
    if (!store) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    const productIds = storeInventory.map(
      storeProductInput => storeProductInput.productId
    );
    const storesInventory = await entityManager.find(StoreInventory, {
      where: {
        product: In(productIds),
        store: storeId
      },
      relations: ["product", "store"]
    });

    const updatedEntity = storesInventory.map(product => {
      const { available } = storeInventory.find(
        storeProductInput => product.product.id === storeProductInput.productId
      );
      product.inventoryAvailable = available;
      return product;
    });
    for (const productId in productIds) {
      this.clearStoreInventoryCache(storeId, productId);
    }

    const savedUpdatedEntity = await entityManager.save(updatedEntity);
    return savedUpdatedEntity;
  }
  public async storeProductAvailablity(
    entityManager: EntityManager,
    input: IStoreProductAvailability
  ): Promise<StoreInventory> {
    const { available, productId, storeId, organizationId } = input;
    const foundProduct = await entityManager.findOne(Product, {
      where: {
        id: productId,
        organization: organizationId
      },
      cache: true
    });
    if (!foundProduct) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }
    const foundStore = await entityManager.findOne(Store, {
      where: {
        id: storeId
      },
      cache: true
    });
    if (!foundStore) {
      throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
    }
    const foundInventory = await entityManager.findOne(StoreInventory, {
      where: {
        store: {
          id: foundStore.id
        },
        product: {
          id: foundProduct.id
        }
      },
      relations: ["store", "product"]
    });
    const updateSchema = {
      inventoryAvailable: available
    };
    this.clearStoreInventoryCache(foundStore.id, foundProduct.id);
    const updatedProductPriceValue = updateEntity(foundInventory, updateSchema);
    const markAvailability = await entityManager.save(updatedProductPriceValue);
    return markAvailability;
  }
  public async getInventoryAvailableDetails(
    entityManager: EntityManager,
    productId,
    storeId
  ): Promise<StoreInventory> {
    const storeInventoryKey = `${CACHING_KEYS.STORE_INVENTORY_AVAILABLE}_${storeId}_${productId}`;
    let storeInventory: any = await getValueFromCache(storeInventoryKey);
    if (!storeInventory) {
      storeInventory = await entityManager.findOne(StoreInventory, {
        where: {
          store: storeId,
          product: productId
        }
      });
      if (storeInventory) {
        await setValueToCache(
          storeInventoryKey,
          storeInventory,
          EXPIRY_MODE.EXPIRE,
          SHORT_CACHE_TTL
        );
      }
    }
    return storeInventory;
  }
  public async clearStoreInventoryCache(storeId, productId) {
    const keys = [
      `${CACHING_KEYS.STORE_INVENTORY_AVAILABLE}_${storeId}_${productId}`,
      `${CACHING_KEYS.STORE_INVENTORY}_${storeId}_${productId}`
    ];
    removeValueFromCache(keys);
    return;
  }
}
