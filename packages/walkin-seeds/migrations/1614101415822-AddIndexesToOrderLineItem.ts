import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddIndexesToOrderLineItem1614101415822
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "order_line_item",
      new TableIndex({
        columnNames: ["order_id", "product_id"],
        name: "IDX_ORDER_LINE_ITEM_PRODUCT"
      })
    );
    await queryRunner.createIndex(
      "order_line_item",
      new TableIndex({
        columnNames: ["order_id"],
        name: "IDX_ORDER_LINE_ITEM_ORDER_ID"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
