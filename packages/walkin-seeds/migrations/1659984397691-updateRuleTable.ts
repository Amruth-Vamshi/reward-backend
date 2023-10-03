import { MigrationInterface, QueryRunner } from "typeorm";

export class updateRuleTable1659984397691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE rule MODIFY COLUMN rule_configuration text NULL"
    );
    await queryRunner.query(
      "ALTER TABLE rule MODIFY COLUMN rule_expression text NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
