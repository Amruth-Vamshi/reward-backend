import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class AddOrganizationToWebhookEventType1569826271429
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "webhook_event_type",
      new TableColumn({
        name: "organization_id",
        isNullable: true,
        type: "varchar(36)"
      })
    );
    await queryRunner.createForeignKey(
      "webhook_event_type",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey(
      "webhook_event_type",
      "dropForeignKey.organization_id"
    );
    await queryRunner.dropColumn("webhook_event_type", "organization_id");
  }
}
