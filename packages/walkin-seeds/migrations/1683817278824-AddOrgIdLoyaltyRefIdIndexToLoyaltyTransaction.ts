import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrgIdLoyaltyRefIdIndexToLoyaltyTransaction1683817278824
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async transactionManager => {
      await transactionManager.query(
        "CREATE INDEX `ORGANIZATION_ID_LOYALTY_REFERENCE_ID` ON `loyalty_transaction`(`organization_id`,`loyalty_reference_id`);"
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
