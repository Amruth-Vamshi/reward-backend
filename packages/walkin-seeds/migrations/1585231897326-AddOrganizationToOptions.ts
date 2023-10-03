import { MigrationInterface, QueryRunner, TableForeignKey, TableColumn } from "typeorm";

export class AddOrganizationToOptions1585231897326 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.addColumn(
            "option",
            new TableColumn({
                name: "organization_id",
                type: "varchar(255)",
                isNullable: true
            })
        );


        await queryRunner.createForeignKey(
            "option",
            new TableForeignKey({
                columnNames: ["organization_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "organization"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Do nothing
    }

}
