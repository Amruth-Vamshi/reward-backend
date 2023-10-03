import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class UpdateLoyaltyTransactionAndCreateLoyaltyTransactionData1658316356570 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const loyaltyTransaction = await queryRunner.getTable("loyalty_transaction");
        await queryRunner.dropColumn(loyaltyTransaction, "data");

        // Create loyalty_transaction_data table
        await queryRunner.createTable(
            new Table({
                name: "loyalty_transaction_data",
                columns: [
                    {
                        name: "id",
                        type: "varchar(36)",
                        isPrimary: true
                    },
                    {
                        name: "created_by",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "last_modified_by",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "created_time",
                        type: "datetime(6)",
                        default: "CURRENT_TIMESTAMP(6)",
                        isNullable: false
                    },
                    {
                        name: "last_modified_time",
                        type: "datetime(6)",
                        default: "CURRENT_TIMESTAMP(6)",
                        isNullable: false
                    },
                    {
                        name: "date",
                        type: "datetime",
                        isNullable: false
                    },
                    {
                        name: "data_input",
                        isNullable: false,
                        type: "varchar(255)"
                    },
                    {
                        name: "loyalty_transaction_id",
                        isNullable: false,
                        type: "int"
                    }]
            })
        )

        await queryRunner.createForeignKey(
            "loyalty_transaction_data",
            new TableForeignKey({
                columnNames: ["loyalty_transaction_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "loyalty_transaction"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
