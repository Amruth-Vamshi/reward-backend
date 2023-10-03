import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnDefaultPasswordResetToUser1603175854851
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "default_password_reset",
        type: "boolean",
        default: false,
        isNullable: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
