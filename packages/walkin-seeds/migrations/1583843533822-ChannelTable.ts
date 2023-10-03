import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
  Unique
} from "typeorm";

export class ChannelTable1583843533822 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "channel",
        columns: [
          {
            name: "id",
            type: "varchar(36)",
            isPrimary: true
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
            type: "varchar",
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

    await queryRunner.createIndex(
      "channel",
      new TableIndex({
        name: "UNIQUE_CHANNEL_NAME_FOR_ORG_ID",
        columnNames: ["name", "organization_id"],
        isUnique: true
      })
    );

    await queryRunner.createForeignKey(
      "channel",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const channel = await queryRunner.getTable("channel");
    if (channel) {
      await queryRunner.dropTable("channel");
    }
  }
}
