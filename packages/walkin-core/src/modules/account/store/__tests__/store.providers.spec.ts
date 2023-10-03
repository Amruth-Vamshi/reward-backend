import * as CoreEntities from "../../../../entity";
import {
  closeUnitTestConnection,
  createUnitTestConnection,
  getAdminUser
} from "../../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { Chance } from "chance";
import { StoreModule } from "../store.module";
import { Stores, StoreOpenTimingProvider } from "../store.providers";
import { StoreFormatModule } from "../../../productcatalog/storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../../productcatalog/storeformat/storeFormat.providers";
import { TaxTypeModule } from "../../../productcatalog/taxtype/taxtype.module";
import { TaxTypeProvider } from "../../../productcatalog/taxtype/taxtype.providers";
import { ChannelModule } from "../../../productcatalog/channel/channel.module";
import { ChannelProvider } from "../../../productcatalog/channel/channel.providers";
import { CatalogModule } from "../../../productcatalog/catalog/catalog.module";
import { CatalogProvider } from "../../../productcatalog/catalog/catalog.providers";
import {
  ENUM_DAY,
  STATUS,
  AREA_TYPE,
  ENUM_DELIVERY_LOCATION_TYPE,
  STAFF_ROLE,
  PRODUCT_TYPE
} from "../../../common/constants/constants";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { WCoreError } from "../../../common/exceptions";
import { CategoryProvider } from "../../../productcatalog/category/category.providers";
import { CategoryModule } from "../../../productcatalog/category/category.module";
import { ProductProvider } from "../../../productcatalog/product/product.providers";
import { ProductModule } from "../../../productcatalog/product/product.module";
import { ProductPriceValueProvider } from "../../../productcatalog/productPriceValue/productPriceValue.providers";
import { ProductPriceValueModule } from "../../../productcatalog/productPriceValue/productPriceValue.module";
import { ProductDiscountValueProvider } from "../../../productcatalog/productDiscountValue/productDiscountValue.providers";
import { ProductDiscountValueModule } from "../../../productcatalog/productDiscountValue/productDiscountValue.module";
import { DiscountTypeProvider } from "../../../productcatalog/discountType/discountType.providers";
import { DiscountTypeModule } from "../../../productcatalog/discountType/discountType.module";
import * as storeResolvers from "../store.resolvers";
import { ProductTagProvider } from "../../../productcatalog/productTag/productTag.providers";
import { ProductTagModule } from "../../../productcatalog/productTag/productTag.module";
import { TagModule } from "@walkinserver/walkin-core/src/modules/productcatalog/tag/tag.module";
import { TagProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/tag/tag.providers";
import { OptionProvider } from "../../../productcatalog/option/option.providers";
import { OptionModule } from "../../../productcatalog/option/option.module";
import { Product } from "../../../../entity";
import { resolvers as chargeResolvers } from "@walkinserver/walkin-core/src/modules/productcatalog/chargeType/chargeType.resolvers";
import { ChargeModule } from "@walkinserver/walkin-core/src/modules/productcatalog/chargeType/chargeType.module";
import { ProductChargeValueModule } from "@walkinserver/walkin-core/src/modules/productcatalog/productChargeValue/productChargeValue.module";
import { resolvers as productPriceValueResolvers } from "@walkinserver/walkin-core/src/modules/productcatalog/productPriceValue/productPriceValue.resolvers";
import { resolvers as productChargeValueResolvers } from "@walkinserver/walkin-core/src/modules/productcatalog/productChargeValue/productChargeValue.resolvers";
import { ProductTaxValueModule } from "@walkinserver/walkin-core/src/modules/productcatalog/productTaxValue/productTaxValue.module";
import { resolvers as productTaxValueResolvers } from "@walkinserver/walkin-core/src/modules/productcatalog/productTaxValue/productTaxValue.resolvers";
import {
  productCategoryLoader,
  productValuesLoader
} from "../../../productcatalog/product/product.loader";
import { StoreInventoryProvider } from "../../../productcatalog/storeInventory/storeInventory.providers";
import { StoreInventoryModule } from "../../../productcatalog/storeInventory/storeInventory.module";
const categoryService: CategoryProvider = CategoryModule.injector.get(
  CategoryProvider
);

const tagProvider: TagProvider = TagModule.injector.get(TagProvider);

const productTagProvider: ProductTagProvider = ProductTagModule.injector.get(
  ProductTagProvider
);

const productService: ProductProvider = ProductModule.injector.get(
  ProductProvider
);

const productPriceValueProvider: ProductPriceValueProvider = ProductPriceValueModule.injector.get(
  ProductPriceValueProvider
);
const productDiscountValueProvider: ProductDiscountValueProvider = ProductDiscountValueModule.injector.get(
  ProductDiscountValueProvider
);
const discountTypeProvider: DiscountTypeProvider = DiscountTypeModule.injector.get(
  DiscountTypeProvider
);
const storeFormatProvider = StoreFormatModule.injector.get(StoreFormatProvider);
const taxTypeProvider = TaxTypeModule.injector.get(TaxTypeProvider);
const channelProvider = ChannelModule.injector.get(ChannelProvider);
const catalogProvider = CatalogModule.injector.get(CatalogProvider);

const storeInventoryProvider: StoreInventoryProvider = StoreInventoryModule.injector.get(
  StoreInventoryProvider
);

let user: CoreEntities.User;
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const storeProvider: Stores = StoreModule.injector.get(Stores);
const storeOpenTimingProvider: StoreOpenTimingProvider = StoreModule.injector.get(
  StoreOpenTimingProvider
);

const optionService: OptionProvider = OptionModule.injector.get(OptionProvider);

const option1 = {
  name: "Size",
  description: "Description Size",
  optionValues: [{ value: "Large" }]
};

const option2 = {
  name: "Crust",
  description: "Description Crust",
  optionValues: [{ value: "Thin" }, { value: "Thick" }]
};

const option3 = {
  name: "Test",
  description: "Description Test",
  optionValues: [{ value: "Test1" }, { value: "Test2" }, { value: "Test3" }]
};

describe("Should fetch all Stores", () => {
  test("Fetch all stores", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );
    expect(openTime).toBeDefined();
    console.log(openTime);

    const storeSearchInput = {
      deliveryLocationType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE,
      deliveryLocationValue: "600092",
      deliveryDateTime: "1230",
      organizationId: user.organization.id
    };

    const pageOptions = {
      page: 1,
      pageSize: 10
    };

    const sortOptions = {
      sortBy: "id",
      sortOrder: "DESC"
    };

    const allStores = await storeProvider.getAllStores(
      manager,
      pageOptions,
      sortOptions,
      storeSearchInput
    );
    expect(allStores).toBeTruthy();
    expect(allStores.data).toHaveLength(1);
  });
});

describe("Should fetch  Stores with catalogs", () => {
  test("Fetch  stores with catalog where catalog is listable", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: true,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
      productType: PRODUCT_TYPE.PRODUCT,
      listable: true
    };

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: catalog.id,
      organizationId: user.organization.id
    });
    const productInput = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const productInput1 = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const product = await productService.createProduct(manager, {
      ...productInput
    });

    const product1 = await productService.createProduct(manager, {
      ...productInput1
    });
    console.log("product", product1);
    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const createProductPriceValue1 = {
      productId: product1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue1 },
      user.organization.id
    );

    const getStoreCatalog = await storeProvider.getStoreCatalogWithCategories(
      manager,
      {
        code: store.code,
        organizationId: user.organization.id
      }
    );

    expect(getStoreCatalog).toBeDefined();
    expect(getStoreCatalog.catalog).toBeDefined();
    expect(getStoreCatalog.catalog.categories).toHaveLength(1);
    expect(getStoreCatalog.catalog.categories[0].products).toHaveLength(2);
    expect(getStoreCatalog.catalog.categories[0].products).toHaveLength(2);
    expect(getStoreCatalog.catalog.categories[0].productType).toEqual(
      PRODUCT_TYPE.PRODUCT
    );
  });

  test("Fetch  stores delivery area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: true,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    await storeProvider.addStoreDelivery(manager, storeDeliveryInput);

    const deliveryArea = await storeProvider.getStoreDeliverArea(
      manager,
      store.id,
      user.organization.id
    );
    expect(deliveryArea).toBeDefined();
    expect(deliveryArea.id).toBeDefined();
    expect(deliveryArea.store.id).toBe(store.id);
  });

  test("Fetch  stores with catalog with discount value", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: true,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
      listable: true
    };

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: catalog.id,
      organizationId: user.organization.id
    });
    const productInput = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const productInput1 = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const product = await productService.createProduct(manager, {
      ...productInput
    });

    const product1 = await productService.createProduct(manager, {
      ...productInput1
    });
    console.log("product", product1);
    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: 100
    };
    const createProductPriceValue1 = {
      productId: product1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const name = chance.string();
    const discountType = await discountTypeProvider.createDiscountType(
      manager,
      {
        name,
        discountTypeCode: chance.string()
      },
      user.organization.id
    );

    const createProductDiscountValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      discountValue: 10,
      discountType: discountType.id
    };
    const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue1 },
      user.organization.id
    );

    const getStoreCatalog = await storeProvider.getStoreCatalogWithCategories(
      manager,
      {
        code: store.code,
        organizationId: user.organization.id
      }
    );
    expect(getStoreCatalog).toBeDefined();
    expect(getStoreCatalog.catalog).toBeDefined();
    expect(getStoreCatalog.catalog.categories).toHaveLength(1);
    expect(getStoreCatalog.catalog.categories[0].products).toHaveLength(2);
    const foundProduct = getStoreCatalog.catalog.categories[0].products.find(
      filterProduct => filterProduct.id === product.id
    );
    const foundProduct1 = getStoreCatalog.catalog.categories[0].products.find(
      filterProduct => filterProduct.id === product1.id
    );
    expect(foundProduct).toBeDefined();
    expect(foundProduct1).toBeDefined();
  });

  test("Fetch  stores with catalog where catalog is listable is not true", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: false,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );
    expect(openTime).toBeDefined();
    console.log(openTime);

    try {
      await storeProvider.getStoreCatalogWithCategories(manager, {
        code: store.code,
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.STORE_CATALOG_NOT_FOUND)
      );
    }
  });

  test("Get product options in the response", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: true,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
      listable: true
    };

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: catalog.id,
      organizationId: user.organization.id
    });

    const optionObject = await optionService.createOption(manager, option1);

    const productInput = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const productInput1 = {
      name: chance.name(),
      description: "Product description",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      optionIds: [optionObject.id],
      organizationId: user.organization.id,
      listable: true
    };
    const product = await productService.createProduct(manager, {
      ...productInput
    });

    const product1 = await productService.createProduct(manager, {
      ...productInput1
    });
    console.log("product", product1);
    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const createProductPriceValue1 = {
      productId: product1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue1 },
      user.organization.id
    );

    const getStoreCatalog = await storeProvider.getStoreCatalogWithCategories(
      manager,
      {
        code: store.code,
        organizationId: user.organization.id
      }
    );

    const getProduct = await storeResolvers.default.ProductCustom.options(
      product1,
      {},
      { injector: StoreModule.injector }
    );

    expect(getStoreCatalog).toBeDefined();
    expect(getStoreCatalog.catalog).toBeDefined();
    expect(getStoreCatalog.catalog.categories).toHaveLength(1);
    expect(getStoreCatalog.catalog.categories[0].products).toHaveLength(3);
    expect(getProduct).toBeDefined();
    expect(getProduct[0].id).toEqual(optionObject.id);
  });

  test("Fetch  stores with catalog where catalog is listable", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: true,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );

    const productInput = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const productInput1 = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const product = await productService.createProduct(manager, {
      ...productInput
    });

    const product1 = await productService.createProduct(manager, {
      ...productInput1
    });
    console.log("product", product1);
    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const createProductPriceValue1 = {
      productId: product1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue1 },
      user.organization.id
    );

    const getStoreCatalog = await storeProvider.getStoreCatalogWithCategories(
      manager,
      {
        code: store.code,
        organizationId: user.organization.id
      }
    );

    expect(getStoreCatalog).toBeDefined();
    expect(getStoreCatalog.catalog).toBeDefined();
    expect(getStoreCatalog.catalog.categories).toHaveLength(0);
  });

  test("Get product categories in the response", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: true,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
      listable: true
    };

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: catalog.id,
      organizationId: user.organization.id
    });

    const optionObject = await optionService.createOption(manager, option1);

    const productInput = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const productInput1 = {
      name: chance.name(),
      description: "Product description",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      optionIds: [optionObject.id],
      organizationId: user.organization.id,
      listable: true
    };
    const product = await productService.createProduct(manager, {
      ...productInput
    });

    const product1 = await productService.createProduct(manager, {
      ...productInput1
    });
    console.log("product", product1);
    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const createProductPriceValue1 = {
      productId: product1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue1 },
      user.organization.id
    );

    const getStoreCatalog = await storeProvider.getStoreCatalogWithCategories(
      manager,
      {
        code: store.code,
        organizationId: user.organization.id
      }
    );

    const loader = productCategoryLoader();
    const getProductCategories = await storeResolvers.default.ProductCustom.categories(
      product1,
      {},
      { productCategoryLoader: loader }
    );

    expect(getStoreCatalog).toBeDefined();
    expect(getStoreCatalog.catalog).toBeDefined();
    expect(getStoreCatalog.catalog.categories).toHaveLength(1);
    expect(getStoreCatalog.catalog.categories[0].products).toHaveLength(3);
    expect(getProductCategories).toBeDefined();
    expect(getProductCategories[0].id).toEqual(category.id);
  });

  test("Get product options and option values in the response", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: true,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
      listable: true
    };

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: catalog.id,
      organizationId: user.organization.id
    });

    const optionObject1 = await optionService.createOption(manager, option2);
    const optionObject2 = await optionService.createOption(manager, option3);

    const productInput = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const productInput1 = {
      name: chance.name(),
      description: "Product description",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      optionIds: [optionObject1.id, optionObject2.id],
      organizationId: user.organization.id,
      listable: true
    };
    const product = await productService.createProduct(manager, {
      ...productInput
    });

    const product1 = await productService.createProduct(manager, {
      ...productInput1
    });
    console.log("product", product1);
    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const createProductPriceValue1 = {
      productId: product1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue1 },
      user.organization.id
    );

    const getStoreCatalog = await storeProvider.getStoreCatalogWithCategories(
      manager,
      {
        code: store.code,
        organizationId: user.organization.id
      }
    );

    const getProduct = await storeResolvers.default.ProductCustom.options(
      product1,
      {},
      { injector: StoreModule.injector }
    );

    expect(getStoreCatalog).toBeDefined();
    expect(getStoreCatalog.catalog).toBeDefined();
    expect(getStoreCatalog.catalog.categories).toHaveLength(1);
    expect(getStoreCatalog.catalog.categories[0].products).toHaveLength(8);
    expect(getProduct).toBeDefined();
    expect(getProduct).toHaveLength(2);
  });

  test("should have valid product Prices for more then one product with variants", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: true,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
      listable: true
    };

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: catalog.id,
      organizationId: user.organization.id
    });
    const optionObject1 = await optionService.createOption(manager, option1);
    const optionObject2 = await optionService.createOption(manager, option2);
    const optionObject3 = await optionService.createOption(manager, option3);

    const productInput = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      optionIds: [optionObject3.id],
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const productInput1 = {
      name: chance.name(),
      description: "Product description",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      optionIds: [optionObject1.id, optionObject2.id],
      organizationId: user.organization.id,
      listable: true
    };
    const createdProduct = await productService.createProduct(manager, {
      ...productInput
    });

    const createdProduct1 = await productService.createProduct(manager, {
      ...productInput1
    });

    // Options

    const getProductVariant = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: createdProduct.name + "+Test1"
      }
    });

    const getProductVariant1 = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: createdProduct1.name + "+Large+Thin"
      }
    });

    const chargeName = chance.string();
    const chargeType = await chargeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chargeName,
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const createProductPriceValue = {
      productId: createdProduct.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: 50
    };
    const createProductPriceValue1 = {
      productId: createdProduct1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: 50
    };

    const createProductVariantPriceValue = {
      productId: getProductVariant.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: 60
    };
    const createProductVariantPriceValue1 = {
      productId: getProductVariant1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: 60
    };

    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );
    const productPriceValue1 = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue1 } },
      { injector: ProductPriceValueModule.injector }
    );

    const productVariantPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductVariantPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );
    const productVariantPriceValue1 = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductVariantPriceValue1 } },
      { injector: ProductPriceValueModule.injector }
    );

    const chargeValueInput = {
      productId: createdProduct.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: 10
    };
    const chargeValueInput1 = {
      productId: createdProduct1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: 10
    };

    const variantChargeValueInput = {
      productId: getProductVariant.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: 15
    };
    const variantChargeValueInput1 = {
      productId: getProductVariant1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: 15
    };

    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const chargeValue1 = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput1 }
      },
      { injector: ProductChargeValueModule.injector }
    );

    const variantChargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...variantChargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const variantChargeValue1 = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...variantChargeValueInput1 }
      },
      { injector: ProductChargeValueModule.injector }
    );

    const taxValueSchema = {
      productId: createdProduct.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: 4
    };
    const taxValueSchema1 = {
      productId: createdProduct1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: 4
    };

    const variantTaxValueSchema = {
      productId: getProductVariant.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: 5
    };
    const variantTaxValueSchema1 = {
      productId: getProductVariant1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: 5
    };

    const productTaxValue = await productTaxValueResolvers.Mutation.createTaxValueForProduct(
      { user },
      { input: { ...taxValueSchema } },
      { injector: ProductTaxValueModule.injector }
    );
    const productTaxValue1 = await productTaxValueResolvers.Mutation.createTaxValueForProduct(
      { user },
      { input: { ...taxValueSchema1 } },
      { injector: ProductTaxValueModule.injector }
    );

    const variantProductTaxValue = await productTaxValueResolvers.Mutation.createTaxValueForProduct(
      { user },
      { input: { ...variantTaxValueSchema } },
      { injector: ProductTaxValueModule.injector }
    );
    const variantProductTaxValue1 = await productTaxValueResolvers.Mutation.createTaxValueForProduct(
      { user },
      { input: { ...variantTaxValueSchema1 } },
      { injector: ProductTaxValueModule.injector }
    );

    createdProduct.store = store;
    createdProduct1.store = store;
    getProductVariant["store"] = store;
    getProductVariant1["store"] = store;

    const loader = productValuesLoader();

    const getProduct = await storeResolvers.default.ProductCustom.productPrices(
      createdProduct,
      {},
      { productValuesLoader: loader }
    );

    const getProduct1 = await storeResolvers.default.ProductCustom.productPrices(
      createdProduct1,
      {},
      { productValuesLoader: loader }
    );

    const getProductVar = await storeResolvers.default.ProductCustom.productPrices(
      getProductVariant,
      {},
      { productValuesLoader: loader }
    );

    const getProductVar1 = await storeResolvers.default.ProductCustom.productPrices(
      getProductVariant1,
      {},
      { productValuesLoader: loader }
    );

    console.log("================== getProduct", getProduct);
    console.log("================== getProduct1", getProduct1);
    console.log("================== getProductVar", getProductVar);
    console.log("================== getProductVar1", getProductVar1);

    const getStoreCatalog = await storeProvider.getStoreCatalogWithCategories(
      manager,
      {
        code: store.code,
        organizationId: user.organization.id
      }
    );

    expect(getStoreCatalog).toBeDefined();
    expect(getStoreCatalog.catalog).toBeDefined();
    expect(getStoreCatalog.catalog.categories).toHaveLength(1);
    expect(getProduct.productChargeValues[0].chargeValue).toEqual(
      chargeValueInput.chargeValue
    );
    expect(getProduct1.productChargeValues[0].chargeValue).toEqual(
      chargeValueInput1.chargeValue
    );
    expect(getProductVar.productChargeValues[0].chargeValue).toEqual(
      variantChargeValueInput.chargeValue
    );
    expect(getProductVar1.productChargeValues[0].chargeValue).toEqual(
      variantChargeValueInput1.chargeValue
    );

    expect(getProduct.productTaxValues[0].taxValue).toEqual(
      taxValueSchema.taxValue
    );
    expect(getProduct1.productTaxValues[0].taxValue).toEqual(
      taxValueSchema1.taxValue
    );
    expect(getProductVar.productTaxValues[0].taxValue).toEqual(
      variantTaxValueSchema.taxValue
    );
    expect(getProductVar1.productTaxValues[0].taxValue).toEqual(
      variantTaxValueSchema1.taxValue
    );

    expect(getProduct.productPriceValues[0].priceValue).toEqual(
      createProductPriceValue.productPrice
    );
    expect(getProduct1.productPriceValues[0].priceValue).toEqual(
      createProductPriceValue1.productPrice
    );
    expect(getProductVar.productPriceValues[0].priceValue).toEqual(
      createProductVariantPriceValue.productPrice
    );
    expect(getProductVar1.productPriceValues[0].priceValue).toEqual(
      createProductVariantPriceValue1.productPrice
    );
  });

  test("Get product storeInventory field", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      listable: true,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeDeliveryInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "600092",
      deliveryAreaType: ENUM_DELIVERY_LOCATION_TYPE.PINCODE
    };

    // Add deliveryLocation
    const deliveryArea = await storeProvider.addStoreDelivery(
      manager,
      storeDeliveryInput
    );

    const storeOpenTimeInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      days: [ENUM_DAY.MONDAY, ENUM_DAY.FRIDAY],
      openTime: 1100,
      closeTime: 2300
    };
    const openTime = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimeInput
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
      listable: true
    };

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: catalog.id,
      organizationId: user.organization.id
    });

    const optionObject = await optionService.createOption(manager, option1);

    const productInput = {
      name: chance.name(),
      description: "Product desc",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      organizationId: user.organization.id,
      listable: true
    };
    const productInput1 = {
      name: chance.name(),
      description: "Product description",
      code: chance.name(),
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      optionIds: [optionObject.id],
      organizationId: user.organization.id,
      listable: true
    };
    const product = await productService.createProduct(manager, {
      ...productInput
    });

    const product1 = await productService.createProduct(manager, {
      ...productInput1
    });
    product1.store = store;
    console.log("product", product1);
    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const createProductPriceValue1 = {
      productId: product1.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue1 },
      user.organization.id
    );

    const getStoreCatalog = await storeProvider.getStoreCatalogWithCategories(
      manager,
      {
        code: store.code,
        organizationId: user.organization.id
      }
    );

    const addStoreInventory = await storeInventoryProvider.addStoreInventoryForAllProducts(
      manager,
      {
        organizationId: user.organization.id,
        storeId: store.id
      }
    );

    const getStoreProductInventory = await storeResolvers.default.ProductCustom.inventoryAvailable(
      product1,
      {},
      { injector: StoreModule.injector }
    );

    expect(getStoreCatalog).toBeDefined();
    expect(getStoreCatalog.catalog).toBeDefined();
    expect(getStoreCatalog.catalog.categories).toHaveLength(1);
    expect(getStoreCatalog.catalog.categories[0].products).toHaveLength(3);
    expect(getStoreProductInventory).toBeDefined();
    expect(getStoreProductInventory).toEqual(true);
  });
});

describe("Should fetch store", () => {
  test("Fetch user with valid store id", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    expect(store).toBeDefined();
    expect(store.id).toBeDefined();
    expect(store.wifi).toEqual(false);

    let foundStore = await storeProvider.getStorebyId(
      manager,
      store.id,
      user.organization.id
    );
    expect(foundStore.name).toBe(store.name);
    expect(foundStore.id).toBe(store.id);
    expect(foundStore.storeFormats).toHaveLength(store.storeFormats.length);
    expect(foundStore.channels).toHaveLength(store.channels.length);
    expect(foundStore.catalog.id).toBe(store.catalog.id);
  });

  test("Fetch store with valid store code", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    expect(store).toBeDefined();
    expect(store.id).toBeDefined();
    expect(store.wifi).toEqual(false);

    let foundStore = await storeProvider.getStorebyCode(
      manager,
      store.code,
      user.organization.id
    );
    expect(foundStore.name).toBe(store.name);
    expect(foundStore.id).toBe(store.id);
    expect(foundStore.storeFormats).toHaveLength(store.storeFormats.length);
    expect(foundStore.channels).toHaveLength(store.channels.length);
    expect(foundStore.catalog.id).toBe(store.catalog.id);
  });

  test("Should not fetch store with invalid org id", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    expect(store).toBeDefined();
    expect(store.id).toBeDefined();
    expect(store.wifi).toEqual(false);

    let dummyOrganizationId = chance.string({ length: 14 });
    let foundStore = await storeProvider.getStorebyCode(
      manager,
      store.code,
      dummyOrganizationId
    );
    expect(foundStore).toBe(undefined);
  });
});

describe(" Store Admin Level tests", () => {
  test("Create store admin level", async () => {
    const entityManager = getManager();
    const storeAmdinLevelParent = {
      code: chance.string({ length: 6 }),
      name: chance.string({ length: 6 })
    };
    const createAdminLevel = await storeProvider.createStoreAdminLevel(
      entityManager,
      storeAmdinLevelParent
    );
    expect(createAdminLevel).toBeDefined();

    const storeAmdinLevel = {
      code: chance.string({ length: 6 }),
      name: chance.string({ length: 6 }),
      parent: createAdminLevel
    };
    const childStoreAdmin = await storeProvider.createStoreAdminLevel(
      entityManager,
      storeAmdinLevel
    );
    expect(childStoreAdmin).toBeDefined();
    expect(childStoreAdmin.id).toBeDefined();

    let foundChildAdminLevel = await storeProvider.getStoreAdminLevel(
      entityManager,
      childStoreAdmin.id
    );

    expect(childStoreAdmin).toEqual(foundChildAdminLevel);

    expect(childStoreAdmin.parent).toEqual(createAdminLevel);
  });

  test("Update store admin level", async () => {
    const entityManager = getManager();
    const storeAmdinLevelParent = {
      code: chance.string({ length: 6 }),
      name: chance.string({ length: 6 })
    };
    const createAdminLevel = await storeProvider.createStoreAdminLevel(
      entityManager,
      storeAmdinLevelParent
    );
    expect(createAdminLevel).toBeDefined();

    createAdminLevel.code = createAdminLevel.code + "_UPDATED";

    const updateStoreAdminLevel = await storeProvider.updateStoreAdminLevel(
      entityManager,
      createAdminLevel
    );
    expect(updateStoreAdminLevel).toBeDefined();
    expect(updateStoreAdminLevel.id).toBeDefined();
    expect(updateStoreAdminLevel.code).toEqual(createAdminLevel.code);
  });
});

describe(" Store Open Timings tests", () => {
  test("Add Store Open Timing", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeOpenTimingInput = {
      storeId: store.id,
      openTime: 1100,
      closeTime: 2323,
      days: [ENUM_DAY.FRIDAY, ENUM_DAY.MONDAY],
      organizationId: user.organization.id
    };

    const storeOpenTiming = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimingInput
    );
    expect(storeOpenTiming).toBeTruthy();
    expect(storeOpenTiming.id).toBeDefined();
  });

  test("Add Bulk Store Open Timing", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeOpenTimingInput = {
      storeId: store.id,
      organizationId: user.organization.id,
      storeTimings: [
        {
          days: ENUM_DAY.FRIDAY,
          data: [
            {
              openTime: 1100,
              closeTime: 1823
            },
            {
              openTime: 1900,
              closeTime: 2323
            }
          ]
        }
      ]
    };

    const storeOpenTiming = await storeOpenTimingProvider.addBulkStoreOpeningTimings(
      manager,
      storeOpenTimingInput
    );
    expect(storeOpenTiming).toBeDefined();
    expect(storeOpenTiming.length).toBe(1);
  });
  test("fail to add Store Open Timing for invalid timings", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeOpenTimingInput = {
      storeId: store.id,
      openTime: 1100,
      closeTime: 2423,
      days: [ENUM_DAY.FRIDAY, ENUM_DAY.MONDAY],
      organizationId: user.organization.id
    };

    try {
      const storeOpenTiming = await storeOpenTimingProvider.addStoreOpenTiming(
        manager,
        storeOpenTimingInput
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.STORE_TIME_INVALID));
    }
  });

  test("Remove Store Open Timing", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeOpenTimingInput = {
      storeId: store.id,
      openTime: 1100,
      closeTime: 2323,
      days: [ENUM_DAY.FRIDAY, ENUM_DAY.MONDAY],
      organizationId: user.organization.id
    };

    const storeOpenTiming = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimingInput
    );

    const removeStoreOpenTimingInput = {
      id: storeOpenTiming.id,
      storeId: store.id,
      organizationId: user.organization.id
    };

    const removeStoreOpenTiming = await storeOpenTimingProvider.removeStoreOpenTiming(
      manager,
      removeStoreOpenTimingInput
    );

    expect(removeStoreOpenTiming.id).toBeUndefined();
  });

  test("Remove multiple Store Open Timing", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeOpenTimingInput = {
      storeId: store.id,
      openTime: 1100,
      closeTime: 2323,
      days: [ENUM_DAY.FRIDAY, ENUM_DAY.MONDAY],
      organizationId: user.organization.id
    };

    const storeOpenTiming = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimingInput
    );

    const storeOpenTimingInput1 = {
      storeId: store.id,
      openTime: 1100,
      closeTime: 2323,
      days: [ENUM_DAY.SATURDAY, ENUM_DAY.THURSDAY],
      organizationId: user.organization.id
    };

    const storeOpenTiming1 = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimingInput
    );

    const removeStoreOpenTimingInput = {
      id: [storeOpenTiming.id, storeOpenTiming1.id],
      storeId: store.id,
      organizationId: user.organization.id
    };

    const removeStoreOpenTiming = await storeOpenTimingProvider.removeStoreOpenTimings(
      manager,
      removeStoreOpenTimingInput
    );

    expect(removeStoreOpenTiming[0].id).toBeUndefined();
    expect(removeStoreOpenTiming[1].id).toBeUndefined();
  });

  test("Get Store Open Timing", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeOpenTimingInput = {
      storeId: store.id,
      openTime: 1100,
      closeTime: 2323,
      days: [ENUM_DAY.FRIDAY, ENUM_DAY.MONDAY],
      organizationId: user.organization.id
    };

    const storeOpenTiming = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimingInput
    );

    const foundStoreOpenTiming = await storeOpenTimingProvider.getStoreOpenTiming(
      manager,
      {
        id: storeOpenTiming.id,
        storeId: store.id,
        organizationId: user.organization.id
      }
    );
    expect(foundStoreOpenTiming).toBeTruthy();
    expect(foundStoreOpenTiming.id).toBe(storeOpenTiming.id);
  });

  test("Get Store Open Timings", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const storeOpenTimingInput = {
      storeId: store.id,
      openTime: 1100,
      closeTime: 2323,
      days: [ENUM_DAY.FRIDAY, ENUM_DAY.MONDAY],
      organizationId: user.organization.id
    };

    const storeOpenTiming = await storeOpenTimingProvider.addStoreOpenTiming(
      manager,
      storeOpenTimingInput
    );

    const pageOptions = {
      page: 1,
      pageSize: 10
    };
    const sortOptions = {
      sortBy: "id",
      sortOrder: "DESC"
    };

    const foundStoreOpenTimings = await storeOpenTimingProvider.getStoreOpenTimings(
      manager,
      {
        id: storeOpenTiming.id,
        storeId: store.id,
        organizationId: user.organization.id
      },
      pageOptions,
      sortOptions
    );
    expect(foundStoreOpenTimings).toBeTruthy();
    expect(foundStoreOpenTimings.data).toHaveLength(1);
  });
});

describe("Add and remove delivery area", () => {
  test("should add delivery area for pincode", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 6 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeDeliverArea = {
      storeId: store.id,
      organizationId: store.organization.id,
      deliveryAreaValue: chance.zip(),
      deliveryAreaType: AREA_TYPE.PINCODE
    };
    const allDeliveryArea = await storeProvider.addStoreDelivery(manager, {
      ...storeDeliverArea
    });
    expect(allDeliveryArea).toBeDefined();
    expect(allDeliveryArea.pincode).toBe(storeDeliverArea.deliveryAreaValue);
  });

  test("should update delivery area for geo area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 10 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeDeliverArea = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "30,40",
      deliveryAreaType: AREA_TYPE.GEO_AREA
    };
    const allDeliveryArea = await storeProvider.addStoreDelivery(manager, {
      ...storeDeliverArea
    });

    const updateStoreDeliverArea = {
      id: allDeliveryArea.id,
      deliveryAreaValue: "30,40",
      deliveryAreaType: AREA_TYPE.GEO_AREA
    };
    const updateDeliveryArea = await storeProvider.updateStoreDelivery(
      manager,
      { ...updateStoreDeliverArea }
    );
    expect(updateDeliveryArea).toBeDefined();
    expect(updateDeliveryArea.area).toBeDefined();
    expect(updateDeliveryArea.area).toBe(
      updateStoreDeliverArea.deliveryAreaValue
    );
  });

  test("should add delivery area for geo area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 10 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeDeliverArea = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: "30,40",
      deliveryAreaType: AREA_TYPE.GEO_AREA
    };
    const allDeliveryArea = await storeProvider.addStoreDelivery(manager, {
      ...storeDeliverArea
    });
    expect(allDeliveryArea).toBeDefined();
    expect(allDeliveryArea.area).toBeDefined();
  });

  test("should remove delivery area", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 6 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const storeDeliverArea = {
      storeId: store.id,
      organizationId: user.organization.id,
      deliveryAreaValue: chance.zip(),
      deliveryAreaType: AREA_TYPE.PINCODE
    };
    const allDeliveryArea = await storeProvider.addStoreDelivery(manager, {
      ...storeDeliverArea
    });
    const removeDeliveryArea = await storeProvider.removeStoreDelivery(
      manager,
      {
        storeId: store.id,
        organizationId: user.organization.id,
        deliveryAreaId: allDeliveryArea.id
      }
    );
    expect(removeDeliveryArea).toBeDefined();
  });
});

describe("Enable and disable store", () => {
  test("should disable a enabled store", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 12 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const disableStore = await storeProvider.disableStore(manager, {
      storeId: store.id,
      organizationId: user.organization.id
    });
    expect(disableStore).toBeDefined();
    expect(disableStore.enable).toBeFalsy();
  });
  test("should enable a disabled store", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);
    const disableStore = await storeProvider.disableStore(manager, {
      storeId: store.id,
      organizationId: store.organization.id
    });
    const storeEnable = await storeProvider.enableStore(manager, {
      storeId: store.id,
      organizationId: user.organization.id
    });
    expect(storeEnable).toBeDefined();
    expect(storeEnable.enable).toBeTruthy();
  });
});

describe("Should add or update Staff members", () => {
  test("should add staff member", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: "DELIVERY"
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    expect(addedStaffMemeber).toBeDefined();
    expect(addedStaffMemeber.id).toBeDefined();
  });

  test("should add Multiple  staff member", async () => {
    const manager = getManager();
    const staffMember = [
      {
        name: chance.name(),
        phone: `+91${chance.phone({ formatted: false })}`,

        staff_role: "DELIVERY"
      },
      {
        name: chance.name(),
        phone: `+91${chance.phone({ formatted: false })}`,

        staff_role: "STAFF_MANAGER"
      }
    ];
    const addedStaffMemeber = await storeProvider.addBulkStaffMembers(
      manager,
      staffMember,
      user.organization.id
    );
    expect(addedStaffMemeber).toBeDefined();
    expect(addedStaffMemeber.length).toBe(2);
    expect(addedStaffMemeber[0].id).toBeDefined();
    expect(addedStaffMemeber[1].id).toBeDefined();
  });
  test("should add staff member with manager role", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    expect(addedStaffMemeber).toBeDefined();
    expect(addedStaffMemeber.id).toBeDefined();
    expect(addedStaffMemeber.staffRole).toBe(STAFF_ROLE.STORE_MANAGER);
  });

  test("should update staff member", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: "DELIVERY"
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const updateEntity = {
      name: chance.name(),
      id: addedStaffMemeber.id,
      organizationId: user.organization.id
    };
    const updateStaffMember = await storeProvider.editStaff(
      manager,
      updateEntity
    );
    expect(updateStaffMember).toBeDefined();
    expect(updateStaffMember.id).toBeDefined();
    expect(updateStaffMember.name).toBe(updateEntity.name);
  });

  test("should add staff member to a store", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: "DELIVERY"
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const staffMemberForStore = await storeProvider.addStaffMemberToStore(
      manager,
      {
        organizationId: user.organization.id,
        staffMemberId: addedStaffMemeber.id,
        storeId: store.id
      }
    );
    expect(staffMemberForStore).toBeDefined();
    expect(staffMemberForStore.id).toBe(store.id);
    expect(staffMemberForStore.staff).toBeDefined();
  });

  test("should add Multiple staff member to a store", async () => {
    const manager = getManager();
    const staffMember = [
      {
        name: chance.name(),
        phone: `+91${chance.phone({ formatted: false })}`,
        staff_role: "DELIVERY"
      },
      {
        name: chance.name(),
        phone: `+91${chance.phone({ formatted: false })}`,
        staff_role: "STAFF_MANAGER"
      }
    ];
    const addedStaffMemeber = await storeProvider.addBulkStaffMembers(
      manager,
      staffMember,
      user.organization.id
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const staffMemberIds: any = addedStaffMemeber.map(
      staffMember => staffMember.id
    );
    const staffMemberForStore = await storeProvider.addStaffMembersToStore(
      manager,
      {
        organizationId: user.organization.id,
        staffMemberIds,
        storeId: store.id
      }
    );
    expect(staffMemberForStore).toBeDefined();
    expect(staffMemberForStore.id).toBe(store.id);
    expect(staffMemberForStore.staff).toBeDefined();
    expect(staffMemberForStore.staff.length).toBe(2);
  });

  test("should add staff member with manager role to a store", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const staffMemberForStore = await storeProvider.addStaffMemberToStore(
      manager,
      {
        organizationId: user.organization.id,
        staffMemberId: addedStaffMemeber.id,
        storeId: store.id
      }
    );
    expect(staffMemberForStore).toBeDefined();
    expect(staffMemberForStore.id).toBe(store.id);
    expect(staffMemberForStore.staff).toBeDefined();
    expect(staffMemberForStore.staff[0].staffRole).toBe(
      STAFF_ROLE.STORE_MANAGER
    );
  });

  test("should be able to fetch staff member with manager role to a store", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const staffMemberForStore = await storeProvider.addStaffMemberToStore(
      manager,
      {
        organizationId: user.organization.id,
        staffMemberId: addedStaffMemeber.id,
        storeId: store.id
      }
    );
    const staffMembers: any = await storeProvider.getStaffMembers(
      manager,
      store.id,
      user.organization.id,
      {
        page: 1,
        pageSize: 10
      },
      {
        sortOrder: "ASC"
      },
      STAFF_ROLE.STORE_MANAGER
    );

    expect(staffMembers).toBeDefined();
    expect(staffMembers.data).toHaveLength(1);
    expect(staffMembers.data[0].staffRole).toBe(STAFF_ROLE.STORE_MANAGER);
  });
  test("should make staff member inactive", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: "DELIVERY"
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const inactiveStaffMember = await storeProvider.inactiveStaff(manager, {
      id: addedStaffMemeber.id,
      organizationId: user.organization.id
    });
    expect(inactiveStaffMember).toBeDefined();
    expect(inactiveStaffMember.status).toBe(STATUS.INACTIVE);
  });

  test("should make staff member active from inactive", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: "DELIVERY"
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const inactiveStaffMember = await storeProvider.inactiveStaff(manager, {
      id: addedStaffMemeber.id,
      organizationId: user.organization.id
    });
    const activeStaffMember = await storeProvider.activeStaff(manager, {
      id: addedStaffMemeber.id,
      organizationId: user.organization.id
    });
    expect(activeStaffMember).toBeDefined();
    expect(activeStaffMember.status).toBe(STATUS.ACTIVE);
  });

  test("should fetch the status of members of the staff for a store", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER,
      busy: false
    };

    const staffMember1 = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER,
      busy: false
    };

    const staffMember2 = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER,
      busy: false
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const addedStaffMemeber1 = await storeProvider.addStaff(
      manager,
      staffMember1
    );
    const addedStaffMemeber2 = await storeProvider.addStaff(
      manager,
      staffMember2
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    const staffMemberForStore = await storeProvider.addStaffMemberToStore(
      manager,
      {
        organizationId: user.organization.id,
        staffMemberId: addedStaffMemeber.id,
        storeId: store.id
      }
    );
    const staffMemberForStore1 = await storeProvider.addStaffMemberToStore(
      manager,
      {
        organizationId: user.organization.id,
        staffMemberId: addedStaffMemeber1.id,
        storeId: store.id
      }
    );
    const staffMemberForStore2 = await storeProvider.addStaffMemberToStore(
      manager,
      {
        organizationId: user.organization.id,
        staffMemberId: addedStaffMemeber2.id,
        storeId: store.id
      }
    );
    const fetchStaffStatus = await storeProvider.getStoreStaffStatus(manager, {
      organizationId: user.organization.id,
      storeId: store.id
    });
    expect(fetchStaffStatus).toBe(false);
  });

  test("should update the channel for store", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channel1Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel1 = await channelProvider.createChannel(
      manager,
      channel1Input,
      user.organization.id
    );

    const channel2Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel2 = await channelProvider.createChannel(
      manager,
      channel2Input,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel1],
      catalog,
      organizationId: user.organization.id
    };
    const createdStore = await storeProvider.createStore(manager, storeInput);

    const updateStoreInput = {
      id: createdStore.id,
      name: createdStore.name,
      channels: [channel2],
      organizationId: user.organization.id
    };
    const updatedStore = await storeProvider.updateStore(
      manager,
      updateStoreInput
    );

    expect(updatedStore.channels[0].channelCode).toEqual(channel2.channelCode);
    expect(updatedStore.channels[0].id).toEqual(channel2.id);
  });
  test("should fail for updating store with wrong organization id", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channel1Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel1 = await channelProvider.createChannel(
      manager,
      channel1Input,
      user.organization.id
    );

    const channel2Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel2 = await channelProvider.createChannel(
      manager,
      channel2Input,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel1],
      catalog,
      organizationId: user.organization.id
    };
    const createdStore = await storeProvider.createStore(manager, storeInput);
    const application = null;
    const updateStoreInput = {
      id: createdStore.id,
      name: createdStore.name,
      channels: [channel2],
      organizationId: chance.string()
    };

    try {
      await storeResolvers.default.Mutation.updateStore(
        { application, user },
        { input: updateStoreInput },
        { injector: StoreModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH)
      );
    }
  });
  test("should make store code url safe", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      channelInput,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 10 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: "store-code!@#-1",
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel],
      catalog,
      organizationId: user.organization.id
    };
    const store = await storeProvider.createStore(manager, storeInput);

    expect(store).toBeDefined();
    expect(store.code).toEqual("store-code-1");
  });

  test("should update the catalog for store", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const catalogInput2 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: "testCatalogCode",
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog2 = await catalogProvider.createCatalog(
      manager,
      catalogInput2
    );

    const channel1Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel1 = await channelProvider.createChannel(
      manager,
      channel1Input,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel1],
      catalog,
      organizationId: user.organization.id
    };
    const createdStore = await storeProvider.createStore(manager, storeInput);

    const updateStoreInput = {
      id: createdStore.id,
      name: createdStore.name,
      organizationId: user.organization.id,
      catalogCode: catalog2.catalogCode
    };
    const application = null;
    const updatedStore = await storeResolvers.default.Mutation.updateStore(
      { application, user },
      { input: updateStoreInput },
      { injector: StoreModule.injector }
    );

    expect(updatedStore).toBeDefined();
    expect(updatedStore.catalog.catalogCode).toEqual(catalog2.catalogCode);
  });
  test("should update the catalog for store", async () => {
    const manager = getManager();
    const staffMember = {
      name: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      organizationId: user.organization.id,
      staff_role: STAFF_ROLE.STORE_MANAGER
    };
    const addedStaffMemeber = await storeProvider.addStaff(
      manager,
      staffMember
    );
    const catalogInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 5 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog = await catalogProvider.createCatalog(manager, catalogInput);

    const catalogInput2 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: "testCatalogCode23",
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string({ length: 10 })
      }
    };

    const catalog2 = await catalogProvider.createCatalog(
      manager,
      catalogInput2
    );

    const channel1Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel1 = await channelProvider.createChannel(
      manager,
      channel1Input,
      user.organization.id
    );

    const taxTypeInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      taxTypeCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };

    const taxType = await taxTypeProvider.createTaxType(manager, taxTypeInput);

    const storeFormatInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      storeFormatCode: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      taxTypeCodes: [taxType.taxTypeCode]
    };

    const storeFormat = await storeFormatProvider.createStoreFormat(
      manager,
      storeFormatInput
    );
    const storeInput = {
      name: chance.string({ length: 6 }),
      code: chance.string({ length: 8 }),
      wifi: false,
      longitude: chance.longitude() + "",
      latitude: chance.latitude() + "",
      storeFormats: [storeFormat],
      channels: [channel1],
      catalog,
      organizationId: user.organization.id
    };
    const createdStore = await storeProvider.createStore(manager, storeInput);

    const updateStoreInput = {
      id: createdStore.id,
      code: createdStore.code,
      name: createdStore.name,
      organizationId: user.organization.id,
      catalogCode: catalog2.catalogCode
    };
    const application = null;
    const updatedStore = await storeResolvers.default.Mutation.updateStoreByCode(
      { application, user },
      { input: updateStoreInput },
      { injector: StoreModule.injector }
    );

    expect(updatedStore).toBeDefined();
    expect(updatedStore.catalog.catalogCode).toEqual(catalog2.catalogCode);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
