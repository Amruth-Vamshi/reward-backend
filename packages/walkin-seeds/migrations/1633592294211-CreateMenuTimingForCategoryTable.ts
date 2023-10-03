import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateMenuTimingForCategoryTable1633592294211
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "menu_timing_for_category",
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
            name: "category_id",
            type: "varchar(255)",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "menu_timing_for_category",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "category"
      })
    );

    await queryRunner.createIndex(
      "menu_timing_for_category",
      new TableIndex({
        columnNames: ["category_id"],
        name: "IDX_FOR_CATEGORY_ID",
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
