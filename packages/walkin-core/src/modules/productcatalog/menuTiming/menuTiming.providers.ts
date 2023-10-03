import { Inject, Injectable } from "@graphql-modules/di";
import {
  capitalizeFirstLetter,
  formatMenuTimings,
  formatMenuTimingsForCode,
  formatUpdateMenuTimingInput,
  getFormattedInputMenuTimings,
  getSlug,
  updateEntity,
  validateMenuTimings
} from "../../common/utils/utils";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { MenuTimings } from "../../../entity/MenuTimings";
import { MenuTimingForCategory } from "../../../entity/MenuTimingForCategory";
import { MenuTimingForProduct } from "../../../entity/MenuTimingForProduct";
import { CACHE_TTL, CACHING_KEYS, EXPIRY_MODE } from "../../common/constants";
import {
  clearEntityCache,
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import { Not } from "typeorm";
import { Category, Product } from "../../../entity";
import { logger } from "../../common/utils/loggerUtil";
@Injectable()
export class MenuTimingProvider {
  public async getMenuTimingsByCode(transactionManager, input) {
    // Assign input to respective variables
    const menuCode = input.code;
    const organizationId = input.organizationId;

    // Fetch the menu timings code details
    if (!menuCode || (menuCode && menuCode.trim().length === 0)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_MENU_TIMING_CODE);
    }

    const key = `${CACHING_KEYS.MENU_TIMINGS}_${menuCode}_${organizationId}`;
    let menuTimingsForCode = await getValueFromCache(key);
    if (!menuTimingsForCode) {
      menuTimingsForCode = await transactionManager.find(MenuTimings, {
        where: {
          code: menuCode,
          organization: organizationId
        }
      });
      if (menuTimingsForCode.length > 0) {
        await setValueToCache(
          key,
          menuTimingsForCode,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    return menuTimingsForCode;
  }

  public async getMenuTimingsByName(transactionManager, input) {
    const menuName = input.name;
    const organizationId = input.organizationId;
    // Fetch menu timings by specifying name
    if (!menuName || (menuName && menuName.trim().length === 0)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_MENU_TIMING_NAME);
    }
    const menuTimingsForName = await transactionManager.find(MenuTimings, {
      where: {
        name: menuName,
        organization: organizationId
      }
    });
    return menuTimingsForName;
  }

  public async getMenuTimingsCodeUsedForCategory(transactionManager, input) {
    // Fetch menu timings code for category

    const menuTimingForCategory = await transactionManager
      .getRepository(MenuTimingForCategory)
      .createQueryBuilder("menuTimingForCategory")
      .leftJoinAndSelect("menuTimingForCategory.category", "category")
      .leftJoinAndSelect("category.catalog", "catalog")
      .leftJoinAndSelect("catalog.organization", "organization")
      .where("menuTimingForCategory.code=  :code and organization.id= :organization", {
        code: input.code,
        organization: input.organizationId
      })
      .getMany();

    if (menuTimingForCategory.length > 0) {
      return true;
    }
    return false;
  }

  public async getMenuTimingsCodeUsedForProduct(transactionManager, input) {
    // Fetch menu timings code for product
    const menuTimingForProduct = await transactionManager
      .getRepository(MenuTimingForProduct)
      .createQueryBuilder("menuTimingForProduct")
      .leftJoinAndSelect("menuTimingForProduct.product", "product")
      .leftJoinAndSelect("product.organization", "organization")
      .where("menuTimingForProduct.code=  :code and organization.id= :organization", {
        code: input.code,
        organization: input.organizationId
      })
      .getMany();

    if (menuTimingForProduct.length > 0) {
      return true;
    }
    return false;
  }

  public async checkForMenuTimingsCodeUsage(transactionManager, input) {
    /**
     * Check if the menu timings are alloted to category or product.
     * Menu timings cannot be removed if they are being used.
     */
    let menuTimingForCategory = await this.getMenuTimingsCodeUsedForCategory(
      transactionManager,
      input
    );
    if (menuTimingForCategory) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_USED_FOR_CATEGORY);
    }

    const menuTimingForProduct = await this.getMenuTimingsCodeUsedForProduct(
      transactionManager,
      input
    );
    if (menuTimingForProduct) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_USED_FOR_PRODUCT);
    }
    return;
  }

  public async fetchAllMenuTimingsByCode(entityManager, input, organizationId) {
    const key = `${CACHING_KEYS.MENU_TIMINGS}_${input.code}_${organizationId}`;
    let menuTimingsForCode = await getValueFromCache(key);
    if (!menuTimingsForCode) {
      menuTimingsForCode = await entityManager.find(MenuTimings, {
        where: {
          code: input.code,
          organization: organizationId
        }
      });
      if (menuTimingsForCode.length > 0) {
        await setValueToCache(
          key,
          menuTimingsForCode,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    return menuTimingsForCode;
  }

  public async clearTimingsForCategoryAndProduct() {
    // clear menuTimingsForCategory and menuTimingsForProduct entity cache when menu timings is updated

    await clearEntityCache("menuTimingsForCategory", () => {
      logger.info("CLEARED ENITY CACHE FOR CATEGORY");
    });
    await clearEntityCache("menuTimingsForProduct", () => {
      logger.info("CLEARED ENITY CACHE FOR PRODUCT");
    });
    return;
  }

  public async clearCacheForOrganizationMenuCode(menuCode, organizationId) {
    // Clear menu timings for organization as new timings are added and will be modified
    const keys = [
      `${CACHING_KEYS.MENU_TIMINGS}_${menuCode}_${organizationId}`,
      `${CACHING_KEYS.MENU_TIMINGS}_${organizationId}`
    ];
    removeValueFromCache(keys);
    return;
  }

  public async createMenuTimings(transactionManager, input) {
    const organizationId = input.organizationId;

    // Format and validate timings provided in the input
    let menuTimings = input.menuTimings;
    menuTimings = getFormattedInputMenuTimings(menuTimings);
    menuTimings = validateMenuTimings(menuTimings);

    // Format menu timings name
    let menuName = input.name;
    const formattedMenuTimingName = capitalizeFirstLetter(menuName);
    input.name = formattedMenuTimingName;

    const uniqueMenuTimingName = await this.getMenuTimingsByName(
      transactionManager,
      input
    );
    if (uniqueMenuTimingName.length !== 0) {
      throw new WCoreError(WCORE_ERRORS.DUPLICATE_MENU_TIMING_NAME);
    }

    // Format menu timings code
    let menuCode = input.code;
    const formattedMenuTimingCode = getSlug(menuCode);
    input.code = formattedMenuTimingCode;

    const uniqueMenuTimingCode = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length !== 0) {
      throw new WCoreError(WCORE_ERRORS.DUPLICATE_MENU_TIMING_CODE);
    }

    // set variables if the slug values are not taken already
    menuCode = formattedMenuTimingCode;
    menuName = formattedMenuTimingName;

    menuTimings = menuTimings.map(timing => {
      return {
        ...timing,
        name: menuName,
        code: menuCode,
        organization: organizationId
      };
    });

    const menuTimingsSchema = await transactionManager.create(
      MenuTimings,
      menuTimings
    );
    let savedMenuTimings = await transactionManager.save(menuTimingsSchema);
    savedMenuTimings = formatMenuTimings(savedMenuTimings);

    this.clearCacheForOrganizationMenuCode(menuCode, organizationId);
    return savedMenuTimings;
  }

  public async removeMenuTimings(transactionManager, input) {
    const menuCode = input.code;
    const organizationId = input.organizationId;

    const uniqueMenuTimingCode = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    // Find if menu timing code is being used for category or product
    await this.checkForMenuTimingsCodeUsage(transactionManager, input);

    let removedMenuTimings = await transactionManager.remove(
      MenuTimings,
      uniqueMenuTimingCode
    );
    removedMenuTimings = formatMenuTimings(removedMenuTimings);

    this.clearCacheForOrganizationMenuCode(menuCode, organizationId);

    // Clear cache used in category and product data loaders
    this.clearTimingsForCategoryAndProduct();

    return removedMenuTimings;
  }

  public async addMenuTimings(transactionManager, input) {
    const menuCode = input.code;
    const organizationId = input.organizationId;

    let existingMenuTimingsForCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (existingMenuTimingsForCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    let menuTimings = input.menuTimings;
    menuTimings = getFormattedInputMenuTimings(menuTimings);

    existingMenuTimingsForCode = existingMenuTimingsForCode.map(menuTiming => {
      return {
        days: JSON.parse(menuTiming.days),
        openTime: menuTiming.openTime,
        closeTime: menuTiming.closeTime,
        name: menuTiming.name
      };
    });

    let mergedMenuTimings = [];
    mergedMenuTimings = [...menuTimings, ...existingMenuTimingsForCode];

    validateMenuTimings(mergedMenuTimings);
    menuTimings = menuTimings.map(timing => {
      return {
        ...timing,
        name: existingMenuTimingsForCode[0].name,
        code: menuCode,
        organization: organizationId
      };
    });
    const menuTimingsSchema = await transactionManager.create(
      MenuTimings,
      menuTimings
    );
    let savedMenuTimings = await transactionManager.save(menuTimingsSchema);
    savedMenuTimings = formatMenuTimings(savedMenuTimings);

    this.clearCacheForOrganizationMenuCode(menuCode, organizationId);

    // Clear cache used in category and product data loaders
    this.clearTimingsForCategoryAndProduct();

    return savedMenuTimings;
  }

  /**
    * @resetMenuTimings
    * To reset all the timings for a code, we will remove the existing timings and
    * then add the new timings.
  */
  public async resetMenuTimings(transactionManager, input) {
    const menuCode = input.code;
    const organizationId = input.organizationId;

    let existingMenuTimingsForCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );

    if (existingMenuTimingsForCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    let menuTimings = input.menuTimings;
    menuTimings = getFormattedInputMenuTimings(menuTimings);
    validateMenuTimings(menuTimings);

    menuTimings = menuTimings.map(timing => {
      return {
        ...timing,
        name: existingMenuTimingsForCode[0].name,
        code: menuCode,
        organization: organizationId
      };
    });

    // Remove existing timings for the specific menuCode
    await transactionManager.remove(
      MenuTimings,
      existingMenuTimingsForCode
    );

    // Save new set of timings
    const menuTimingsSchema = await transactionManager.create(
      MenuTimings,
      menuTimings
    );
    let savedMenuTimings = await transactionManager.save(menuTimingsSchema);
    savedMenuTimings = formatMenuTimings(savedMenuTimings);

    this.clearCacheForOrganizationMenuCode(menuCode, organizationId);

    // Clear cache used in category and product data loaders
    this.clearTimingsForCategoryAndProduct();

    return savedMenuTimings;
  }

  public async getMenuTimings(transactionManager, input) {
    const organizationId = input.organizationId;
    const key = `${CACHING_KEYS.MENU_TIMINGS}_${organizationId}`;
    let menuTimingsForOrganization: any = await getValueFromCache(key);
    if (!menuTimingsForOrganization) {
      menuTimingsForOrganization = await transactionManager.find(MenuTimings, {
        where: {
          organization: organizationId
        }
      });
      if (menuTimingsForOrganization.length > 0) {
        await setValueToCache(
          key,
          menuTimingsForOrganization,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    menuTimingsForOrganization = formatMenuTimingsForCode(
      menuTimingsForOrganization
    );
    return menuTimingsForOrganization;
  }

  public async updateMenuTimings(transactionManager, input) {
    const menuCode = input.code;
    const organizationId = input.organizationId;

    // Validate timings given as input
    let menuTimings = input.menuTimings;
    menuTimings = formatUpdateMenuTimingInput(menuTimings);
    validateMenuTimings(menuTimings);

    // Check if correct code is given as input
    const uniqueMenuTimingCode = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    // Fetch existing menu timings and validate with the new menu timings
    let updateMenuTimingSchema = [];
    for (const menuTime of menuTimings) {
      let existingMenuTimings = await transactionManager.findOne(MenuTimings, {
        where: {
          id: menuTime.id,
          code: menuCode,
          organization: organizationId
        }
      });
      if (!existingMenuTimings) {
        throw new WCoreError(WCORE_ERRORS.MENU_TIMING_NOT_FOUND);
      } else {
        let existingMenuTimingsForCode = await transactionManager.find(
          MenuTimings,
          {
            where: {
              id: Not(menuTime.id),
              days: menuTime["days"],
              code: menuCode,
              organization: organizationId
            }
          }
        );

        let mergedMenuTimings = [...[menuTime], ...existingMenuTimingsForCode];

        validateMenuTimings(mergedMenuTimings);
        updateEntity(existingMenuTimings, menuTime);
        updateMenuTimingSchema.push(existingMenuTimings);
      }
    }

    let savedMenuTimings = await transactionManager.save(
      updateMenuTimingSchema
    );

    this.clearCacheForOrganizationMenuCode(menuCode, organizationId);

    // Clear cache used in category and product data loaders
    this.clearTimingsForCategoryAndProduct();

    savedMenuTimings = formatMenuTimings(savedMenuTimings);
    return savedMenuTimings;
  }

  public async removeMenuTimingsById(transactionManager, input) {
    const organizationId = input.organizationId;
    const menuCode = input.code;

    const menuTimingIds = input.id;
    if (!menuTimingIds || (menuTimingIds && menuTimingIds.length === 0)) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_IDS_EMPTY);
    }

    const uniqueMenuTimingCode = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    const menuTimingsToBeRemoved = [];
    for (const menuTimingId of menuTimingIds) {
      const menuTimings = await transactionManager.findOne(MenuTimings, {
        where: {
          id: menuTimingId,
          organization: organizationId
        }
      });

      if (!menuTimings) {
        throw new WCoreError(WCORE_ERRORS.MENU_TIMING_NOT_FOUND);
      }
      menuTimingsToBeRemoved.push(menuTimings);
    }

    // Check if menu timing code is being used for category or product
    if (menuTimingsToBeRemoved.length === uniqueMenuTimingCode.length) {
      await this.checkForMenuTimingsCodeUsage(transactionManager, input);
    }

    const removedMenuTiming = await transactionManager.remove(
      MenuTimings,
      menuTimingsToBeRemoved
    );

    this.clearCacheForOrganizationMenuCode(menuCode, organizationId);

    // Clear cache used in category and product data loaders
    this.clearTimingsForCategoryAndProduct();

    return formatMenuTimings(removedMenuTiming);
  }

  public async menuTimingCodeForCategory(transactionManager, category) {
    const key = `${CACHING_KEYS.MENU_TIMINGS}_${category}`;
    let menuTimings = await getValueFromCache(key);
    if (!menuTimings) {
      menuTimings = await transactionManager.findOne(MenuTimingForCategory, {
        where: {
          category
        },
        relations: ["category"]
      });
      if (menuTimings) {
        await setValueToCache(key, menuTimings, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
    }
    return menuTimings;
  }

  public clearCacheForCategoryTimings(categoryId) {
    // Clear the menu timings code and the list of actual menu timings for category from cache
    const keys = [
      `${CACHING_KEYS.MENU_TIMINGS}_${categoryId}`,
      `${CACHING_KEYS.MENU_TIMINGS_FOR_CATEGORY}_${categoryId}`
    ];
    removeValueFromCache(keys);
    return;
  }

  public async addMenuTimingsForCategory(transactionManager, input) {
    const categoryId = input.category;
    const menuTimingsForCategory = await this.menuTimingCodeForCategory(
      transactionManager,
      categoryId
    );
    if (menuTimingsForCategory) {
      throw new WCoreError(
        WCORE_ERRORS.MENU_TIMING_ALREADY_EXISTS_FOR_CATEGORY
      );
    }

    let uniqueMenuTimingCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    const categoryDetails = await transactionManager.findOne(Category, {
      where: {
        id: categoryId
      }
    });
    if (!categoryDetails) {
      throw new WCoreError(WCORE_ERRORS.CATEGORY_NOT_FOUND);
    }

    const menuTimingsSchema = await transactionManager.create(
      MenuTimingForCategory,
      input
    );
    const savedMenuTimings = await transactionManager.save(menuTimingsSchema);
    uniqueMenuTimingCode = formatMenuTimings(uniqueMenuTimingCode);

    savedMenuTimings["menuTimings"] = uniqueMenuTimingCode;
    savedMenuTimings["category"] = categoryDetails;

    this.clearCacheForCategoryTimings(categoryId);
    return savedMenuTimings;
  }

  public async removeMenuTimingsForCategory(transactionManager, input) {
    const categoryId = input.category;
    const menuCode = input.code;

    const menuTimingsForCategory = await transactionManager.findOne(
      MenuTimingForCategory,
      {
        where: {
          code: menuCode,
          category: categoryId
        },
        relations: ["category"]
      }
    );
    if (!menuTimingsForCategory) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_NOT_FOUND_FOR_CATEGORY);
    }

    let uniqueMenuTimingCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    const removedMenuTiming = await transactionManager.remove(
      MenuTimingForCategory,
      menuTimingsForCategory
    );

    uniqueMenuTimingCode = formatMenuTimings(uniqueMenuTimingCode);
    removedMenuTiming["menuTimings"] = uniqueMenuTimingCode;

    this.clearCacheForCategoryTimings(categoryId);
    return removedMenuTiming;
  }

  public async updateMenuTimingsForCategory(transactionManager, input) {
    const categoryId = input.category;

    const menuTimingsForCategory: any = await this.menuTimingCodeForCategory(
      transactionManager,
      categoryId
    );

    if (!menuTimingsForCategory) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_NOT_FOUND_FOR_CATEGORY);
    }

    let uniqueMenuTimingCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    const categoryDetails = menuTimingsForCategory.category;

    updateEntity(menuTimingsForCategory, input);
    let savedMenuTimings = await transactionManager.save(
      MenuTimingForCategory,
      menuTimingsForCategory
    );

    // set menu timings in the response
    uniqueMenuTimingCode = formatMenuTimings(uniqueMenuTimingCode);
    savedMenuTimings["menuTimings"] = uniqueMenuTimingCode;
    savedMenuTimings["category"] = categoryDetails;

    this.clearCacheForCategoryTimings(categoryId);
    return savedMenuTimings;
  }

  public async getMenuTimingsForCategory(transactionManager, input) {
    const categoryId = input.category;
    const organizationId = input.organizationId;

    const menuTimingsForCategory: any = await this.menuTimingCodeForCategory(
      transactionManager,
      categoryId
    );

    if (!menuTimingsForCategory) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_NOT_FOUND_FOR_CATEGORY);
    }

    let uniqueMenuTimingCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      {
        code: menuTimingsForCategory.code,
        organizationId: organizationId
      }
    );
    uniqueMenuTimingCode = formatMenuTimings(uniqueMenuTimingCode);
    menuTimingsForCategory["menuTimings"] = uniqueMenuTimingCode;
    return menuTimingsForCategory;
  }

  public async menuTimingCodeForProduct(transactionManager, product) {
    const key = `${CACHING_KEYS.MENU_TIMINGS}_${product}`;
    let menuTimings = await getValueFromCache(key);
    if (!menuTimings) {
      menuTimings = await transactionManager.findOne(MenuTimingForProduct, {
        where: {
          product
        },
        relations: ["product"]
      });
      if (menuTimings) {
        await setValueToCache(key, menuTimings, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
    }
    return menuTimings;
  }

  public clearCacheForProductTimings(productId) {
    const keys = [
      `${CACHING_KEYS.MENU_TIMINGS}_${productId}`,
      `${CACHING_KEYS.PRODUCT}_${productId}`,
      `${CACHING_KEYS.MENU_TIMINGS_FOR_PRODUCT}_${productId}`
    ];
    removeValueFromCache(keys);
    return;
  }

  public async getMenuTimingsForProduct(transactionManager, input) {
    const productId = input.product;

    const menuTimingsForProduct: any = await this.menuTimingCodeForProduct(
      transactionManager,
      productId
    );

    if (!menuTimingsForProduct) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_NOT_FOUND_FOR_PRODUCT);
    }

    let uniqueMenuTimingCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      {
        code: menuTimingsForProduct.code,
        organizationId: input.organizationId
      }
    );
    uniqueMenuTimingCode = formatMenuTimings(uniqueMenuTimingCode);
    menuTimingsForProduct["menuTimings"] = uniqueMenuTimingCode;
    return menuTimingsForProduct;
  }

  public async addMenuTimingsToProduct(transactionManager, input) {
    const productId = input.product;
    const menuTimingsForProduct = await this.menuTimingCodeForProduct(
      transactionManager,
      productId
    );

    if (menuTimingsForProduct) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_ALREADY_EXISTS_FOR_PRODUCT);
    }

    let uniqueMenuTimingCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    const productDetails = await transactionManager.findOne(Product, {
      where: {
        id: productId
      }
    });

    if (!productDetails) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }

    const menuTimingsSchema = await transactionManager.create(
      MenuTimingForProduct,
      input
    );
    const savedMenuTimings = await transactionManager.save(menuTimingsSchema);

    // set menu timings in the response
    uniqueMenuTimingCode = formatMenuTimings(uniqueMenuTimingCode);
    savedMenuTimings["menuTimings"] = uniqueMenuTimingCode;
    savedMenuTimings["product"] = productDetails;

    this.clearCacheForProductTimings(productId);
    return savedMenuTimings;
  }

  public async removeMenuTimingsForProduct(transactionManager, input) {
    const productId = input.product;
    const menuCode = input.code;

    const menuTimingsForProduct = await transactionManager.findOne(
      MenuTimingForProduct,
      {
        where: {
          code: menuCode,
          product: productId
        },
        relations: ["product"]
      }
    );
    if (!menuTimingsForProduct) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_NOT_FOUND_FOR_PRODUCT);
    }

    let uniqueMenuTimingCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    const removedMenuTiming = await transactionManager.remove(
      MenuTimingForProduct,
      menuTimingsForProduct
    );

    uniqueMenuTimingCode = formatMenuTimings(uniqueMenuTimingCode);
    removedMenuTiming["menuTimings"] = uniqueMenuTimingCode;

    this.clearCacheForProductTimings(productId);
    return removedMenuTiming;
  }

  public async updateMenuTimingsForProduct(transactionManager, input) {
    const productId = input.product;

    const menuTimingsForProduct: any = await this.menuTimingCodeForProduct(
      transactionManager,
      productId
    );

    if (!menuTimingsForProduct) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_NOT_FOUND_FOR_PRODUCT);
    }
    const productDetails = menuTimingsForProduct.product;

    let uniqueMenuTimingCode: any = await this.getMenuTimingsByCode(
      transactionManager,
      input
    );
    if (uniqueMenuTimingCode.length === 0) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_CODE_NOT_FOUND);
    }

    updateEntity(menuTimingsForProduct, input);
    let savedMenuTimings = await transactionManager.save(
      MenuTimingForProduct,
      menuTimingsForProduct
    );

    // set menu timings in the response
    uniqueMenuTimingCode = formatMenuTimings(uniqueMenuTimingCode);
    savedMenuTimings["menuTimings"] = uniqueMenuTimingCode;
    savedMenuTimings["product"] = productDetails;

    this.clearCacheForProductTimings(productId);
    return savedMenuTimings;
  }
}