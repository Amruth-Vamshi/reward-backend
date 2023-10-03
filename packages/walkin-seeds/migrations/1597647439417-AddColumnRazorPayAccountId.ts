import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnRazorPayAccountId1597647439417
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "bank_account",
      new TableColumn({
        name: "external_account_id",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
