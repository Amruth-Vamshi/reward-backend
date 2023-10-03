import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class feedbackFormExpiry1574325132148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "feedback_form",
      new TableColumn({
        type: "text",
        name: "expireAfter"
      })
    );
    await queryRunner.addColumn(
      "customer_feedback",
      new TableColumn({
        name: "expiryDate",
        type: "datetime(6)",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("feedback_form", "expireAfter");
    await queryRunner.dropColumn("customer_feedback", "expiryDate");
  }
}
