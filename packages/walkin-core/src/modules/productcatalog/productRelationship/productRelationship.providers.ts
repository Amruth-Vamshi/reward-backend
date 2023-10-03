import { Injectable } from "@graphql-modules/di";
import {
  CACHING_KEYS,
  EXPIRY_MODE,
  LONG_CACHE_TTL
} from "../../common/constants";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

import { EntityManager, In } from "typeorm";
import { Product, ProductRelationship } from "../../../entity";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { updateEntity } from "../../common/utils/utils";

@Injectable()
export class ProductRelationshipProvider {
  public async getProductRelationship(
    entityManager: EntityManager,
    input
  ): Promise<ProductRelationship> {
    const { id } = input;

    const foundProductRelationShip = await entityManager.findOne(
      ProductRelationship,
      {
        where: {
          id
        }
      }
    );
    if (!foundProductRelationShip) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_RELATIONSHIP_NOT_FOUND);
    }
    return foundProductRelationShip;
  }

  public async getChildProductRelationship(
    entityManager: EntityManager,
    input
  ): Promise<ProductRelationship[]> {
    const { parentId } = input;

    const foundProductRelationShip = await entityManager.find(
      ProductRelationship,
      {
        where: {
          parentId
        }
      }
    );
    if (!foundProductRelationShip) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_RELATIONSHIP_NOT_FOUND);
    }
    return foundProductRelationShip;
  }

  public async updateProductRelationships(
    entityManager: EntityManager,
    input: any[],
    organizationId: string
  ) {
    const updatedProductRelationShip = [];
    for (const productRelationShipInput of input) {
      const { id } = productRelationShipInput;
      const foundProductRelationShip = await entityManager.findOne(
        ProductRelationship,
        {
          where: {
            id
          }
        }
      );
      if (!foundProductRelationShip) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_RELATIONSHIP_NOT_FOUND);
      }

      const updatedProductRelationShipEntity = updateEntity(
        foundProductRelationShip,
        productRelationShipInput
      );
      const key = `${CACHING_KEYS.PRODUCT_RELATIONSHIP}_${foundProductRelationShip.parentId}`;
      removeValueFromCache([key]);
      const savedUpdatedEntity = await entityManager.save(
        updatedProductRelationShipEntity
      );
      updatedProductRelationShip.push(savedUpdatedEntity);
    }
    return updatedProductRelationShip;
  }

  public async removeProductRelationships(
    entityManager: EntityManager,
    input: any[],
    organizationId: string
  ) {
    const productRelationShipIds = input.map(
      productRelationShipId => productRelationShipId.id
    );
    const foundProductRelationShips = await entityManager.find(
      ProductRelationship,
      {
        where: {
          id: In(productRelationShipIds)
        }
      }
    );

    const removeProductRelationShip = await entityManager.remove(
      foundProductRelationShips
    );

    for (const foundProductRelationShip of foundProductRelationShips) {
      const key = `${CACHING_KEYS.PRODUCT_RELATIONSHIP}_${foundProductRelationShip.parentId}`;
      removeValueFromCache([key]);
    }

    console.log("foundProductRelationShips", foundProductRelationShips);
    return removeProductRelationShip;
  }

  public async creatProductRelationships(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ) {
    const productRelationShipObjects = [];
    for (const productRelationShipInput of input) {
      const {
        parentId,
        childId,
        relationship,
        parentType,
        childType,
        config
      } = productRelationShipInput;
      const parent = await entityManager.findOne(Product, {
        where: {
          id: parentId,
          organization: organizationId
        }
      });
      if (!parent) {
        throw new WCoreError(WCORE_ERRORS.PARENT_PRODUCT_NOT_FOUND);
      }
      const child = await entityManager.findOne(Product, {
        where: {
          id: childId,
          organization: organizationId
        }
      });
      if (!child) {
        throw new WCoreError(WCORE_ERRORS.CHILD_PRODUCT_NOT_FOUND);
      }
      const foundRelation = await entityManager.findOne(ProductRelationship, {
        where: {
          parentId,
          childId,
          relationship
        }
      });
      if (foundRelation) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_RELATIONSHIP_ALREADY_EXISTS);
      }
      const productRelationShipObject = {
        parentId: parent.id,
        childId: child.id,
        parentType,
        childType,
        relationship,
        config
      };
      const key = `${CACHING_KEYS.PRODUCT_RELATIONSHIP}_${parent.id}`;
      const productRelationShip = await entityManager.create(
        ProductRelationship,
        productRelationShipObject
      );
      removeValueFromCache([key]);
      productRelationShipObjects.push(productRelationShip);
    }
    const savedProductRelationShip = await entityManager.save(
      productRelationShipObjects
    );
    return savedProductRelationShip;
  }

  public async creatProductRelationship(
    entityManager: EntityManager,
    input
  ): Promise<ProductRelationship> {
    console.log(input);
    const {
      parentId,
      childId,
      relationship,
      parentType,
      childType,
      organizationId,
      config
    } = input;
    const parent = await entityManager.findOne(Product, {
      where: {
        id: parentId,
        organization: organizationId
      }
    });
    if (!parent) {
      throw new WCoreError(WCORE_ERRORS.PARENT_PRODUCT_NOT_FOUND);
    }
    const child = await entityManager.findOne(Product, {
      where: {
        id: childId,
        organization: organizationId
      }
    });
    if (!child) {
      throw new WCoreError(WCORE_ERRORS.CHILD_PRODUCT_NOT_FOUND);
    }
    const foundRelation = await entityManager.findOne(ProductRelationship, {
      where: {
        parentId,
        childId,
        relationship
      }
    });
    if (foundRelation) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_RELATIONSHIP_ALREADY_EXISTS);
    }
    const productRelationShipObject = {
      parentId: parent.id,
      childId: child.id,
      parentType,
      childType,
      relationship,
      config
    };
    const key = `${CACHING_KEYS.PRODUCT_RELATIONSHIP}_${parent.id}`;
    removeValueFromCache([key]);
    const productRelationShip = await entityManager.create(
      ProductRelationship,
      productRelationShipObject
    );
    return entityManager.save(productRelationShip);
  }

  public async updateProductRelationship(
    entityManager: EntityManager,
    input
  ): Promise<ProductRelationship> {
    const { id, relationship, config } = input;
    const updateObj = {};
    const foundProductRelationShip = await entityManager.findOne(
      ProductRelationship,
      {
        where: {
          id
        }
      }
    );
    if (!foundProductRelationShip) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_RELATIONSHIP_NOT_FOUND);
    }
    foundProductRelationShip.relationship = relationship;
    if (config) {
      foundProductRelationShip.config = config;
    }
    const updatedObject = updateEntity(foundProductRelationShip, {
      input
    });
    const key = `${CACHING_KEYS.PRODUCT_RELATIONSHIP}_${foundProductRelationShip.parentId}`;
    removeValueFromCache([key]);
    const updatedProductRelationship = await entityManager.save(updatedObject);
    return updatedProductRelationship;
  }

  public async getProductRelationshipByParentId(
    entityManager: EntityManager,
    product
  ) {
    const { id } = product;
    const productId = id;
    const productRelationShip = await entityManager.find(ProductRelationship, {
      where: {
        parentId: productId
      }
    });
    return productRelationShip;
  }

  public async getProductRelationshipByChildId(
    entityManager: EntityManager,
    product
  ) {
    const { id } = product;
    const productId = id;
    const productRelationShip = await entityManager.find(ProductRelationship, {
      where: {
        childId: productId
      }
    });
    return productRelationShip;
  }
}
