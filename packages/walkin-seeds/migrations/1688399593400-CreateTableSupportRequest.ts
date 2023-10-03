import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class CreateTableSupportRequests1688399593400
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async transactionManager => {
      await queryRunner.createTable(
        new Table({
          name: "support_request",
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
              name: "support_type",
              type: "varchar(36)",
              isNullable: false
            },
            {
              name: "support_subtype",
              type: "varchar(36)",
              isNullable: false
            },
            {
              name: "subject",
              type: "varchar",
              isNullable: false
            },
            {
              name: "content",
              type: "text",
              isNullable: false
            },
            {
              name: "response",
              type: "json",
              isNullable: false
            },
            {
              name: "user_id",
              type: "varchar(36)",
              isNullable: false
            },
            {
              name: "organization_id",
              type: "varchar(36)",
              isNullable: false
            }
          ]
        })
      );

      await transactionManager.query(
        `ALTER TABLE \`support_request\` CONVERT TO CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci';`
      );

      await queryRunner.createForeignKey(
        "support_request",
        new TableForeignKey({
          columnNames: ["user_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "user"
        })
      );

      await queryRunner.createForeignKey(
        "support_request",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization"
        })
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
