import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addEarnBurnConfigurationAndValidation1583918356567 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "loyalty_program",
            new TableColumn({
                name: "earn_rule_data",
                type: "json",
                isNullable: true
            }),
        );
        await queryRunner.addColumn(
            "loyalty_program",
            new TableColumn({
                name: "earn_rule_validation",
                type: "json",
                isNullable: true
            }),
        );
        await queryRunner.addColumn(
            "loyalty_program",
            new TableColumn({
                name: "burn_rule_data",
                type: "json",
                isNullable: true
            }),
        );
        await queryRunner.addColumn(
            "loyalty_program",
            new TableColumn({
                name: "burn_rule_validation",
                type: "json",
                isNullable: true
            }),
        );
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
