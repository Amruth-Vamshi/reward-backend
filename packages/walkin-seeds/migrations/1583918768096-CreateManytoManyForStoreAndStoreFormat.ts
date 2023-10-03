import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateManytoManyForStoreAndStoreFormat1583918768096
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "store_format_store",
        columns: [
          {
            name: "storeFormatId",
            type: "varchar(36)",
            isNullable: false,
          },
          {
            name: "storeId",
            type: "varchar(36)",
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            default: "'ACTIVE'",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "store_format_store",
      new TableForeignKey({
        columnNames: ["storeFormatId"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_format",
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "store_format_store",
      new TableForeignKey({
        columnNames: ["storeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "store",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
