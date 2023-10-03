import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class autoCreateCustomer1572434566973 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "feedback_form",
      new TableColumn({
        type: "boolean",
        name: "autoCreateCustomer",
        default: false
      })
    );

    await queryRunner.addColumn(
      "feedback_form",
      new TableColumn({
        type: "varchar",
        name: "templateURL",
        isNullable: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("feedback_form", "autoCreateCustomer");
    await queryRunner.dropColumn("feedback_form", "templateURL");
  }
}
