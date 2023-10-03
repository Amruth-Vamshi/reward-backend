import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateMenuTimingsForProductTable1633603388635
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "menu_timing_for_product",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true
          },
          {
            name: "created_by",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "last_modified_by",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          },
          {
            name: "code",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "product_id",
            type: "varchar(255)",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "menu_timing_for_product",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product"
      })
    );

    await queryRunner.createIndex(
      "menu_timing_for_product",
      new TableIndex({
        columnNames: ["product_id"],
        name: "IDX_FOR_PRODUCT_ID",
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
