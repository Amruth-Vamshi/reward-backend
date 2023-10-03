import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from "typeorm";

export class AddColumnStatusToCatalog1594234024874
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "catalog",
      new TableColumn({
        name: "status",
        isNullable: true,
        type: "varchar",
        default: "'ACTIVE'",
      })
    );

    await queryRunner.addColumn(
      "catalog",
      new TableColumn({
        name: "listable",
        type: "boolean",
        isNullable: false,
        default: true,
      })
    );
    await queryRunner.createIndex(
      "catalog",
      new TableIndex({
        columnNames: ["listable"],
        name: "index_table_catalog_columns_listable",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
