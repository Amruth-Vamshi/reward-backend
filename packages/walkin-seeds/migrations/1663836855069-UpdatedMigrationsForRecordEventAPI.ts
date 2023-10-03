import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class UpdatedMigrationsForRecordEventAPI1663836855069 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const campaign = await queryRunner.getTable("campaign");
        if (campaign) {
            if (campaign.columns.find(k => k.name === "loyalty_program_config_id")) {
                await queryRunner.dropColumn("campaign", "loyalty_program_config_id");
            }
        }

        await queryRunner.addColumn(
            "campaign",
            new TableColumn({
                name: "loyalty_program_config_id",
                type: "int",
                isNullable: true
            })
        );

        // Add code enum field to event_type
        const eventType = await queryRunner.getTable("event_type");
        if (eventType) {
            await queryRunner.dropIndex("event_type", "eventTypeCodeForApplication");
            if (eventType.columns.find(k => k.name === "code")) {
                await queryRunner.dropColumn("event_type", "code");
            }
            if (eventType.columns.find(k => k.name === "organization_id")) {
                await queryRunner.dropForeignKey(eventType, "FK_4548cdb6836fa5a523812d07739");
                await queryRunner.dropColumn("event_type", "organization_id");
            }
        }

        // Add organizationId column to event_type
        await queryRunner.addColumn(
            "event_type",
            new TableColumn({
                name: "organization_id",
                type: "varchar(36)",
                isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "event_type",
            new TableForeignKey({
                columnNames: ["organization_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "organization"
            })
        );

        await queryRunner.addColumn(
            "event_type",
            new TableColumn({
                name: "code",
                isNullable: false,
                type: "varchar(255)"
                // enum: ["PURCHASE", "CUSTOMER_SIGNUP", "CUSTOMER_LEVEL_CHANGE", "REFERRAL_SIGNUP", "REVIEW_SUBMITTED"]
            })
        )

        // Add organizationId column to event
        await queryRunner.addColumn(
            "event",
            new TableColumn({
                name: "organization_id",
                type: "varchar(36)",
                isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "event",
            new TableForeignKey({
                columnNames: ["organization_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "organization"
            })
        );

        // Remove Event link in campaign_event_trigger and add link to EventType
        const campaign_event_trigger = await queryRunner.getTable("campaign_event_trigger");
        await queryRunner.dropForeignKey(campaign_event_trigger, "FK_5e5a9e9f2d0f8cf1bfd3817571b");
        await queryRunner.dropColumn(campaign_event_trigger, "eventId");

        await queryRunner.addColumn(
            "campaign_event_trigger",
            new TableColumn({
                name: "eventTypeId",
                type: "varchar(255)",
                isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "campaign_event_trigger",
            new TableForeignKey({
                columnNames: ["eventTypeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "event_type",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
