import {MigrationInterface, QueryRunner} from "typeorm";

export class ADDNECESSARYINDEXCOLLECTIONFILTERS1687143273537 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {
            await transactionManager.query(`DROP INDEX COLLECTIONS_ITEM_ID_INDEX  ON collections_items;`);
              
            await transactionManager.query(`DROP INDEX COLLECTIONS_ENTITY_INDEX ON collections;`);

            await transactionManager.query(`CREATE INDEX COLLECTION_ID_ITEM_ID on collections_items(collections_id,item_id);`);
            
          });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
