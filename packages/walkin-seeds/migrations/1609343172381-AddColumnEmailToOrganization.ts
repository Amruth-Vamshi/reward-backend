import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnEmailToOrganization1609343172381
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "organization",
      new TableColumn({
        name: "email",
        isNullable: true,
        type: "varchar"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
