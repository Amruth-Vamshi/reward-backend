import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class WebhookEventTypeBugFix1571309153095 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex(
      "webhook_event_type",
      "IDX_f4d2864a39b5a79ccd7104d33c"
    );

    await queryRunner.createIndex(
      "webhook_event_type",
      new TableIndex({
        name: "unique_webhook_event_for_org",
        columnNames: ["event", "organization_id"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex(
      "webhook_event_type",
      "unique_webhook_event_for_org"
    );

    await queryRunner.createUniqueConstraint(
      "webhook_event_type",
      new TableIndex({
        name: "IDX_f4d2864a39b5a79ccd7104d33c",
        columnNames: ["event"],
        isUnique: true
      })
    );
  }
}
