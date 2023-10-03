import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrModifyIndexes1683303314423 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {
            // Create unique index for customer loyalty
            const result = await transactionManager.query('SHOW INDEX from customer_loyalty');
            const indexName = 'UNIQUE_CUSTOMER_ID_AND_LOYALTY_CARD_ID';
            const indexExists = result.some(result => result.Key_name === indexName);
            if (!indexExists) {
                await transactionManager.query("CREATE UNIQUE INDEX `UNIQUE_CUSTOMER_ID_AND_LOYALTY_CARD_ID` ON `customer_loyalty` (`customer_id`, `loyalty_card_id`);");
            }

            // Drop the unique index for loyalty_reference_id in loyalty_transaction
            const response = await transactionManager.query('SHOW INDEX from loyalty_transaction');
            const loyaltyReferenceUniqueIndexName = "UNIQUE_LOYALTY_REFERENCE_ID";
            const loyaltyReferenceUniqueIndexExists = response.some(result => result.Key_name === loyaltyReferenceUniqueIndexName);
            if (loyaltyReferenceUniqueIndexExists) {
                await transactionManager.query("ALTER TABLE loyalty_transaction DROP INDEX UNIQUE_LOYALTY_REFERENCE_ID;");
            }

            // Add index for loyalty_reference_id in loyalty_transaction if not exist
            const loyaltyReferenceIndexName = "loyalty_reference_id_index";
            const loyaltyReferenceIndexExists = response.some(result => result.Key_name === loyaltyReferenceIndexName);
            if (!loyaltyReferenceIndexExists) {
                await transactionManager.query(`CREATE INDEX ${loyaltyReferenceIndexName} ON loyalty_transaction (loyalty_reference_id);`);
            }

            // add unique index for organization_id and loyalty_reference_id combination in loyalty_transaction
            await transactionManager.query("CREATE UNIQUE INDEX `UNIQUE_ORGANIZATION_LOYALTY_REFERENCE_ID` ON `loyalty_transaction` (`organization_id`, `loyalty_reference_id`);");
        })
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
