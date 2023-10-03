import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class changingEventIdsToUUID1571728776377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const campaignEventTriggerTable = await queryRunner.getTable(
      "campaign_event_trigger"
    );

    for (const foreignKey of campaignEventTriggerTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "eventId") {
        await queryRunner.dropForeignKey(
          campaignEventTriggerTable,
          foreignKey.name
        );
      }
    }

    const customerFeedbackTable = await queryRunner.getTable(
      "customer_feedback"
    );

    for (const foreignKey of customerFeedbackTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "eventId") {
        await queryRunner.dropForeignKey(
          customerFeedbackTable,
          foreignKey.name
        );
      }
    }
    const eventTable = await queryRunner.getTable("event");

    for (const foreignKey of eventTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "event_type_id") {
        await queryRunner.dropForeignKey(eventTable, foreignKey.name);
      }
    }

    const eventSubscriptionTable = await queryRunner.getTable(
      "event_subscription"
    );

    for (const foreignKey of eventSubscriptionTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "event_type_id") {
        await queryRunner.dropForeignKey(
          eventSubscriptionTable,
          foreignKey.name
        );
      }
    }
    await queryRunner.query(
      "ALTER TABLE `campaign_event_trigger` CHANGE `eventId` `eventId` varchar(255)"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback` CHANGE `eventId` `eventId` varchar(255)"
    );
    await queryRunner.query(
      "ALTER TABLE `event` CHANGE `event_type_id` `eventTypeId` varchar(255)"
    );
    await queryRunner.query(
      "ALTER TABLE `event_subscription` CHANGE `event_type_id` `eventTypeId` varchar(255)"
    );
    await queryRunner.query(
      "ALTER TABLE `event` CHANGE `id` `id` varchar(255)"
    );
    await queryRunner.query(
      "ALTER TABLE `event_subscription` CHANGE `id` `id` varchar(255)"
    );
    await queryRunner.query(
      "ALTER TABLE `event_type` CHANGE `id` `id` varchar(255)"
    );
    await queryRunner.createForeignKey(
      campaignEventTriggerTable,
      new TableForeignKey({
        columnNames: ["eventId"],
        referencedColumnNames: ["id"],
        referencedTableName: "event",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      customerFeedbackTable,
      new TableForeignKey({
        columnNames: ["eventId"],
        referencedColumnNames: ["id"],
        referencedTableName: "event",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      eventTable,
      new TableForeignKey({
        columnNames: ["eventTypeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "event_type",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      eventSubscriptionTable,
      new TableForeignKey({
        columnNames: ["eventTypeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "event_type",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const campaignEventTriggerTable = await queryRunner.getTable(
      "campaign_event_trigger"
    );

    for (const foreignKey of campaignEventTriggerTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "eventId") {
        await queryRunner.dropForeignKey(
          campaignEventTriggerTable,
          foreignKey.name
        );
      }
    }

    const customerFeedbackTable = await queryRunner.getTable(
      "customer_feedback"
    );

    for (const foreignKey of customerFeedbackTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "eventId") {
        await queryRunner.dropForeignKey(
          customerFeedbackTable,
          foreignKey.name
        );
      }
    }
    const eventTable = await queryRunner.getTable("event");

    for (const foreignKey of eventTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "eventTypeId") {
        await queryRunner.dropForeignKey(eventTable, foreignKey.name);
      }
    }

    const eventSubscriptionTable = await queryRunner.getTable(
      "event_subscription"
    );

    for (const foreignKey of eventSubscriptionTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "eventTypeId") {
        await queryRunner.dropForeignKey(
          eventSubscriptionTable,
          foreignKey.name
        );
      }
    }
    await queryRunner.query(
      "ALTER TABLE `campaign_event_trigger` CHANGE `eventId` `eventId` int(11)"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback` CHANGE `eventId` `eventId` int(11)"
    );
    await queryRunner.query(
      "ALTER TABLE `event` CHANGE `eventTypeId` `event_type_id` int(11)"
    );
    await queryRunner.query(
      "ALTER TABLE `event_subscription` CHANGE `eventTypeId` `event_type_id` int(11)"
    );
    await queryRunner.query("ALTER TABLE `event` CHANGE `id` `id` int(11)");
    await queryRunner.query(
      "ALTER TABLE `event_subscription` CHANGE `id` `id` int(11)"
    );
    await queryRunner.query(
      "ALTER TABLE `event_type` CHANGE `id` `id` int(11)"
    );
    await queryRunner.createForeignKey(
      campaignEventTriggerTable,
      new TableForeignKey({
        columnNames: ["eventId"],
        referencedColumnNames: ["id"],
        referencedTableName: "event",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      customerFeedbackTable,
      new TableForeignKey({
        columnNames: ["eventId"],
        referencedColumnNames: ["id"],
        referencedTableName: "event",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      eventTable,
      new TableForeignKey({
        columnNames: ["event_type_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "event_type",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      eventSubscriptionTable,
      new TableForeignKey({
        columnNames: ["event_type_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "event_type",
        onDelete: "CASCADE"
      })
    );
  }
}
