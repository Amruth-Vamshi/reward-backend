import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveColumnInventoryFromProductPriceValue1595825870031
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const productPriceValue = await queryRunner.getTable("product_price_value");
    // remove inventory_available from product_price_value
    await queryRunner.dropColumn(productPriceValue, "inventory_available");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
