import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddIndexesToWorkflowEntity1614097689729
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "workflow_entity",
      new TableIndex({
        columnNames: ["entity_type", "id"],
        name: "IDX_WORKFLOW_ENTITY_TYPE_ID"
      })
    );

    await queryRunner.createIndex(
      "workflow_entity",
      new TableIndex({
        columnNames: ["entity_type", "workflow_id"],
        name: "IDX_WORKFLOW_ENTITY_TYPE_WORKFLOW_ID"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
