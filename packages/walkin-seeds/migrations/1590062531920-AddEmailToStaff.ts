import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddEmailToStaff1590062531920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "staff",
      new TableColumn({
        name: "email",
        isNullable: true,
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // dO nothing
  }
}
