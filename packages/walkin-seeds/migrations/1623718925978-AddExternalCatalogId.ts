import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class AddExternalCatalogId1623718925978 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "catalog",
      new TableColumn({
        name: "external_catalog_id",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.createIndex(
      "catalog",
      new TableIndex({
        columnNames: ["external_catalog_id"],
        name: "IDX_EXTERNAL_CATALOG_ID"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
