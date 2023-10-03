import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class eventTableChanges1571214156882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("events", "event_arrival_time");
    const events = await queryRunner.getTable("events");
    for (const foreignKey of events.foreignKeys) {
      if (
        foreignKey.columnNames[0] === "organization_id" ||
        foreignKey.columnNames[0] === "application_id"
      ) {
        await queryRunner.dropForeignKey("events", foreignKey.name);
        await queryRunner.dropColumn("events", foreignKey.columnNames[0]);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // ALTER THE EVENTS TABLE
    await queryRunner.addColumn(
      "events",
      new TableColumn({
        type: "timestamp",
        name: "event_arrival_time"
      })
    );
    await queryRunner.addColumn(
      "events",
      new TableColumn({
        type: "varchar",
        name: "organization_id"
      })
    );
    await queryRunner.addColumn(
      "events",
      new TableColumn({
        type: "varchar",
        name: "application_id"
      })
    );

    await queryRunner.createForeignKey(
      "events",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      "events",
      new TableForeignKey({
        columnNames: ["application_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "application",
        onDelete: "CASCADE"
      })
    );
  }
}
