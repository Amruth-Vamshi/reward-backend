import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyPrimaryIdColumnInCampaignEventTrigger1664351326756
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "campaign_event_trigger",
      "campaignEventTriggerId",
      new TableColumn({
        name: "id",
        type: "int",
        isNullable: false,
        isPrimary: true,
        isGenerated: true,
        generationStrategy: "increment"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
