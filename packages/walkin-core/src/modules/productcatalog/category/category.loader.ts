import Dataloader from "dataloader";
import { getManager, In } from "typeorm";
import { Catalog, Category, ProductCategory } from "../../../entity";
import {
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE,
  STATUS
} from "../../common/constants";
import {
  getValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

export const categoryDetailsLoader = () => {
  return new Dataloader(getCategoryDetailsById);
};

async function getCategoryDetailsById(categorIds: any) {
  const categoryDetailsMapping = {};
  const foundCategoryDetails = {};
  const categoryIdsToBeFetched = [];

  for (const categoryId of categorIds) {
    const key = `${CACHING_KEYS.CATEGORY}_${categoryId}`;
    let category: any = await getValueFromCache(key);
    if (category) {
      foundCategoryDetails[categoryId] = category;
    } else {
      categoryIdsToBeFetched.push(categoryId);
    }
  }

  if (categoryIdsToBeFetched.length > 0) {
    const categoryDetails = await getManager().find(Category, {
      where: {
        id: In(categoryIdsToBeFetched)
      },
      relations: ["productCategories", "productCategories.product"],
      order: {
        sortSeq: "ASC"
      }
    });

    for (const category of categoryDetails) {
      const categoryId = category.id;

      // Set category details in Mapping object
      categoryDetailsMapping[categoryId] = category;

      // Set category details in Memory
      const key: any = `${CACHING_KEYS.CATEGORY}_${categoryId}`;
      const value: any = category;
      await setValueToCache(key, value, EXPIRY_MODE.EXPIRE, CACHE_TTL);
    }
  }

  const combinedCategoryDetails = {
    ...foundCategoryDetails,
    ...categoryDetailsMapping
  };
  return categorIds.map(id => combinedCategoryDetails[id]);
}

export const categoryCatalogLoader = () => {
  return new Dataloader(getCategoryCatalog);
};

async function getCategoryCatalog(categoryDetails: any) {
  const catalogIds = categoryDetails.map(category => category.catalogId);

  const organizationId = categoryDetails[0].organizationId;
  const transactionManager = getManager();
  const catalogDetailsMapping = {};

  const options: any = {};
  let query = {
    id: In(catalogIds),
    organization: {
      id: organizationId
    },
    status: STATUS.ACTIVE
  };

  options.where = query;
  options.relations = ["organization"];

  const catalogs = await transactionManager.find(Catalog, options);

  for (const catalog of catalogs) {
    const categoriesLoaded = catalog.categories;
    catalog.categories = [];
    const categoryIds = categoriesLoaded.map(category => category.id);
    const categories = await transactionManager.find(Category, {
      where: {
        id: In(categoryIds)
      },
      cache: true,
      order: {
        sortSeq: "ASC"
      },
      relations: ["productCategories"]
    });

    for (const category of categories) {
      const treeRepo = await transactionManager.getTreeRepository(Category);
      const catTree = await treeRepo.findDescendantsTree(category);
      catalog.categories.push(catTree);
    }
    const catalogCategoriesIds = catalog.categories.map(
      category => category.id
    );

    const productCategoriesInBulk = await transactionManager
      .getRepository(ProductCategory)
      .createQueryBuilder("productCategory")
      .leftJoinAndSelect("productCategory.category", "category")
      .leftJoinAndSelect("productCategory.product", "product")
      .where("category.id IN (:id)", {
        id: catalogCategoriesIds
      })
      .orderBy("productCategory.sortSeq", "ASC")
      .cache(true)
      .getMany();

    const productCategoryMapping = {};
    productCategoriesInBulk.map(productCategoryDetails => {
      productCategoryMapping[productCategoryDetails.category.id] = [
        productCategoryDetails
      ];
    });

    for (const category of catalog.categories) {
      const productCategories = productCategoryMapping[category.id]
        ? productCategoryMapping[category.id]
        : [];

      const products = productCategories.map(productCategory => {
        const product = productCategory.product;
        product["productCategory"] = productCategory;
        return product;
      });
      const index = catalog.categories.findIndex(
        foundCategory => foundCategory.id === category.id
      );
      category["products"] = products;
      catalog.categories[index] = category;
    }
    catalogDetailsMapping[catalog.id] = catalog;
  }

  return catalogIds.map(id => {
    return catalogDetailsMapping[id];
  });
}

export const categoryproductsLoader = () => {
  return new Dataloader(getCategoryProducts);
};

async function getCategoryProducts(categories: any) {
  const categoryIds = categories.map(category => category.id);
  const organizationId = categories[0].organizationId;
  const categoryProductMapping = {};

  const productCategories = await getManager()
    .getRepository(ProductCategory)
    .createQueryBuilder("productCategory")
    .leftJoinAndSelect("productCategory.category", "category")
    .leftJoinAndSelect("productCategory.product", "product")
    .leftJoinAndSelect("product.organization", "organization")
    .where(
      "category.id IN (:...id) and product.listable= :listable and organization.id= :organizationId",
      {
        id: categoryIds,
        listable: true,
        organizationId
      }
    )
    .orderBy("productCategory.sortSeq", "ASC")
    .getMany();

  for (const productCategory of productCategories) {
    const categoryId = productCategory.category.id;

    if (categoryProductMapping[categoryId]) {
      categoryProductMapping[categoryId].push(productCategory.product);
    } else {
      categoryProductMapping[categoryId] = [productCategory.product];
    }
  }

  return categoryIds.map(id =>
    categoryProductMapping[id] ? categoryProductMapping[id] : []
  );
}
