import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatesForCustomerTable1658243737526
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("ALTER TABLE customer DROP COLUMN city");
    await queryRunner.query("ALTER TABLE customer DROP COLUMN state");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
