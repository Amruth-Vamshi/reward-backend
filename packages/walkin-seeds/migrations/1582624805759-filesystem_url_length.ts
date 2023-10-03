import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class filesystemUrlLength1582624805759 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            "file",
            new TableColumn({
                name: "public_url",
                type: "varchar(256)",
                isNullable: false,
            }),
            new TableColumn({
                name: "public_url",
                type: "varchar(2048)",
                isNullable: false
            })
        );

        await queryRunner.changeColumn(
            "file",
            new TableColumn({
                name: "internal_url",
                type: "varchar(256)",
                isNullable: false,
            }),
            new TableColumn({
                name: "internal_url",
                type: "varchar(2048)",
                isNullable: false
            })
        );


    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            "file",
            new TableColumn({
                name: "public_url",
                type: "varchar(2048)",
                isNullable: false,
            }),
            new TableColumn({
                name: "public_url",
                type: "varchar(256)",
                isNullable: false
            })
        );

        await queryRunner.changeColumn(
            "file",
            new TableColumn({
                name: "internal_url",
                type: "varchar(2048)",
                isNullable: false,
            }),
            new TableColumn({
                name: "internal_url",
                type: "varchar(256)",
                isNullable: false
            })
        );
    }

}
