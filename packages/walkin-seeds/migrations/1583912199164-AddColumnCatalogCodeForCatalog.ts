import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class AddColumnCatalogCodeForCatalog1583912199164
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "catalog",
      new TableColumn({
        name: "catalog_code",
        type: "varchar(36)",
        isNullable: true
      })
    );

    await queryRunner.createIndex(
      "catalog",
      new TableIndex({
        name: "UNIQUE_TAX_TYPE_CODE_FOR_ORG",
        columnNames: ["catalog_code", "organization_id"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
