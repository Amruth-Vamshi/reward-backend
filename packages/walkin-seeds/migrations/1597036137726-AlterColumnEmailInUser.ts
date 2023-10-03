import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnEmailInUser1597036137726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async (TransactionManager) => {
      await queryRunner.dropIndex("user", "IDX_e12875dfb3b1d92d7d7c5377e2");
      await TransactionManager.query(
        "ALTER TABLE `user` MODIFY COLUMN email varchar(255) NULL"
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
