import { EntityManager } from "typeorm";
import { CollectionsRepository } from "../../collections/collections.repository";

export async function checkIfItemExistsInCollection(
  entityManager: EntityManager,
  itemId,
  collectionsId
): Promise<boolean> {
  let queryRunner = await entityManager.connection.createQueryRunner();
  let collectionItem = await queryRunner.manager.query(
    `SELECT * FROM collections_items WHERE item_id='${itemId}' AND collections_id='${collectionsId}'`
  );
  await queryRunner.release();
  if (collectionItem.length > 1) {
    return collectionItem[0];
  }
  return null;
}

export async function listOutCollectionsOfLoyaltyProgram(
  injector,
  entityManager,
  loyalty_program_detail
): Promise<object> {
  let dynamicCollections: any = [],
    staticCollections: any = [];
  let collectionIds = loyalty_program_detail.collection_ids;
  collectionIds = collectionIds.replace(/^(.)|(.)$/g, "");
  collectionIds = collectionIds.replace(/\s/g, "");
  collectionIds = collectionIds.split(",");
  for (let i = 0; i < collectionIds.length; i++) {
    let id = collectionIds[i].replace(/^(.)|(.)$/g, "");
    let collection = await injector
      .get(CollectionsRepository)
      .getCollections_rawQuery(entityManager, {
        id: id,
        organization_id: loyalty_program_detail.organization_id
      });

    if (collection[0].rule_set_id == null) {
      staticCollections.push({ ...collection[0] });
    } else {
      dynamicCollections.push({ ...collection[0] });
    }
  }
  return { dynamicCollections, staticCollections };
}
