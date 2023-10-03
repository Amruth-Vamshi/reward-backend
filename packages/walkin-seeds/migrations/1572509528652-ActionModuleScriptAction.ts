import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ActionModuleScriptAction1572509528652
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const actionDefinition = await queryRunner.getTable("action_definition");
    if (actionDefinition) {
      await queryRunner.addColumn(
        "action_definition",
        new TableColumn({
          name: "code",
          type: "text",
          isNullable: true
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const actionDefinition = await queryRunner.getTable("action_definition");
    if (actionDefinition) {
      if (actionDefinition.columns.find(k => k.name === "code")) {
        await queryRunner.dropColumn("action_definition", "code");
      }
    }
  }
}
