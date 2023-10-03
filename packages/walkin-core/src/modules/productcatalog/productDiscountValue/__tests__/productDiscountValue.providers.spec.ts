// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ProductDiscountValueProvider } from "../productDiscountValue.providers";
import { ProductDiscountValueModule } from "../productDiscountValue.module";
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
import { DiscountTypeProvider } from "../../discountType/discountType.providers";
import { DiscountTypeModule } from "../../discountType/discountType.module";
let user: WCoreEntities.User;
const chance = new Chance();

const productDiscountValueProvider: ProductDiscountValueProvider = ProductDiscountValueModule.injector.get(
  ProductDiscountValueProvider
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

const discountTypeProvider: DiscountTypeProvider = DiscountTypeModule.injector.get(
  DiscountTypeProvider
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

describe("Create discount value", () => {
  test("should create discount value for valid input", async () => {
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

    const name = chance.string();
    const discountType = await discountTypeProvider.createDiscountType(
      manager,
      {
        name,
        discountTypeCode: chance.string()
      },
      user.organization.id
    );

    const channel = await channelProvider.createChannel(
      manager,
      {
        ...channelInput
      },
      user.organization.id
    );

    const createProductDiscountValue = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      discountValue: chance.floating({ min: 0, max: 1000 }),
      discountType: discountType.id
    };
    const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );

    expect(productDiscountValue).toBeDefined();
    expect(productDiscountValue.id).toBeDefined();
    expect(productDiscountValue.discountValue).toBe(
      createProductDiscountValue.discountValue
    );
  });

  test("should create discount value for valid input of prive value 0", async () => {
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
      discountValue: 0,
      discountType: discountType.id
    };
    const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );

    expect(productDiscountValue).toBeDefined();
    expect(productDiscountValue.id).toBeDefined();
    expect(productDiscountValue.discountValue).toBe(
      createProductDiscountValue.discountValue
    );
  });

  test("should fail to create a product discount value with invalid input", async () => {
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
      productId: chance.guid(),
      storeFormat: storeFormat.id,
      channel: channel.id,
      discountValue: chance.floating({ min: 0, max: 1000 }),
      discountType: discountType.id
    };
    try {
      const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
        manager,
        { ...createProductDiscountValue },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND));
    }
  });

  test("should fail to create a product discount value multiple times for same channel and store format", async () => {
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
      discountValue: chance.floating({ min: 0, max: 1000 }),
      discountType: discountType.id
    };

    await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );

    try {
      await productDiscountValueProvider.createDiscountValueForProduct(
        manager,
        { ...createProductDiscountValue },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_DISCOUNT_VALUE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Update product discount value", () => {
  test("should update a valid product discount value", async () => {
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
      discountValue: chance.floating({ min: 0, max: 1000 }),
      discountType: discountType.id
    };
    const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );

    const updatePrice = chance.floating({ min: 0, max: 1000 });
    const updateProductDiscountValue = await productDiscountValueProvider.updateDiscountValueForProduct(
      manager,
      {
        productDiscountValueId: productDiscountValue.id,
        discountValue: updatePrice
      },
      user.organization.id
    );
    expect(updateProductDiscountValue).toBeDefined();
    expect(updateProductDiscountValue.discountValue).toBe(updatePrice);
  });
  test("should update a valid product discount value with discount value 0", async () => {
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
      discountValue: chance.floating({ min: 0, max: 1000 }),
      discountType: discountType.id
    };
    const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );

    const updatePrice = 0;
    const updateProductDiscountValue = await productDiscountValueProvider.updateDiscountValueForProduct(
      manager,
      {
        productDiscountValueId: productDiscountValue.id,
        discountValue: updatePrice
      },
      user.organization.id
    );
    expect(updateProductDiscountValue).toBeDefined();
    expect(updateProductDiscountValue.discountValue).toBe(updatePrice);
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
      discountValue: chance.floating({ min: 0, max: 1000 }),
      discountType: discountType.id
    };
    const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );

    const updatePrice = chance.floating({ min: -100, max: -1 });

    try {
      const updateProductDiscountValue = await productDiscountValueProvider.updateDiscountValueForProduct(
        manager,
        {
          productDiscountValueId: productDiscountValue.id,
          discountValue: updatePrice
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_DISCOUNT_INVALID)
      );
    }
  });
});

describe("Fetch product discount Value", () => {
  test("should Create product discount value with valid input", async () => {
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
      discountValue: chance.floating({ min: 0, max: 1000 }),
      discountType: discountType.id
    };
    const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );

    const getProductDiscountValue = await productDiscountValueProvider.getproductDiscountValue(
      manager,
      {
        productDiscountValueId: productDiscountValue.id
      },
      user.organization.id
    );

    expect(getProductDiscountValue).toBeDefined();
    expect(getProductDiscountValue.discountValue).toBe(
      productDiscountValue.discountValue
    );
  });

  test("should fetch multiple product discount", async () => {
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
      discountValue: chance.floating({ min: 0, max: 1000 }),
      discountType: discountType.id
    };
    const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );

    const getProductDiscountValue = await productDiscountValueProvider.getproductDiscountValues(
      manager,
      {
        productDiscountValueId: productDiscountValue.id
      },
      {
        page: 1,
        pageSize: 10
      },
      user.organization.id
    );

    expect(getProductDiscountValue).toBeDefined();
  });

  test("should fetch multiple product discount for a product", async () => {
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
      discountValue: chance.floating({ min: 0, max: 1000 }),
      discountType: discountType.id
    };
    const productDiscountValue = await productDiscountValueProvider.createDiscountValueForProduct(
      manager,
      { ...createProductDiscountValue },
      user.organization.id
    );

    const getProductDiscountValue = await productDiscountValueProvider.getproductDiscountValue(
      manager,
      {
        productId: product.id
      },

      user.organization.id
    );

    expect(getProductDiscountValue).toBeDefined();
    expect(getProductDiscountValue.id).toBeDefined();
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
