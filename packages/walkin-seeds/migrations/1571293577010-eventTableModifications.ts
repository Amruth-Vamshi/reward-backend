import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class eventTableModifications1571293577010
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `event` CHANGE `producer_event_id` `sourceEventId` varchar(255)"
    );
    await queryRunner.query(
      "ALTER TABLE `event` CHANGE `producer_event_time` `sourceEventTime`  datetime(6)"
    );
    await queryRunner.query(
      "ALTER TABLE `event` CHANGE `source` `sourceName`  varchar(255)"
    );
    await queryRunner.addColumn(
      "event",
      new TableColumn({
        type: "text",
        name: "metaData",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `event` CHANGE `sourceEventId` `producer_event_id` varchar(255)"
    );
    await queryRunner.query(
      "ALTER TABLE `event` CHANGE `sourceEventTime` `producer_event_time`  datetime(6)"
    );
    await queryRunner.query(
      "ALTER TABLE `event` CHANGE `sourceName` `source` varchar(255)"
    );
    await queryRunner.dropColumn("event", "metaData");
  }
}
