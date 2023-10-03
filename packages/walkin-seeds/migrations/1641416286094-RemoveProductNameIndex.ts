import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RemoveProductNameIndex1641416286094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex(
      "product",
      "UNIQUE_INDEX_FOR_NAME_ORGANIZATION"
    );
    await queryRunner.dropIndex(
      "product",
      "UNIQUE_INDEX_FOR_CODE_ORGANIZATION"
    );
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "isProductUnique",
        type: "varchar",
        isNullable: false,
        default: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
