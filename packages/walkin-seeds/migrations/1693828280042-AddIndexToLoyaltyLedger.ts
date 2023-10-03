import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToLoyaltyLedger1693828280042 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {
            await transactionManager.query("CREATE INDEX `POINTS_REMAINING` ON `loyalty_ledger`(`points_remaining`);");
            await transactionManager.query("CREATE INDEX `EXPIRY_DATE` ON `loyalty_ledger`(`expiry_date`);");
            await transactionManager.query("CREATE INDEX `POINTS_REMAINING_AND_EXPIRY_DATE_COMBO` ON `loyalty_ledger`(`points_remaining`, `expiry_date`);");
        })
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
