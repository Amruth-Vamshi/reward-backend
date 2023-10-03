import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnDeliveryOrderStatusInOrderDelivery1639071294219 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "order_delivery",
            new TableColumn({
                name: "delivery_order_status",
                isNullable: true,
                type: "varchar"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}


