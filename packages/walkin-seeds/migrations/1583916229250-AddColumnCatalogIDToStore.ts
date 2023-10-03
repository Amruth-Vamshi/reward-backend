import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class AddColumnCatalogIDToStore1583916229250
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "catalog_id",
        type: "int(11)",
        isNullable: true
      })
    );

    await queryRunner.createForeignKey(
      "store",
      new TableForeignKey({
        columnNames: ["catalog_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "catalog"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
