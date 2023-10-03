import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class feedbackTemplate1581325808920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "feedback_form",
      new TableColumn({
        name: "isTemplate",
        isNullable: true,
        default: false,
        type: "boolean"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("feedback_form", "isTemplate");
  }
}
