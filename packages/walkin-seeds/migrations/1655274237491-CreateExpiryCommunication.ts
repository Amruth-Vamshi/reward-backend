import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateExpiryCommunication1655274237491 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: "expiry_communication",
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
                        name: "event_type",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "days",
                        type: "int",
                        isNullable: true
                    },
                    {
                        name: "loyalty_card_id_ec",
                        type: "int",
                        isNullable: true
                    },
                    {
                        name: "loyalty_program_id_ec",
                        type: "int",
                        isNullable: true
                    },
                    {
                        name: "communication_id_ec",
                        type: "int",
                        isNullable: true
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "expiry_communication",
            new TableForeignKey({
                columnNames: ["loyalty_card_id_ec"],
                referencedColumnNames: ["id"],
                referencedTableName: "loyalty_card"
            })
        );

        await queryRunner.createForeignKey(
            "expiry_communication",
            new TableForeignKey({
                columnNames: ["loyalty_program_id_ec"],
                referencedColumnNames: ["id"],
                referencedTableName: "loyalty_program"
            })
        );

        await queryRunner.createForeignKey(
            "expiry_communication",
            new TableForeignKey({
                columnNames: ["communication_id_ec"],
                referencedColumnNames: ["id"],
                referencedTableName: "communication"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
