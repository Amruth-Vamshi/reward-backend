import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class UpdateCommunicationCampaignRelation1570704408721
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "communication",
      new TableColumn({
        name: "campaign_id",
        type: "int(11)",
        isNullable: true
      })
    );
    await queryRunner.createForeignKey(
      "communication",
      new TableForeignKey({
        columnNames: ["campaign_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "campaign"
      })
    );
    const table = await queryRunner.getTable("campaign");

    const communicationForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf("communication_id") !== -1
    );
    await queryRunner.dropForeignKey("campaign", communicationForeignKey);

    await queryRunner.dropColumn("campaign", "communication_id");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "campaign",
      new TableColumn({
        name: "communication_id",
        type: "int(11)",
        isNullable: true
      })
    );
    await queryRunner.createForeignKey(
      "campaign",
      new TableForeignKey({
        columnNames: ["campaign_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "campaign"
      })
    );
    await queryRunner.dropForeignKey(
      "communication",
      "dropForeignKey.campaign_id"
    );
    await queryRunner.dropColumn("communication", "campaign_id");
  }
}
