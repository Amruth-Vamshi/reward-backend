import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line:class-name
export class workflowUniqueIndexFix1567499997377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex(
      "workflow_process",
      "IDX_7756b0d84326656e38d1480afb"
    );
    await queryRunner.dropIndex(
      "workflow_process_transition",
      "IDX_9a9ab3ca5323d398b127340acb"
    );
    await queryRunner.dropIndex(
      "workflow_state",
      "IDX_554a1e68bf7d4cfddb48ecc6e5"
    );
    await queryRunner.dropIndex("rule", "IDX_e272edd8cbd400c7c29462142f");
    await queryRunner.dropIndex("workflow", "IDX_8ec5afd3566bb368910c59f441");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log("Do nothing");
  }
}
