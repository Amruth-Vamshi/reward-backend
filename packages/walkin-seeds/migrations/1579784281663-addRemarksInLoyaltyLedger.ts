import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addRemarksInLoyaltyLedger1579784281663 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "loyalty_ledger",
            new TableColumn({
                name: "remarks",
                type: "varchar",
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
