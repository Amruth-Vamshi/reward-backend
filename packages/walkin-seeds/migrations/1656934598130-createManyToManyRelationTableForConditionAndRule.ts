import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class createManyToManyRelationTableForConditionAndRule1656934598130
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "rule_condition_rule",
        columns: [
          {
            name: "rule_id",
            type: "int",
            isNullable: false
          },
          {
            name: "rule_condition_id",
            type: "int",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "rule_condition_rule",
      new TableForeignKey({
        columnNames: ["rule_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "rule"
      })
    );

    await queryRunner.createForeignKey(
      "rule_condition_rule",
      new TableForeignKey({
        columnNames: ["rule_condition_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "rule_condition"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
