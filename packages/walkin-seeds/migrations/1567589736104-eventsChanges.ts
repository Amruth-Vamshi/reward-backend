import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class EventsChanges1567589736104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "event_type",
      new TableColumn({
        name: "application_id",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.createForeignKey(
      "event_type",
      new TableForeignKey({
        columnNames: ["application_id"],
        referencedTableName: "application",
        referencedColumnNames: ["id"]
      })
    );

    const eventSubscriptionTable = await queryRunner.getTable(
      "event_subscription"
    );
    const organizationForeignKey = eventSubscriptionTable.foreignKeys.find(
      fk => fk.columnNames.indexOf("organization_id") !== -1
    );
    await queryRunner.dropForeignKey(
      eventSubscriptionTable,
      organizationForeignKey
    );
    await queryRunner.dropColumn(eventSubscriptionTable, "organization_id");
    const applicationForeignKey = eventSubscriptionTable.foreignKeys.find(
      fk => fk.columnNames.indexOf("application_id") !== -1
    );
    await queryRunner.dropForeignKey(
      eventSubscriptionTable,
      applicationForeignKey
    );
    await queryRunner.dropColumn(eventSubscriptionTable, "application_id");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const eventTypeTable = await queryRunner.getTable("event_type");

    const applicationForeignKey = eventTypeTable.foreignKeys.find(
      fk => fk.columnNames.indexOf("applicationId") !== -1
    );
    await queryRunner.dropForeignKey(eventTypeTable, applicationForeignKey);
    await queryRunner.dropColumn(eventTypeTable, "applicationId");

    await queryRunner.addColumn(
      "event_subscription",
      new TableColumn({
        name: "organization_id",
        type: "varchar"
      })
    );
    await queryRunner.createForeignKey(
      "event_subscription",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedTableName: "organization",
        referencedColumnNames: ["id"]
      })
    );
    await queryRunner.addColumn(
      "event_subscription",
      new TableColumn({
        name: "application_id",
        type: "varchar"
      })
    );
    await queryRunner.createForeignKey(
      "event_subscription",
      new TableForeignKey({
        columnNames: ["application_id"],
        referencedTableName: "application",
        referencedColumnNames: ["id"]
      })
    );
  }
}
