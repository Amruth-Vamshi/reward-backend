import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class createConditionTable1656932600720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "rule_condition",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "created_by",
            type: "varchar",
            default: "'defaultuser'",
            isNullable: false
          },
          {
            name: "last_modified_by",
            type: "varchar",
            default: "'defaultuser'",
            isNullable: false
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "name",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "description",
            type: "varchar(1000)",
            isNullable: true
          },
          {
            name: "organization_id",
            type: "varchar(36)",
            isNullable: false
          },
          {
            name: "type",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "value_type",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "rule_entity_id",
            type: "int",
            isNullable: true
          },
          {
            name: "rule_attribute_id",
            type: "int",
            isNullable: true
          },
          {
            name: "value",
            type: "varchar(255)",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "rule_condition",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );

    await queryRunner.createForeignKey(
      "rule_condition",
      new TableForeignKey({
        columnNames: ["rule_entity_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "rule_entity"
      })
    );

    await queryRunner.createForeignKey(
      "rule_condition",
      new TableForeignKey({
        columnNames: ["rule_attribute_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "rule_attribute"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
