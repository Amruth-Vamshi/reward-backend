import {
    MigrationInterface,
    QueryRunner,
    TableForeignKey,
    Table
} from "typeorm";

export class CreateStatus1572267743000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: "status",
                columns: [
                    {
                        name: "status_id",
                        type: "int",
                        isPrimary: true,
                    },
                    {
                        name: "status_code",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "status_type",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                ]
            }),
            true
        );
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
