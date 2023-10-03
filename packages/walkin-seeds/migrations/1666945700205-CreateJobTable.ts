import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class CreateJobTable1666945700205 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "job",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "last_modified_by",
            type: "varchar",
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
            name: "job_id",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "job_type",
            isNullable: false,
            type: "varchar",
            default: "'GENERAL'"
          },
          {
            name: "last_executed_time",
            isNullable: false,
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)"
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
