import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnDeliveryQuoteExpiryToOrderDelivery1606385842703
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_delivery",
      new TableColumn({
        name: "delivery_quote_expiry",
        type: "datetime(6)",
        isNullable: true
      })
    );

    await queryRunner.addColumn(
      "order_delivery",
      new TableColumn({
        name: "delivery_quote_price",
        type: "float",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("order_delivery", "delivery_quote_expiry");
    await queryRunner.dropColumn("order_delivery", "delivery_quote_price");
  }
}
