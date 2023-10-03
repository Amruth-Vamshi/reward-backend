import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class webhookNewAttributesEnhancements1571291208610
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "webhook",
      new TableColumn({
        name: "name",
        type: "varchar(255)",
        isNullable: false,
        default: "'DEFAULT TEXT'"
      })
    );
    await queryRunner.addColumn(
      "webhook",
      new TableColumn({
        name: "enabled",
        type: "boolean",
        isNullable: false,
        default: "true"
      })
    );

    await queryRunner.addColumn(
      "webhook_event_type",
      new TableColumn({
        name: "description",
        type: "varchar(1000)",
        isNullable: false,
        default: "'DEFAULT TEXT'"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const webhook = await queryRunner.getTable("webhook");
    await queryRunner.dropColumn(webhook, "name");
    await queryRunner.dropColumn(webhook, "enabled");
    const webhook_event_type = await queryRunner.getTable("webhook_event_type");
    await queryRunner.dropColumn(webhook_event_type, "description");
  }
}
