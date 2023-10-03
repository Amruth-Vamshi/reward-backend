import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey
} from "typeorm";

export class CreateLoyaltyCard1571900863979 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: "loyalty_card",
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
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isNullable: false
                    }, {
                        name: "currency_id",
                        type: "int",
                        isNullable: true
                    },
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "loyalty_card",
            new TableForeignKey({
                columnNames: ["currency_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "currency"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("loyalty_card");
    }



}
