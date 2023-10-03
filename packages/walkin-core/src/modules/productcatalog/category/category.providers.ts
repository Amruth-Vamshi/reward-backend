import {
  CACHING_KEYS,
  EXPIRY_MODE,
  SHORT_CACHE_TTL,
  STATUS
} from "../../common/constants";
import {
  WalkinError,
  WalkinPlatformError
} from "../../common/exceptions/walkin-platform-error";
import { validationDecorator } from "../../common/validations/Validations";
import { validateAndReturnEntityExtendedData } from "../../entityExtend/utils/EntityExtension";
import { updateEntity, capitalizeFirstLetter } from "../../common/utils/utils";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { ProductCategory, Category, Catalog } from "../../../entity";
import { In, EntityManager } from "typeorm";
import {
  clearEntityCache,
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

interface ICategorySeq {
  id: string;
  sortSeq: number;
}
interface IUpdateCategorySortSeq {
  organizationId: string;
  categorySeq: ICategorySeq[];
}

export class CategoryProvider {
  public async findById(transactionManager, id) {
    const result = await transactionManager.findOneOrFail(Category, {
      where: {
        id
      },
      relations: [
        "productCategories",
        "productCategories.product"
        // "productCategories.product.variants",
        // "productCategories.product.variants.productVariantValues",
        // "productCategories.product.variants.productVariantValues.optionValue",
        // "productCategories.product.variants.productVariantValues.optionValue.option"
      ],
      order: {
        sortSeq: "ASC"
      }
    });

    return result;
  }
  public async findDescendentsTree(
    transactionManager,
    catalogId,
    categoryCode
  ) {
    let rootCategory = null;
    if (categoryCode) {
      rootCategory = await transactionManager.findOne(Category, {
        where: {
          code: categoryCode,
          catalog: {
            id: catalogId
          }
        },
        order: {
          sortSeq: "ASC"
        }
      });
      return transactionManager
        .getRepository(Category)
        .findDescendantsTree(rootCategory);
    } else {
      rootCategory = await transactionManager.findOne(Category, {
        where: {
          parentId: "",
          catalog: {
            id: catalogId
          }
        }
      });
      return transactionManager
        .getRepository(Category)
        .findDescendantsTree(rootCategory);
    }
  }

  public async findByCode(transactionManager, catalogId, categoryCode) {
    const result = await transactionManager.findOneOrFail(Category, {
      where: {
        code: categoryCode,
        catalog: {
          id: catalogId
        }
      },
      relations: [
        "productCategories",
        "productCategories.product",
        "productCategories.product.variants",
        "productCategories.product.variants.productVariantValues",
        "productCategories.product.variants.productVariantValues.optionValue",
        "productCategories.product.variants.productVariantValues.optionValue.option"
      ],
      order: {
        sortSeq: "ASC"
      }
    });

    return transactionManager
      .getRepository(Category)
      .findDescendantsTree(result);
  }

  public async updateCategorySortSeq(
    entityManager: EntityManager,
    input: IUpdateCategorySortSeq
  ) {
    const categoryIds = input.categorySeq.map(category => category.id);

    const foundCategories = await entityManager.find(Category, {
      where: {
        id: In(categoryIds)
      }
    });

    for (const category of foundCategories) {
      const categorySeqInput = input.categorySeq.find(
        foundCategory => foundCategory.id === category.id
      );
      const keys = [`${CACHING_KEYS.CATEGORY}_${category.id}`];
      removeValueFromCache(keys);
      category.sortSeq = categorySeqInput.sortSeq;
    }
    await clearEntityCache("store", () => {
      console.log("Store Cache removed");
    });

    const updatedCategory = await entityManager.save(foundCategories);
    return updatedCategory;
  }

  public async createCategory(transactionManager, categoryDetails) {
    const validationPromises = [];
    const formattedCategoryName = capitalizeFirstLetter(categoryDetails.name);
    categoryDetails.name = formattedCategoryName;
    if (categoryDetails.parentId) {
      validationPromises.push(
        Category.availableById(transactionManager, categoryDetails.parentId)
      );
    }
    if (categoryDetails.catalogId) {
      validationPromises.push(
        Catalog.availableById(transactionManager, categoryDetails.catalogId)
      );
    } else {
      throw new WalkinError(
        "Attribute catalogId is madatory to create category"
      );
    }

    const createCategoryPromise = async () => {
      const category = await transactionManager.create(
        Category,
        categoryDetails
      );
      if (categoryDetails.catalogId) {
        category.catalog = await transactionManager.create(Catalog, {
          id: categoryDetails.catalogId
        });
      }
      if (categoryDetails.parentId) {
        category.parent = await transactionManager.create(Category, {
          id: categoryDetails.parentId
        });
      }
      // Handle Entity Extensions
      const { extend } = categoryDetails;
      if (extend !== undefined) {
        try {
          const extendData = await validateAndReturnEntityExtendedData(
            transactionManager,
            extend,
            categoryDetails.organizationId,
            "category"
          );
          category.extend = extendData;
        } catch (e) {
          throw new WalkinPlatformError(
            "cust005",
            "entity extended data is invalid",
            e,
            400,
            ""
          );
        }
      }
      // Handle Entity Extensions
      const savedCategory = await transactionManager.save(category);
      return savedCategory;
    };

    return validationDecorator(createCategoryPromise, validationPromises);
  }

  public async updateCategory(transactionManager, categoryDetails) {
    const validationPromises = [];
    if (categoryDetails.name) {
      const formattedCategoryName = capitalizeFirstLetter(categoryDetails.name);
      categoryDetails.name = formattedCategoryName;
    }
    if (categoryDetails.id) {
      validationPromises.push(
        Category.availableById(transactionManager, categoryDetails.id)
      );
    }
    if (categoryDetails.parentId) {
      validationPromises.push(
        Category.availableById(transactionManager, categoryDetails.parentId)
      );
    }
    if (categoryDetails.catalogId) {
      validationPromises.push(
        Catalog.availableById(transactionManager, categoryDetails.catalogId)
      );
    }

    const updateCategoryPromise = async () => {
      const mergedCategory = await transactionManager.findOne(Category, {
        where: {
          id: categoryDetails.id
        }
      });

      await clearEntityCache("store", () => {
        console.log("Store Cache removed");
      });
      const keys = [`${CACHING_KEYS.CATEGORY}_${mergedCategory.id}`];
      removeValueFromCache(keys);

      updateEntity(mergedCategory, categoryDetails);
      mergedCategory.parent = transactionManager.create(Category, {
        id: categoryDetails.parentId
      });
      mergedCategory.catalog = transactionManager.create(Catalog, {
        id: categoryDetails.catalogId
      });
      // Handle Entity Extensions
      const { extend } = categoryDetails;
      if (extend !== undefined) {
        try {
          const extendData = await validateAndReturnEntityExtendedData(
            transactionManager,
            extend,
            categoryDetails.organizationId,
            "category"
          );
          mergedCategory.extend = extendData;
        } catch (e) {
          throw new WalkinPlatformError(
            "cust005",
            "entity extended data is invalid",
            e,
            400,
            ""
          );
        }
      }
      // Handle Entity Extensions
      return transactionManager.save(mergedCategory);
    };

    return validationDecorator(updateCategoryPromise, validationPromises);
  }

  public async disableCategory(transactionManager, id) {
    const category = await transactionManager.findOne(Category, {
      id
    });
    if (category && category.status === STATUS.ACTIVE) {
      const updateCategory = await transactionManager.update(
        Category,
        { id: category.id },
        { status: STATUS.INACTIVE }
      );

      const keys = [`${CACHING_KEYS.CATEGORY}_${id}`];
      removeValueFromCache(keys);
      await clearEntityCache("store", () => {
        console.log("Store Cache removed");
      });
      return updateCategory;
    } else if (category && category.status === STATUS.INACTIVE) {
      throw new Error("Category is already inactive.");
    } else {
      throw new Error("Category not found");
    }
  }

  public async getCategories(
    transactionManager: EntityManager,
    categorySearchObj
  ) {
    const validationPromises = [];
    if (categorySearchObj.catalogId) {
      if (categorySearchObj.catalogId) {
        validationPromises.push(
          Catalog.availableByIdForOrganization(
            transactionManager,
            categorySearchObj.catalogId,
            categorySearchObj.organizationId
          )
        );
      }
    }

    const categoriesPromise = async () => {
      if (categorySearchObj.catalogId) {
        categorySearchObj.catalog = {
          id: categorySearchObj.catalogId
        };
        delete categorySearchObj["catalogId"];
      }
      const options: any = {};
      options.where = categorySearchObj;
      options.relations = ["catalog"];

      const categories = await transactionManager.find(Category, {
        ...options,
        order: {
          sortSeq: "ASC"
        }
      });

      if (!categories) {
        throw new WCoreError(WCORE_ERRORS.CATEGORY_NOT_FOUND);
      }

      for (const category of categories) {
        const subCategories = await transactionManager
          .getTreeRepository(Category)
          .findDescendantsTree(category);

        category["children"] = subCategories.children;
      }

      return categories;
    };

    return validationDecorator(categoriesPromise, validationPromises);
  }

  public async getCategoriesWithProductId(transactionManager, productId) {
    const productCategories = await transactionManager.find(ProductCategory, {
      where: {
        product: {
          id: productId
        },
        relations: ["category"]
      }
    });
    let categoryArray = [];
    let categories = [];
    for (const productCategory of productCategories) {
      if (productCategory) {
        categoryArray.push(productCategory.categoryId);
      }
    }
    if (categoryArray.length > 0) {
      categories = await transactionManager.find(Category, {
        where: {
          id: In(categoryArray)
        }
      });
    }
    return categories;
  }

  public async getCategoriesByIds(entityManager: EntityManager, categoryIds) {
    const categoriesArray = await entityManager.find(Category, {
      where: {
        id: In(categoryIds),
        listable: true,
        status: STATUS.ACTIVE
      },
      cache: true,
      order: {
        sortSeq: "ASC"
      },
      relations: ["productCategories"]
    });
    return categoriesArray;
  }

  public async getProductsWithCategoryId(transactionManager, categoryId) {
    const productCategories = await transactionManager
      .getRepository(ProductCategory)
      .createQueryBuilder("productCategory")
      .leftJoinAndSelect("productCategory.category", "category")
      .leftJoinAndSelect("productCategory.product", "product")
      .leftJoinAndSelect("product.organization", "organization")
      .where("category.id=  :id and product.listable= :listable", {
        id: categoryId,
        listable: true
      })
      .orderBy("productCategory.sortSeq", "ASC")
      .getMany();
    let products = [];
    if (productCategories) {
      products = productCategories.map(productCategory => {
        return productCategory.product;
      });
    }

    return products;
  }
}
