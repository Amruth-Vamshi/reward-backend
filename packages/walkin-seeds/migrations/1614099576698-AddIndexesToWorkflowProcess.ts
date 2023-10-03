import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddIndexesToWorkflowProcess1614099576698
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "workflow_process",
      new TableIndex({
        columnNames: ["name"],
        name: "IDX_WORKFLOW_PROCESS_NAME"
      })
    );
    await queryRunner.createIndex(
      "workflow_process",
      new TableIndex({
        columnNames: ["workflow_id", "name"],
        name: "IDX_WORKFLOW_PROCESS_WORKFLOW_PROCESS_NAME"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
