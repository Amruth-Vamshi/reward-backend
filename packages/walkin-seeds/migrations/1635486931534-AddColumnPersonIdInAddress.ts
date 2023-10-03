import { Address, Customer } from "@walkinserver/walkin-core/src/entity";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddColumnPersonIdInAddress1635486931534 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        /**
         * Drop foreignkey constraint for Customer in Address table
         * Add Column person_id in the Address table
         * Add person_id as foreign key in Address table
        */

        const addressTable = await queryRunner.getTable("address");
        const customerForeignKey = addressTable.foreignKeys.find(
            fk => fk.columnNames.indexOf("customer") !== -1
        );

        await queryRunner.dropForeignKey("address", customerForeignKey);

        await queryRunner.addColumn(
            "address",
            new TableColumn({
                name: "person_id",
                type: "bigint(20)",
                isNullable: true
            })
        );

        await queryRunner.createForeignKey("address", new TableForeignKey({
            columnNames: ["person_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "person",
            onDelete: "CASCADE"
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
