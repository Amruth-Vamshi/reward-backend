import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class eventsTableRename1571214156890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    try {
      const events = await queryRunner.getTable("events");
      if (events) {
        await queryRunner.renameTable(events, "event");
      }
    } catch (error) {
      const event = await queryRunner.getTable("event");
      if (event) {
        console.log("Table already renamed");
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameTable("event", "events");
  }
}
