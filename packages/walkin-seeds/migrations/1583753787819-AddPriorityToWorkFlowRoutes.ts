import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPriorityToWorkFlowRoutes1583753787819 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "workflow_route",
            new TableColumn({
                name: "priority",
                type: "int",
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Do nothing
    }

}
