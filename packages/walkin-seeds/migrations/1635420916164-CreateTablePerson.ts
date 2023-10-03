import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTablePerson1635420916164 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: "person",
                columns: [
                    {
                        name: "id",
                        type: "bigint(20)",
                        isPrimary: true
                    },
                    {
                        name: "created_by",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "last_modified_by",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "created_time",
                        type: "datetime(6)",
                        default: "CURRENT_TIMESTAMP(6)",
                        isNullable: true
                    },
                    {
                        name: "last_modified_time",
                        type: "datetime(6)",
                        default: "CURRENT_TIMESTAMP(6)",
                        isNullable: true
                    },
                    {
                        name: "firstName",
                        type: "varchar(255)",
                        isNullable: true
                    },
                    {
                        name: "lastName",
                        type: "varchar(255)",
                        isNullable: true
                    },
                    {
                        name: "phoneNumber",
                        type: "varchar(255)",
                        isNullable: true
                    },
                    {
                        name: "email",
                        type: "varchar(255)",
                        isNullable: true
                    },
                    {
                        name: "extend",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "personIdentifier",
                        type: "varchar(255)",
                        isNullable: true,
                        isUnique: true
                    },
                    {
                        name: "gender",
                        type: "varchar(255)",
                        isNullable: true
                    },
                    {
                        name: "dateOfBirth",
                        type: "varchar(255)",
                        isNullable: true
                    },
                    {
                        name: "status",
                        type: "varchar(36)",
                        isNullable: true
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
