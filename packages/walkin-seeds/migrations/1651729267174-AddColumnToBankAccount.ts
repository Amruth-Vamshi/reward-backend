import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { BankAccount } from "@walkinserver/walkin-core/src/entity";

export class AddColumnToBankAccount1651729267174 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
          "bank_account",
          new TableColumn({
            name: "beneficiary_name",
            type: "varchar(256)",
            isNullable: true,
          })
        );
    
        await queryRunner.connection.transaction(async (transactionManager) => {
          const bankAccounts = await transactionManager.find(BankAccount, {
            cache: false,
          });
          for (const bankAccount of bankAccounts) {
            bankAccount.beneficiaryName = bankAccount.name;
            bankAccount.verified = false;
            await transactionManager.save(bankAccount);
          }
        });
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
      }

}
