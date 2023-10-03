import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DropColumnLoyaltyProgramConfigInCampaign1665570903596
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const campaign = await queryRunner.getTable("campaign");
    if (campaign) {
      if (campaign.columns.find(k => k.name === "loyalty_program_config_id")) {
        await queryRunner.dropColumn("campaign", "loyalty_program_config_id");
      }
    }

    // Add loyalty_program_detail_id column
    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "loyalty_program_detail_id",
        type: "int",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
