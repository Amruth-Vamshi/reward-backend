import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class fireBaseCredentials1574839537586 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "feedback_form",
      new TableColumn({
        name: "firebaseDynamicLinkPrefix",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      "feedback_form",
      new TableColumn({
        name: "firebaseDynamicLinkAPIURL",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      "feedback_form",
      new TableColumn({
        name: "fireBaseAPIKey",
        type: "varchar",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("feedback_form", "firebaseDynamicLinkPrefix");
    await queryRunner.dropColumn("feedback_form", "firebaseDynamicLinkAPIURL");
    await queryRunner.dropColumn("feedback_form", "fireBaseAPIKey");
  }
}
