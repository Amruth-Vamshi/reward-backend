import { MigrationInterface, QueryRunner } from "typeorm";

export class DropColumnStoreFormatCodeFromStore1583918113195
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("store");
    const storeFormatForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf("store_format_id") !== -1
    );
    await queryRunner.dropForeignKey("store", storeFormatForeignKey);

    await queryRunner.dropColumn("store", "store_format_id");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
