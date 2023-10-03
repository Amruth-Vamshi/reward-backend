import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableStoreInventory1595424003337 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "store_inventory",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true,
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true,
          },
          {
            name: "inventoryAvailable",
            type: "boolean",
            default: true,
            isNullable: false,
          },
          {
            name: "product_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "store_id",
            type: "varchar",
            isNullable: false,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
