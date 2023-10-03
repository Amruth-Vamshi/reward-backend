import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnInvoiceNumberToOrderEntity1645511566345 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "order",
            new TableColumn({
                name: "invoice_number",
                isUnique: true,
                isNullable: true,
                type: "bigint",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}
