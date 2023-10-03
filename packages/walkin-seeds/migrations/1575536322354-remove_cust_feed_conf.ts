import { MigrationInterface, QueryRunner } from "typeorm";

export class removeCustFeedConf1575536322354 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("customer_feedback_configs", true, true, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log("Not required");
  }
}
