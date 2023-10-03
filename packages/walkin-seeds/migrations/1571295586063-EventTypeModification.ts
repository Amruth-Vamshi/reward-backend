import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class EventTypeModification1571295586063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "event_type",
      "type",
      new TableColumn({
        type: "varchar",
        name: "code",
        isNullable: false
      })
    );

    await queryRunner.renameColumn("event_type", "format", "description");

    await queryRunner.createIndex(
      "event_type",
      new TableIndex({
        columnNames: ["code", "application_id"],
        isUnique: true,
        name: "eventTypeCodeForApplication"
      })
    );

    await queryRunner.dropColumn("event_type", "schema");
    await queryRunner.dropColumn("event_type", "meta");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "event_type",
      "code",
      new TableColumn({
        type: "varchar",
        name: "type",
        isNullable: false
      })
    );

    await queryRunner.renameColumn("event_type", "description", "format");

    await queryRunner.dropIndex("event_type", "eventTypeCodeForApplication");
    await queryRunner.addColumn(
      "event_type",
      new TableColumn({
        type: "text",
        name: "schema"
      })
    );
    await queryRunner.addColumn(
      "event_type",
      new TableColumn({
        type: "text",
        name: "meta"
      })
    );
  }
}
