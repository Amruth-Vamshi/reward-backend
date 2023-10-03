import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingIndexInBusinessRules1693831779847
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async transactionManager => {
      await transactionManager.query(
        "CREATE INDEX `COMBO_INDEX` ON `business_rule_detail`(`rule_level`,`rule_level_id`, `rule_type`);"
      );
      await transactionManager.query(
        "CREATE INDEX `RULE_LEVEL_ORG_ID` ON `business_rule_detail`(`rule_level`,`organization_id`);"
      );
      await transactionManager.query(
        "CREATE INDEX `RULE_LEVEL_ID_ORG_ID` ON `business_rule_detail`(`rule_level_id`,`organization_id`);"
      );
      await transactionManager.query(
        "CREATE INDEX `RULE_LEVEL_TYPE_ORG_ID` ON `business_rule_detail`(`rule_type`, `organization_id`);"
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
