import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnStatusToProductChargeValue1594893980642
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "product_charge_value",
      new TableColumn({
        name: "status",
        isNullable: true,
        type: "varchar",
        default: "'ACTIVE'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
