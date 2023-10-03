import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddOrganizationIdToJob1671614306029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "job",
            new TableColumn({
                name: "organization_id",
                type: "varchar(36)",
                isNullable: true
            })
        )

        await queryRunner.createForeignKey(
            "job",
            new TableForeignKey({
                columnNames: ["organization_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "organization"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
