import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUniqueNameCatalog1585840955206 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex(
            "catalog",
            "IDX_408ad15a08984a8e9b0619ee3e"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Do nothing
    }

}
