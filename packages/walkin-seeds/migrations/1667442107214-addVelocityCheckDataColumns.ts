import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class addVelocityCheckDataColumns1667442107214 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
              name: "loyalty_totals",
              columns: [
                {
                  name: "id",
                  type: "int",
                  isNullable: false,
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: "increment"
                },
                {
                  name: "daily_points",
                  type: "float",
                  isNullable: false,
                  default: 0
                },
                {
                    name: "weekly_points",
                    type: "float",
                    isNullable: false,
                    default: 0
                },
                {
                    name: "monthly_points",
                    type: "float",
                    isNullable: false,
                    default: 0
                },
                {
                    name: "daily_transactions",
                    type: "bigint",
                    isNullable: false,
                    default: 0
                },
                {
                    name: "weekly_transactions",
                    type: "bigint",
                    isNullable: false,
                    default: 0
                },
                {
                    name: "monthly_transactions",
                    type: "bigint",
                    isNullable: false,
                    default: 0
                },
                {
                    name: "last_transaction_date",
                    type: "datetime(6)",
                    isNullable: true
                },
              ]
            })
          );

        await queryRunner.addColumn(
            "customer_loyalty",
            new TableColumn({
              name: "loyalty_totals",
              type: "int",
              isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "customer_loyalty",
            new TableForeignKey({
              columnNames: ["loyalty_totals"],
              referencedColumnNames: ["id"],
              referencedTableName: "loyalty_totals"
            })
        );

        await queryRunner.addColumn(
            "store",
            new TableColumn({
              name: "loyalty_totals",
              type: "int",
              isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "store",
            new TableForeignKey({
              columnNames: ["loyalty_totals"],
              referencedColumnNames: ["id"],
              referencedTableName: "loyalty_totals"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("customer_loyalty", "loyalty_totals");
        await queryRunner.dropColumn("store", "loyalty_totals");
        await queryRunner.dropTable("loyalty_totals");
    }

}
