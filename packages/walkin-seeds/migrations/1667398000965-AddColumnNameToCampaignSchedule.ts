import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnNameToCampaignSchedule1667398000965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "campaign_schedule",
            new TableColumn({
                name: "name",
                type: "varchar(255)",
                isNullable: false
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
