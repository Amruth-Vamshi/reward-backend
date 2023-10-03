import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnExtendOrderLineItem1586801270187
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_line_item",
      new TableColumn({
        name: "extend",
        type: "text",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
