import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyColumnPhoneNumberNonMandatoryBankAccount1596786668457
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async (TransactionManager) => {
      await TransactionManager.query(
        "ALTER TABLE `bank_account` MODIFY COLUMN phone varchar(255) NULL"
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
