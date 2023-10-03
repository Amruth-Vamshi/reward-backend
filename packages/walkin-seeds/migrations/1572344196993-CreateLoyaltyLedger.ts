import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table
} from "typeorm";

export class CreateLoyaltyProgramLedger1572344196993
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const loyaltyLedger = await queryRunner.getTable("loyalty_ledger");
    if (!loyaltyLedger) {
      await queryRunner.createTable(
        new Table({
          name: "loyalty_ledger",
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
              name: "points",
              type: "float",
              default: 0
            },
            {
              name: "balance_snapshot",
              type: "float",
              default: 0
            },
            {
              name: "points_remaining",
              type: "float",
              default: 0
            },
            {
              name: "type",
              type: "varchar",
              isNullable: false
            },
            {
              name: "loyalty_transaction_id",
              type: "int",
              isNullable: true
            },
            {
              name: "expiry_date",
              type: "datetime",
              isNullable: true
            },
            {
              name: "details",
              type: "json",
              isNullable: true
            }
          ]
        })
      );

      await queryRunner.createForeignKey(
        "loyalty_ledger",
        new TableForeignKey({
          columnNames: ["loyalty_transaction_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "loyalty_transaction"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("loyalty_ledger");
  }
}
