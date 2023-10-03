import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyColumnNameInOptionTable1631175843303 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            "option",
            new TableColumn({
                name: "name",
                type: "varchar(255)",
                isUnique: false
            }),
            new TableColumn({
                name: "name",
                type: "varchar(255)",
                isUnique: false,
                isNullable: false
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
    }
}