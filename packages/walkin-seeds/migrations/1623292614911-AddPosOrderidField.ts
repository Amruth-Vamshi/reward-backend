import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class AddPosOrderidField1623292614911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order",
      new TableColumn({
        name: "pos_order_id",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.createIndex(
      "order",
      new TableIndex({
        columnNames: ["pos_order_id"],
        name: "IDX_EXTERNAL_POS_ORDER_ID"
      })
    );
    await queryRunner.createIndex(
      "order",
      new TableIndex({
        columnNames: ["store_id", "pos_order_id"],
        name: "IDX_UNIQUE_TAG_FOR_POS_ORDER_ID",
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
