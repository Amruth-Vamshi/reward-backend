import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class customerFeedbackChanges1575023239844
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "customer_feedback",
      new TableColumn({
        name: "fetchedOnce",
        type: "boolean",
        default: false
      })
    );

    await queryRunner.addColumn(
      "customer_feedback",
      new TableColumn({
        name: "meta",
        type: "text",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("customer_feedback", "fetchedOnce");
    await queryRunner.dropColumn("customer_feedback", "meta");
  }
}
