import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueIndexToCLP1686670933724 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async transactionManager => {
      // Add unique index constraint with loyalty_program_code, loyalty_experiment_code and customer_loyalty_id combination in customer_loyalty_program
      const result = await transactionManager.query(
        "SHOW INDEX from customer_loyalty_program"
      );
      const indexName = "UNIQUE_CONFIG_DETAIL_CUSTOMER_LOYALTY";
      const indexExists = result.some(result => result.Key_name === indexName);
      if (!indexExists) {
        await transactionManager.query(
          "CREATE UNIQUE INDEX `UNIQUE_CONFIG_DETAIL_CUSTOMER_LOYALTY` ON `customer_loyalty_program` (`loyalty_program_code`,`loyalty_experiment_code`,`customer_loyalty_id`);"
        );
      }
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
