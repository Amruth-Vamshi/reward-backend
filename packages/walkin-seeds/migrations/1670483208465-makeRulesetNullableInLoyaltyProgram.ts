import {MigrationInterface, QueryRunner,TableColumn} from "typeorm";

export class makeRulesetNullableInLoyaltyProgram1670483208465 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER table loyalty_program_config modify column loyalty_burn_rule_set_id int DEFAULT NULL");
        await queryRunner.query("ALTER table loyalty_program_detail modify column loyalty_earn_rule_set_id int DEFAULT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
