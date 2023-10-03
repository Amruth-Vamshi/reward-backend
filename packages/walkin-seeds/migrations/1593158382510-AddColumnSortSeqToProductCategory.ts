import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from "typeorm";

export class AddColumnSortSeqToProductCategory1593158382510
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "product_category",
      new TableColumn({
        name: "sortSeq",
        isNullable: true,
        type: "int",
        default: 0,
      })
    );
    await queryRunner.createIndex(
      "product_category",
      new TableIndex({
        columnNames: ["sortSeq"],
        name: "INDEX_FOR_SORTSEQ_PRODUCT_CATEGORY",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
