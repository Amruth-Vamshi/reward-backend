import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class UpdateProductIndexes1589811112559 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const productTable = await queryRunner.getTable("product");
    if (
      productTable.indices.find(
        (k) => k.name === "IDX_99c39b067cfa73c783f0fc49a6"
      ) !== undefined
    ) {
      await queryRunner.dropIndex("product", "IDX_99c39b067cfa73c783f0fc49a6");
    }

    if (
      productTable.indices.find(
        (k) => k.name === "IDX_22cc43e9a74d7498546e9a63e7"
      ) !== undefined
    ) {
      await queryRunner.dropIndex("product", "IDX_22cc43e9a74d7498546e9a63e7");
    }

    if (
      productTable.indices.find(
        (k) => k.name === "UNIQUE_INDEX_FOR_NAME_ORGANIZATION"
      ) === undefined
    ) {
      await queryRunner.createIndex(
        "product",
        new TableIndex({
          columnNames: ["organization_id", "name"],
          name: "UNIQUE_INDEX_FOR_NAME_ORGANIZATION",
        })
      );
    }

    if (
      productTable.indices.find(
        (k) => k.name === "UNIQUE_INDEX_FOR_CODE_ORGANIZATION"
      ) === undefined
    ) {
      await queryRunner.createIndex(
        "product",
        new TableIndex({
          columnNames: ["organization_id", "code"],
          name: "UNIQUE_INDEX_FOR_CODE_ORGANIZATION",
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
