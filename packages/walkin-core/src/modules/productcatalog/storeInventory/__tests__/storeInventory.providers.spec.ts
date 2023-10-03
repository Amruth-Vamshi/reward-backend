// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { StoreInventoryProvider } from "../storeInventory.providers";
import { StoreInventoryModule } from "../storeInventory.module";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { CACHING_KEYS, STATUS } from "../../../common/constants";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { TaxTypeProvider } from "../../taxtype/taxtype.providers";
import { TaxTypeModule } from "../../taxtype/taxtype.module";
import { ProductChargeValueProvider } from "../../productChargeValue/productChargeValue.providers";
import { ProductChargeValueModule } from "../../productChargeValue/productChargeValue.module";
import { ProductProvider } from "../../product/product.providers";
import { ChannelProvider } from "../../channel/channel.providers";
import { ProductModule } from "../../product/product.module";
import { ChannelModule } from "../../channel/channel.module";
import { ChargeTypeProvider } from "../../chargeType/chargeType.providers";
import { ChargeModule } from "../../chargeType/chargeType.module";
import { StoreFormatProvider } from "../../storeformat/storeFormat.providers";
import { StoreFormatModule } from "../../storeformat/storeFormat.module";
import { CategoryProvider } from "../../category/category.providers";
import { CategoryModule } from "../../category/category.module";
import { CatalogModule } from "../../catalog/catalog.module";
import resolvers from "../../catalog/catalog.resolvers";
import { Stores } from "../../../account/store/store.providers";
import { StoreModule } from "../../../account/store/store.module";
import { getValueFromCache } from "../../../common/utils/redisUtils";
let user: WCoreEntities.User;
const chance = new Chance();

const storeInventoryProvider: StoreInventoryProvider = StoreInventoryModule.injector.get(
  StoreInventoryProvider
);
const taxTypeProvider: TaxTypeProvider = TaxTypeModule.injector.get(
  TaxTypeProvider
);
const productChargeValueProvider: ProductChargeValueProvider = ProductChargeValueModule.injector.get(
  ProductChargeValueProvider
);

const productProvider: ProductProvider = ProductModule.injector.get(
  ProductProvider
);

const channelProvider: ChannelProvider = ChannelModule.injector.get(
  ChannelProvider
);

const chargeTypeProvider: ChargeTypeProvider = ChargeModule.injector.get(
  ChargeTypeProvider
);

const storeFormatProvider: StoreFormatProvider = StoreFormatModule.injector.get(
  StoreFormatProvider
);

const categoryService: CategoryProvider = CategoryModule.injector.get(
  CategoryProvider
);

const storeProvider: Stores = StoreModule.injector.get(Stores);

const createCustomTaxType = async manager => {
  return taxTypeProvider.createTaxType(manager, {
    name: chance.string(),
    description: "",
    taxTypeCode: chance.string({ length: 5 }),
    organizationId: user.organization.id,
    status: STATUS.ACTIVE
  });
};

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create store inventory", () => {
  test("should add a store inventory value for a product", async () => {
    const manager = getManager();
    const catalogInput = {
      name: chance.string(),
      catalogCode: chance.string({ length: 5 }),
      description: chance.string(),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string()
      }
    };
    const application = null;

    const createdCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: {
          ...catalogInput
        }
      },
      {
        injector: CatalogModule.injector
      }
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };
    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createdCatalog.id,
      organizationId: user.organization.id
    });
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });

    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode]
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput
      },
      user.organization.id
    );

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createProductChargeValueForCatalog(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );
    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1
    });
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog: createdCatalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    console.log("store", store);
    const addStoreInventory = await storeInventoryProvider.addStoreInventoryForAllProducts(
      manager,
      {
        organizationId: user.organization.id,
        storeId: store.id
      }
    );
    expect(addStoreInventory).toBeDefined();
    expect(addStoreInventory.length).toBeGreaterThan(0);
    expect(addStoreInventory[0].inventoryAvailable).toBe(true);
  });

  test("should mark multiple store product as unavailable", async () => {
    const manager = getManager();
    const catalogInput = {
      name: chance.string(),
      catalogCode: chance.string({ length: 5 }),
      description: chance.string(),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string()
      }
    };
    const application = null;

    const createdCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: {
          ...catalogInput
        }
      },
      {
        injector: CatalogModule.injector
      }
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };
    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createdCatalog.id,
      organizationId: user.organization.id
    });
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });

    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode]
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput
      },
      user.organization.id
    );

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createProductChargeValueForCatalog(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );
    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1
    });
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog: createdCatalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    console.log("store", store);
    const addStoreInventory = await storeInventoryProvider.addStoreInventoryForAllProducts(
      manager,
      {
        organizationId: user.organization.id,
        storeId: store.id
      }
    );
    const markUnavailable = await storeInventoryProvider.storeProductsAvailability(
      manager,

      {
        storeInventory: [
          {
            available: false,
            productId: product1.id
          },
          {
            available: false,
            productId: product.id
          }
        ],
        storeId: store.id
      },
      user.organization.id
    );

    const cacheKey = `${CACHING_KEYS.STORE_INVENTORY}_${store.id}_${product.id}`;
    const cacheValue = await getValueFromCache(cacheKey);

    const productCacheKey = `${CACHING_KEYS.STORE_INVENTORY}_${store.id}_${product1.id}`;
    const productCacheValue = await getValueFromCache(productCacheKey);

    expect(markUnavailable).toBeDefined();
    expect(markUnavailable[0].inventoryAvailable).toBe(false);
    expect(markUnavailable[1].inventoryAvailable).toBe(false);
    expect(cacheValue).toBeNull();
    expect(productCacheValue).toBeNull();
  });

  test("should add a store inventory based on store format and channel", async () => {
    const manager = getManager();
    const catalogInput = {
      name: chance.string(),
      catalogCode: chance.string({ length: 5 }),
      description: chance.string(),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string()
      }
    };
    const application = null;

    const createdCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: {
          ...catalogInput
        }
      },
      {
        injector: CatalogModule.injector
      }
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };
    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createdCatalog.id,
      organizationId: user.organization.id
    });
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });

    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode]
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput
      },
      user.organization.id
    );

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createProductChargeValueForCatalog(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );
    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1
    });
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog: createdCatalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    console.log("store", store);
    const addStoreInventory = await storeInventoryProvider.addStoreInventory(
      manager,
      {
        channel: [channel.id],
        productId: product1.id,
        storeFormat: [storeFormat.id]
      },
      user.organization.id
    );
    const storeKey = `${CACHING_KEYS.STORE_INVENTORY}_${store.id}_${product1.id}`;
    const storeCacheValue = await getValueFromCache(storeKey);

    expect(storeCacheValue).toBeNull();
    expect(addStoreInventory).toBeDefined();
    expect(addStoreInventory.length).toBeGreaterThan(0);
    expect(addStoreInventory[0].inventoryAvailable).toBe(true);
    expect(addStoreInventory[0].store.id).toBe(store.id);
  });

  test("should fetch product inventory", async () => {
    const manager = getManager();
    const catalogInput = {
      name: chance.string(),
      catalogCode: chance.string({ length: 5 }),
      description: chance.string(),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string()
      }
    };
    const application = null;

    const createdCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: {
          ...catalogInput
        }
      },
      {
        injector: CatalogModule.injector
      }
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };
    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createdCatalog.id,
      organizationId: user.organization.id
    });
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });

    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode]
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput
      },
      user.organization.id
    );

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createProductChargeValueForCatalog(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );
    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1
    });
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog: createdCatalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    console.log("store", store);
    const addStoreInventory = await storeInventoryProvider.addStoreInventoryForAllProducts(
      manager,
      {
        organizationId: user.organization.id,
        storeId: store.id
      }
    );

    const getStoreInventory = await storeInventoryProvider.storeProductInventory(
      manager,
      {
        storeId: store.id,
        productId: product1.id
      }
    );

    expect(getStoreInventory).toBeDefined();
    expect(getStoreInventory.inventoryAvailable).toBe(true);
    expect(getStoreInventory.product.id).toBe(product1.id);
  });

  test("should fetch store inventory", async () => {
    const manager = getManager();
    const catalogInput = {
      name: chance.string(),
      catalogCode: chance.string({ length: 5 }),
      description: chance.string(),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string()
      }
    };
    const application = null;

    const createdCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: {
          ...catalogInput
        }
      },
      {
        injector: CatalogModule.injector
      }
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };
    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createdCatalog.id,
      organizationId: user.organization.id
    });
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });

    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode]
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput
      },
      user.organization.id
    );

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createProductChargeValueForCatalog(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );
    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),

      listable: true
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1
    });
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog: createdCatalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    console.log("store", store);
    const addStoreInventory = await storeInventoryProvider.addStoreInventoryForAllProducts(
      manager,
      {
        organizationId: user.organization.id,
        storeId: store.id
      }
    );

    const getStoreInventory = await storeInventoryProvider.storeInventory(
      manager,
      {
        storeId: store.id
      }
    );
    expect(getStoreInventory).toBeDefined();
    expect(getStoreInventory.length).toBeGreaterThan(0);
    expect(getStoreInventory[0].inventoryAvailable).toBe(true);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
