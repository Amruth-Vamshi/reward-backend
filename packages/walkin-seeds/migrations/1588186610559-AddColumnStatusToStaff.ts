import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnStatusToStaff1588186610559 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "staff",
      new TableColumn({
        name: "status",
        isNullable: false,
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
