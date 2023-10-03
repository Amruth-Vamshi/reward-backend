import { MigrationInterface, QueryRunner } from "typeorm";

export class AdditionalIndexes1689682102011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async transactionManager => {
      await transactionManager.query(
        "CREATE INDEX `BUSINESS_RULE_LEVEL` ON `business_rule`(`rule_level`);"
      );

      await transactionManager.query(
        "CREATE INDEX `RULE_LEVEL_AND_RULE_TYPE` ON `business_rule`(`rule_level`,`rule_type`);"
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
