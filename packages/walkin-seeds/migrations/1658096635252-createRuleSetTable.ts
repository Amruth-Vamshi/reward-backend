import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createRuleSetTable1658096635252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "rule_set",
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
            name: "rules",
            type: "json",
            isNullable: false
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("rule_set");
  }
}
