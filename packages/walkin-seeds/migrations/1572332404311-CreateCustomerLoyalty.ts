import {
    MigrationInterface,
    TableForeignKey,
    QueryRunner,
    Table
} from "typeorm";

export class CreateCustomerLoyalty1572332404311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // create customer loyalty table

        await queryRunner.createTable(new Table({
            name: "customer_loyalty",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
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
                    name: "customer_id",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "loyalty_card_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "points",
                    type: "float",
                    default: 0
                },
                {
                    name: "points_blocked",
                    type: "int",
                    default: 0
                },
                {
                    name: "redeemed_transactions",
                    type: "int",
                    default: 0
                },
                {
                    name: "issued_transactions",
                    type: "int",
                    default: 0
                },

            ]
        }),
            true
        );



        await queryRunner.createForeignKey(
            "customer_loyalty",
            new TableForeignKey({
                columnNames: ["loyalty_card_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "loyalty_card"
            })
        );

        await queryRunner.createForeignKey(
            "customer_loyalty",
            new TableForeignKey({
                columnNames: ["customer_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "customer"
            })
        );

    }

    public async down(queryRunner: QueryRunner): Promise<any> { }

}
