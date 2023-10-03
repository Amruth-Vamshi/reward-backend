import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from "typeorm";
import { type } from "os";

export class Communication1567590922821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "communication",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "entity_id",
            type: "varchar",
            isNullable: true
          },
          {
            name: "entity_type",
            type: "varchar",
            isNullable: true
          },
          {
            name: "isScheduled",
            type: "boolean",
            isNullable: false,
            default: "false"
          },
          {
            name: "isRepeatable",
            type: "boolean",
            isNullable: false,
            default: "false"
          },
          {
            name: "firstScheduleDateTime",
            type: "datetime",
            isNullable: true
          },
          {
            name: "lastProcessedDateTime",
            type: "datetime",
            isNullable: true
          },
          {
            name: "commsChannelName",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "repeatRuleConfiguration",
            type: "text",
            isNullable: true
          }
        ]
      }),
      true
    );

    await queryRunner.addColumn(
      "communication",
      new TableColumn({
        name: "communication_id",
        type: "int(11)"
      })
    );

    await queryRunner.addColumn(
      "communication",
      new TableColumn({
        name: "organization_id",
        type: "varchar(36)"
      })
    );

    await queryRunner.addColumn(
      "communication",
      new TableColumn({
        name: "message_template_id",
        type: "int(11)"
      })
    );

    await queryRunner.addColumn(
      "communication",
      new TableColumn({
        name: "application_id",
        type: "varchar(26)"
      })
    );

    await queryRunner.createForeignKey(
      "communication",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "communication",
      new TableForeignKey({
        columnNames: ["message_template_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "message_template",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "communication",
      new TableForeignKey({
        columnNames: ["application_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "application",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey(
      "communication",
      "dropForeignKey.communication_id"
    );
    await queryRunner.dropForeignKey(
      "communication",
      "dropForeignKey.organization_id"
    );
    await queryRunner.dropForeignKey(
      "communication",
      "dropForeignKey.message_template_id"
    );
    await queryRunner.dropForeignKey(
      "communication",
      "dropForeignKey.application_id"
    );
    await queryRunner.dropColumn("communication", "communication_id");
    await queryRunner.dropColumn("communication", "organization_id");
    await queryRunner.dropColumn("communication", "message_template_id");
    await queryRunner.dropColumn("communication", "application_id");
    await queryRunner.dropTable("communication");
  }
}
