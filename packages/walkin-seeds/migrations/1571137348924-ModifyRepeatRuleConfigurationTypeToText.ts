import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyRepeatRuleConfigurationTypeToText1571137348924
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "communication",
      "repeatRuleConfiguration",
      new TableColumn({
        name: "repeatRuleConfiguration",
        type: "text",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "communication",
      "repeatRuleConfiguration",
      new TableColumn({
        name: "repeatRuleConfiguration",
        type: "JSON"
      })
    );
  }
}
