import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addColumnIsInventoryAvailable1584342558194
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "product_price_value",
      new TableColumn({
        name: "inventory_available",
        type: "boolean",
        default: true,
        isNullable: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
