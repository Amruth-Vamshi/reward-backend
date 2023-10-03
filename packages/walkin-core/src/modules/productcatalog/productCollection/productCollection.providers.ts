import { Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import UrlSafeString from "url-safe-string";

import {
  Organization,
  Tag,
  ProductTag,
  Collection,
  Product,
  ProductCollection
} from "../../../entity";
import { STATUS } from "../../common/constants";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { addPaginateInfo, updateEntity } from "../../common/utils/utils";

@Injectable()
export class ProductCollectionProvider {
  public async getProductCollection(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<ProductCollection[]> {
    const { productCollectionId } = input;
    const productCollection = await entityManager
      .getRepository(ProductCollection)
      .createQueryBuilder("productCollection")
      .leftJoinAndSelect("productCollection.product", "product")
      .leftJoinAndSelect("productCollection.collection", "collection")
      .where(
        "product.organization=:organizationId and collection.organization=:organizationId  and productCollection.id IN (:...productCollectionId)",
        {
          organizationId,
          productCollectionId
        }
      )
      .getMany();

    return productCollection;
  }
  public async addProductsToCollection(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<ProductCollection | any> {
    const { productId, collectionCode } = input;
    console.log(productId, collectionCode);
    const organization = await entityManager.findOne(Organization, {
      where: { id: organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const collectionFound = await entityManager.findOne(Collection, {
      where: {
        code: collectionCode,
        organization: organizationId
      }
    });
    if (!collectionFound) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_NOT_FOUND);
    }
    const products = await entityManager.find(Product, {
      where: {
        id: In(productId),
        organization: organizationId
      }
    });
    if (products.length === 0) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }
    const collectionSchema = products.map(product => {
      const schema = entityManager.create(ProductCollection, {
        product,
        collection: collectionFound
      });
      return schema;
    });
    const savedEntity = await entityManager
      .createQueryBuilder()
      .insert()
      .into(ProductCollection)
      .values([...collectionSchema])
      .execute();
    return savedEntity;
  }

  public async removeProductsFromCollection(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<ProductCollection[]> {
    const { productId, collectionCode } = input;
    console.log(productId, collectionCode);
    const organization = await entityManager.findOne(Organization, {
      where: { id: organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const foundEntities = await entityManager
      .getRepository(ProductCollection)
      .createQueryBuilder("productCollection")
      .leftJoinAndSelect("productCollection.product", "product")
      .leftJoinAndSelect("productCollection.collection", "collection")
      .where("collection.code=:collectionCode", { collectionCode })
      .where(
        "product.organization=:organizationId and collection.organization=:organizationId  and product.id IN (:...productId)",
        {
          organizationId,
          productId
        }
      )
      .getMany();
    if (foundEntities.length === 0) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_COLLECTION_NOT_FOUND);
    }
    try {
      const removeEntities = await entityManager.remove(foundEntities);
      return removeEntities;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}
