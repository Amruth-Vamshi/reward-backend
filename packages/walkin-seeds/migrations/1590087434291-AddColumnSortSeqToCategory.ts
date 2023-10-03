import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from "typeorm";

export class AddColumnSortSeqToCategory1590087434291
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "category",
      new TableColumn({
        name: "sortSeq",
        isNullable: true,
        type: "int",
        default: 0,
      })
    );
    await queryRunner.createIndex(
      "category",
      new TableIndex({
        columnNames: ["sortSeq", "catalog_id"],
        name: "INDEX_FOR_SORTSEQ_ORGANIZATION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
