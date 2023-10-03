import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
export class AddColumnQuantityToOrderLineItem1586149756111
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_line_item",
      new TableColumn({
        name: "quantity",
        type: "int",
        isNullable: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
