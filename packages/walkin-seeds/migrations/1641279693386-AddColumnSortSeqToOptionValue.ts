import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class AddColumnSortSeqToOptionValue1641279693386
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "option_value",
      new TableColumn({
        name: "sortSeq",
        isNullable: true,
        type: "int",
        default: 0
      })
    );
    await queryRunner.createIndex(
      "option_value",
      new TableIndex({
        columnNames: ["sortSeq"],
        name: "INDEX_FOR_SORTSEQ_OPTION_VALUE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
