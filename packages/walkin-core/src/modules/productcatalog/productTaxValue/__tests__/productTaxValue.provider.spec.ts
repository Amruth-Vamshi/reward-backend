// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ProductTaxValueProvider } from "../productTaxValue.providers";
import { ProductTaxValueModule } from "../productTaxValue.module";
import { resolvers as productTaxValueResolvers } from "../productTaxValue.resolvers";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection,
} from "../../../../../__tests__/utils/unit";
import { STATUS } from "../../../common/constants";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { ProductProvider } from "../../product/product.providers";
import { ProductModule } from "../../product/product.module";
import { ChannelProvider } from "../../channel/channel.providers";
import { ChannelModule } from "../../channel/channel.module";
import { ChargeTypeProvider } from "../../chargeType/chargeType.providers";
import { ChargeModule } from "../../chargeType/chargeType.module";
import { StoreFormatModule } from "../../storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../storeformat/storeFormat.providers";
import { TaxTypeModule } from "../../taxtype/taxtype.module";
import { CatalogModule } from "../../catalog/catalog.module";
import resolvers from "../../catalog/catalog.resolvers";
import { CategoryModule } from "../../category/category.module";
import { CategoryProvider } from "../../category/category.providers";
import { TaxTypeProvider } from "../../taxtype/taxtype.providers";
let user: WCoreEntities.User;
let customerForCustomerDeviceTests: WCoreEntities.Customer;
var chance = new Chance();

const productTaxValueProvider: ProductTaxValueProvider = ProductTaxValueModule.injector.get(
  ProductTaxValueProvider
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

const taxTypeProvider: TaxTypeProvider = TaxTypeModule.injector.get(
  TaxTypeProvider
);

const categoryService: CategoryProvider = CategoryModule.injector.get(
  CategoryProvider
);

const createCustomTaxType = async (manager) => {
  return taxTypeProvider.createTaxType(manager, {
    name: chance.string(),
    description: "",
    taxTypeCode: chance.string({ length: 5 }),
    organizationId: user.organization.id,
    status: STATUS.ACTIVE,
  });
};

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Create Product Tax value", () => {
  test("should create a tax value for a product", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    expect(productTaxValue).toBeDefined();
    expect(productTaxValue.taxValue).toBeDefined();
    expect(productTaxValue.taxValue).toBe(taxValueSchema.taxValue);
    expect(productTaxValue.product).toBeDefined();
    expect(productTaxValue.product.id).toBeDefined();
  });

  test("should create tax values for a catalog", async () => {
    const manager = getManager();
    const catalogInput = {
      name: chance.string(),
      catalogCode: chance.string({ length: 5 }),
      description: chance.string(),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string(),
      },
    };
    const application = null;

    const createdCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: {
          ...catalogInput,
        },
      },
      {
        injector: CatalogModule.injector,
      }
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
    };
    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createdCatalog.id,
      organizationId: user.organization.id,
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
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });

    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    const taxValueSchema = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createProductTaxValueForCatalog(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    expect(productTaxValue).toBeDefined();
    expect(productTaxValue.length).toBe(2);
    expect(productTaxValue[0].taxValue).toBe(taxValueSchema.taxValue);
  });

  test("should update tax values for a catalog", async () => {
    const manager = getManager();
    const catalogInput = {
      name: chance.string(),
      catalogCode: chance.string({ length: 5 }),
      description: chance.string(),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string(),
      },
    };
    const application = null;

    const createdCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: {
          ...catalogInput,
        },
      },
      {
        injector: CatalogModule.injector,
      }
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
    };
    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createdCatalog.id,
      organizationId: user.organization.id,
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
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });

    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    const taxValueSchema = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createProductTaxValueForCatalog(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    const updateTaxValueSchema = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const updateProductTaxValue = await productTaxValueProvider.updateProductTaxValueForCatalog(
      manager,
      { ...updateTaxValueSchema },
      user.organization.id
    );
    expect(updateProductTaxValue).toBeDefined();
    expect(updateProductTaxValue.length).toBe(2);
    expect(updateProductTaxValue[0].taxValue).toBe(
      updateTaxValueSchema.taxValue
    );
    expect(updateProductTaxValue[1].taxValue).toBe(
      updateTaxValueSchema.taxValue
    );
  });

  test("should remove tax values for a store format and channel", async () => {
    const manager = getManager();
    const catalogInput = {
      name: chance.string(),
      catalogCode: chance.string({ length: 5 }),
      description: chance.string(),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string(),
      },
    };
    const application = null;

    const createdCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: {
          ...catalogInput,
        },
      },
      {
        injector: CatalogModule.injector,
      }
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
    };
    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createdCatalog.id,
      organizationId: user.organization.id,
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
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });

    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    const taxValueSchema = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createProductTaxValueForCatalog(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    const updateTaxValueSchema = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const updateProductTaxValue = await productTaxValueProvider.updateProductTaxValueForCatalog(
      manager,
      { ...updateTaxValueSchema },
      user.organization.id
    );

    const removeProductTaxValues = await productTaxValueProvider.removeProductTaxValues(
      manager,
      {
        storeFormat: storeFormat.id,
        channel: channel.id,
        taxLevel: taxType.id,
      },
      user.organization.id
    );

    const getProductTaxValues: any = await productTaxValueProvider.getproductTaxTypeValues(
      manager,
      {
        storeFormat: storeFormat.id,
        channel: channel.id,
        taxLevel: taxType.id,
      },
      {
        page: 1,
        pageSize: 10,
      },
      user.organization.id
    );
    expect(removeProductTaxValues).toBeDefined();
    expect(removeProductTaxValues.length).toBeGreaterThan(0);
    expect(getProductTaxValues.data.length).toBe(0);
  });
  test("should link tax values for a product", async () => {
    const manager = getManager();
    const catalogInput = {
      name: chance.string(),
      catalogCode: chance.string({ length: 5 }),
      description: chance.string(),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.string(),
      },
    };
    const application = null;

    const createdCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: {
          ...catalogInput,
        },
      },
      {
        injector: CatalogModule.injector,
      }
    );
    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
    };
    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createdCatalog.id,
      organizationId: user.organization.id,
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
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    const taxValueSchema = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createProductTaxValueForCatalog(
      manager,
      { ...taxValueSchema },
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
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1,
    });
    const addProductTaxValueForProduct = await productTaxValueProvider.addProductTaxValuesForProduct(
      manager,
      { productId: product1.id },
      user.organization.id
    );
    const addedTaxValue = addProductTaxValueForProduct.filter((taxValue) => {
      return (
        taxValue.taxLevel.id === taxType.id &&
        taxValue.storeFormat.id === storeFormat.id
      );
    });
    expect(addedTaxValue).toBeDefined();
    expect(addedTaxValue.length).toBe(1);
    expect(addedTaxValue[0].taxValue).toBe(taxValueSchema.taxValue);
  });

  test("should create a tax value for a product with tax value 0", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    const taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: 0,
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    expect(productTaxValue).toBeDefined();
    expect(productTaxValue.taxValue).toBeDefined();
    expect(productTaxValue.taxValue).toBe(taxValueSchema.taxValue);
  });
  test("should Fail to create tax value for product ", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: product.id,
      storeFormat: chance.guid(),
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    try {
      const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
        manager,
        { ...taxValueSchema },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND)
      );
    }
  });

  test("should Fail to create tax value for invalid product ", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: chance.string(),
      storeFormat: chance.guid(),
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    try {
      const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
        manager,
        { ...taxValueSchema },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND)
      );
    }
  });

  test("should fail to create a tax value for a product with duplicate tax type,channel and store format", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    const taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );

    try {
      await productTaxValueProvider.createTaxValueForProduct(
        manager,
        { ...taxValueSchema },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_TAX_VALUE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Update a tax value for a product", () => {
  test("should Update a tax value for valid input", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    const updateTaxValue = chance.floating({ min: 1, max: 1000 });
    const updateProductTaxValue = await productTaxValueProvider.updateTaxValueForProduct(
      manager,
      {
        productTaxValueId: productTaxValue.id,
        taxValue: updateTaxValue,
      },
      user.organization.id
    );

    expect(updateProductTaxValue).toBeDefined();
    expect(updateProductTaxValue.id).toBe(productTaxValue.id);
    expect(updateProductTaxValue.taxValue).toBe(updateTaxValue);
  });

  test("should Update a tax value for valid input with tax value as 0", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    const taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    const updateTaxValue = 0;
    const updateProductTaxValue = await productTaxValueProvider.updateTaxValueForProduct(
      manager,
      {
        productTaxValueId: productTaxValue.id,
        taxValue: updateTaxValue,
      },
      user.organization.id
    );

    expect(updateProductTaxValue).toBeDefined();
    expect(updateProductTaxValue.id).toBe(productTaxValue.id);
    expect(updateProductTaxValue.taxValue).toBe(updateTaxValue);
  });
  test("should fail to update for a invalid value", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    const updateTaxValue = chance.floating({ min: 1, max: 1000 });
    try {
      const updateProductTaxValue = await productTaxValueProvider.updateTaxValueForProduct(
        manager,
        {
          productTaxValueId: chance.guid(),
          taxValue: updateTaxValue,
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_TAX_VALUE_NOT_FOUND)
      );
    }
  });
});

describe("Fetch product tax value", () => {
  test("should fetch tax value for valid input", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    const getTaxValue = await productTaxValueProvider.getproductTaxTypeValue(
      manager,
      {
        productTaxValueId: productTaxValue.id,
      },
      user.organization.id
    );

    expect(getTaxValue).toBeDefined();
    expect(getTaxValue.id).toBe(productTaxValue.id);
    expect(getTaxValue.taxValue).toBe(productTaxValue.taxValue);
  });

  test("should fetch tax value for valid input(productTaxValueId provided) product", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    const getTaxValue = await productTaxValueProvider.getproductTaxTypeValue(
      manager,
      {
        productTaxValueId: productTaxValue.id,
      },
      user.organization.id
    );

    expect(getTaxValue).toBeDefined();
    expect(getTaxValue.id).toBe(productTaxValue.id);
    expect(getTaxValue.taxValue).toBe(productTaxValue.taxValue);
  });

  test("should fetch tax value for valid input(productId, storeFormat, channel, taxLevel - all mandatory fields provided) product", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    const getTaxValue = await productTaxValueProvider.getproductTaxTypeValue(
      manager,
      {
        productId: product.id,
        storeFormat: storeFormat.id,
        channel: channel.id,
        taxLevel: taxType.id,
      },
      user.organization.id
    );

    expect(getTaxValue).toBeDefined();
    expect(getTaxValue.id).toBe(productTaxValue.id);
    expect(getTaxValue.taxValue).toBe(productTaxValue.taxValue);
  });

  test("should Fetch product Tax value for multiple products", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    const taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );
    const getTaxValue: any = await productTaxValueProvider.getproductTaxTypeValues(
      manager,
      {
        productTaxValueId: productTaxValue.id,
        storeFormat: storeFormat.id,
        channel: channel.id,
      },
      {
        page: 1,
        pageSize: 10,
      },
      user.organization.id
    );
    expect(getTaxValue).toBeDefined();
    expect(getTaxValue.data).toHaveLength(1);
  });

  test("should Failt to fetch product tax value for invalid input", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );

    try {
      const getTaxValue = await productTaxValueProvider.getproductTaxTypeValue(
        manager,
        {
          productTaxValueId: chance.guid(),
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_TAX_VALUE_NOT_FOUND)
      );
    }
  });

  test("should Fail to fetch product tax value for invalid input(tax level input missing)", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput,
    });
    // Create taxType
    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode],
    });

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 }),
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput,
      },
      user.organization.id
    );
    let taxValueSchema = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      taxLevel: taxType.id,
      taxValue: chance.floating({ min: 1, max: 1000 }),
    };
    const productTaxValue = await productTaxValueProvider.createTaxValueForProduct(
      manager,
      { ...taxValueSchema },
      user.organization.id
    );

    try {
      const getTaxValue = await productTaxValueProvider.getproductTaxTypeValue(
        manager,
        {
          productId: product.id,
          storeFormat: storeFormat.id,
          channel: channel.id,
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.INVALID_TAX_TYPE_VALUE_INPUT)
      );
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
