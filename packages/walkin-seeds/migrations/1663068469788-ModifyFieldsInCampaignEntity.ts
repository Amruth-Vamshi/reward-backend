import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyFieldsInCampaignEntity1663068469788
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("ALTER TABLE campaign DROP COLUMN loyalty_totals");
    await queryRunner.query("ALTER TABLE campaign DROP COLUMN coupon_totals");
    await queryRunner.query("ALTER TABLE campaign DROP COLUMN referral_totals");
    await queryRunner.query("ALTER TABLE campaign DROP COLUMN discount_totals");
    await queryRunner.query("ALTER TABLE campaign DROP COLUMN campaignType");
    await queryRunner.query(
      "ALTER TABLE campaign DROP COLUMN campaignTriggerType"
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "campaignType",
        type: "varchar(255)",
        isNullable: false
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "campaignTriggerType",
        type: "varchar(255)",
        isNullable: false
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "loyalty_totals",
        type: "json",
        isNullable: true
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "coupon_totals",
        type: "json",
        isNullable: true
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "referral_totals",
        type: "json",
        isNullable: true
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "discount_totals",
        type: "json",
        isNullable: true
      })
    );

    // Add Columns Group and extend to Campaign
    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "group",
        type: "varchar(255)",
        isNullable: true
      })
    );

    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "extend",
        type: "json",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
