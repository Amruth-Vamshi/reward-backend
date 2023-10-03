import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class MakeCampaignIdNullableInCollections1657794060661 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            "collections",
            new TableColumn({
                name: "campaign_id",
                type: "int",
                isNullable: false
            }),
            new TableColumn({
                name: "campaign_id",
                type: "int",
                isNullable: true
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
