import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addMetadataInCampaignEventTrigger1571904267209
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.addColumn(
      "campaign_event_trigger",
      new TableColumn({
        name: "metadata",
        type: "text",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.dropColumn("campaign_event_trigger", "metadata");
  }
}
