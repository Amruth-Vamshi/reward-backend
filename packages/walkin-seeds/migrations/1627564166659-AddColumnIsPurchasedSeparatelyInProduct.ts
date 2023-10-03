import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnIsPurchasedSeparatelyInProduct1627564166659 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "product",
            new TableColumn({
                name: "is_purchased_separately",
                default: true,
                type: "boolean"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Do nothing
    }
}
