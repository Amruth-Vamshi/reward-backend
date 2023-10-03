import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class AddExternalProductId1622774918447 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "external_product_id",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.createIndex(
      "product",
      new TableIndex({
        columnNames: ["external_product_id"],
        name: "IDX_EXTERNAL_PRODUCT_ID"
      })
    );
    await queryRunner.createIndex(
      "product",
      new TableIndex({
        columnNames: ["organization_id", "external_product_id"],
        name: "IDX_UNIQUE_TAG_FOR_EXTERNAL_PRODUCT_ID",
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
