import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class RemoveIndexFromOptions1642390056787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex("option", "IDX_NAME_ORGANIZATION");
    await queryRunner.dropIndex("option_value", "IDX_FOR_VALUE_OPTION");
    await queryRunner.createIndex(
      "option",
      new TableIndex({
        columnNames: ["code", "organization_id"],
        name: "IDX_CODE_ORGANIZATION",
        isUnique: true
      })
    );
    await queryRunner.createIndex(
      "option_value",
      new TableIndex({
        columnNames: ["code", "option_id"],
        name: "IDX_FOR_CODE_OPTION",
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
