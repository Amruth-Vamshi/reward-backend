import { Inject, Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import UrlSafeString from "url-safe-string";

import { Organization, Tag, ProductTag, Product } from "../../../entity";
import { Organizations } from "../../account/organization/organization.providers";
import {
  CACHING_KEYS,
  EXPIRY_MODE,
  LONG_CACHE_TTL,
  STATUS
} from "../../common/constants";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import { addPaginateInfo, updateEntity } from "../../common/utils/utils";
import { ProductProvider } from "../product/product.providers";

@Injectable()
export class ProductTagProvider {
  constructor(
    @Inject(Organizations) private organizationProvider: Organizations,
    @Inject(ProductProvider) private productProvider: ProductProvider
  ) { }
  public async getProductTags(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<ProductTag[]> {
    const { productTagId, productId } = input;
    let whereClause =
      "product.organization=:organizationId and tag.organization=:organizationId";
    const filterCondition = {
      organizationId
    };
    if (productTagId) {
      whereClause =
        whereClause + " " + "and productTag.id IN (:...productTagId)";
      filterCondition["productTagId"] = productTagId;
    }
    if (productId) {
      whereClause = whereClause + " " + "and product.id=:productId";
      filterCondition["productId"] = productId;
    }
    const productTags = await entityManager
      .getRepository(ProductTag)
      .createQueryBuilder("productTag")
      .leftJoinAndSelect("productTag.product", "product")
      .leftJoinAndSelect("productTag.tag", "tag")
      .where(whereClause, filterCondition)
      .getMany();

    return productTags;
  }
  public async addTagsToProduct(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<ProductTag | any> {
    const { productId, tagCodes } = input;
    const organization = await this.organizationProvider.getOrganizationById(
      entityManager,
      organizationId
    );
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const tagsFound = await entityManager.find(Tag, {
      where: {
        code: In(tagCodes),
        organization: organizationId
      }
    });
    if (tagsFound.length === 0) {
      throw new WCoreError(WCORE_ERRORS.TAG_NOT_FOUND);
    }
    const product = await this.productProvider.getProductById(
      entityManager,
      productId,
      organizationId
    );
    if (!product) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }
    const productTagSchema = tagsFound.map(tag => {
      const schema = entityManager.create(ProductTag, {
        product,
        tag
      });
      return schema;
    });
    const savedProductTag = await entityManager
      .createQueryBuilder()
      .insert()
      .into(ProductTag)
      .values([...productTagSchema])
      .orIgnore()
      .execute();
    return savedProductTag;
  }

  public async removeTagsFromProduct(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<ProductTag | any> {
    const { productId, tagCodes } = input;

    const organization = await entityManager.findOne(Organization, {
      where: { id: organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const foundEntities = await entityManager
      .getRepository(ProductTag)
      .createQueryBuilder("productTag")
      .leftJoinAndSelect("productTag.product", "product")
      .leftJoinAndSelect("productTag.tag", "tag")
      .where("product.id=:productId", { productId })
      .andWhere(
        "product.organization=:organizationId and tag.organization=:organizationId  and tag.code IN (:...tagCodes)",
        {
          organizationId,
          tagCodes
        }
      )
      .getMany();
    if (foundEntities.length === 0) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_TAG_NOT_FOUND);
    }
    try {
      const removeEntities = await entityManager.remove(foundEntities);
      const keys = [`${CACHING_KEYS.PRODUCT_TAG}_${productId}`];
      removeValueFromCache(keys);
      return removeEntities;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
  public async getProductTagsByProductId(
    entityManager: EntityManager,
    input
  ): Promise<ProductTag[]> {
    const { productId } = input;
    const key = `${CACHING_KEYS.PRODUCT_TAG}_${productId}`;
    let productTag: any = await getValueFromCache(key);
    if (!productTag) {
      productTag = await entityManager.find(ProductTag, {
        where: {
          product: {
            id: productId
          }
        },
        relations: ["product"]
      });
      if (productTag) {
        await setValueToCache(
          key,
          productTag,
          EXPIRY_MODE.EXPIRE,
          LONG_CACHE_TTL
        );
      }
    }
    return productTag;
  }
}
