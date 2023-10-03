import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnBusyToStaff1599542183920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "staff",
      new TableColumn({
        name: "busy",
        type: "boolean",
        default: false,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
