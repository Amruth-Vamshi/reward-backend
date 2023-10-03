import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class AddColumnStoreFormatCodeForStoreFormat1583907578547
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "store_format",
      new TableColumn({
        name: "store_format_code",
        type: "varchar(36)",
        isNullable: true
      })
    );

    await queryRunner.createIndex(
      "store_format",
      new TableIndex({
        name: "UNIQUE_STORE_FORMAT_CODE_FOR_ORG",
        columnNames: ["store_format_code", "organization_id"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
