import {MigrationInterface, QueryRunner} from "typeorm";

export class DropColumnCustomerFromAddress1637615186032 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const addressTable = await queryRunner.getTable("address");
        await queryRunner.dropColumn(addressTable, "customer");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Do nothing
    }

}
