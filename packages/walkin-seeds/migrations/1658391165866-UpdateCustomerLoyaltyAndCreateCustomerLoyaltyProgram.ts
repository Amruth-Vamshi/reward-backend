import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class UpdateCustomerLoyaltyAndCreateCustomerLoyaltyProgram1658391165866 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "customer_loyalty",
            new TableColumn({
                name: "start_date",
                type: "datetime",
                default: "CURRENT_TIMESTAMP",
                isNullable: false
            }),
        )

        await queryRunner.addColumn(
            "customer_loyalty",
            new TableColumn({
                name: "end_date",
                type: "datetime",
                isNullable: true
            })
        )

        await queryRunner.addColumn(
            "customer_loyalty",
            new TableColumn({
                name: "status",
                type: "varchar(255)",
                isNullable: true,
                default: "'ACTIVE'"
            })
        )

        // Create customer_loyalty_program
        await queryRunner.createTable(
            new Table({
                name: "customer_loyalty_program",
                columns: [{
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
                    name: "loyalty_program_code",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "loyalty_experiment_code",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "redeemed_transactions",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "issued_transactions",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "customer_loyalty_id",
                    type: "int",
                    isNullable: false
                }]
            })
        )

        await queryRunner.createForeignKey(
            "customer_loyalty_program",
            new TableForeignKey({
                columnNames: ["customer_loyalty_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "customer_loyalty"
            })
        );


        // Add customer_loyalty_program_id foreign key to loyalty_transaction
        await queryRunner.addColumn(
            "loyalty_transaction",
            new TableColumn({
                name: "customer_loyalty_program_id",
                type: "varchar(36)",
                isNullable: true
            })
        )

        await queryRunner.createForeignKey(
            "loyalty_transaction",
            new TableForeignKey({
                columnNames: ["customer_loyalty_program_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "customer_loyalty_program",
                name: "loyalty_transaction_customer_loyalty_program"
            })
        );

        await queryRunner.dropForeignKey("loyalty_transaction", "loyalty_transaction_customer_loyalty");

        const loyaltyTransaction = await queryRunner.getTable("loyalty_transaction");
        await queryRunner.dropColumn(loyaltyTransaction, "customer_loyalty_id");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
