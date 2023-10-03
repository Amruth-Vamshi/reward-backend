import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableStoreOpenTiming1586275241131 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: "store_open_timing",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid"
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
                        name: "openTime",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "closeTime",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "days",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "store_id",
                        type: "varchar",
                        isNullable: false
                    },
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "store_open_timing",
            new TableForeignKey({
                columnNames: ["store_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "store",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Do nothing
    }

}
