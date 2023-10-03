// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ProductPriceValueProvider } from "../productPriceValue.providers";
import { ProductPriceValueModule } from "../productPriceValue.module";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
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
import { TaxTypeProvider } from "../../taxtype/taxtype.providers";
let user: WCoreEntities.User;
let customerForCustomerDeviceTests: WCoreEntities.Customer;
var chance = new Chance();

const productPriceValueProvider: ProductPriceValueProvider = ProductPriceValueModule.injector.get(
  ProductPriceValueProvider
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

describe("Create Price Value", () => {
  test("should create price value for valid input", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    expect(productPriceValue).toBeDefined();
    expect(productPriceValue.id).toBeDefined();
    expect(productPriceValue.priceValue).toBe(
      createProductPriceValue.productPrice
    );
  });

  test("should update a valid product price value for multiple products", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });
    const product2Input = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product2 = await productProvider.createProduct(manager, {
      ...product2Input
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
    const channel1Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channel1Input
      },
      user.organization.id
    );

    const channel2Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel2 = await channelProvider.createChannel(
      manager,
      {
        ...channel2Input
      },
      user.organization.id
    );

    const product1Price = chance.floating({ min: 0, max: 1000 });
    const product2Price = chance.floating({ min: 0, max: 1000 });

    const productPriceValues = await productPriceValueProvider.createPriceValueForProducts(
      manager,
      [
        {
          productId: product.id,
          storeFormat: storeFormat.id,
          channel: channel.id,
          productPrice: product1Price
        },
        {
          productId: product2.id,
          storeFormat: storeFormat.id,
          channel: channel2.id,
          productPrice: product2Price
        }
      ],
      user.organization.id
    );
    const productIds = [product.id, product2.id];
    expect(productPriceValues).toBeDefined();
    expect(productPriceValues).toHaveLength(2);
  });

  test("should create price value for valid input of prive value 0", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: 0
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    expect(productPriceValue).toBeDefined();
    expect(productPriceValue.id).toBeDefined();
    expect(productPriceValue.priceValue).toBe(
      createProductPriceValue.productPrice
    );
  });

  test("should create price value for valid input of price 0 for multiple products", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };

    const manager = getManager();
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });
    const product2Input = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product2 = await productProvider.createProduct(manager, {
      ...product2Input
    });

    const taxType = await createCustomTaxType(manager);
    const storeFormat = await storeFormatProvider.createStoreFormat(manager, {
      description: chance.string(),
      name: chance.string(),
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      storeFormatCode: chance.string(),
      taxTypeCodes: [taxType.taxTypeCode]
    });
    const channel1Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channel1Input
      },
      user.organization.id
    );

    const channel2Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel2 = await channelProvider.createChannel(
      manager,
      {
        ...channel2Input
      },
      user.organization.id
    );

    const productPrice = 0;
    const productPriceValues = await productPriceValueProvider.createPriceValueForProducts(
      manager,
      [
        {
          productId: product.id,
          storeFormat: storeFormat.id,
          channel: channel.id,
          productPrice: productPrice
        },
        {
          productId: product2.id,
          storeFormat: storeFormat.id,
          channel: channel2.id,
          productPrice: productPrice
        }
      ],
      user.organization.id
    );
    const productIds = [product.id, product2.id];
    expect(productPriceValues).toBeDefined();
    expect(productPriceValues).toHaveLength(2);
    expect(productPriceValues[0].priceValue).toBe(productPrice);
    expect(productPriceValues[1].priceValue).toBe(productPrice);
  });

  test("should fail to create a product price value with invalid input", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: chance.guid(),
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    try {
      const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
        manager,
        { ...createProductPriceValue },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND));
    }
  });

  test("should FAIL to create price value for same channel,store format when adding multiple products", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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
    const channel1Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channel1Input
      },
      user.organization.id
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProducts(
      manager,
      [createProductPriceValue],
      user.organization.id
    );

    try {
      await productPriceValueProvider.createPriceValueForProducts(
        manager,
        [createProductPriceValue],
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_VALUE_ALREADY_EXISTS)
      );
    }
  });

  test("should fail to create a product price value multiple times for same channel and store format", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };

    await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    try {
      await productPriceValueProvider.createPriceValueForProduct(
        manager,
        { ...createProductPriceValue },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_VALUE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Update Product price value", () => {
  test("should update a valid product price value", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    const updatePrice = chance.floating({ min: 0, max: 1000 });
    const updateProductPriceValue = await productPriceValueProvider.updatePriceValueForProduct(
      manager,
      {
        productPriceValueId: productPriceValue.id,
        productPrice: updatePrice
      },
      user.organization.id
    );
    expect(updateProductPriceValue).toBeDefined();
    expect(updateProductPriceValue.priceValue).toBe(updatePrice);
  });
  test("should update a valid product price value with price value 0", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    const updatePrice = 0;
    const updateProductPriceValue = await productPriceValueProvider.updatePriceValueForProduct(
      manager,
      {
        productPriceValueId: productPriceValue.id,
        productPrice: updatePrice
      },
      user.organization.id
    );
    expect(updateProductPriceValue).toBeDefined();
    expect(updateProductPriceValue.priceValue).toBe(updatePrice);
  });
  test("should fail to update with invalid input", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    const updatePrice = chance.floating({ min: -100, max: -1 });

    try {
      const updateProductPriceValue = await productPriceValueProvider.updatePriceValueForProduct(
        manager,
        {
          productPriceValueId: productPriceValue.id,
          productPrice: updatePrice
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_INVALID));
    }
  });
});

describe("Fetch Product Price Value", () => {
  test("should Create product price value with valid input", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    const getProductPriceValue = await productPriceValueProvider.getproductPriceValue(
      manager,
      {
        productPriceValueId: productPriceValue.id
      },
      user.organization.id
    );

    expect(getProductPriceValue).toBeDefined();
    expect(getProductPriceValue.priceValue).toBe(productPriceValue.priceValue);
  });

  test("should fetch multiple product price", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    const getProductPriceValue = await productPriceValueProvider.getproductPriceValues(
      manager,
      {
        productPriceValueId: productPriceValue.id
      },
      {
        page: 1,
        pageSize: 10
      },
      user.organization.id
    );

    expect(getProductPriceValue).toBeDefined();
  });

  test("should fetch multiple product price for a product", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    const getProductPriceValue = await productPriceValueProvider.getproductPriceValue(
      manager,
      {
        productId: product.id
      },

      user.organization.id
    );

    expect(getProductPriceValue).toBeDefined();
    expect(getProductPriceValue.id).toBeDefined();
  });

  test("should remove product price value given an id", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    const removeProductPriceValues = await productPriceValueProvider.removeProductPriceValues(
      manager,
      {
        ids: [productPriceValue.id]
      },

      user.organization.id
    );

    expect(removeProductPriceValues).toBeDefined();
    expect(removeProductPriceValues[0].priceValue).toEqual(
      createProductPriceValue.productPrice
    );
  });

  test("should remove product price values given store format and channel", async () => {
    const productInput = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const manager = getManager();
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

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    const removeProductPriceValues = await productPriceValueProvider.removeProductPriceValuesByFilter(
      manager,
      {
        storeFormat: storeFormat.id,
        channel: channel.id
      },

      user.organization.id
    );

    expect(removeProductPriceValues).toBeDefined();
    expect(removeProductPriceValues.length).toBeGreaterThan(0);
    expect(removeProductPriceValues[0].priceValue).toEqual(
      createProductPriceValue.productPrice
    );
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
