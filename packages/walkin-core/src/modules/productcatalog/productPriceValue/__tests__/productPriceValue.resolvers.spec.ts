// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ProductPriceValueProvider } from "../productPriceValue.providers";
import { ProductPriceValueModule } from "../productPriceValue.module";
import { resolvers as productPriceValueResolvers } from "../productPriceValue.resolvers";
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
import * as productResolver from "../../product/product.resolvers";
import { ChannelProvider } from "../../channel/channel.providers";
import { ChannelModule } from "../../channel/channel.module";
import { resolvers as channelResolvers } from "../../channel/channel.resolvers";
import { ChargeTypeProvider } from "../../chargeType/chargeType.providers";
import { ChargeModule } from "../../chargeType/chargeType.module";
import { resolvers as chargeTypeResolvers } from "../../chargeType/chargeType.resolvers";
import { StoreFormatModule } from "../../storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../storeformat/storeFormat.providers";
import * as storeFormatResovers from "../../storeformat/storeFormat.resolvers";
import { TaxTypeModule } from "../../taxtype/taxtype.module";
import { TaxTypeProvider } from "../../taxtype/taxtype.providers";
import * as taxTypeResolvers from "../../taxtype/taxtype.resolvers";
let user: WCoreEntities.User;

const chance = new Chance();

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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );

    expect(productPriceValue).toBeDefined();
    expect(productPriceValue.id).toBeDefined();
    expect(productPriceValue.priceValue).toBe(
      createProductPriceValue.productPrice
    );
  });

  test("should create valid product price values for multiple products", async () => {
    const productInput = {
      name: "testchance.string()",
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );
    const channel2Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel2 = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channel2Input }
      },
      { injector: ChannelModule.injector }
    );

    const product1Price = chance.floating({ min: 0, max: 1000 });
    const product2Price = chance.floating({ min: 0, max: 1000 });

    const productPriceValues = await productPriceValueResolvers.Mutation.createPriceValueForProducts(
      { user },
      { input: [
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
      ] },
      { injector: ProductPriceValueModule.injector }
    );

    const productIds = [product.id, product2.id];
    expect(productPriceValues).toBeDefined();
    expect(productPriceValues).toHaveLength(2);
    expect(productIds).toContain(productPriceValues[0].product.id);
    expect(productIds).toContain(productPriceValues[1].product.id);
  });

  test("should fail to create multiple products price value with invalid input", async () => {
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );
    
    const channel2Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel2 = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channel2Input }
      },
      { injector: ChannelModule.injector }
    );

    const product1Price = chance.floating({ min: 0, max: 1000 });
    const product2Price = chance.floating({ min: 0, max: 1000 });
    try {
      const productPriceValues = await productPriceValueResolvers.Mutation.createPriceValueForProducts(
        { user },
        { input: [
          {
            productId: chance.guid(),
            storeFormat: storeFormat.id,
            channel: channel.id,
            productPrice: product1Price
          },
          {
            productId: chance.guid(),
            storeFormat: storeFormat.id,
            channel: channel2.id,
            productPrice: product2Price
          }
        ] },
        { injector: ProductPriceValueModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND));
    }
  });

  test("should create price value for valid input of price 0", async () => {
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: 0
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );
    const channel2Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel2 = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channel2Input }
      },
      { injector: ChannelModule.injector }
    );

    const productPrice = 0;
    const productPriceValues = await productPriceValueResolvers.Mutation.createPriceValueForProducts(
      { user },
      { input: [
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
      ] },
      { injector: ProductPriceValueModule.injector }
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: chance.guid(),
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    try {
      const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
        { user },
        { input: { ...createProductPriceValue } },
        { injector: ProductPriceValueModule.injector }
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProducts(
      { user },
      { input: [createProductPriceValue] },
      { injector: ProductPriceValueModule.injector }
    );

    try {
      await productPriceValueResolvers.Mutation.createPriceValueForProducts(
        { user },
        { input: [createProductPriceValue] },
        { injector: ProductPriceValueModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_VALUE_ALREADY_EXISTS)
      );
    }
  });

  test("should FAIL to create price value for same channel,store format", async () => {
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );

    try {
      await productPriceValueResolvers.Mutation.createPriceValueForProduct(
        { user },
        { input: { ...createProductPriceValue } },
        { injector: ProductPriceValueModule.injector }
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );

    const updatePrice = chance.floating({ min: 0, max: 1000 });
    const updateProductPriceValue = await productPriceValueResolvers.Mutation.updatePriceValueForProduct(
      { user },
      {
        input: {
          productPriceValueId: productPriceValue.id,
          productPrice: updatePrice
        }
      },
      { injector: ProductPriceValueModule.injector }
    );
    expect(updateProductPriceValue).toBeDefined();
    expect(updateProductPriceValue.priceValue).toBe(updatePrice);
  });
  test("should update a valid product price value of  price 0", async () => {
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );

    const updatePrice = 0;
    const updateProductPriceValue = await productPriceValueResolvers.Mutation.updatePriceValueForProduct(
      { user },
      {
        input: {
          productPriceValueId: productPriceValue.id,
          productPrice: updatePrice
        }
      },
      { injector: ProductPriceValueModule.injector }
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );

    const updatePrice = chance.floating({ min: -100, max: -1 });
    try {
      const updateProductPriceValue = await productPriceValueResolvers.Mutation.updatePriceValueForProduct(
        { user },
        {
          input: {
            productPriceValueId: productPriceValue.id,
            productPrice: updatePrice
          }
        },
        { injector: ProductPriceValueModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_INVALID));
    }
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );
    const channel2Input = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel2 = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channel2Input }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const createProduct2PriceValue = {
      productId: product2.id,
      storeFormat: storeFormat.id,
      channel: channel2.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );
    const productPriceValue2 = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProduct2PriceValue } },
      { injector: ProductPriceValueModule.injector }
    );

    const updatePrice = chance.floating({ min: 0, max: 1000 });
    const updatePrice2 = chance.floating({ min: 0, max: 1000 });
    const updateProductPriceValue = await productPriceValueResolvers.Mutation.updatePriceValueForProducts(
      { user },
      {
        input: [
          {
            productPriceValueId: productPriceValue.id,
            productPrice: updatePrice
          },
          {
            productPriceValueId: productPriceValue2.id,
            productPrice: updatePrice2
          }
        ]
      },
      { injector: ProductPriceValueModule.injector }
    );
    const priceArray = [updatePrice, updatePrice2];
    expect(updateProductPriceValue).toBeDefined();
    expect(updateProductPriceValue).toHaveLength(2);
    expect(priceArray).toContain(updateProductPriceValue[0].priceValue);
    expect(priceArray).toContain(updateProductPriceValue[1].priceValue);
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );

    const updatePrice = chance.floating({ min: -100, max: -1 });
    try {
      const updateProductPriceValue = await productPriceValueResolvers.Mutation.updatePriceValueForProducts(
        { user },
        {
          input: [
            {
              productPriceValueId: productPriceValue.id,
              productPrice: updatePrice
            }
          ]
        },
        { injector: ProductPriceValueModule.injector }
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );

    const getProductPriceValue = await productPriceValueResolvers.Query.productPriceValue(
      { user },
      {
        filter: { productPriceValueId: productPriceValue.id }
      },
      { injector: ProductPriceValueModule.injector }
    );

    expect(getProductPriceValue).toBeDefined();
    expect(getProductPriceValue.priceValue).toBe(productPriceValue.priceValue);
  });

  test("should fetch multiple feedback form", async () => {
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
    const storeFormat = await storeFormatResovers.default.Mutation.createStoreFormat(
      { user },
      {
        input: {
          description: chance.string(),
          name: chance.string(),
          organizationId: user.organization.id,
          status: STATUS.ACTIVE,
          storeFormatCode: chance.string(),
          taxTypeCodes: [taxType.taxTypeCode]
        }
      },
      { injector: StoreFormatModule.injector }
    );

    const channelInput = {
      name: chance.string({ length: 5 }),
      channelCode: chance.string({ length: 5 })
    };

    const channel = await channelResolvers.Mutation.createChannel(
      { user },
      {
        input: { ...channelInput }
      },
      { injector: ChannelModule.injector }
    );

    const createProductPriceValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueResolvers.Mutation.createPriceValueForProduct(
      { user },
      { input: { ...createProductPriceValue } },
      { injector: ProductPriceValueModule.injector }
    );

    const getProductPriceValue = await productPriceValueResolvers.Query.productPriceValues(
      { user },
      {
        filter: {
          productPriceValueId: productPriceValue.id
        },
        pageOptions: {
          page: 1,
          pageSize: 10
        }
      },
      { injector: ProductPriceValueModule.injector }
    );

    expect(getProductPriceValue).toBeDefined();
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
