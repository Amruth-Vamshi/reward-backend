import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table
} from "typeorm";

export class reportTable1576837404253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "report",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "report_config_id",
            type: "int",
            isNullable: false
          },
          {
            name: "report_file_id",
            type: "int",
            isNullable: false
          },
          {
            name: "report_date",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
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
      "report",
      new TableForeignKey({
        name: "FK_REPORT_ORG_ID",
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );

    await queryRunner.createForeignKey(
      "report",
      new TableForeignKey({
        name: "FK_REPORT_REPORT_CONFIG_ID",
        columnNames: ["report_config_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "report_config"
      })
    );

    await queryRunner.createForeignKey(
      "report",
      new TableForeignKey({
        name: "FK_REPORT_FILE_ID",
        columnNames: ["report_file_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "file"
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    let fileSystemTable = await queryRunner.getTable("report");
    if (fileSystemTable) {
      await queryRunner.dropTable("report");
    }
  }
}
