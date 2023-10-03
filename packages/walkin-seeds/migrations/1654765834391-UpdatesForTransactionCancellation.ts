import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UpdatesForTransactionCancellation1654765834391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "loyalty_program",
            new TableColumn({
                name:"cancel_transaction_rules",
                type: "json",
                isNullable: false
            })
        );

        await queryRunner.addColumn(
            "customer_loyalty",
            new TableColumn({
                name:"negative_points",
                type:"int",
                isNullable: false,
                default: 0
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
