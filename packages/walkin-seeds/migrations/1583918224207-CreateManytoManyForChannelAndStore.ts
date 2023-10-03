import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class CreateManytoManyForChannelAndStore1583918224207
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "channel_store",
        columns: [
          {
            name: "channelId",
            type: "varchar(36)",
            isNullable: false
          },
          {
            name: "storeId",
            type: "varchar(36)",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "channel_store",
      new TableForeignKey({
        columnNames: ["channelId"],
        referencedColumnNames: ["id"],
        referencedTableName: "channel",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      "channel_store",
      new TableForeignKey({
        columnNames: ["storeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "store",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
