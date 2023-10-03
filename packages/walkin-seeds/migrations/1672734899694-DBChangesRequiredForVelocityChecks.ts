import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class DBChangesRequiredForVelocityChecks1672734899694 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            "ALTER TABLE rule_condition MODIFY COLUMN value LONGTEXT"
        );
        await queryRunner.query(
            "ALTER TABLE rule_effect MODIFY COLUMN value LONGTEXT"
        );
        await queryRunner.query(
            "ALTER TABLE loyalty_totals ADD COLUMN yearly_points FLOAT NOT NULL DEFAULT 0 AFTER monthly_points"
        );
        await queryRunner.query(
            "ALTER TABLE loyalty_totals ADD COLUMN yearly_transactions BIGINT NOT NULL DEFAULT 0 AFTER monthly_transactions"
        );
        await queryRunner.query(
            "ALTER TABLE `customer_loyalty_program` ADD COLUMN `loyalty_totals` INT NULL"
        );
        await queryRunner.query(
            "ALTER TABLE `customer_loyalty_program` ADD CONSTRAINT `FK_customerLoyaltyProgram_loyaltyTotals` FOREIGN KEY (`loyalty_totals`) REFERENCES `loyalty_totals`(`id`)"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            "ALTER TABLE rule_condition MODIFY COLUMN value VARCHAR(255)"
        );
        await queryRunner.query(
            "ALTER TABLE rule_effect MODIFY COLUMN value VARCHAR(255)"
        );
        await queryRunner.query(
            "ALTER TABLE loyalty_totals DROP COLUMN yearly_points"
        );
        await queryRunner.query(
            "ALTER TABLE loyalty_totals DROP COLUMN yearly_transactions"
        );
        await queryRunner.query(
            "ALTER TABLE `customer_loyalty_program` DROP FOREIGN KEY `FK_customerLoyaltyProgram_loyaltyTotals`"
        );
        await queryRunner.query(
            "ALTER TABLE `customer_loyalty_program` DROP COLUMN `loyalty_totals`"
        );
    }

}
