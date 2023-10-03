import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToCustomerLoyalty1687433597594
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async transactionManager => {
      await transactionManager.query(
        "CREATE INDEX `CUSTOMER_ID_LOYALTY_CARD_ID` ON `customer_loyalty`(`customer_id`,`loyalty_card_id`);"
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
