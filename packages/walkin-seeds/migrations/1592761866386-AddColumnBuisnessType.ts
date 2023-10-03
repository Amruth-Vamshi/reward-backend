import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnBuisnessType1592761866386 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "organization",
      new TableColumn({
        name: "business_type",
        type: "varchar(256)",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
