import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from "typeorm";

export class AddColumnListableToCategory1594234738696
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "category",
      new TableColumn({
        name: "listable",
        type: "boolean",
        isNullable: false,
        default: true,
      })
    );
    await queryRunner.createIndex(
      "category",
      new TableIndex({
        columnNames: ["listable"],
        name: "index_table_category_columns_listable",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
