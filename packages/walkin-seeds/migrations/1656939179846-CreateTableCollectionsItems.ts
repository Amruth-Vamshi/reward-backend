import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class CreateTableCollectionsItems1656939179846
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "collections_items",
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
            name: "item_id",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "collections_id",
            type: "varchar(255)",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "collections_items",
      new TableForeignKey({
        columnNames: ["collections_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "collections"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
