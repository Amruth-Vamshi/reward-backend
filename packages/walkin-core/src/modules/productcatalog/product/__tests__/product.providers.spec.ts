// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { CategoryProvider } from "../../category/category.providers";
import { CategoryModule } from "../../category/category.module";
import { ProductCategoryProvider, ProductProvider } from "../product.providers";
import { ProductModule } from "../product.module";
import { Product } from "../../../../entity";
import * as productResolvers from "../product.resolvers";
import { CatalogProvider } from "../../catalog/catalog.providers";
import { CatalogModule } from "../../catalog/catalog.module";
import { OptionModule } from "../../option/option.module";
import {
  OptionProvider,
  OptionValueProvider
} from "../../option/option.providers";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";
import { ProductPriceValueProvider } from "../../../productcatalog/productPriceValue/productPriceValue.providers";
import { ProductPriceValueModule } from "../../../productcatalog/productPriceValue/productPriceValue.module";
import { StoreModule } from "../../../account/store/store.module";
import {
  Stores,
  StoreOpenTimingProvider
} from "../../../account/store/store.providers";
import { StoreFormatModule } from "../../../productcatalog/storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../../productcatalog/storeformat/storeFormat.providers";
import { TaxTypeModule } from "../../../productcatalog/taxtype/taxtype.module";
import { TaxTypeProvider } from "../../../productcatalog/taxtype/taxtype.providers";
import { ChannelModule } from "../../../productcatalog/channel/channel.module";
import { ChannelProvider } from "../../../productcatalog/channel/channel.providers";
import {
  ENUM_DAY,
  ENUM_DELIVERY_LOCATION_TYPE
} from "../../../common/constants/constants";
import {
  productCategoryLoader,
  productValuesLoader
} from "../../../productcatalog/product/product.loader";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { PRODUCT_TYPE, STATUS } from "../../../common/constants";
import { capitalizeFirstLetter } from "../../../common/utils/utils";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import moment from "moment";
let user: WCoreEntities.User;
const chance = new Chance();
jest.mock("i18n");

const catalogInput1 = {
  name: "Pizzahut",
  description: "Pizzahut catalog",
  catalogCode: "PizzaHutCode"
};

const catalogInput2 = {
  name: "Pizzahut2",
  description: "Pizzahut catalog",
  catalogCode: "PizzaHutCode2"
};

const categoryInput = {
  name: "Category 1",
  description: "Category 1 description",
  status: STATUS.ACTIVE,
  code: "CAT_1"
};

const categoryInput2 = {
  name: "Category 2",
  description: "new description",
  status: STATUS.ACTIVE,
  code: "CAT_2"
};

let productInput = {
  name: "Product 1",
  description: "Product desc",
  code: "PRODUCT_CODE",
  status: STATUS.ACTIVE,
  categoryIds: [],
  imageUrl: chance.url(),
  sku: chance.string(),
  isPurchasedSeparately: false
};

const productInput2 = {
  name: "product 2",
  description: "product description2"
};

const productInput3 = {
  name: "test product[with brackets]",
  description: "Product desc",
  code: "PRODUCT_CODE",
  status: STATUS.ACTIVE,
  categoryIds: [],
  sku: chance.string()
};

const productInput4 = {
  name: "test product-name",
  description: "Product desc",
  code: "PRODUCT_CODE",
  status: STATUS.ACTIVE,
  categoryIds: [],
  sku: chance.string()
};

const option1 = {
  name: "Size",
  description: "Size",
  optionValues: [{ value: "Large" }]
};

const option2 = {
  name: "newSize",
  description: "Size Description",
  optionValues: [{ value: "Small" }]
};

const option3 = {
  name: "SizeName",
  description: "Description Size",
  optionValues: [{ value: "Medium" }]
};

let testCatalog: WCoreEntities.Catalog;
let testCategory: WCoreEntities.Category;
let testCatalog2: WCoreEntities.Catalog;
let testCategory2: WCoreEntities.Category;
const categoryService: CategoryProvider = CategoryModule.injector.get(
  CategoryProvider
);

const catalogService: CatalogProvider = CatalogModule.injector.get(
  CatalogProvider
);

const productService: ProductProvider = ProductModule.injector.get(
  ProductProvider
);

const productCategoryService: ProductCategoryProvider = ProductModule.injector.get(
  ProductCategoryProvider
);

const productPriceValueProvider: ProductPriceValueProvider = ProductPriceValueModule.injector.get(
  ProductPriceValueProvider
);

const storeFormatProvider = StoreFormatModule.injector.get(StoreFormatProvider);
const taxTypeProvider = TaxTypeModule.injector.get(TaxTypeProvider);
const channelProvider = ChannelModule.injector.get(ChannelProvider);
const storeProvider: Stores = StoreModule.injector.get(Stores);
const storeOpenTimingProvider: StoreOpenTimingProvider = StoreModule.injector.get(
  StoreOpenTimingProvider
);

const optionService: OptionProvider = OptionModule.injector.get(OptionProvider);
const optionValueService: OptionValueProvider = OptionModule.injector.get(
  OptionValueProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();
  testCatalog = await catalogService.createCatalog(manager, {
    ...catalogInput1,
    organizationId: user.organization.id
  });
  testCategory = await categoryService.createCategory(manager, {
    ...categoryInput,
    catalogId: testCatalog.id,
    organizationId: user.organization.id
  });
  testCatalog2 = await catalogService.createCatalog(manager, {
    ...catalogInput2,
    organizationId: user.organization.id
  });
  testCategory2 = await categoryService.createCategory(manager, {
    ...categoryInput2,
    catalogId: testCatalog2.id,
    organizationId: user.organization.id
  });
});

describe("Testing createUpdateproduct", () => {
  test("should updateProduct given correct inputs", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });
    expect(product.isPurchasedSeparately).toBe(
      productInput["isPurchasedSeparately"]
    );

    const updateProduct = await productService.updateProduct(manager, {
      id: product.id,
      name: productInput2.name,
      description: productInput2.description,
      organizationId: user.organization.id,
      isPurchasedSeparately: true
    });

    productInput2.name = capitalizeFirstLetter(productInput2.name);
    expect(updateProduct).toBeTruthy();
    expect(updateProduct.name).toBe(productInput2.name);
    expect(updateProduct.description).toBe(productInput2.description);
    expect(updateProduct.isPurchasedSeparately).toBe(true);
  });
  test("should create product with null imageURL", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const createdProduct = await productService.createProduct(manager, {
      ...productInput3,
      organizationId: user.organization.id
    });

    productInput3.name = "Test Product[With Brackets]";
    expect(createdProduct).toBeDefined();
    expect(createdProduct.imageUrl).toBeNull();
    expect(createdProduct.name).toBe(productInput3.name);
    expect(createdProduct.description).toBe(productInput3.description);
  });
  test("should create product category link", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const createdProduct = await productService.createProduct(manager, {
      ...productInput3,
      organizationId: user.organization.id
    });

    productInput3.name = "Test Product[With Brackets]";
    expect(createdProduct).toBeDefined();
    expect(createdProduct.imageUrl).toBeNull();
    expect(createdProduct.name).toBe(productInput3.name);
    expect(createdProduct.description).toBe(productInput3.description);

    const createProductCategory = await productCategoryService.createProductCategory(manager, {
      productId: createdProduct.id,
      categoryId: testCategory.id,
      organizationId: user.organization.id
    })
    expect(createProductCategory).toBeDefined();
    expect(createProductCategory.category.id).toBe(testCategory.id);
    expect(createProductCategory.product.id).toBe(createdProduct.id);
  });
  test("should update product category link", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const createdProduct = await productService.createProduct(manager, {
      ...productInput3,
      organizationId: user.organization.id
    });

    productInput3.name = "Test Product[With Brackets]";
    expect(createdProduct).toBeDefined();
    expect(createdProduct.imageUrl).toBeNull();
    expect(createdProduct.name).toBe(productInput3.name);
    expect(createdProduct.description).toBe(productInput3.description);

    const createProductCategory = await productCategoryService.createProductCategory(manager, {
      productId: createdProduct.id,
      categoryId: testCategory.id,
      organizationId: user.organization.id
    })
    expect(createProductCategory).toBeDefined();
    expect(createProductCategory.category.id).toBe(testCategory.id);
    expect(createProductCategory.product.id).toBe(createdProduct.id);

    const updateProductCategory = await productCategoryService.updateProductCategory(manager, {
      id: createProductCategory.id,
      productId: createdProduct.id,
      categoryId: testCategory2.id,
      organizationId: user.organization.id
    })
    expect(updateProductCategory).toBeDefined();
    expect(updateProductCategory.category.id).toBe(testCategory2.id);
    expect(updateProductCategory.product.id).toBe(createdProduct.id);
  });
  test("should create product with external Product Id", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname",
      description: "Product desc",
      code: "PRODUCT_CODE-1",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    productInput3.name = "Test Product[With Brackets]";
    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproductname");
    expect(createdProduct.externalProductId).toBeDefined();
  });
  test("should updateProduct with external Product Id", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput4,
      organizationId: user.organization.id
    });

    expect(product.externalProductId).toBeNull();

    const updateProduct = await productService.updateProduct(manager, {
      id: product.id,
      name: productInput2.name + "rs",
      description: productInput2.description,
      organizationId: user.organization.id,
      externalProductId: "extPrID"
    });
    productInput2.name = capitalizeFirstLetter(productInput2.name);

    expect(updateProduct).toBeTruthy();
    expect(updateProduct.externalProductId).toBe("extPrID");
  });

  test("should search product with external Product Id", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      name: "testProductName",
      description: "Product desc",
      code: "PRODUCT_CODE-3",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: "testId",
      organizationId: user.organization.id
    });

    const getProducts = await productService.getProducts(manager, {
      organizationId: user.organization.id,
      externalProductId: "testId"
    });
    expect(getProducts).toBeDefined();
    expect(getProducts[0].externalProductId).toBe("testId");
  });
  test("should get product with external Product Id", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproduct-1",
      description: "Product desc",
      code: "PRODUCT_CODE-2",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: "externalId",
      organizationId: user.organization.id
    });

    const getProductByExternalProductId = await productService.getProductByExternalProductId(
      manager,
      {
        externalProductId: createdProduct.externalProductId,
        organizationId: user.organization.id
      }
    );

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproduct-1");
    expect(getProductByExternalProductId).toBeDefined();
    expect(getProductByExternalProductId.id).toEqual(createdProduct.id);
  });
  test("should create product with null external Product Id when empty string is passed", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-112",
      description: "Product desc-1",
      code: "PRODUCT_CODE-212",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: "",
      organizationId: user.organization.id
    });

    productInput3.name = "Test Product[With Brackets]";
    expect(createdProduct).toBeDefined();
    expect(createdProduct.externalProductId).toBeNull();
  });

  test("should updateProduct with prev value external Product Id when empty string is passed", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      name: "Newproducts-3",
      description: "Product desc-2",
      code: "PRODUCT_CODE-242",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: "extsq",
      organizationId: user.organization.id
    });

    expect(product.externalProductId).toEqual("extsq");

    const updateProduct = await productService.updateProduct(manager, {
      id: product.id,
      name: productInput2.name + "rsas",
      description: productInput2.description,
      organizationId: user.organization.id,
      externalProductId: ""
    });
    productInput2.name = capitalizeFirstLetter(productInput2.name);

    expect(updateProduct).toBeTruthy();
    expect(updateProduct.externalProductId).toEqual("extsq");
  });

  test("should create options product when optionId is provided", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const optionObject = await optionService.createOption(manager, option1);
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-12",
      description: "Product desc",
      code: "PRODUCT_CODE-23",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      optionIds: [optionObject.id],
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: "Newproductname-12+Large"
      }
    });

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproductname-12");
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getProduct.name).toEqual("Newproductname-12+Large");
    expect(getProduct.productType).toEqual(PRODUCT_TYPE.VARIANT);
    expect(getProduct.code).toEqual(getProduct.name.replace(/\s+/g, ""));
  });

  test("should create options product when optionId is provided", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const optionObject = await optionService.createOption(manager, option1);
    const optionObject2 = await optionService.createOption(manager, option2);
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-323",
      description: "Product desc",
      code: "PRODUCT_CODE-323",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      optionIds: [optionObject.id, optionObject2.id],
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: "Newproductname-323+Large+Small"
      }
    });

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproductname-323");
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getProduct.name).toEqual("Newproductname-323+Large+Small");
    expect(getProduct.productType).toEqual(PRODUCT_TYPE.VARIANT);
    expect(getProduct.code).toEqual(getProduct.name.replace(/\s+/g, ""));
  });

  test("should update options product when optionId is provided", async () => {
    const manager = getManager();
    const optionObject = await optionService.createOption(manager, option2);
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-122",
      description: "Product desc",
      code: "PRODUCT_CODE-233",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const updateProduct = await productService.updateProduct(manager, {
      id: createdProduct.id,
      name: "Newproductupdatedname",
      organizationId: user.organization.id,
      optionIds: [optionObject.id]
    });

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: "Newproductupdatedname+Small"
      }
    });

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproductname-122");
    expect(updateProduct.name).toBe("Newproductupdatedname");
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getProduct.name).toEqual("Newproductupdatedname+Small");
    expect(getProduct.productType).toEqual(PRODUCT_TYPE.VARIANT);
    expect(getProduct.code).toEqual(getProduct.name.replace(/\s+/g, ""));
  });
  test("should get product options", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;

    const optionObject = await optionService.createOption(manager, option3);

    const createdProduct = await productService.createProduct(manager, {
      name: "NewproductsNames-1",
      description: "Product desc",
      code: "PRODUCT_CODES-2",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      optionIds: [optionObject.id],
      externalProductId: "externalId",
      organizationId: user.organization.id
    });

    const getProduct = await productResolvers.default[0].Product.options(
      createdProduct,
      {},
      { injector: ProductModule.injector }
    );

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproductsnames-1");
    expect(getProduct).toBeDefined();
    expect(getProduct[0].id).toEqual(optionObject.id);
  });
  test("Update product with options and create Product Variant", async () => {
    const manager = getManager();
    const optionObject = await optionService.createOption(manager, option2);
    const optionObject2 = await optionService.createOption(manager, option3);
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-128",
      description: "Product desc",
      code: "PRODUCT_CODE-238",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const updateProduct = await productService.updateProduct(manager, {
      id: createdProduct.id,
      name: "Newupdatedname",
      organizationId: user.organization.id,
      optionIds: [optionObject.id, optionObject2.id]
    });

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: "Newupdatedname+Small+Medium"
      }
    });

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproductname-128");
    expect(updateProduct.name).toBe("Newupdatedname");
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getProduct.name).toEqual("Newupdatedname+Small+Medium");
    expect(getProduct.productType).toEqual(PRODUCT_TYPE.VARIANT);
    expect(getProduct.code).toEqual(getProduct.name.replace(/\s+/g, ""));
  });
  test("Update product with category", async () => {
    const manager = getManager();
    const optionObject = await optionService.createOption(manager, option2);
    const optionObject2 = await optionService.createOption(manager, option3);
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-158",
      description: "Product desc",
      code: "PRODUCT_CODE-258",
      status: STATUS.ACTIVE,
      categoryIds: [testCategory.id],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const updateProduct = await productService.updateProduct(manager, {
      id: createdProduct.id,
      name: "Newupdatednames",
      optionIds: [optionObject.id, optionObject2.id],
      categoryIds: [testCategory2.id],
      organizationId: user.organization.id
    });

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: "Newupdatednames+Small+Medium"
      }
    });

    const loader = productCategoryLoader();
    const getUpdateProductCategories = await productResolvers.default[0].Product.categories(
      updateProduct,
      {},
      { productCategoryLoader: loader }
    );

    const getProductVariantCategories = await productResolvers.default[0].Product.categories(
      getProduct,
      {},
      { productCategoryLoader: loader }
    );

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproductname-158");
    expect(updateProduct.name).toBe("Newupdatednames");
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getProduct.name).toEqual("Newupdatednames+Small+Medium");
    expect(getProduct.productType).toEqual(PRODUCT_TYPE.VARIANT);

    expect(getUpdateProductCategories[0].id).toEqual(testCategory2.id);
    expect(getUpdateProductCategories[0].name).toEqual(testCategory2.name);

    expect(getProductVariantCategories[0].id).toEqual(testCategory2.id);
    expect(getProductVariantCategories[0].name).toEqual(testCategory2.name);
  });
  test("should search product with name", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      name: "testProductName2314",
      description: "Product desc",
      code: "PRODUCT_CODE-32",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      organizationId: user.organization.id
    });
    const getProducts = await productService.getProducts(manager, {
      organizationId: user.organization.id,
      name: "Testproductname2314"
    });
    expect(getProducts).toBeDefined();
    expect(getProducts[0].name).toBe("Testproductname2314");
  });
  test("should create variant product when optionValueId is provided", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const optionObject = await optionService.createOption(manager, option1);
    const optionValueInput = {
      optionId: optionObject.id,
      value: "Large-1"
    };
    const optionValue = await optionValueService.createOptionValue(
      manager,
      optionValueInput
    );
    const createProductName = "Newproductname-42";
    const createProductCode = "PRODUCT_CODE-23";
    const createdProduct = await productService.createProduct(manager, {
      name: createProductName,
      description: "Product desc",
      code: createProductCode,
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      optionValueIds: [optionValue.id],
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const productName = "Newproductname-42+Large-1";

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: productName
      }
    });

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe(createProductName);
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getProduct.name).toEqual(productName);
    expect(getProduct.productType).toEqual(PRODUCT_TYPE.VARIANT);
    expect(getProduct.code).toEqual(getProduct.name.replace(/\s+/g, ""));
  });
  test("should search all products for an organization", async () => {
    const manager = getManager();
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      name: "testProductName-247",
      description: "Product desc",
      code: "PRODUCT_CODE-247",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: "testId126",
      organizationId: user.organization.id
    });

    const productName = "Testproductname-247";

    const getProducts = await productService.getProducts(manager, {
      organizationId: user.organization.id,
      name: productName
    });

    expect(getProducts).toBeDefined();
    expect(getProducts[0].id).toBeDefined();
    expect(getProducts[0].name).toEqual(productName);
  });
  test("should update product with optionId is provided", async () => {
    const manager = getManager();
    const optionObject = await optionService.createOption(manager, option2);
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-125",
      description: "Product desc",
      code: "PRODUCT_CODE-235",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const createdProductName = "Newproductname-125";
    const updatedProductName = "Newproductupdatename";

    const updateProduct = await productService.updateProduct(manager, {
      id: createdProduct.id,
      name: updatedProductName,
      organizationId: user.organization.id,
      optionIds: [optionObject.id]
    });

    const getProductName = "Newproductupdatename+Small";

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: getProductName
      }
    });

    expect(createdProduct).toBeDefined();
    expect(createdProduct.id).toEqual(updateProduct.id);
    expect(createdProduct.name).toBe(createdProductName);
    expect(updateProduct.name).toBe(updatedProductName);
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getProduct.name).toEqual(getProductName);
    expect(getProduct.productType).toEqual(PRODUCT_TYPE.VARIANT);
    expect(getProduct.code).toEqual(getProduct.name.replace(/\s+/g, ""));
  });
});

describe("Should Update product sort seq", () => {
  test("should Update sort seq of a product", async () => {
    const manager = getManager();

    productInput["organizationId"] = user.organization.id;
    const productInput1 = {
      name: "Product 123",
      description: "Product desc",
      code: "PRODUCT_CODE",
      status: STATUS.ACTIVE,
      categoryIds: [testCategory.id],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    const getProductCategory = await productCategoryService.findProductCategoryByCategoryId(
      manager,
      testCategory.id,
      user.organization.id
    );
    const foundProductCategory = getProductCategory[0];
    const productCategory = await productService.updateProductCategorySortSeq(
      manager,
      {
        organizationId: user.organization.id,
        productCategory: [
          {
            id: foundProductCategory.id,
            sortSeq: 10
          }
        ]
      }
    );

    expect(productCategory[0].sortSeq).toBe(10);
  });

  test("should Update sort seq of a product", async () => {
    const manager = getManager();

    productInput["organizationId"] = user.organization.id;
    const productInput1 = {
      name: chance.string(),
      description: "Product desc",
      code: chance.string(),
      status: STATUS.ACTIVE,
      categoryIds: [testCategory.id],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });
    const productInput4 = {
      name: chance.string(),
      description: "Product desc",
      code: chance.string(),
      status: STATUS.ACTIVE,
      categoryIds: [testCategory.id],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product1 = await productService.createProduct(manager, {
      ...productInput4,
      organizationId: user.organization.id
    });

    const getProductCategory = await productCategoryService.findProductCategoryByCategoryId(
      manager,
      testCategory.id,
      user.organization.id
    );
    const foundProductCategory = getProductCategory[0];
    const foundProductCategory1 = getProductCategory[1];
    const productCategory = await productService.updateProductCategorySortSeq(
      manager,
      {
        organizationId: user.organization.id,
        productCategory: [
          {
            id: foundProductCategory.id,
            sortSeq: 10
          },
          {
            id: foundProductCategory1.id,
            sortSeq: 1
          }
        ]
      }
    );

    const foundSortedProductCategory = productCategory.find(
      productCategory1 => productCategory1.id === foundProductCategory.id
    );
    const foundSortedProductCategory1 = productCategory.find(
      productCategory1 => productCategory1.id === foundProductCategory1.id
    );
    expect(foundSortedProductCategory.id).toBe(foundProductCategory.id);
    expect(foundSortedProductCategory.sortSeq).toBe(10);
    expect(foundSortedProductCategory1.id).toBe(foundProductCategory1.id);
    expect(foundSortedProductCategory1.sortSeq).toBe(1);
  });
  test("should get prices in productByExternalProductId", async () => {
    const manager = getManager();

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
      testCatalog,
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

    productInput["organizationId"] = user.organization.id;
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproduct-123",
      description: "Product desc",
      code: "PRODUCT_CODE-123",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: "externalIdNew",
      organizationId: user.organization.id
    });

    const createProductPriceValue = {
      productId: createdProduct.id,
      storeFormat: storeFormat.id,
      channel: channel.id,
      productPrice: chance.floating({ min: 0, max: 1000 })
    };
    const productPriceValue = await productPriceValueProvider.createPriceValueForProduct(
      manager,
      { ...createProductPriceValue },
      user.organization.id
    );

    const getProductByExternalProductId = await productService.getProductByExternalProductId(
      manager,
      {
        externalProductId: createdProduct.externalProductId,
        organizationId: user.organization.id
      }
    );

    const loader = productValuesLoader();

    const getProduct = await productResolvers.default[0].Product.productPrices(
      createdProduct,
      {},
      { productValuesLoader: loader }
    );

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproduct-123");
    expect(getProductByExternalProductId).toBeDefined();
    expect(getProductByExternalProductId.id).toEqual(createdProduct.id);
    expect(getProduct.productPriceValues[0].priceValue).toEqual(
      createProductPriceValue.productPrice
    );
  });
});

describe("Should Update product category", () => {
  test("should not Update product category for duplicate entry", async () => {
    const manager = getManager();

    productInput["organizationId"] = user.organization.id;
    const productInput1 = {
      name: "Product 12344",
      description: "Product desc",
      code: "PRODUCT_CODE_N",
      status: STATUS.ACTIVE,
      categoryIds: [testCategory.id],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    productInput["organizationId"] = user.organization.id;
    const productInput2 = {
      name: "Product 1422",
      description: "Product desc",
      code: "PRODUCT_CODE_NEW",
      status: STATUS.ACTIVE,
      categoryIds: [testCategory2.id],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product2 = await productService.createProduct(manager, {
      ...productInput2,
      organizationId: user.organization.id
    });

    const getProductCategory = await productCategoryService.findProductCategoryByCategoryId(
      manager,
      testCategory.id,
      user.organization.id
    );
    const foundProductCategory = getProductCategory[0];
    const getProductCategory2 = await productCategoryService.findProductCategoryByCategoryId(
      manager,
      testCategory2.id,
      user.organization.id
    );
    const foundProductCategory2 = getProductCategory2[0];
    try {
      const updateProductCategory = await productCategoryService.updateProductCategory(
        manager,
        {
          id: foundProductCategory.id,
          productId: foundProductCategory2.product.id,
          categoryId: foundProductCategory2.category.id,
          organizationId: user.organization.id
        }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_ALREADY_AVAILABLE_IN_CATEGORY)
      );
    }
  });
  test("Update product with corect optionIds ", async () => {
    const manager = getManager();
    const optionObject = await optionService.createOption(manager, option2);
    const optionObject2 = await optionService.createOption(manager, option3);
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-129",
      description: "Product desc",
      code: "PRODUCT_CODE-239",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const updateProduct = await productService.updateProduct(manager, {
      id: createdProduct.id,
      name: "Newupdatedname291",
      organizationId: user.organization.id,
      optionIds: [optionObject.id, optionObject2.id]
    });

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: "Newupdatedname291+Small+Medium"
      }
    });

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproductname-129");
    expect(updateProduct.name).toBe("Newupdatedname291");
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getProduct.name).toEqual("Newupdatedname291+Small+Medium");
    expect(getProduct.productType).toEqual(PRODUCT_TYPE.VARIANT);
    expect(getProduct.code).toEqual(getProduct.name.replace(/\s+/g, ""));
  });
  test("Get Categories in product ", async () => {
    const manager = getManager();

    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-130",
      description: "Product desc",
      code: "PRODUCT_CODE-230",
      status: STATUS.ACTIVE,
      categoryIds: [testCategory.id],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const loader = productCategoryLoader();
    const getCategories = await productResolvers.default[0].Product.categories(
      createdProduct,
      {},
      { productCategoryLoader: loader }
    );

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe(createdProduct.name);
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getCategories[0].id).toEqual(testCategory.id);
    expect(getCategories[0].name).toEqual(testCategory.name);
  });
  test("should remove product category", async () => {
    const manager = getManager();

    productInput["organizationId"] = user.organization.id;
    const productInput1 = {
      name: "Product 4894",
      description: "Product desc",
      code: "PRODUCT_CODE_TEXT",
      status: STATUS.ACTIVE,
      categoryIds: [testCategory.id],
      imageUrl: chance.url(),
      sku: chance.string()
    };
    const product = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    productInput["organizationId"] = user.organization.id;

    const getProductCategory = await productCategoryService.findProductCategoryByCategoryId(
      manager,
      testCategory.id,
      user.organization.id
    );
    const foundProductCategory = getProductCategory[0];
    const removeProductCategory = await productCategoryService.removeProductCategory(
      manager,
      {
        id: foundProductCategory.id,
        organizationId: user.organization.id
      }
    );

    expect(removeProductCategory.id).toBeUndefined();
  });
  test("should allow creation of product without unique name constraint", async () => {
    const manager = getManager();

    const createdProduct1 = await productService.createProduct(manager, {
      name: "Newproductname-1411",
      description: "Product desc",
      code: "PRODUCT_CODE-2311",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id,
      isProductUnique: false
    });

    const createdProduct2 = await productService.createProduct(manager, {
      name: "Newproductname-1411",
      description: "Product desc",
      code: "PRODUCT_CODE-2311",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    try {
      const createdProduct3 = await productService.createProduct(manager, {
        name: "Newproductname-1411",
        description: "Product desc",
        isProductUnique: true,
        code: "PRODUCT_CODE-2311",
        status: STATUS.ACTIVE,
        categoryIds: [],
        sku: chance.string(),
        externalProductId: chance.string(),
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PRODUCT_NAME_NOT_UNIQUE)
      );
    }

    const productName = "Newproductname-1411";

    expect(createdProduct1).toBeDefined();
    expect(createdProduct1.name).toBe(productName);
    expect(createdProduct1.externalProductId).toBeDefined();
    expect(createdProduct2).toBeDefined();
    expect(createdProduct2.name).toBe(productName);
  });
  test("Update product with corect optionValueIds", async () => {
    const manager = getManager();
    const optionObject = await optionService.createOption(manager, option2);
    const optionObject2 = await optionService.createOption(manager, option3);
    const optionValueInput = {
      optionId: optionObject.id,
      value: "Large-1"
    };
    const optionValue = await optionValueService.createOptionValue(
      manager,
      optionValueInput
    );
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-159",
      description: "Product desc",
      code: "PRODUCT_CODE-259",
      status: STATUS.ACTIVE,
      categoryIds: [],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const updateProduct = await productService.updateProduct(manager, {
      id: createdProduct.id,
      name: "Newupdatedname159",
      organizationId: user.organization.id,
      optionValueIds: [optionValue.id]
    });

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: "Newupdatedname159+Large-1"
      }
    });

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe("Newproductname-159");
    expect(createdProduct.externalProductId).toBeDefined();
    expect(getProduct.name).toEqual("Newupdatedname159+Large-1");
    expect(getProduct.productType).toEqual(PRODUCT_TYPE.VARIANT);
    expect(getProduct.code).toEqual(getProduct.name.replace(/\s+/g, ""));
  });
  test("should update product variant with product name updated", async () => {
    const manager = getManager();
    const optionObject = await optionService.createOption(manager, option2);
    const createdProduct = await productService.createProduct(manager, {
      name: "Newproductname-126",
      description: "Product desc",
      code: "PRODUCT_CODE-236",
      status: STATUS.ACTIVE,
      categoryIds: [],
      optionIds: [optionObject.id],
      sku: chance.string(),
      externalProductId: chance.string(),
      organizationId: user.organization.id
    });

    const createdProductName = "Newproductname-126";
    const updatedProductName = "Newproductupdatedname";

    const updateProduct = await productService.updateProduct(manager, {
      id: createdProduct.id,
      name: updatedProductName,
      organizationId: user.organization.id,
      optionIds: [optionObject.id]
    });

    const getProductName = "Newproductupdatedname+Small";

    const getProduct = await manager.findOne(Product, {
      where: {
        organizationId: user.organization.id,
        name: getProductName
      }
    });

    expect(createdProduct).toBeDefined();
    expect(createdProduct.id).toEqual(updateProduct.id);
    expect(createdProduct.name).toBe(createdProductName);
    expect(updateProduct.name).toBe(updatedProductName);
    expect(getProduct.name).toEqual(getProductName);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
