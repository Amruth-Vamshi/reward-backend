import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingEntityOrganizationIdIndex1687317006199 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {

            await transactionManager.query(`CREATE INDEX COLLECTION_ENTITY_AND_ORGANIZATION_ID on collections(entity,organization_id);`);
            
          });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
