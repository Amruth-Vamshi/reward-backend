import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateColumnIdForPersonWithAutoGeneration1637835140884 implements MigrationInterface {

    /**
     * Using queryRunner.query 
     * * Wouldn't be able to modify an ID column via queryRunner functions without dropping the existing column
     * * ID is primary, hence direct query to modify the column 
     * * NOTE: To be avoided in future
     */

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('SET FOREIGN_KEY_CHECKS=0');
        await queryRunner.query(`ALTER TABLE person modify column id bigint NOT NULL AUTO_INCREMENT`);
        await queryRunner.query('SET FOREIGN_KEY_CHECKS=1');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
