import { MigrationInterface, QueryRunner } from "typeorm";
import { Webhook } from "../../walkin-core/src/entity";
import { WEBHOOK_TYPE } from "../../walkin-core/src/modules/common/constants";

export class FixMarkAllWebhookTypeAsExternal1629808869971 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {
            const webhooks = await transactionManager.find(Webhook, {
                cache: false
            });

            for (const webhook of webhooks) {
                if (
                    (webhook.webhookType === null || webhook.webhookType === undefined || webhook.webhookType === '')
                ) {
                    webhook.webhookType = WEBHOOK_TYPE.EXTERNAL
                }
                await transactionManager.save(webhook);
            }
        });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
