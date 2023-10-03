import { MigrationInterface, QueryRunner } from "typeorm";

export class AddressAndCustomerTableUpdate1658234021440
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // for Address Table
    await queryRunner.query(
      "ALTER TABLE address DROP FOREIGN KEY FK_b370008f75f439dbba95cf6d5e8"
    );
    await queryRunner.query("ALTER TABLE address DROP COLUMN person_id");

    // for Customer Table
    await queryRunner.query(
      "ALTER TABLE customer DROP FOREIGN KEY FK_009f5197ebf5eea0f815cdec07e"
    );
    await queryRunner.query("ALTER TABLE customer DROP COLUMN parentId");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
