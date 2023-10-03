import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class AddColumnStoreFormatForStore1583848062282
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "store_format_id",
        type: "varchar(36)",
        isNullable: true
      })
    );

    await queryRunner.createForeignKey(
      "store",
      new TableForeignKey({
        columnNames: ["store_format_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_format"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    //  Do Nothing
  }
}
