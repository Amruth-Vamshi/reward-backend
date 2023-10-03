import { getManager, getConnection } from "typeorm";
import { MenuTimingProvider } from "../menuTiming.providers";
import { MenuTimingModule } from "../menuTiming.module";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import * as CoreEntities from "@walkinserver/walkin-core/src/entity";
import { Chance } from "chance";
import { ENUM_DAY, STATUS } from "../../../common/constants";
import { capitalizeFirstLetter, getSlug } from "../../../common/utils/utils";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { CategoryProvider } from "../../category/category.providers";
import { CategoryModule } from "../../category/category.module";
import { CatalogProvider } from "../../catalog/catalog.providers";
import { CatalogModule } from "../../catalog/catalog.module";
import { ProductProvider } from "../../product/product.providers";
import { ProductModule } from "../../product/product.module";

const chance = new Chance();
let user: CoreEntities.User;

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const menuTimingService: MenuTimingProvider = MenuTimingModule.injector.get(
  MenuTimingProvider
);

const catalogService: CatalogProvider = CatalogModule.injector.get(
  CatalogProvider
);

const categoryService: CategoryProvider = CategoryModule.injector.get(
  CategoryProvider
);

const productService: ProductProvider = ProductModule.injector.get(
  ProductProvider
);

describe("Should create and add menu timings", () => {
  test("Should create new set of menu timings", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();
    expect(createdMenuTiming.name).toBe(capitalizeFirstLetter(name));
    expect(createdMenuTiming.code).toBe(getSlug(code));
    expect(createdMenuTiming.timings[0].data[0].openTime).toBe(
      menuTimingInput.menuTimings[0].data[0].openTime
    );
    expect(createdMenuTiming.timings[0].data[0].closeTime).toBe(
      menuTimingInput.menuTimings[0].data[0].closeTime
    );
  });

  test("Should FAIL to create new set of menu timings when duplicate name is given", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code = chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    try {
      await menuTimingService.createMenuTimings(manager, {
        ...menuTimingInput,
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DUPLICATE_MENU_TIMING_NAME)
      );
    }
  });

  test("Should FAIL to create new set of menu timings when duplicate code is given", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code = chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    try {
      menuTimingInput.name = chance.string({ length: 4 });
      await menuTimingService.createMenuTimings(manager, {
        ...menuTimingInput,
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.DUPLICATE_MENU_TIMING_CODE)
      );
    }
  });

  test("Should FAIL to create new set of menu timings if invalid timings are given", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code = chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 2010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };

    try {
      await menuTimingService.createMenuTimings(manager, {
        ...menuTimingInput,
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.INCORRECT_MENU_TIMING));
    }
  });

  test("Should add menu timings to existing menu timing code", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    const menuTimingInput2 = {
      code: getSlug(code),
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1320,
              closeTime: 1400
            }
          ]
        }
      ]
    };

    const addedMenuTiming = await menuTimingService.addMenuTimings(manager, {
      ...menuTimingInput2,
      organizationId: user.organization.id
    });
    expect(addedMenuTiming).toBeDefined();
    expect(addedMenuTiming.name).toBe(capitalizeFirstLetter(name));
    expect(addedMenuTiming.code).toBe(getSlug(code));
    expect(addedMenuTiming.timings[0].data[0].openTime).toBe(
      menuTimingInput2.menuTimings[0].data[0].openTime
    );
    expect(addedMenuTiming.timings[0].data[0].closeTime).toBe(
      menuTimingInput2.menuTimings[0].data[0].closeTime
    );
  });

  test("Should FAIL add menu timings to existing menu timing code if there are conflicts in the given timings", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    const menuTimingInput2 = {
      code: getSlug(code),
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 2210,
              closeTime: 2217
            }
          ]
        }
      ]
    };

    try {
      await menuTimingService.addMenuTimings(manager, {
        ...menuTimingInput2,
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.CONLFICT_IN_MENU_TIMINGS_FOR_DAYS)
      );
    }
  });

  test("Should reset menu timings to existing menu timing code", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    const menuTimingInput2 = {
      code: getSlug(code),
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1320,
              closeTime: 1400
            }
          ]
        }
      ]
    };

    const resetMenuTiming = await menuTimingService.resetMenuTimings(manager, {
      ...menuTimingInput2,
      organizationId: user.organization.id
    });
    expect(resetMenuTiming).toBeDefined();
    expect(resetMenuTiming.name).toBe(capitalizeFirstLetter(name));
    expect(resetMenuTiming.code).toBe(getSlug(code));
    expect(resetMenuTiming.timings.length).toBe(menuTimingInput2.menuTimings.length);
    expect(resetMenuTiming.timings[0].data[0].openTime).toBe(
      menuTimingInput2.menuTimings[0].data[0].openTime
    );
    expect(resetMenuTiming.timings[0].data[0].closeTime).toBe(
      menuTimingInput2.menuTimings[0].data[0].closeTime
    );
  });

  test("Should create new set of menu timings to category", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();
    expect(createdMenuTiming.name).toBe(capitalizeFirstLetter(name));
    expect(createdMenuTiming.code).toBe(getSlug(code));

    const catalogInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 3 })
    };

    const categoryInput = {
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
    categoryInput.name = capitalizeFirstLetter(categoryInput.name);
    expect(category).toBeTruthy();
    expect(category.name).toBe(categoryInput.name);

    const addMenuTimingsInput = {
      code: createdMenuTiming.code,
      category: category.id
    };
    const menuTimingForCategory = await menuTimingService.addMenuTimingsForCategory(
      manager,
      {
        ...addMenuTimingsInput,
        organizationId: user.organization.id
      }
    );
    expect(menuTimingForCategory).toBeDefined();
    expect(menuTimingForCategory.menuTimings.name).toBe(createdMenuTiming.name);
    expect(menuTimingForCategory.menuTimings.code).toBe(createdMenuTiming.code);
  });

  test("Should create new set of menu timings to product", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    let productInput = {
      name: chance.string({ length: 5 }),
      description: "Product desc",
      code: "PRODUCT_CODE",
      status: STATUS.ACTIVE,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
      isPurchasedSeparately: false
    };

    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });

    const addMenuTimingsInput = {
      code: createdMenuTiming.code,
      product: product.id
    };
    const menuTimingForProduct = await menuTimingService.addMenuTimingsToProduct(
      manager,
      {
        ...addMenuTimingsInput,
        organizationId: user.organization.id
      }
    );
    expect(menuTimingForProduct).toBeDefined();
    expect(menuTimingForProduct.menuTimings.name).toBe(createdMenuTiming.name);
    expect(menuTimingForProduct.menuTimings.code).toBe(createdMenuTiming.code);
  });
});

describe("Should remove menu timings", () => {
  test("Should remove existing menu timings", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    const removedMenuTimingInput = {
      code: getSlug(code)
    };
    const removedMenuTiming = await menuTimingService.removeMenuTimings(
      manager,
      {
        ...removedMenuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(removedMenuTiming).toBeDefined();
    expect(removedMenuTiming.name).toBe(capitalizeFirstLetter(name));
    expect(removedMenuTiming.code).toBe(getSlug(code));
    expect(removedMenuTiming.timings[0].data[0].openTime).toBe(
      menuTimingInput.menuTimings[0].data[0].openTime
    );
    expect(removedMenuTiming.timings[0].data[0].closeTime).toBe(
      menuTimingInput.menuTimings[0].data[0].closeTime
    );
  });

  test("Should FAIL to remove menu timings if code is invalid", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code = chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    const removeMenuTimingInput = {
      code
    };

    try {
      await menuTimingService.removeMenuTimings(manager, {
        ...removeMenuTimingInput,
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND)
      );
    }
  });

  test("Should remove menu timings from category", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();
    expect(createdMenuTiming.name).toBe(capitalizeFirstLetter(name));
    expect(createdMenuTiming.code).toBe(getSlug(code));

    const catalogInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 3 })
    };

    const categoryInput = {
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
    categoryInput.name = capitalizeFirstLetter(categoryInput.name);
    expect(category).toBeTruthy();
    expect(category.name).toBe(categoryInput.name);

    const categoryMenuTimingInput = {
      code: createdMenuTiming.code,
      category: category.id
    };
    const addMenuTimingForCategory = await menuTimingService.addMenuTimingsForCategory(
      manager,
      {
        ...categoryMenuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(addMenuTimingForCategory).toBeDefined();

    const menuTimingForCategory = await menuTimingService.removeMenuTimingsForCategory(
      manager,
      {
        ...categoryMenuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(menuTimingForCategory).toBeDefined();
    expect(menuTimingForCategory.menuTimings.name).toBe(createdMenuTiming.name);
    expect(menuTimingForCategory.menuTimings.code).toBe(createdMenuTiming.code);
  });

  test("Should remove menu timings from product", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    let productInput = {
      name: chance.string({ length: 5 }),
      description: "Product desc",
      code: "PRODUCT_CODE",
      status: STATUS.ACTIVE,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
      isPurchasedSeparately: false
    };

    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });

    const addMenuTimingsInput = {
      code: createdMenuTiming.code,
      product: product.id
    };
    const menuTimingForProduct = await menuTimingService.addMenuTimingsToProduct(
      manager,
      {
        ...addMenuTimingsInput,
        organizationId: user.organization.id
      }
    );
    expect(menuTimingForProduct).toBeDefined();
    expect(menuTimingForProduct.menuTimings.name).toBe(createdMenuTiming.name);
    expect(menuTimingForProduct.menuTimings.code).toBe(createdMenuTiming.code);

    const productMenuTimingInput = {
      code: createdMenuTiming.code,
      product: product.id
    };
    const removedMenuTimingForProduct = await menuTimingService.removeMenuTimingsForProduct(
      manager,
      {
        ...productMenuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(removedMenuTimingForProduct).toBeDefined();
    expect(removedMenuTimingForProduct.menuTimings.name).toBe(
      createdMenuTiming.name
    );
    expect(removedMenuTimingForProduct.menuTimings.code).toBe(
      createdMenuTiming.code
    );
  });
});

describe("Should update menu timings", () => {
  test("Should update existing menu timings", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();
    expect(createdMenuTiming.name).toBe(capitalizeFirstLetter(name));
    expect(createdMenuTiming.code).toBe(getSlug(code));

    const updateMenuTimingInput = {
      code: getSlug(code),
      menuTimings: [
        {
          id: createdMenuTiming.timings[0].data[0].id,
          days: ENUM_DAY.TUESDAY,
          openTime: 2100,
          closeTime: 2200
        }
      ]
    };
    const updateMenuTiming = await menuTimingService.updateMenuTimings(
      manager,
      {
        ...updateMenuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(updateMenuTiming).toBeDefined();
  });
  test("Should update category menu timings", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();
    expect(createdMenuTiming.name).toBe(capitalizeFirstLetter(name));
    expect(createdMenuTiming.code).toBe(getSlug(code));

    const catalogInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      catalogCode: chance.string({ length: 3 })
    };

    const categoryInput = {
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
    categoryInput.name = capitalizeFirstLetter(categoryInput.name);
    expect(category).toBeTruthy();
    expect(category.name).toBe(categoryInput.name);

    const addMenuTimingsInput = {
      code: createdMenuTiming.code,
      category: category.id
    };
    const menuTimingForCategory = await menuTimingService.addMenuTimingsForCategory(
      manager,
      {
        ...addMenuTimingsInput,
        organizationId: user.organization.id
      }
    );
    expect(menuTimingForCategory).toBeDefined();

    const menuTimingInput2 = {
      name: chance.string({ length: 7 }),
      code: chance.string({ length: 5 }),
      menuTimings: [
        {
          days: ENUM_DAY.TUESDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdNewMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput2,
        organizationId: user.organization.id
      }
    );
    const addNewMenuTimingsInput = {
      code: createdNewMenuTiming.code,
      category: category.id
    };
    const updateMenuTimingForCategory = await menuTimingService.updateMenuTimingsForCategory(
      manager,
      {
        ...addNewMenuTimingsInput,
        organizationId: user.organization.id
      }
    );
    expect(updateMenuTimingForCategory).toBeDefined();
    expect(updateMenuTimingForCategory.code).toBe(createdNewMenuTiming.code);
  });
  test("Should update menu timings for product", async () => {
    const manager = getManager();
    const name = chance.string({ length: 5 });
    const code =
      chance.string({ length: 3 }) + " " + chance.string({ length: 3 });
    const menuTimingInput = {
      name,
      code,
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    let productInput = {
      name: chance.string({ length: 5 }),
      description: "Product desc",
      code: "PRODUCT_CODE",
      status: STATUS.ACTIVE,
      categoryIds: [],
      imageUrl: chance.url(),
      sku: chance.string(),
      isPurchasedSeparately: false
    };

    productInput["organizationId"] = user.organization.id;
    const product = await productService.createProduct(manager, {
      ...productInput,
      organizationId: user.organization.id
    });

    const addMenuTimingsInput = {
      code: createdMenuTiming.code,
      product: product.id
    };
    const menuTimingForProduct = await menuTimingService.addMenuTimingsToProduct(
      manager,
      {
        ...addMenuTimingsInput,
        organizationId: user.organization.id
      }
    );
    expect(menuTimingForProduct).toBeDefined();
    expect(menuTimingForProduct.menuTimings.name).toBe(createdMenuTiming.name);
    expect(menuTimingForProduct.menuTimings.code).toBe(createdMenuTiming.code);

    const productMenuTimingInput = {
      code: createdMenuTiming.code,
      product: product.id
    };

    const menuTimingInput2 = {
      name: chance.string({ length: 5 }),
      code: chance.string({ length: 5 }),
      menuTimings: [
        {
          days: ENUM_DAY.MONDAY,
          data: [
            {
              openTime: 1010,
              closeTime: 1200
            },
            {
              openTime: 2200,
              closeTime: 2310
            }
          ]
        }
      ]
    };
    const createdNewMenuTiming = await menuTimingService.createMenuTimings(
      manager,
      {
        ...menuTimingInput2,
        organizationId: user.organization.id
      }
    );
    expect(createdMenuTiming).toBeDefined();

    const addNewMenuTimingsInput = {
      code: createdNewMenuTiming.code,
      product: product.id
    };
    const updateMenuTimingForCategory = await menuTimingService.updateMenuTimingsForProduct(
      manager,
      {
        ...addNewMenuTimingsInput,
        organizationId: user.organization.id
      }
    );
    expect(updateMenuTimingForCategory).toBeDefined();
    expect(updateMenuTimingForCategory.code).toBe(createdNewMenuTiming.code);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
