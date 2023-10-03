import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStoreEntityForRewardX1657606436263 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("store", "FK_f36b4b26d587434ea524b33c660");
        await queryRunner.dropForeignKey("store", "FK_STORE_ADMIN_LEVEL_ID");
        await queryRunner.dropIndex("store", "IDX_STORE_ADMIN_LEVEL_ID");
        
        const storeTable = await queryRunner.getTable("store");
        await queryRunner.dropColumn(storeTable, "catalog_id");
        await queryRunner.dropColumn(storeTable, "store_admin_level_id");
        await queryRunner.dropColumn(storeTable, "externalCustomerId");
        await queryRunner.dropColumn(storeTable, "wifi");
        await queryRunner.dropColumn(storeTable, "enable");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
