import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table
} from "typeorm";

export class CreateLoyaltyTransaction1572343737968
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const loyaltyTransactionTable = await queryRunner.getTable(
      "loyalty_transaction"
    );
    if (!loyaltyTransactionTable) {
      await queryRunner.createTable(
        new Table({
          name: "loyalty_transaction",
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
              name: "status_code",
              type: "int",
              isNullable: false
            },
            {
              name: "loyalty_reference_id",
              type: "varchar",
              isNullable: false
            },
            {
              name: "points_blocked",
              type: "float",
              default: 0
            },
            {
              name: "points_issued",
              type: "float",
              default: 0
            },
            {
              name: "points_redeemed",
              type: "float",
              default: 0
            },
            {
              name: "type",
              type: "varchar",
              isNullable: false
            },
            {
              name: "name",
              type: "varchar",
              isNullable: false
            },
            {
              name: "data",
              type: "json",
              isNullable: true
            },
            {
              name: "customer_loyalty_id",
              type: "int",
              isNullable: false
            }
          ]
        })
      );

      await queryRunner.createForeignKey(
        "loyalty_transaction",
        new TableForeignKey({
          columnNames: ["customer_loyalty_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "customer_loyalty",
          name: "loyalty_transaction_customer_loyalty"
        })
      );
      await queryRunner.createForeignKey(
        "loyalty_transaction",
        new TableForeignKey({
          columnNames: ["status_code"],
          referencedColumnNames: ["status_id"],
          referencedTableName: "status",
          name: "loyalty_transaction_status"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("loyalty_transaction");
  }
}
