import { MigrationInterface, QueryRunner } from "typeorm";

export class DropColumnLatLong1585499960812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("store", "longitude");
    await queryRunner.dropColumn("store", "latitude");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
