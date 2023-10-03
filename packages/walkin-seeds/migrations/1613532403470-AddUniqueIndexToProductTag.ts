import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddUniqueIndexToProductTag1613532403470
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "product_tag",
      new TableIndex({
        columnNames: ["product_id", "tag_id"],
        name: "IDX_UNIQUE_TAG_FOR_PRODUCT",
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
