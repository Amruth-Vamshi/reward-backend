// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { CatalogModule } from "../catalog.module";
import resolvers from "../catalog.resolvers";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { capitalizeFirstLetter } from "../../../common/utils/utils";
import { ProductModule } from "../../product/product.module";
import { ProductProvider } from "../../product/product.providers";
import { STATUS } from "../../../common/constants";
import { CategoryProvider } from "../../category/category.providers";
import { CategoryModule } from "../../category/category.module";

const productService: ProductProvider = ProductModule.injector.get(
  ProductProvider
);

const categoryService: CategoryProvider = CategoryModule.injector.get(
  CategoryProvider
);

let user: WCoreEntities.User;
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create and Update Catalogs", () => {
  const application = null;

  test("should create channel name with correct inputs", async () => {
    const manager = getManager();
    const catalogCode = "NEW_CATALOG";

    const catalogInput = {
      name: chance.name(),
      catalogCode,
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      }
    };
    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );

    expect(createCatalog.catalogCode).toBe(catalogCode);
  });
  test("should delete catalog with valid inputs", async () => {
    const catalogCode = chance.string({ length: 6 });

    const catalogInput = {
      name: chance.name(),
      catalogCode,
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      }
    };
    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );

    expect(createCatalog.catalogCode).toBe(catalogCode);

    const deleteCatalog = await resolvers.Mutation.deleteCatalog(
      { user, application },
      {
        id: createCatalog.id,
        organizationId: user.organization.id
      },
      { injector: CatalogModule.injector }
    );

    expect(deleteCatalog.id).toBe(createCatalog.id);
    expect(deleteCatalog.catalogCode).toBe(catalogCode);
    expect(deleteCatalog.status).toBe(STATUS.INACTIVE);
  });
  test("should not create catalog with incorrect inputs", async () => {
    const manager = getManager();

    const catalogInput = {
      name: chance.name(),
      catalogCode: "NEW_CATALOG",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      }
    };

    const createCatalog = resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );
    await expect(createCatalog).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.CATALOG_CODE_ALREADY_EXISTS)
    );
  });

  test("should update a catalog with valid info", async () => {
    const catalogInput = {
      name: chance.name(),
      catalogCode: chance.company(),
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      }
    };

    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );
    let updatedName = chance.string();
    const updateCatalog = await resolvers.Mutation.updateCatalog(
      { user, application },
      {
        input: {
          id: createCatalog.id,
          name: updatedName
        }
      },
      { injector: CatalogModule.injector }
    );
    updatedName = capitalizeFirstLetter(updatedName);
    expect(updateCatalog.name).toBe(updatedName);
  });

  test("should throw an error for updating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();
    const updateCatalog = resolvers.Mutation.updateCatalog(
      { user, application },
      {
        input: {
          id: chance.guid(),
          name: updatedName
        }
      },
      { injector: CatalogModule.injector }
    );
    await expect(updateCatalog).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND)
    );
  });
  test("should create catalog with externalCatalogId", async () => {
    const manager = getManager();
    const catalogCode = "NEW_CATALOG-1";

    const catalogInput = {
      name: chance.name(),
      catalogCode,
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      },
      externalCatalogId: "extId"
    };
    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );

    expect(createCatalog.catalogCode).toBe(catalogCode);
    expect(createCatalog.externalCatalogId).toEqual("extId");
  });
  test("should update a catalog with externalCatalogId", async () => {
    const catalogInput = {
      name: chance.name(),
      catalogCode: chance.company(),
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      },
      externalCatalogId: "newExtId"
    };

    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );
    let updatedName = chance.string();
    const updateCatalog = await resolvers.Mutation.updateCatalog(
      { user, application },
      {
        input: {
          id: createCatalog.id,
          name: updatedName,
          externalCatalogId: "updatedExtID"
        }
      },
      { injector: CatalogModule.injector }
    );
    updatedName = capitalizeFirstLetter(updatedName);
    expect(updateCatalog.name).toBe(updatedName);
    expect(createCatalog.externalCatalogId).toEqual("newExtId");
    expect(updateCatalog.externalCatalogId).toEqual("updatedExtID");
  });

  test("should create catalog with null externalCatalogId", async () => {
    const manager = getManager();
    const catalogCode = "NEW_CATALOG-121";

    const catalogInput = {
      name: chance.name(),
      catalogCode,
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      },
      externalCatalogId: ""
    };
    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );

    expect(createCatalog.catalogCode).toBe(catalogCode);
    expect(createCatalog.externalCatalogId).toBeNull();
  });

  test("should update a catalog with prev value externalCatalogId with empty string", async () => {
    const catalogInput = {
      name: chance.name(),
      catalogCode: chance.company(),
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      },
      externalCatalogId: "newExtId"
    };

    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );
    let updatedName = chance.string();
    const updateCatalog = await resolvers.Mutation.updateCatalog(
      { user, application },
      {
        input: {
          id: createCatalog.id,
          name: updatedName,
          externalCatalogId: ""
        }
      },
      { injector: CatalogModule.injector }
    );
    updatedName = capitalizeFirstLetter(updatedName);
    expect(updateCatalog.name).toBe(updatedName);
    expect(createCatalog.externalCatalogId).toEqual("newExtId");
    expect(updateCatalog.externalCatalogId).toEqual("newExtId");
  });
});

describe("Update a catalog name", () => {
  const application = null;

  test("should update a catalog with valid info", async () => {
    const catalogInput = {
      name: chance.name(),
      catalogCode: chance.company(),
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      }
    };

    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );
    let updatedName = chance.string();
    const updateCatalog = await resolvers.Mutation.updateCatalog(
      { user, application },
      {
        input: {
          id: createCatalog.id,
          name: updatedName
        }
      },
      { injector: CatalogModule.injector }
    );
    updatedName = capitalizeFirstLetter(updatedName);
    expect(updateCatalog.name).toBe(updatedName);
  });

  test("should throw an error for updating invalid info", async () => {
    const manager = getManager();
    const updatedName = chance.string();
    const updateCatalog = resolvers.Mutation.updateCatalog(
      { user, application },
      {
        input: {
          id: chance.guid(),
          name: updatedName
        }
      },
      { injector: CatalogModule.injector }
    );
    await expect(updateCatalog).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND)
    );
  });
});

describe("Should fetch a catalog", () => {
  const application = null;

  test("should be able to fech a valid catalog", async () => {
    let name = chance.string();

    const catalogInput = {
      name,
      catalogCode: chance.company(),
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      }
    };

    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );

    const getCatalog = await resolvers.Query.catalog(
      { user, application },
      {
        id: createCatalog.id
      },
      { injector: CatalogModule.injector }
    );
    name = capitalizeFirstLetter(name);
    expect(getCatalog).toBeDefined();
    expect(getCatalog.name).toBe(name);
  });

  test("should throw an error ofr invalid catalog", async () => {
    const manager = getManager();

    const getCatalog = resolvers.Query.catalog(
      { user, application },
      {
        id: chance.guid()
      },
      { injector: CatalogModule.injector }
    );
    await expect(getCatalog).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND)
    );
  });
  test("should be able to fech a valid catalog", async () => {
    let name = chance.string();

    const catalogInput = {
      name,
      catalogCode: chance.company(),
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      },
      externalCatalogId: "test"
    };

    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );

    const getCatalog = await resolvers.Query.catalogs(
      { user, application },
      {
        externalCatalogId: "test"
      },
      { injector: CatalogModule.injector }
    );
    name = capitalizeFirstLetter(name);
    expect(getCatalog).toBeDefined();
    expect(getCatalog[0].name).toBe(name);
    expect(getCatalog[0].externalCatalogId).toEqual("test");
  });

  test("should be able to fech sortSeq, product category id from a catalog", async () => {
    const manager = getManager();
    let name = chance.string();

    const catalogInput = {
      name,
      catalogCode: chance.company(),
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      usage: {
        purpose: chance.country({ length: 5 })
      }
    };

    const createCatalog = await resolvers.Mutation.createCatalog(
      { user, application },
      {
        input: catalogInput
      },
      { injector: CatalogModule.injector }
    );

    const categoryInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      code: chance.string({ length: 3 }),
      status: STATUS.ACTIVE
    };

    const category = await categoryService.createCategory(manager, {
      ...categoryInput,
      catalogId: createCatalog.id,
      organizationId: user.organization.id
    });

    let productInput = {
      name: "Product 1",
      description: "Product desc",
      code: "PRODUCT_CODE",
      status: STATUS.ACTIVE,
      categoryIds: [category.id],
      imageUrl: chance.url(),
      sku: chance.string(),
      isPurchasedSeparately: false,
      organizationId: user.organization.id
    };

    const createdProduct = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });

    const getCatalog = await resolvers.Query.catalog(
      { user, application },
      {
        id: createCatalog.id
      },
      { injector: CatalogModule.injector }
    );
    name = capitalizeFirstLetter(name);
    expect(getCatalog).toBeDefined();
    expect(getCatalog.name).toBe(name);

    const productsForCategory =
      getCatalog.categories[0].products[0].productCategory;
    expect(productsForCategory.id).toBeDefined();
    expect(productsForCategory.sortSeq).toBeDefined();
    expect(productsForCategory.category.id).toBe(category.id);
    expect(productsForCategory.product.id).toBe(createdProduct.id);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
