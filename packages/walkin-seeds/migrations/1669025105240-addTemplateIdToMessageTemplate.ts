import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addTemplateIdToMessageTemplate1669025105240 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "message_template",
            new TableColumn({
                name: "external_template_id",
                isNullable: true,
                type: "varchar(255)",
                default: null
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
