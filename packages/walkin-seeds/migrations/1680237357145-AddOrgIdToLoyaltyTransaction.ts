import {
  getManager,
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";
export class AddOrgIdToLoyaltyTransaction1680237357145
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "loyalty_transaction",
      new TableColumn({
        name: "organization_id",
        type: "varchar(36)",
        isNullable: true
      })
    );
    await queryRunner.createForeignKey(
      "loyalty_transaction",
      new TableForeignKey({
        name: "FK_LOYALTY_TRANSACTION_ORGANIZATION_ID",
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );
    // // Populate data in organization_id column
    // /**
    //  * 1. Fetch loyalty_transaction
    //  * 2. Loop through them
    //  *    2.1 - Fetch customer_loyalty_program using customer_loyalty_program_id
    //  *    2.2 - Fetch customer_loyalty using customer_loyalty_program
    //  *    2.3 - Fetch customer using customer_loyalty
    //  *    2.4 - Fetch organization_id from customer
    //  *    2.5 - Update the org_id
    //  * 3. Make organization_id as non-nullable field
    //  */
    await queryRunner.connection.transaction(async transactionManager => {
      const loyaltyTransactions = await transactionManager.query(
        `SELECT transaction.id AS transaction_id, customer.organization_id AS customer_organization_id
          FROM loyalty_transaction transaction
          LEFT JOIN customer_loyalty_program customerLoyaltyProgram ON customerLoyaltyProgram.id=transaction.customer_loyalty_program_id  
          LEFT JOIN customer_loyalty customerLoyalty ON customerLoyalty.id=customerLoyaltyProgram.customer_loyalty_id  
          LEFT JOIN customer customer ON customer.id=customerLoyalty.customer_id  
          LEFT JOIN organization organization ON organization.id=customer.organization_id;`
      );

      for (const loyaltyTransaction of loyaltyTransactions) {
        const organization = loyaltyTransaction["customer_organization_id"];
        const loyaltyTransactionId = loyaltyTransaction["transaction_id"];
        if (organization) {
          await transactionManager.query(
            `update loyalty_transaction set organization_id='${organization}' where id='${loyaltyTransactionId}';`
          );
        } else {
          await transactionManager.query(
            `delete from loyalty_ledger where loyalty_transaction_id='${loyaltyTransactionId}';`
          );
          await transactionManager.query(
            `delete from loyalty_transaction_data where loyalty_transaction_id='${loyaltyTransactionId}';`
          );
          await transactionManager.query(
            `delete from loyalty_transaction where id='${loyaltyTransactionId}';`
          );
        }
      }

      // Drop organization_id foreign key, make it not null, add constraint back
      await transactionManager.query(
        `ALTER TABLE loyalty_transaction DROP FOREIGN KEY FK_LOYALTY_TRANSACTION_ORGANIZATION_ID;`
      );
      await transactionManager.query(
        `ALTER TABLE loyalty_transaction MODIFY organization_id varchar(36) NOT NULL;`
      );
      await transactionManager.query(
        "ALTER TABLE `loyalty_transaction` ADD CONSTRAINT `FK_LOYALTY_TRANSACTION_ORGANIZATION_ID` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`);"
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
