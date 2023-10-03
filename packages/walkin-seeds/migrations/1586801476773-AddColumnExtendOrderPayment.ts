import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnExtendOrderPayment1586801476773
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_payment",
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
