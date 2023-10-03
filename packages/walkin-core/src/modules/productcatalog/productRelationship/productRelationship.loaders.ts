import DataLoader from "dataloader";
import { ProductRelationship } from "../../../entity";
import { getManager, In } from "typeorm";

export function productRelationshipLoader() {
  return new DataLoader<string, ProductRelationship>(
    getProductRelationshipByParentId
  );
}


async function getProductRelationshipByParentId(products) {
  const entityManager = getManager();

  let productIds = [];
  let productMap = {};

  products.map(product => {
    productIds.push(product.id);
    productMap[product.id] = product;
  });

  let productRelationShips = [];
  const productRelationshipsMap: any = {};

  const productRelationShipObjects = await entityManager
    .createQueryBuilder(ProductRelationship, "productRelationship")
    .where("productRelationship.parentId IN (:productIds)", {
      productIds: productIds,
    })
    .getMany();

  productRelationShipObjects.map(relationObject => {
    relationObject["product"] = productMap[relationObject.parentId];
    if (productRelationshipsMap[relationObject.parentId]) {
      productRelationshipsMap[relationObject.parentId].push(
        relationObject
      );
    } else {
      productRelationshipsMap[relationObject.parentId] = [relationObject];
    }
  })

  productRelationShips = {
    ...productRelationShipObjects,
  };

  return products.map((product) =>
    productRelationshipsMap[product.id] == null ? [] : productRelationshipsMap[product.id]
  );
}