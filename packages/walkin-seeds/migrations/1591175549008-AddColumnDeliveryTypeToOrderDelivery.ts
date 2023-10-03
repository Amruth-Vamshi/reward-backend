import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddColumnDeliveryTypeToOrderDelivery1591175549008
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_delivery",
      new TableColumn({
        name: "delivery_type_id",
        isNullable: true,
        type: "varchar(255)",
      })
    );
    await queryRunner.createForeignKey(
      "order_delivery",
      new TableForeignKey({
        columnNames: ["delivery_type_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "delivery_type",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
