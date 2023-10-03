import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddColumnsPaymentPartnerAndType1586868283145 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "order_payment",
            new TableColumn({
                name: "payment_type",
                type: "varchar",
                isNullable: true
            })
        );

        await queryRunner.addColumn(
            "order_payment",
            new TableColumn({
                name: "payment_partner_id",
                type: "varchar",
                isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "order_payment",
            new TableForeignKey({
                columnNames: ["payment_partner_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "partner"
            })
        );

        await queryRunner.createForeignKey(
            "order_payment",
            new TableForeignKey({
                columnNames: ["payment_type"],
                referencedColumnNames: ["id"],
                referencedTableName: "payment_type"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
