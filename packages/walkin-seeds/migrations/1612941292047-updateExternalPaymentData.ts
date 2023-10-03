// import { OrderPayment } from "@walkinserver/walkin-orderx/src/entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class updateExternalPaymentData1612941292047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {
            const orderPaymentObj = await transactionManager.query(
                "SELECT id, external_payment_details FROM order_payment"
            );
            for (const element of orderPaymentObj) {
                if (element.external_payment_details != null) {
                    const orderPayment = await transactionManager.query(
                        "UPDATE order_payment SET external_payment_details=? WHERE id=?",
                        [JSON.parse(element.external_payment_details), element.id]
                    )
                }
            }
        })
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
