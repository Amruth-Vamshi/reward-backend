import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnOrderDeliveryChargeToOrder1588664032192
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order",
      new TableColumn({
        name: "order_delivery_charges",
        type: "float",
        default: 0,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
