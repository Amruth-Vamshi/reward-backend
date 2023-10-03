import { getManager, getConnection } from "typeorm";
import { CategoryProvider } from "../category.providers";
import { CategoryModule } from "../category.module";
import { CatalogProvider } from "../../catalog/catalog.providers";
import { CatalogModule } from "../../catalog/catalog.module";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection,
  emptyQueues
} from "../../../../../__tests__/utils/unit";
import { CACHING_KEYS, PRODUCT_TYPE, STATUS } from "../../../common/constants";
import * as CoreEntities from "@walkinserver/walkin-core/src/entity";
import { Chance } from "chance";
import { capitalizeFirstLetter } from "../../../common/utils/utils";
import { getValueFromCache } from "../../../common/utils/redisUtils";
import { ProductProvider } from "../../product/product.providers";
import { ProductModule } from "../../product/product.module";
import * as categoryResolvers from "../category.resolvers";
import { categoryproductsLoader } from "../category.loader";
const chance = new Chance();
let user: CoreEntities.User;
// jest.mock("i18n");

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const catalogService: CatalogProvider = CatalogModule.injector.get(
  CatalogProvider
);

const categoryService: CategoryProvider = CategoryModule.injector.get(
  CategoryProvider
);

const productService: ProductProvider = ProductModule.injector.get(
  ProductProvider
);

describe("Testing updateCategory", () => {
  test("should createCategory given correct inputs", async () => {
    const manager = getManager();

    const catalogInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 3 })
    };

    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
      productType: PRODUCT_TYPE.ADDON
    };

    const testCatalog = await catalogService.createCatalog(manager, {
      ...catalogInput1,
      organizationId: user.organization.id
    });

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: testCatalog.id,
      organizationId: user.organization.id
    });
    categoryInput.name = capitalizeFirstLetter(categoryInput.name);
    expect(category).toBeTruthy();
    expect(category.name).toBe(categoryInput.name);
    expect(category.description).toBe(categoryInput.description);
    expect(category.productType).toBe(PRODUCT_TYPE.ADDON);
  });

  test("should updateCategory given correct inputs", async () => {
    const manager = getManager();

    const catalogInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 3 })
    };

    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };

    const categoryInput2 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 })
    };

    const testCatalog = await catalogService.createCatalog(manager, {
      ...catalogInput1,
      organizationId: user.organization.id
    });

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: testCatalog.id,
      organizationId: user.organization.id
    });

    const key = `${CACHING_KEYS.CATEGORY}_${category.id}`;
    const cacheValue = await getValueFromCache(key);
    expect(cacheValue).toBeNull();

    const updateCategory = await categoryService.updateCategory(manager, {
      id: category.id,
      name: categoryInput2.name,
      description: categoryInput2.description,
      organizationId: user.organization.id,
      productType: PRODUCT_TYPE.VARIANT
    });
    categoryInput2.name = capitalizeFirstLetter(categoryInput2.name);
    expect(updateCategory).toBeTruthy();
    expect(updateCategory.name).toBe(categoryInput2.name);
    expect(updateCategory.description).toBe(categoryInput2.description);
    expect(updateCategory.productType).toBe(PRODUCT_TYPE.VARIANT);
  });

  test("should have name in correct format for category", async () => {
    const manager = getManager();

    const catalogInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 3 })
    };

    const categoryInput = {
      name: "category-input[name test]",
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };

    const testCatalog = await catalogService.createCatalog(manager, {
      ...catalogInput1,
      organizationId: user.organization.id
    });

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: testCatalog.id,
      organizationId: user.organization.id
    });

    categoryInput.name = "Category-Input[Name Test]";
    expect(category).toBeTruthy();
    expect(category.name).toBe(categoryInput.name);
    expect(category.description).toBe(categoryInput.description);
  });
});

describe("Should Update sort Value correctly", () => {
  test("should update sort value of a category", async () => {
    const manager = getManager();

    const catalogInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 3 })
    };

    const categoryInput = {
      name: "category-input[name test]",
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };

    const testCatalog = await catalogService.createCatalog(manager, {
      ...catalogInput1,
      organizationId: user.organization.id
    });

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: testCatalog.id,
      organizationId: user.organization.id
    });
    const updateSortSeq = await categoryService.updateCategorySortSeq(manager, {
      categorySeq: [
        {
          id: category.id,
          sortSeq: 10
        }
      ],
      organizationId: user.organization.id
    });
    expect(updateSortSeq[0].sortSeq).toBe(10);
  });

  test("should update sort value for multiple products", async () => {
    const manager = getManager();

    const catalogInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 3 })
    };

    const categoryInput = {
      name: "category-input[name test]",
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };

    const testCatalog = await catalogService.createCatalog(manager, {
      ...catalogInput1,
      organizationId: user.organization.id
    });

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: testCatalog.id,
      organizationId: user.organization.id
    });
    const categoryInput2 = {
      name: chance.string(),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };
    const category2 = await categoryService.createCategory(manager, {
      ...categoryInput2,
      catalogId: testCatalog.id,
      organizationId: user.organization.id
    });
    const updateSortSeq = await categoryService.updateCategorySortSeq(manager, {
      categorySeq: [
        {
          id: category.id,
          sortSeq: 10
        },
        {
          id: category2.id,
          sortSeq: 1
        }
      ],
      organizationId: user.organization.id
    });
    const updatedCategory = updateSortSeq.find(
      foundCategory => foundCategory.id === category.id
    );
    const updatedCategory1 = updateSortSeq.find(
      foundCategory => foundCategory.id === category2.id
    );

    expect(updateSortSeq).toHaveLength(2);
    expect(updatedCategory.id).toBe(category.id);
    expect(updatedCategory.sortSeq).toBe(10);
    expect(updatedCategory1.id).toBe(category2.id);
    expect(updatedCategory1.sortSeq).toBe(1);
  });
});

describe("GEt Category Details", () => {
  test("should get products within category", async () => {
    const manager = getManager();

    const catalogInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 3 })
    };

    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE,
      productType: PRODUCT_TYPE.ADDON
    };

    const testCatalog = await catalogService.createCatalog(manager, {
      ...catalogInput1,
      organizationId: user.organization.id
    });

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: testCatalog.id,
      organizationId: user.organization.id
    });

    const productInput1 = {
      name: "Product 123",
      description: "Product desc",
      code: "PRODUCT_CODE",
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      listable: true,
      organizationId: user.organization.id
    };
    const product = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    const loader = categoryproductsLoader();
    const products = await categoryResolvers.resolvers.Category.products(
      category,
      {},
      {
        categoryproductsLoader: loader,
        organizationId: user.organization.id
      }
    );

    categoryInput.name = capitalizeFirstLetter(categoryInput.name);
    expect(category).toBeTruthy();
    expect(category.name).toBe(categoryInput.name);
    expect(category.description).toBe(categoryInput.description);
    expect(products).toBeDefined();
    expect(products).toHaveLength(1);
    expect(products[0].id).toEqual(product.id);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
