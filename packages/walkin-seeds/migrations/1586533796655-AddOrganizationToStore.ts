import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddOrganizationToStore1586533796655 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "store",
            new TableColumn({
                name: "organization_id",
                type: "varchar",
                isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "store",
            new TableForeignKey({
                columnNames: ["organization_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "organization",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Do nothing
    }

}
