import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddIndexToTagTable1615948246576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "tag",
      new TableIndex({
        columnNames: ["code"],
        name: "IDX_TAG_CODE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
