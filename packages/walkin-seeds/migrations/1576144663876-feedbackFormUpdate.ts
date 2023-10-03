import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class feedbackFormUpdate1576144663876 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "feedback_form",
      new TableColumn({
        name: "createMultipleFeedbacks",
        type: "boolean",
        default: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("feedback_form", "createMultipleFeedbacks");
  }
}
