import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddressAndProductTable1658486501865
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE product MODIFY COLUMN categoryCode JSON NULL"
    );

    await queryRunner.query(
      "ALTER TABLE address MODIFY COLUMN name VARCHAR(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE address MODIFY COLUMN country VARCHAR(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE address MODIFY COLUMN zip VARCHAR(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE address MODIFY COLUMN contactNumber VARCHAR(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE address MODIFY COLUMN addressTitle VARCHAR(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE address MODIFY COLUMN addressType VARCHAR(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE address MODIFY COLUMN status VARCHAR(255) NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
