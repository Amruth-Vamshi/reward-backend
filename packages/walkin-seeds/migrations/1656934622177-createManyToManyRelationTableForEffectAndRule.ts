import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class createManyToManyRelationTableForEffectAndRule1656934622177
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "rule_effect_rule",
        columns: [
          {
            name: "rule_id",
            type: "int",
            isNullable: false
          },
          {
            name: "rule_effect_id",
            type: "int",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "rule_effect_rule",
      new TableForeignKey({
        columnNames: ["rule_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "rule"
      })
    );

    await queryRunner.createForeignKey(
      "rule_effect_rule",
      new TableForeignKey({
        columnNames: ["rule_effect_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "rule_effect"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
