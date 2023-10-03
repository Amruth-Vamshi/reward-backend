import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class AddColumnParentIdOrderLineItem1629653141049
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_line_item",
      new TableColumn({
        name: "parent",
        type: "varchar(255)",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "order_line_item",
      new TableForeignKey({
        name: "FK_ORDER_LINE_ITEM_PARENT_ID",
        columnNames: ["parent"],
        referencedColumnNames: ["id"],
        referencedTableName: "order_line_item",
      })
    );

    await queryRunner.createIndex(
      "order_line_item",
      new TableIndex({
        name: "IDX_ORDER_LINE_ITEM_PARENT_ID",
        columnNames: ["parent"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
