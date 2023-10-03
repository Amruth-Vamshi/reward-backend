// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { CategoryProvider } from "../../category/category.providers";
import { CategoryModule } from "../../category/category.module";
import {
  ProductCategoryProvider,
  ProductProvider
} from "../../product/product.providers";
import { ProductModule } from "../../product/product.module";
import { ProductRelationshipProvider } from "../productRelationship.providers";
import { ProductRelationshipModule } from "../productRelationship.module";
import { CatalogProvider } from "../../catalog/catalog.providers";
import { CatalogModule } from "../../catalog/catalog.module";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import {
  CACHING_KEYS,
  PRODUCT_RELATIONSHIP,
  PRODUCT_TYPE,
  STATUS
} from "../../../common/constants";
import { capitalizeFirstLetter } from "../../../common/utils/utils";
import { getValueFromCache } from "../../../common/utils/redisUtils";
let user: WCoreEntities.User;
const chance = new Chance();
jest.mock("i18n");

const catalogInput1 = {
  name: chance.name(),
  description: chance.string(),
  catalogCode: chance.string()
};

const categoryInput = {
  name: chance.name(),
  description: chance.string(),
  status: STATUS.ACTIVE,
  code: chance.string()
};

const categoryInput2 = {
  name: chance.name(),
  description: chance.string()
};

const generateProductInput = productType => {
  const generatedInput = {
    name: chance.name(),
    description: chance.string(),
    code: chance.string(),
    status: STATUS.ACTIVE,
    categoryIds: [],
    imageUrl: chance.url(),
    sku: chance.string(),
    productType
  };
  return generatedInput;
};

let testCatalog: WCoreEntities.Catalog;
let testCategory: WCoreEntities.Category;

const categoryService: CategoryProvider = CategoryModule.injector.get(
  CategoryProvider
);

const catalogService: CatalogProvider = CatalogModule.injector.get(
  CatalogProvider
);

const productService: ProductProvider = ProductModule.injector.get(
  ProductProvider
);

const productRelationShipProvider: ProductRelationshipProvider = ProductRelationshipModule.injector.get(
  ProductRelationshipProvider
);

const productCategoryService: ProductCategoryProvider = ProductModule.injector.get(
  ProductCategoryProvider
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
});

describe("Testing create and update productRelationship", () => {
  test("should create Product relationship given correct inputs", async () => {
    const manager = getManager();
    const productInput = generateProductInput(PRODUCT_TYPE.PRODUCT);
    productInput["organizationId"] = user.organization.id;

    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });
    const productInput1 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product1 = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    const productRelationship = await productRelationShipProvider.creatProductRelationship(
      manager,
      {
        parentId: product.id,
        childId: product1.id,
        relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
        parentType: PRODUCT_TYPE.PRODUCT,
        childType: PRODUCT_TYPE.ADDON,
        organizationId: user.organization.id,
        config: {
          name: "name",
          description: "description"
        }
      }
    );
    expect(productRelationship).toBeTruthy();
    expect(productRelationship.parentId).toBe(product.id);
    expect(productRelationship.childId).toBe(product1.id);
    expect(productRelationship.config).toBeDefined();
    expect(productRelationship.config["name"]).toEqual("name");
    expect(productRelationship.config["description"]).toEqual("description");
  });

  test("should create Product relationship given correct inputs", async () => {
    const manager = getManager();
    const productInput = generateProductInput(PRODUCT_TYPE.PRODUCT);
    productInput["organizationId"] = user.organization.id;

    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });
    const productInput1 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product1 = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    const productRelationship = await productRelationShipProvider.creatProductRelationship(
      manager,
      {
        parentId: product.id,
        childId: product1.id,
        relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
        parentType: PRODUCT_TYPE.PRODUCT,
        childType: PRODUCT_TYPE.ADDON,
        organizationId: user.organization.id,
        config: {
          name: "name",
          description: "description"
        }
      }
    );
    expect(productRelationship).toBeTruthy();
    expect(productRelationship.parentId).toBe(product.id);
    expect(productRelationship.childId).toBe(product1.id);
    expect(productRelationship.config).toBeDefined();
    expect(productRelationship.config["name"]).toEqual("name");
    expect(productRelationship.config["description"]).toEqual("description");
  });

  test("should update Product relationship", async () => {
    const manager = getManager();
    const productInput = generateProductInput(PRODUCT_TYPE.PRODUCT);
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });
    const productInput1 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product1 = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    const productRelationship = await productRelationShipProvider.creatProductRelationship(
      manager,
      {
        parentId: product.id,
        childId: product1.id,
        relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
        parentType: PRODUCT_TYPE.PRODUCT,
        childType: PRODUCT_TYPE.ADDON,
        organizationId: user.organization.id
      }
    );

    const updateProductRelationship = await productRelationShipProvider.updateProductRelationship(
      manager,
      {
        id: productRelationship.id,
        relationship: PRODUCT_RELATIONSHIP.PRODUCT_COMBO,
        config: {
          name: "name",
          description: "description"
        }
      }
    );

    expect(updateProductRelationship).toBeTruthy();
    expect(updateProductRelationship.relationship).toBe(
      PRODUCT_RELATIONSHIP.PRODUCT_COMBO
    );
    expect(updateProductRelationship.config).toBeDefined();
    expect(updateProductRelationship.config["name"]).toEqual("name");
    expect(updateProductRelationship.config["description"]).toEqual(
      "description"
    );
  });

  test("should update Product relationships", async () => {
    const manager = getManager();
    const productInput = generateProductInput(PRODUCT_TYPE.PRODUCT);
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });
    const productInput1 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product1 = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    const productInput2 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product2 = await productService.createProduct(manager, {
      ...productInput2,
      organizationId: user.organization.id
    });

    const productInput3 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product3 = await productService.createProduct(manager, {
      ...productInput3,
      organizationId: user.organization.id
    });

    const productRelationship = await productRelationShipProvider.creatProductRelationships(
      manager,
      [
        {
          parentId: product.id,
          childId: product1.id,
          relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
          parentType: PRODUCT_TYPE.PRODUCT,
          childType: PRODUCT_TYPE.ADDON,
          organizationId: user.organization.id
        },
        {
          parentId: product2.id,
          childId: product3.id,
          relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
          parentType: PRODUCT_TYPE.PRODUCT,
          childType: PRODUCT_TYPE.ADDON,
          organizationId: user.organization.id
        }
      ],
      user.organization.id
    );

    const updateProductRelationship = await productRelationShipProvider.updateProductRelationships(
      manager,
      [
        {
          id: productRelationship[0].id,
          relationship: PRODUCT_RELATIONSHIP.PRODUCT_COMBO,
          config: { min: 1, max: 4 }
        },
        {
          id: productRelationship[1].id,
          relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
          config: { min: 1, max: 4 }
        }
      ],
      user.organization.id
    );

    expect(updateProductRelationship).toBeTruthy();
    expect(updateProductRelationship.length).toBe(2);
    expect(updateProductRelationship[0].relationship).toBe(
      PRODUCT_RELATIONSHIP.PRODUCT_COMBO
    );
    expect(updateProductRelationship[0].config).toBeTruthy();
    expect(updateProductRelationship[0].config.min).toBe(1);
    expect(updateProductRelationship[0].config.max).toBe(4);
    expect(updateProductRelationship[1].relationship).toBe(
      PRODUCT_RELATIONSHIP.PRODUCT_ADDONS
    );
  });

  test("should search product relationship and children with parentId", async () => {
    const manager = getManager();
    const productInput = generateProductInput(PRODUCT_TYPE.PRODUCT);
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });
    const productInput1 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product1 = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    const productRelationship = await productRelationShipProvider.creatProductRelationship(
      manager,
      {
        parentId: product.id,
        childId: product1.id,
        relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
        parentType: PRODUCT_TYPE.PRODUCT,
        childType: PRODUCT_TYPE.ADDON,
        organizationId: user.organization.id
      }
    );
    const getProductRelationship = await productRelationShipProvider.getProductRelationship(
      manager,
      {
        id: productRelationship.id
      }
    );
    expect(getProductRelationship).toBeDefined();
    expect(getProductRelationship.id).toBe(productRelationship.id);
    expect(getProductRelationship.relationship).toBe(
      productRelationship.relationship
    );
    expect(getProductRelationship.parentId).toBe(productRelationship.parentId);
    expect(getProductRelationship.childId).toBe(productRelationship.childId);
  });

  test("should remove product relationship", async () => {
    const manager = getManager();
    const productInput = generateProductInput(PRODUCT_TYPE.PRODUCT);
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });
    const productInput1 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product1 = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    const productRelationship = await productRelationShipProvider.creatProductRelationship(
      manager,
      {
        parentId: product.id,
        childId: product1.id,
        relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
        parentType: PRODUCT_TYPE.PRODUCT,
        childType: PRODUCT_TYPE.ADDON,
        organizationId: user.organization.id
      }
    );
    const removeProductRelationShip = await productRelationShipProvider.removeProductRelationships(
      manager,
      [
        {
          id: productRelationship.id
        }
      ],
      user.organization.id
    );

    const key = `${CACHING_KEYS.PRODUCT_RELATIONSHIP}_${productRelationship.parentId}`;
    const cacheValue = await getValueFromCache(key);

    expect(cacheValue).toBeNull();

    console.log("removeProductRelationShip", removeProductRelationShip);
    expect(removeProductRelationShip).toBeDefined();
    expect(removeProductRelationShip.length).toBe(1);
  });

  test("should create Product relationships with config", async () => {
    const manager = getManager();
    const productInput = generateProductInput(PRODUCT_TYPE.PRODUCT);
    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });
    const productInput1 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product1 = await productService.createProduct(manager, {
      ...productInput1,
      organizationId: user.organization.id
    });

    const productInput2 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product2 = await productService.createProduct(manager, {
      ...productInput2,
      organizationId: user.organization.id
    });

    const productInput3 = generateProductInput(PRODUCT_TYPE.ADDON);
    const product3 = await productService.createProduct(manager, {
      ...productInput3,
      organizationId: user.organization.id
    });

    const productRelationship = await productRelationShipProvider.creatProductRelationships(
      manager,
      [
        {
          parentId: product.id,
          childId: product1.id,
          relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
          parentType: PRODUCT_TYPE.PRODUCT,
          childType: PRODUCT_TYPE.ADDON,
          organizationId: user.organization.id,
          config: {
            min: "0",
            max: "3"
          }
        },
        {
          parentId: product2.id,
          childId: product3.id,
          relationship: PRODUCT_RELATIONSHIP.PRODUCT_ADDONS,
          parentType: PRODUCT_TYPE.PRODUCT,
          childType: PRODUCT_TYPE.ADDON,
          organizationId: user.organization.id,
          config: {
            min: "0",
            max: "3"
          }
        }
      ],
      user.organization.id
    );

    expect(productRelationship).toBeTruthy();
    expect(productRelationship.length).toBe(2);
    expect(productRelationship[0].config).toBeTruthy();
    expect(productRelationship[0].config.min).toBe("0");
    expect(productRelationship[0].config.max).toBe("3");
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
