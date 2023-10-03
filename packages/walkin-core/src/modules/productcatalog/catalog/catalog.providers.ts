import {
  Catalog,
  CatalogUsage,
  Organization,
  Category,
  ProductCategory,
  Store
} from "../../../entity";
import { WalkinError } from "../../common/exceptions/walkin-platform-error";
import { validationDecorator } from "../../common/validations/Validations";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import {
  capitalizeFirstLetter,
  emptyStringCheck,
  updateEntity
} from "../../common/utils/utils";
import { CACHING_KEYS, STATUS } from "../../common/constants";
import { EntityManager, In } from "typeorm";
import {
  clearEntityCache,
  removeValueFromCache
} from "../../common/utils/redisUtils";

interface ICatalogInput {
  id: string;
  organizationId: string;
}

export class CatalogProvider {
  public async getCatalogs(transactionManager, input) {
    const options: any = {};

    const query: any = { ...input, status: STATUS.ACTIVE };

    if (input.organizationId) {
      query.organization = {
        id: input.organizationId
      };
      delete input.organizationId;
    }
    options.where = query;
    options.relations = ["organization"];

    const catalog = await transactionManager.find(Catalog, options);
    return catalog;
  }

  public async findCatalogById(
    transactionManager: EntityManager,
    id,
    organizationId?
  ) {
    const options: any = {};
    let query = {};

    if (organizationId) {
      query = {
        id,
        organization: {
          id: organizationId
        },
        status: STATUS.ACTIVE
      };
    } else {
      query = { id };
    }

    options.where = query;
    options.relations = ["organization"];

    const catalog = await transactionManager.findOne(Catalog, options);
    if (!catalog) {
      throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
    }
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
    for (const category of catalog.categories) {
      const productCategories = await transactionManager
        .getRepository(ProductCategory)
        .createQueryBuilder("productCategory")
        .leftJoinAndSelect("productCategory.category", "category")
        .leftJoinAndSelect("productCategory.product", "product")
        .leftJoinAndSelect("product.variants", "variants")
        .where("category.id=  :id", {
          id: category.id
        })
        .orderBy("productCategory.sortSeq", "ASC")
        .cache(true)
        .getMany();

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

    return catalog;
  }

  public async findCatalogByCode(
    transactionManager: EntityManager,
    { catalogCode, organizationId }
  ) {
    return transactionManager.findOne(Catalog, {
      where: {
        catalogCode,
        organization: {
          id: organizationId
        },
        status: STATUS.ACTIVE
      },
      relations: ["organization"]
    });
  }

  public async findCatalogUsage(transactionManager, id, organizationId) {
    return transactionManager.findOne(CatalogUsage, {
      where: {
        catalogId: id,
        organizationId
      }
    });
  }

  public async createCatalog(transactionManager, catalog) {
    const validationPromises = [];

    const formattedCatalogName = capitalizeFirstLetter(catalog.name);
    catalog.name = formattedCatalogName;
    if (!catalog.organizationId) {
      throw new WalkinError(
        "Attribute organizationId is madatory to create catalog"
      );
    } else {
      validationPromises.push(
        Organization.availableById(transactionManager, catalog.organizationId)
      );
    }
    const organization = await transactionManager.findOneOrFail(Organization, {
      where: { id: catalog.organizationId }
    });
    const createCatalogPromise = async () => {
      catalog.externalCatalogId = emptyStringCheck(catalog.externalCatalogId);
      const newCatalog = transactionManager.create(Catalog, catalog);
      newCatalog.organization = organization;
      const savedCatalog = await transactionManager.save(newCatalog);
      if (catalog.usage) {
        const catalogUsage = await transactionManager.create(CatalogUsage, {
          ...catalog.usage,
          catalogId: savedCatalog.id
        });
        catalogUsage.catalog = savedCatalog;
        catalogUsage.organization = organization;
        await transactionManager.save(catalogUsage);
      }
      return savedCatalog;
    };

    return validationDecorator(createCatalogPromise, validationPromises);
  }

  public async updateCatalog(transactionManager, catalog) {
    const { organizationId } = catalog;
    const validationPromises = [];
    const catalogId = catalog.id;
    const catalogUsageId = catalog.usage?.id;

    if (catalogUsageId) {
      validationPromises.push(
        CatalogUsage.availableByIdForOrganization(
          transactionManager,
          catalogUsageId,
          organizationId
        )
      );
    }

    if (catalogId) {
      validationPromises.push(
        Catalog.availableByIdForOrganization(
          transactionManager,
          catalogId,
          organizationId
        )
      );
    }

    if (catalog.name) {
      const formattedCatalogName = capitalizeFirstLetter(catalog.name);
      catalog.name = formattedCatalogName;
    }

    const prevCatalogValue = await this.getCatalogById(
      transactionManager,
      catalogId
    );

    catalog.externalCatalogId =
      emptyStringCheck(catalog.externalCatalogId) == null
        ? prevCatalogValue.externalCatalogId
        : catalog.externalCatalogId;

    const updateCatalogPromise = async () => {
      const mergedCatalog = await transactionManager.preload(Catalog, {
        ...catalog,
        id: Number(catalogId)
      });
      if (catalog.usage) {
        const catalogUsage = await transactionManager.preload(CatalogUsage, {
          ...catalog.usage,
          id: Number(catalogUsageId)
        });
        if (catalogUsage) {
          catalogUsage.catalog = mergedCatalog;
          transactionManager.save(catalogUsage);
        }
      }
      await clearEntityCache("store", () => {
        console.log("Store Cache removed");
      });
      return transactionManager.save(mergedCatalog);
    };
    return validationDecorator(updateCatalogPromise, validationPromises);
  }

  /**
   * deleteCatalog
   */
  public async deleteCatalog(
    entityManager: EntityManager,
    input: ICatalogInput
  ): Promise<Catalog> {
    const { id, organizationId } = input;
    const existingCatalog = await entityManager.findOne(Catalog, {
      where: {
        id,
        status: STATUS.ACTIVE,
        organization: organizationId
      }
    });
    if (!existingCatalog) {
      throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
    }

    const updatedEntity = {
      status: STATUS.INACTIVE
    };
    await clearEntityCache("store", () => {
      console.log("Store Cache removed");
    });
    const updateCatalog = updateEntity(existingCatalog, updatedEntity);
    const savedUpdatedEntity = await entityManager.save(updateCatalog);
    return savedUpdatedEntity;
  }

  public async getCatalogById(transactionManager, id) {
    const catalog = await transactionManager.findOne(Catalog, {
      id
    });
    if (!catalog) {
      throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
    }
    return catalog;
  }
}
