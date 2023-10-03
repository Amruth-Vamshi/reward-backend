import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
  Table
} from "typeorm";

export class AddTableCollection1584520628628 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const collection = await queryRunner.getTable("collection");
    if (!collection) {
      await queryRunner.createTable(
        new Table({
          name: "collection",
          columns: [
            {
              name: "id",
              type: "varchar",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "uuid"
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
              name: "name",
              type: "varchar(255)",
              isNullable: false
            },
            {
              name: "code",
              type: "varchar(255)",
              isNullable: true
            },
            {
              name: "active",
              type: "boolean",
              isNullable: true,
              default: true
            },
            {
              name: "organization_id",
              type: "varchar(36)",
              isNullable: false
            }
          ]
        })
      );

      await queryRunner.createIndex(
        "collection",
        new TableIndex({
          columnNames: ["organization_id", "name"],
          name: "IDX_UNIQUE_NAME_FOR_ORG_ID",
          isUnique: true
        })
      );

      await queryRunner.createForeignKey(
        "collection",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const collection = await queryRunner.getTable("collection");
    if (collection) {
      await queryRunner.dropTable("collection");
    }
  }
}
