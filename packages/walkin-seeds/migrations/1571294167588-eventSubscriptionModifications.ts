import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class eventSubscriptionModifications1571294167588
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `event_subscription` CHANGE `name` `triggerAction` varchar(255)"
    );

    await queryRunner.addColumn(
      "event_subscription",
      new TableColumn({
        type: "int",
        name: "customActionId",
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      "event_subscription",
      new TableColumn({
        type: "boolean",
        name: "sync",
        default: false
      })
    );

    await queryRunner.changeColumn(
      "event_subscription",
      "status",
      new TableColumn({
        name: "status",
        type: "varchar",
        default: `"INACTIVE"`
      })
    );

    await queryRunner.createForeignKey(
      "event_subscription",
      new TableForeignKey({
        columnNames: ["customActionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "action",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.dropColumn("event_subscription", "description");
    await queryRunner.dropColumn("event_subscription", "queue");
    await queryRunner.dropColumn("event_subscription", "meta");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `event_subscription` CHANGE `triggerAction` `name`  varchar(255)"
    );
    const eventSubscriptionTable = await queryRunner.getTable(
      "event_subscription"
    );

    for (const foreignKey of eventSubscriptionTable.foreignKeys) {
      if (foreignKey.columnNames[0] === "customActionId") {
        await queryRunner.dropForeignKey("event_subscription", foreignKey.name);
        await queryRunner.dropColumn(
          "event_subscription",
          foreignKey.columnNames[0]
        );
      }
    }

    await queryRunner.dropColumn("event_subscription", "sync");

    await queryRunner.changeColumn(
      "event_subscription",
      "status",
      new TableColumn({
        name: "status",
        type: "varchar"
      })
    );
    await queryRunner.addColumn(
      "event_subscription",
      new TableColumn({
        type: "varchar",
        name: "description"
      })
    );
    await queryRunner.addColumn(
      "event_subscription",
      new TableColumn({
        type: "varchar",
        name: "queue"
      })
    );
    await queryRunner.addColumn(
      "event_subscription",
      new TableColumn({
        type: "text",
        name: "meta"
      })
    );
  }
}
