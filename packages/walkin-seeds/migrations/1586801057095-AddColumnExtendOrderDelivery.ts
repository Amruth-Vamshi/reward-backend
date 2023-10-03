import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnExtendOrderDelivery1586801057095
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_delivery",
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
