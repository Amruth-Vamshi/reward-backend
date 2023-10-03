import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddColumnPersonIdInCustomer1635486184707 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "customer",
            new TableColumn({
                name: "person_id",
                type: "bigint(20)",
                isNullable: true
            })
        );

        await queryRunner.createForeignKey("customer", new TableForeignKey({
            columnNames: ["person_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "person",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
