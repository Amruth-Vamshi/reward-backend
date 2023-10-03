import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class CreateTableCampaignSchedule1665408927650
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "campaign_schedule",
        columns: [
          {
            name: "id",
            type: "int",
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "campaign_id",
            type: "int",
            isNullable: false
          },
          {
            name: "cron_expression",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "status",
            type: "varchar(255)",
            isNullable: false,
            default: "'ACTIVE'"
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "campaign_schedule",
      new TableForeignKey({
        columnNames: ["campaign_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "campaign"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("campaign_schedule");
  }
}
