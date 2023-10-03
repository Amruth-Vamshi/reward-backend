import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFieldsFromCampaignEntity1662971842387
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const campaign = await queryRunner.getTable("campaign");
    await queryRunner.dropForeignKey(
      campaign,
      "FK_1193a9f2460ee9a9705a96a8d8e"
    );
    await queryRunner.dropForeignKey(
      campaign,
      "FK_b5c4c0412080b0f4e1bc14f06bd"
    );

    await queryRunner.dropColumn(campaign, "status");
    await queryRunner.dropColumn(campaign, "trigger_rule_id");
    await queryRunner.dropColumn(campaign, "audience_filter_rule_id");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
