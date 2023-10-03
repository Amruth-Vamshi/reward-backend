import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterResetCodeColumnUserTable1651737304855 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            "user",
            new TableColumn({
            name: "reset_code",
            type: "varchar(255)"
        }),
            new TableColumn({
            name: "reset_code",
            type: "text",
            isNullable: true,
            default: null
        })
        );
        }

        public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
        }

}



