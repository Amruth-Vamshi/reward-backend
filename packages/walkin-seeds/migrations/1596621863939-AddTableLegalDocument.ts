import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class AddTableLegalDocument1596621863939 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "legal_document",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true,
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true,
          },
          {
            name: "legal_document_type",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "legal_document_value",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "legal_document_info",
            type: "JSON",
            isNullable: true,
          },
          {
            name: "legal_document_url",
            type: "varchar(255)",
            isNullable: true,
          },
          {
            name: "organization_id",
            type: "varchar",
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "legal_document",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
