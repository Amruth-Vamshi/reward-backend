import { MigrationInterface, QueryRunner } from "typeorm";

export class EventTypeCodeUnique1574861700887 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `event_type` ADD UNIQUE INDEX `id_UNIQUE` (`id` ASC)"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("ALTER TABLE `event_type` DROP INDEX `id_UNIQUE` ");
  }
}
