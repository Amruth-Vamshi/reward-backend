import {
    MigrationInterface,
    TableForeignKey,
    QueryRunner,
    Table
} from "typeorm";
export class CreateCurrency1571653554815 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: "currency",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "created_by",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "last_modified_by",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "created_time",
                        type: "datetime(6)",
                        default: "CURRENT_TIMESTAMP(6)",
                        isNullable: false
                    },
                    {
                        name: "last_modified_time",
                        type: "datetime(6)",
                        default: "CURRENT_TIMESTAMP(6)",
                        isNullable: false
                    },
                    {
                        name: "code",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "conversion_ratio",
                        type: "float",
                        default: 0
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isNullable: false
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
