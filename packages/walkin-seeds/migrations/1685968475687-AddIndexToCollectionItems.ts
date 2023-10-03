import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIndexToCollectionItems1685968475687 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {
            await transactionManager.query(`CREATE INDEX COLLECTIONS_ITEM_ID_INDEX  ON collections_items(item_id);`);
              
            await transactionManager.query(`CREATE INDEX COLLECTIONS_ENTITY_INDEX ON collections(entity);`);
            
          });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}

}
