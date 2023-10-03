import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnResponseToWebhookEventData1637868185054 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "webhook_data",
            new TableColumn({
                name: "response",
                type: "text",
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}


