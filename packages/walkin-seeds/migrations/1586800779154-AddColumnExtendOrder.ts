import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnExtendOrder1586800779154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order",
      new TableColumn({
        name: "extend",
        type: "text",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
