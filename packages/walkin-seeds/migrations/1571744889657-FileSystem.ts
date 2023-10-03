import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
  TableIndex
} from "typeorm";

export class FileSystem1571744889657 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // file system table
    await queryRunner.createTable(
      new Table({
        name: "file_system",
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
          },
          {
            name: "name",
            isNullable: false,
            isUnique: true,
            type: "varchar"
          },
          {
            name: "description",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "access_type",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "file_system_type",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "configuration",
            isNullable: false,
            type: "JSON"
          },
          {
            name: "file_system_status",
            isNullable: false,
            type: "varchar"
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
          }
        ]
      }),
      true
    );

    await queryRunner.createIndex(
      "file_system",
      new TableIndex({
        columnNames: ["organization_id"],
        name: "IDX_FILE_SYSTEM_ORG_ID"
      })
    );
    // file_system foriegn keys

    await queryRunner.createForeignKey(
      "file_system",
      new TableForeignKey({
        name: "FK_FILE_SYSTEM_ORG_ID",
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );

    // file table

    await queryRunner.createTable(
      new Table({
        name: "file",
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
          },
          {
            name: "name",
            isNullable: false,
            isUnique: true,
            type: "varchar"
          },
          {
            name: "description",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "mime_type",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "encoding",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "public_url",
            isNullable: false,
            type: "varchar"
          },
          {
            name: "internal_url",
            isNullable: false,
            type: "varchar"
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
            name: "file_system_id",
            type: "int",
            isNullable: false
          }
        ]
      }),
      true
    );

    await queryRunner.createIndex(
      "file",
      new TableIndex({
        columnNames: ["organization_id"],
        name: "IDX_FILE_ORG_ID"
      })
    );

    await queryRunner.createIndex(
      "file",
      new TableIndex({
        columnNames: ["file_system_id"],
        name: "IDX_FILE_FILE_SYSTEM_ID"
      })
    );

    //file foriegn keys
    await queryRunner.createForeignKey(
      "file",
      new TableForeignKey({
        columnNames: ["file_system_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "file_system",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "file",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    let fileTable = await queryRunner.getTable("file");
    if (fileTable) {
      await queryRunner.dropTable("file");
    }

    let fileSystemTable = await queryRunner.getTable("file_system");
    if (fileSystemTable) {
      await queryRunner.dropTable("file_system");
    }
  }
}
