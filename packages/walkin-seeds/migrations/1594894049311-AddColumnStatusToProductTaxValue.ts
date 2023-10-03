import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnStatusToProductTaxValue1594894049311
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "product_tax_value",
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
