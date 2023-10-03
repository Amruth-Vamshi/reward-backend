import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveColumnGstNumberFromBankAccount1651729079671 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const bankAccount = await queryRunner.getTable("bank_account");
        // remove gst_number from bank_account
        await queryRunner.dropColumn(bankAccount, "gst_number");
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
      }

}
