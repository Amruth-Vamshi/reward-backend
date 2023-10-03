import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
  TableIndex
} from "typeorm";

export class AddTableTag1584519325170 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const tag = await queryRunner.getTable("tag");
    if (!tag) {
      await queryRunner.createTable(
        new Table({
          name: "tag",
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
              name: "tag_name",
              type: "varchar(255)",
              isNullable: false
            },
            {
              name: "code",
              type: "varchar(255)",
              isNullable: true
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
        "tag",
        new TableIndex({
          columnNames: ["organization_id", "tag_name"],
          name: "IDX_UNIQUE_TAG_NAME_FOR_ORG_ID",
          isUnique: true
        })
      );

      await queryRunner.createForeignKey(
        "tag",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const tag = await queryRunner.getTable("tag");
    if (tag) {
      await queryRunner.dropTable("tag");
    }
  }
}
