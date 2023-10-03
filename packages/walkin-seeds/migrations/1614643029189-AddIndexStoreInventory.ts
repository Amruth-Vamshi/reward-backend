import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddIndexStoreInventory1614643029189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "store_inventory",
      new TableIndex({
        columnNames: ["store_id"],
        name: "IDX_STORE_INVENTORY_STORE_ID"
      })
    );
    await queryRunner.createIndex(
      "store_inventory",
      new TableIndex({
        columnNames: ["product_id"],
        name: "IDX_STORE_INVENTORY_PRODUCT_ID"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
