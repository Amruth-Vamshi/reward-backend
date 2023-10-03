// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ProductChargeValueProvider } from "../productChargeValue.providers";
import { ProductChargeValueModule } from "../productChargeValue.module";
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
import { CatalogModule } from "../../catalog/catalog.module";
import resolvers from "../../catalog/catalog.resolvers";
import { CategoryModule } from "../../category/category.module";
import { CategoryProvider } from "../../category/category.providers";
let user: WCoreEntities.User;
let customerForCustomerDeviceTests: WCoreEntities.Customer;
const chance = new Chance();

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

const taxTypeProvider: TaxTypeProvider = TaxTypeModule.injector.get(
  TaxTypeProvider
);

const categoryService: CategoryProvider = CategoryModule.injector.get(
  CategoryProvider
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

describe("Should Create Charge Value", () => {
  test("create a charge type for a valid input", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );
    expect(chargeValue.chargeValue).toBe(chargeValueInput.chargeValue);
    expect(chargeValue.product.id).toBe(chargeValueInput.productId);
    expect(chargeValue.channel.id).toBe(chargeValueInput.channel);
    expect(chargeValue.storeFormat.id).toBe(chargeValueInput.storeFormat);
  });

  test("create a charge type for a valid input for multiple products", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProducts(
      manager,
      [chargeValueInput],
      user.organization.id
    );
    expect(chargeValue[0].chargeValue).toBe(chargeValueInput.chargeValue);
    expect(chargeValue[0].product.id).toBe(chargeValueInput.productId);
    expect(chargeValue[0].channel.id).toBe(chargeValueInput.channel);
    expect(chargeValue[0].storeFormat.id).toBe(chargeValueInput.storeFormat);
  });

  test("create  charges value for a catalog", async () => {
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
      sku: chance.string()
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });

    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1
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

    expect(chargeValue).toBeDefined();
    expect(chargeValue.length).toBe(2);
    expect(chargeValue[0].chargeValue).toBe(chargeValueInput.chargeValue);
  });

  test("remove  charges values for a store format and channel", async () => {
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
      sku: chance.string()
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });

    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1
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

    const removeChargeValues = await productChargeValueProvider.removeProductChargeValues(
      manager,
      {
        storeFormat: storeFormat.id,
        channel: channel.id,
        chargeType: chargeType.id
      },
      user.organization.id
    );

    const getChargeValues: any = await productChargeValueProvider.getproductChargeValues(
      manager,
      {
        storeFormat: storeFormat.id,
        channel: channel.id,
        chargeType: chargeType.id
      },
      {
        page: 1,
        pageSize: 10
      },
      user.organization.id
    );
    expect(removeChargeValues).toBeDefined();
    expect(removeChargeValues.length).toBeGreaterThan(0);
    expect(getChargeValues.data.length).toBe(0);
  });

  test("update  charges value for a catalog", async () => {
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
      sku: chance.string()
    };
    const product = await productProvider.createProduct(manager, {
      ...productInput
    });

    const productInput1 = {
      name: chance.string(),
      description: chance.string(),
      code: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1
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
    const updateChargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const updateChargeValue = await productChargeValueProvider.updateProductChargeForCatalog(
      manager,
      {
        ...updateChargeValueInput
      },
      user.organization.id
    );

    expect(updateChargeValue).toBeDefined();
    expect(updateChargeValue.length).toBe(2);
    expect(updateChargeValue[0].chargeValue).toBe(
      updateChargeValueInput.chargeValue
    );
  });

  test("link a product to charges values similar to existing ones", async () => {
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
      sku: chance.string()
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
      sku: chance.string()
    };
    const product1 = await productProvider.createProduct(manager, {
      ...productInput1
    });
    const chargeValueForProduct = await productChargeValueProvider.addProductChargeValuesForProduct(
      manager,
      {
        productId: product1.id
      },
      user.organization.id
    );
    const addChargeValue = chargeValueForProduct.filter(chargeValue => {
      return (
        chargeValue.chargeType.id === chargeType.id &&
        chargeValue.storeFormat.id === storeFormat.id
      );
    });
    expect(addChargeValue).toBeDefined();
    expect(addChargeValue[0].chargeValue).toBe(chargeValueInput.chargeValue);
  });
  test("create a charge value for a charge value of 0", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: 0
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );
    expect(chargeValue.chargeValue).toBe(chargeValueInput.chargeValue);
    expect(chargeValue.product.id).toBe(chargeValueInput.productId);
    expect(chargeValue.channel.id).toBe(chargeValueInput.channel);
    expect(chargeValue.storeFormat.id).toBe(chargeValueInput.storeFormat);
  });

  test("create a charge value for a charge value of 0 when creating multiple products", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: 0
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProducts(
      manager,
      [chargeValueInput],
      user.organization.id
    );
    expect(chargeValue[0].chargeValue).toBe(chargeValueInput.chargeValue);
    expect(chargeValue[0].product.id).toBe(chargeValueInput.productId);
    expect(chargeValue[0].channel.id).toBe(chargeValueInput.channel);
    expect(chargeValue[0].storeFormat.id).toBe(chargeValueInput.storeFormat);
  });

  test("Fail to create a charge type with invalid input", async () => {
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
      status: "ACTIVE",
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

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chance.guid,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
        manager,
        {
          ...chargeValueInput
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND));
    }
  });

  test("Fail to create a charge type with invalid product", async () => {
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
      status: "ACTIVE",
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

    const chargeValueInput = {
      productId: chance.string(),
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chance.guid,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      await productChargeValueProvider.createChargeValueForProduct(
        manager,
        {
          ...chargeValueInput
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND));
    }
  });

  test("Fail to create a charge type with invalid input for multiple products", async () => {
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
      status: "ACTIVE",
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

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chance.guid(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      await productChargeValueProvider.createChargeValueForProducts(
        manager,
        [chargeValueInput],
        user.organization.id
      );
    } catch (error) {
      const invalidChargeTypeError = WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND;
      invalidChargeTypeError.MESSAGE = `Charge Type: ${chargeValueInput.chargeType} not found`;
      expect(error).toEqual(new WCoreError(invalidChargeTypeError));
    }
  });

  test("SHOULD FAIL to create a charge type for same charge type, channel and storeformat", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );

    try {
      await productChargeValueProvider.createChargeValueForProduct(
        manager,
        {
          ...chargeValueInput
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_ALREADY_EXISTS)
      );
    }
  });

  test("SHOULD FAIL to create a charge type for same charge type, channel and storeformat when creating multiple products", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProducts(
      manager,
      [chargeValueInput],
      user.organization.id
    );

    try {
      await productChargeValueProvider.createChargeValueForProducts(
        manager,
        [chargeValueInput],
        user.organization.id
      );
    } catch (error) {
      const errorChargeValueExists =
        WCORE_ERRORS.PRODUCT_CHARGE_VALUE_ALREADY_EXISTS;
      errorChargeValueExists.MESSAGE = `Charge value already exists for Product: ${product.id}`;
      expect(error).toEqual(new WCoreError(errorChargeValueExists));
    }
  });
});

describe("Update a charge value", () => {
  test("should be able to update a charge value for valid input", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );

    const updateChargeValueInput = {
      productChargeValueId: chargeValue.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const updateChargeValue = await productChargeValueProvider.updateChargeValueForProduct(
      manager,
      { ...updateChargeValueInput },
      user.organization.id
    );

    expect(updateChargeValue.chargeValue).toBe(
      updateChargeValueInput.chargeValue
    );
  });

  test("should be able to update a charge value for valid input of charge value 0", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );

    const updateChargeValueInput = {
      productChargeValueId: chargeValue.id,
      chargeValue: 0
    };
    const updateChargeValue = await productChargeValueProvider.updateChargeValueForProduct(
      manager,
      { ...updateChargeValueInput },
      user.organization.id
    );

    expect(updateChargeValue.chargeValue).toBe(
      updateChargeValueInput.chargeValue
    );
  });
  test("should Fail to udpate with invalid input", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );

    const updateChargeValueInput = {
      productChargeValueId: chance.guid(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      const updateChargeValue = await productChargeValueProvider.updateChargeValueForProduct(
        manager,
        { ...updateChargeValueInput },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_NOT_FOUND)
      );
    }
  });
});

describe("Fetch Charge Type Value", () => {
  test("should Fetch Charge Type value for valid input", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );
    const getChargeTypeValue = await productChargeValueProvider.getproductChargeValue(
      manager,
      {
        productChargeValueId: chargeValue.id,
        storeFormat: storeFormat.id,
        channel: channel.id
      },
      user.organization.id
    );
    console.log("getChargeTypeValue", getChargeTypeValue);
    expect(getChargeTypeValue).toBeDefined();
    expect(getChargeTypeValue.id).toBe(chargeValue.id);
    expect(getChargeTypeValue.chargeValue).toBe(chargeValue.chargeValue);
  });

  test("should Fail to fetch for an invalid input", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );

    try {
      const getChargeTypeValue = await productChargeValueProvider.getproductChargeValue(
        manager,
        {
          productChargeValueId: chargeValue.id,
          storeFormat: storeFormat.id,
          channel: chance.guid()
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_NOT_FOUND)
      );
    }
  });

  test("should Be able to fetch product charge value for multiple products", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );

    const getChargeValues: any = await productChargeValueProvider.getproductChargeValues(
      manager,
      {
        productChargeValueId: chargeValue.id,
        storeFormat: storeFormat.id,
        channel: channel.id
      },
      {
        page: 1,
        pageSize: 10
      },
      user.organization.id
    );

    expect(getChargeValues).toBeDefined();
    expect(getChargeValues.data).toBeDefined();
  });

  test("should Be able to fetch product charge value for  product", async () => {
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

    const chargeType = await chargeTypeProvider.createChargeType(
      manager,
      {
        name: chance.string(),
        chargeTypeCode: chance.string()
      },
      user.organization.id
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueProvider.createChargeValueForProduct(
      manager,
      {
        ...chargeValueInput
      },
      user.organization.id
    );

    const getChargeValue = await productChargeValueProvider.getproductChargeValue(
      manager,
      {
        productChargeValueId: chargeValue.id
      },

      user.organization.id
    );

    expect(getChargeValue).toBeDefined();
    expect(getChargeValue.id).toBeDefined();
  });

  test("Should FAIL to create charge value for products with invalid productId and display error with productId", async () => {
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
      status: "ACTIVE",
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

    const chargeValueInput = {
      productId: chance.guid(),
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chance.guid(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      await productChargeValueProvider.createChargeValueForProducts(
        manager,
        [chargeValueInput],
        user.organization.id
      );
    } catch (error) {
      const productNotFoundError = WCORE_ERRORS.PRODUCT_NOT_FOUND;
      productNotFoundError.MESSAGE = `Product: ${chargeValueInput.productId} not found`;
      expect(error).toEqual(new WCoreError(productNotFoundError));
    }
  });

  test("Should FAIL to create charge value for products with invalid chargeValue and display error with productId", async () => {
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
      status: "ACTIVE",
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

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chance.guid(),
      chargeValue: -1
    };
    try {
      await productChargeValueProvider.createChargeValueForProducts(
        manager,
        [chargeValueInput],
        user.organization.id
      );
    } catch (error) {
      const invalidChargeValueError = WCORE_ERRORS.CHARGE_VALUE_INVALID;
      invalidChargeValueError.MESSAGE = `Charge Value cannot be less than 0 for Product: ${chargeValueInput.productId}`;
      expect(error).toEqual(new WCoreError(invalidChargeValueError));
    }
  });

  test("Should FAIL to create charge value for products with invalid store format and display error with storeFormatId", async () => {
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
      status: "ACTIVE",
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

    const chargeValueInput = {
      productId: product.id,
      storeFormat: chance.string(),
      channel: channel.id,
      chargeType: chance.guid(),
      chargeValue: 100
    };
    try {
      await productChargeValueProvider.createChargeValueForProducts(
        manager,
        [chargeValueInput],
        user.organization.id
      );
    } catch (error) {
      const invalidStoreFormatError = WCORE_ERRORS.STORE_FORMAT_NOT_FOUND;
      invalidStoreFormatError.MESSAGE = `Store Format: ${chargeValueInput.storeFormat} not found`;
      expect(error).toEqual(new WCoreError(invalidStoreFormatError));
    }
  });

  test("Should FAIL to create charge value for products with invalid channel and display error with channeltId", async () => {
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
      status: "ACTIVE",
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
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: chance.string(),
      chargeType: chargeType.id,
      chargeValue: 100
    };
    try {
      await productChargeValueProvider.createChargeValueForProducts(
        manager,
        [chargeValueInput],
        user.organization.id
      );
    } catch (error) {
      const invalidChannelError = WCORE_ERRORS.CHANNEL_NOT_FOUND;
      invalidChannelError.MESSAGE = `Channel: ${chargeValueInput.channel} not found`;
      expect(error).toEqual(new WCoreError(invalidChannelError));
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
