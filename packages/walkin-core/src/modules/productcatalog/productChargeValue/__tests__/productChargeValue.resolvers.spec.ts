// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { ProductChargeValueProvider } from "../productChargeValue.providers";
import { resolvers as productChargeValueResolvers } from "../productChargeValue.resolvers";
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
import { CatalogModule } from "../../catalog/catalog.module";
import resolvers from "../../catalog/catalog.resolvers";
import { CategoryModule } from "../../category/category.module";
import { CategoryProvider } from "../../category/category.providers";
import * as taxTypeResolvers from "../../taxtype/taxtype.resolvers";
import { chargeValueLoader } from "../productCharge.loader";
let user: WCoreEntities.User;
let customerForCustomerDeviceTests: WCoreEntities.Customer;
var chance = new Chance();

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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProducts(
      { user },
      {
        input: [chargeValueInput]
      },
      { injector: ProductChargeValueModule.injector }
    );
    expect(chargeValue[0].chargeValue).toBe(chargeValueInput.chargeValue);
    expect(chargeValue[0].product.id).toBe(chargeValueInput.productId);
    expect(chargeValue[0].channel.id).toBe(chargeValueInput.channel);
    expect(chargeValue[0].storeFormat.id).toBe(chargeValueInput.storeFormat);
  });

  test("create  charge values for a catalog", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createProductChargeValueForCatalog(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    expect(chargeValue).toBeDefined();
    expect(chargeValue.length).toBe(2);
    expect(chargeValue[0].chargeValue).toBe(chargeValueInput.chargeValue);
  });

  test("create  charge values for a catalog", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createProductChargeValueForCatalog(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const removeChargeValues = await productChargeValueResolvers.Mutation.removeProductChargeValues(
      { user },
      {
        input: {
          storeFormat: storeFormat.id,
          channel: channel.id,
          chargeType: chargeType.id
        }
      },
      { injector: ProductChargeValueModule.injector }
    );

    const getChargeValues: any = await productChargeValueResolvers.Query.productChargeValues(
      { user },
      {
        filter: {
          storeFormat: storeFormat.id,
          channel: channel.id,
          chargeType: chargeType.id
        },
        pageOptions: {
          page: 1,
          pageSize: 10
        },
        organizationId: user.organization.id
      },
      { injector: ProductChargeValueModule.injector }
    );
    expect(removeChargeValues).toBeDefined();
    expect(removeChargeValues.length).toBeGreaterThan(0);
    expect(getChargeValues.data.length).toBe(0);
  });

  test("update  charge values for a catalog", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createProductChargeValueForCatalog(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );

    const updateChargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const updateChargeValue = await productChargeValueResolvers.Mutation.updateProductChargeForCatalog(
      { user },
      {
        input: { ...updateChargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    expect(updateChargeValue).toBeDefined();
    expect(updateChargeValue.length).toBe(2);
    expect(updateChargeValue[0].chargeValue).toBe(
      updateChargeValueInput.chargeValue
    );
  });

  test("link  charge values to a product", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createProductChargeValueForCatalog(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
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
    const chargeValueForProduct = await productChargeValueResolvers.Mutation.linkChargeValuesForProduct(
      { user },
      {
        input: { productId: product1.id }
      },
      { injector: ProductChargeValueModule.injector }
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

  test("create a charge type for a valid input of charge value 0", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: 0
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    expect(chargeValue.chargeValue).toBe(chargeValueInput.chargeValue);
    expect(chargeValue.product.id).toBe(chargeValueInput.productId);
    expect(chargeValue.channel.id).toBe(chargeValueInput.channel);
    expect(chargeValue.storeFormat.id).toBe(chargeValueInput.storeFormat);
  });

  test("create a charge type for a valid input of charge value 0 for multiple products", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: 0
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProducts(
      { user },
      {
        input: [chargeValueInput]
      },
      { injector: ProductChargeValueModule.injector }
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chance.guid(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
        { user },
        {
          input: { ...chargeValueInput }
        },
        { injector: ProductChargeValueModule.injector }
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: chance.string(),
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chance.guid(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
        { user },
        {
          input: { ...chargeValueInput }
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND));
    }
  });

  test("Fail to create a charge type with invalid inputs for multiple products", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chance.guid(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      await productChargeValueResolvers.Mutation.createChargeValueForProducts(
        { user },
        {
          input: [chargeValueInput]
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      const invalidChargeTypeError = WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND;
      invalidChargeTypeError.MESSAGE = `Charge Type: ${chargeValueInput.chargeType} not found`;
      expect(error).toEqual(new WCoreError(invalidChargeTypeError));
    }
  });

  test("Fail to create a charge type with invalid productId for multiple products with product id in error message", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: chance.string(),
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      await productChargeValueResolvers.Mutation.createChargeValueForProducts(
        { user },
        {
          input: [chargeValueInput]
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      const productNotFoundError = WCORE_ERRORS.PRODUCT_NOT_FOUND;
      productNotFoundError.MESSAGE = `Product: ${chargeValueInput.productId} not found`;
      expect(error).toEqual(new WCoreError(productNotFoundError));
    }
  });

  test("Fail to create a charge type with invalid channelId for multiple products with channel id in error message", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: chance.string(),
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      await productChargeValueResolvers.Mutation.createChargeValueForProducts(
        { user },
        {
          input: [chargeValueInput]
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      const invalidChannelError = WCORE_ERRORS.CHANNEL_NOT_FOUND;
      invalidChannelError.MESSAGE = `Channel: ${chargeValueInput.channel} not found`;
      expect(error).toEqual(new WCoreError(invalidChannelError));
    }
  });

  test("Fail to create a charge type with invalid chargeType for multiple products with chargeType id in error message", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chance.string(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      await productChargeValueResolvers.Mutation.createChargeValueForProducts(
        { user },
        {
          input: [chargeValueInput]
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      const invalidChargeTypeError = WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND;
      invalidChargeTypeError.MESSAGE = `Charge Type: ${chargeValueInput.chargeType} not found`;
      expect(error).toEqual(new WCoreError(invalidChargeTypeError));
    }
  });

  test("Fail to create a charge type with invalid storeFormat for multiple products with storeFormat id in error message", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: chance.string(),
      channel: channel.id,
      chargeType: chance.string(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      await productChargeValueResolvers.Mutation.createChargeValueForProducts(
        { user },
        {
          input: [chargeValueInput]
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      const invalidStoreFormatError = WCORE_ERRORS.STORE_FORMAT_NOT_FOUND;
      invalidStoreFormatError.MESSAGE = `Store Format: ${chargeValueInput.storeFormat} not found`;
      expect(error).toEqual(new WCoreError(invalidStoreFormatError));
    }
  });

  test("Fail to create a charge type with invalid chargeValue for multiple products with product id in error message", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: chance.string(),
      channel: channel.id,
      chargeType: chance.string(),
      chargeValue: -1
    };
    try {
      await productChargeValueResolvers.Mutation.createChargeValueForProducts(
        { user },
        {
          input: [chargeValueInput]
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      const invalidChargeValueError = WCORE_ERRORS.CHARGE_VALUE_INVALID;
      invalidChargeValueError.MESSAGE = `Charge Value cannot be less than 0 for Product: ${chargeValueInput.productId}`;
      expect(error).toEqual(new WCoreError(invalidChargeValueError));
    }
  });

  test("Should fail to create a charge type for duplicate charge type,channel,store format and product", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    try {
      await productChargeValueResolvers.Mutation.createChargeValueForProduct(
        { user },
        {
          input: { ...chargeValueInput }
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_ALREADY_EXISTS)
      );
    }
  });

  test("Should fail to create a charge type for duplicate charge type,channel,store format and product when creating multiple products", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProducts(
      { user },
      {
        input: [chargeValueInput]
      },
      { injector: ProductChargeValueModule.injector }
    );
    try {
      await productChargeValueResolvers.Mutation.createChargeValueForProducts(
        { user },
        {
          input: [chargeValueInput]
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      const errorChargeValueExists =
        WCORE_ERRORS.PRODUCT_CHARGE_VALUE_ALREADY_EXISTS;
      errorChargeValueExists.MESSAGE = `Charge value already exists for Product: ${product.id}`;
      expect(error).toEqual(new WCoreError(errorChargeValueExists));
    }
  });

  test("get products from chargeValue", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      catalogId: createdCatalog.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createProductChargeValueForCatalog(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
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
    const chargeValueForProduct = await productChargeValueResolvers.Mutation.linkChargeValuesForProduct(
      { user },
      {
        input: { productId: product1.id }
      },
      { injector: ProductChargeValueModule.injector }
    );

    const addChargeValue = chargeValueForProduct.filter(chargeValue => {
      return (
        chargeValue.chargeType.id === chargeType.id &&
        chargeValue.storeFormat.id === storeFormat.id
      );
    });

    const loader = chargeValueLoader();

    const products = await productChargeValueResolvers.ProductValue.product(
      chargeValueForProduct[0],
      {},
      { chargeValueLoader: loader }
    );
    expect(addChargeValue).toBeDefined();
    expect(addChargeValue[0].chargeValue).toBe(chargeValueInput.chargeValue);
    expect(products).toBeDefined();
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const updateChargeValueInput = {
      productChargeValueId: chargeValue.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const updateChargeValue = await productChargeValueResolvers.Mutation.updateChargeValueForProduct(
      { user },
      { input: { ...updateChargeValueInput } },
      { injector: ProductChargeValueModule.injector }
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const updateChargeValueInput = {
      productChargeValueId: chargeValue.id,
      chargeValue: 0
    };
    const updateChargeValue = await productChargeValueResolvers.Mutation.updateChargeValueForProduct(
      { user },
      { input: { ...updateChargeValueInput } },
      { injector: ProductChargeValueModule.injector }
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const updateChargeValueInput = {
      productChargeValueId: chance.guid(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      const updateChargeValue = await productChargeValueResolvers.Mutation.updateChargeValueForProduct(
        { user },
        { input: { ...updateChargeValueInput } },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_NOT_FOUND)
      );
    }
  });
  test("should be able to update a charge value for multiple product items", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const updateChargeValueInput = {
      productChargeValueId: chargeValue.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const updateChargeValue = await productChargeValueResolvers.Mutation.updateChargeValueForProducts(
      { user },
      { input: [{ ...updateChargeValueInput }] },
      { injector: ProductChargeValueModule.injector }
    );

    expect(updateChargeValue[0].chargeValue).toBe(
      updateChargeValueInput.chargeValue
    );
  });
  test("should Fail to udpate for multiple products with invalid input", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const updateChargeValueInput = {
      productChargeValueId: chance.guid(),
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    try {
      const updateChargeValues = await productChargeValueResolvers.Mutation.updateChargeValueForProducts(
        { user },
        { input: [{ ...updateChargeValueInput }] },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_NOT_FOUND)
      );
    }
  });
});

describe("Fetch Charge Type Value", () => {
  test("should Fetch Charge Type value for valid input(chargeValueId provided)", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const getChargeTypeValue = await productChargeValueResolvers.Query.productChargeValue(
      { user },
      {
        filter: {
          productChargeValueId: chargeValue.id
        }
      },
      { injector: ProductChargeValueModule.injector }
    );
    expect(getChargeTypeValue).toBeDefined();
    expect(getChargeTypeValue.id).toBe(chargeValue.id);
    expect(getChargeTypeValue.chargeValue).toBe(chargeValue.chargeValue);
  });

  test("should Fetch Charge Type value for valid input(all params(productId, storeFormat, channel, chargeType) provided)", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );
    const getChargeTypeValue = await productChargeValueResolvers.Query.productChargeValue(
      { user },
      {
        filter: {
          productId: product.id,
          storeFormat: storeFormat.id,
          channel: channel.id,
          chargeType: chargeType.id
        }
      },
      { injector: ProductChargeValueModule.injector }
    );
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );

    try {
      const getChargeTypeValue = await productChargeValueResolvers.Query.productChargeValue(
        { user },
        {
          filter: {
            productChargeValueId: chargeValue.id,
            storeFormat: storeFormat.id,
            channel: chance.guid()
          }
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_NOT_FOUND)
      );
    }
  });

  test("should Fail to fetch for incomplete input(Mandatory field chargeType is missing)", async () => {
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );

    try {
      const getChargeTypeValue = await productChargeValueResolvers.Query.productChargeValue(
        { user },
        {
          filter: {
            productChargeValueId: chargeValue.id,
            storeFormat: storeFormat.id,
            channel: channel.id
          }
        },
        { injector: ProductChargeValueModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.INVALID_CHARGE_TYPE_VALUE_INPUT)
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

    const chargeType = await chargeTypeResolvers.Mutation.createChargeType(
      { user },
      {
        input: {
          name: chance.string(),
          chargeTypeCode: chance.string()
        }
      },
      { injector: ChargeModule.injector }
    );

    const chargeValueInput = {
      productId: product.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      chargeType: chargeType.id,
      chargeValue: chance.floating({ min: 0, max: 1000 })
    };
    const chargeValue = await productChargeValueResolvers.Mutation.createChargeValueForProduct(
      { user },
      {
        input: { ...chargeValueInput }
      },
      { injector: ProductChargeValueModule.injector }
    );

    const getChargeValues = await productChargeValueResolvers.Query.productChargeValues(
      { user },
      {
        filter: {
          productChargeValueId: chargeValue.id,
          storeFormat: storeFormat.id,
          channel: channel.id
        },
        pageOptions: {
          page: 1,
          pageSize: 10
        }
      },
      { injector: ProductChargeValueModule.injector }
    );

    console.log("getChargeValues", getChargeValues);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
