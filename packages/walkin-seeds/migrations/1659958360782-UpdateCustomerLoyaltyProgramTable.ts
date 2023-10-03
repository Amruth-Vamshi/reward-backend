import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateCustomerLoyaltyProgramTable1659958360782
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE loyalty_transaction DROP FOREIGN KEY loyalty_transaction_customer_loyalty_program"
    );

    await queryRunner.changeColumn(
      "customer_loyalty_program",
      "id",
      new TableColumn({
        name: "id",
        type: "varchar",
        length: "36",
        isNullable: false,
        isPrimary: true,
        isGenerated: true,
        generationStrategy: "uuid"
      })
    );

    await queryRunner.query(
      "ALTER TABLE loyalty_transaction ADD CONSTRAINT loyalty_transaction_customer_loyalty_program FOREIGN KEY (customer_loyalty_program_id) REFERENCES customer_loyalty_program(id)"
    );

    await queryRunner.query(
      "ALTER TABLE customer_loyalty_program ADD status varchar(255) NOT NULL DEFAULT 'ACTIVE'"
    );

    await queryRunner.query(
      "ALTER TABLE customer_loyalty_program MODIFY COLUMN redeemed_transactions int NOT NULL DEFAULT 0"
    );

    await queryRunner.query(
      "ALTER TABLE customer_loyalty_program MODIFY COLUMN issued_transactions int NOT NULL DEFAULT 0"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
