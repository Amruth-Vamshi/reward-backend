import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class triggerActionRemoveConstraint1573628960302
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "event_subscription",
      "triggerAction",
      new TableColumn({
        type: "varchar",
        name: "triggerAction",
        isNullable: false
      })
    );
    await queryRunner.createIndex(
      "event_subscription",
      new TableIndex({
        columnNames: ["triggerAction", "eventTypeId"],
        isUnique: true,
        name: "eventSubscriptionForEventType"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex(
      "event_subscription",
      "eventSubscriptionForEventType"
    );
  }
}
