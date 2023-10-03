import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePriceValueForeignKeyFromOrderLineItem1645773677388
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("order_line_item");
    const priceValueForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf("product_price_value_id") !== -1
    );

    await queryRunner.dropForeignKey("order_line_item", priceValueForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
