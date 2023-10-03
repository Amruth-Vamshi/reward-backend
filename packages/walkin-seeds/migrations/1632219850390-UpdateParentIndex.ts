import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class UpdateParentIndex1632219850390 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey(
      "order_line_item",
      "FK_ORDER_LINE_ITEM_PARENT_ID"
    );

    await queryRunner.createForeignKey(
      "order_line_item",
      new TableForeignKey({
        name: "FK_ORDER_LINE_ITEM_PARENT_ID",
        columnNames: ["parent"],
        referencedColumnNames: ["id"],
        referencedTableName: "order_line_item",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
