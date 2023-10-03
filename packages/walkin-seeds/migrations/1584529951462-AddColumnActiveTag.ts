import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnActiveTag1584529951462 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "tag",
      new TableColumn({
        name: "active",
        type: "boolean",
        default: true,
        isNullable: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
