import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class AddTableStoreDeliveryArea1586285830048
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "store_delivery_area",
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
            name: "area_type",
            type: "varchar(255)",
            isNullable: false,
          },
          {
            name: "pincode",
            type: "int",
            isNullable: true,
          },
          {
            name: "area",
            type: "varchar",
            isNullable: true,
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
    await queryRunner.createForeignKey(
      "store_delivery_area",
      new TableForeignKey({
        columnNames: ["store_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const storeDeliveryArea = await queryRunner.getTable("store_delivery_area");
    if (storeDeliveryArea) {
      await queryRunner.dropTable("store_delivery_area");
    }
  }
}
