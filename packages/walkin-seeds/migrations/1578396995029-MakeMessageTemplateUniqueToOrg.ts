import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class MakeMessageTemplateUniqueToOrg1578396995029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const messageTemplate = await queryRunner.getTable("message_template");

        if (messageTemplate.indices.find(k => k.name === 'IDX_332cce35545f88fa6a69a56d18') !== undefined) {
            await queryRunner.dropIndex(
                "message_template",
                "IDX_332cce35545f88fa6a69a56d18"
            );
            await queryRunner.createIndex(
                "message_template",
                new TableIndex({
                    name: "UNIQUE_NAME_FOR_ORG",
                    columnNames: ["name", "organization_id"],
                    isUnique: true
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createIndex(
            "message_template",
            new TableIndex({
                name: "UNIQUE_NAME_FOR_ORG",
                columnNames: ["name"],
                isUnique: true
            })
        );
    }

}
