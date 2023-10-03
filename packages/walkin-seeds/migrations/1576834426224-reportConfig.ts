import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table
} from "typeorm";

export class reportConfig1576834426224 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "report_config",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "name",
            type: "varchar",
            isNullable: true
          },
          {
            name: "description",
            type: "text",
            isNullable: true
          },
          {
            name: "status",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "organization_id",
            type: "varchar(36)",
            isNullable: false
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: true
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: true
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      "report_config",
      new TableForeignKey({
        name: "FK_REPORT_CONFIG_ORG_ID",
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    let fileSystemTable = await queryRunner.getTable("report_config");
    if (fileSystemTable) {
      await queryRunner.dropTable("report_config");
    }
  }
}
