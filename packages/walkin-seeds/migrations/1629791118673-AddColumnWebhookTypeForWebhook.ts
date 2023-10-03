import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnWebhookTypeForWebhook1629791118673 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "webhook",
            new TableColumn({
                name: "webhook_type",
                type: "enum",
                enum: ["INTERNAL", "EXTERNAL"],
                isNullable: false
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
    }

}
