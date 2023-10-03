import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldsToCampaignEntity1662980522420
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "application_method",
        type: "enum",
        enum: ["EXCLUSIVE", "SEQUENTIAL", "ALWAYS"],
        isNullable: false
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "loyalty_totals",
        type: "json"
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "coupon_totals",
        type: "json"
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "referral_totals",
        type: "json"
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "discount_totals",
        type: "json"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
