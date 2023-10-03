import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDiscountFieldOrderLineItem1625543085141
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_line_item",
      new TableColumn({
        name: "product_discount_price",
        type: "varchar",
        isNullable: false
      })
    );
    await queryRunner.addColumn(
      "order_line_item",
      new TableColumn({
        name: "line_item_discount_value",
        type: "varchar",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
