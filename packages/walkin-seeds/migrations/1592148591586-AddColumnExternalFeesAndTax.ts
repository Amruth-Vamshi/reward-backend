import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnExternalFeesAndTax1592148591586
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_payment",
      new TableColumn({
        name: "external_payment_fee",
        type: "float",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "order_payment",
      new TableColumn({
        name: "external_payment_fee_tax",
        type: "float",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
