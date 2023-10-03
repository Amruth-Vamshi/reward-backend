import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class linkCampaignToEvent1571293900379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "campaign_event_trigger",
        columns: [
          new TableColumn({
            name: "campaignEventTriggerId",
            type: "int",
            generationStrategy: "increment"
          }),
          new TableColumn({
            name: "status",
            type: "varchar"
          }),
          new TableColumn({
            name: "campaignId",
            type: "int"
          }),
          new TableColumn({
            name: "eventId",
            type: "int"
          })
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ["campaignId"],
            referencedColumnNames: ["id"],
            referencedTableName: "campaign",
            onDelete: "CASCADE"
          }),
          new TableForeignKey({
            columnNames: ["eventId"],
            referencedColumnNames: ["id"],
            referencedTableName: "event",
            onDelete: "CASCADE"
          })
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("campaign_event_trigger", true, true, true);
  }
}
