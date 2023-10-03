import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
  TableColumn
} from "typeorm";

export class AddColumnsOrder1586591222360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const columns = [
      {
        name: "shipping_address_id",
        type: "varchar(255)"
      },
      {
        name: "billing_address_id",
        type: "varchar(255)"
      },
      {
        name: "all_line_items_total_prices",
        type: "float",
        default: 0
      },
      {
        name: "all_line_items_total_taxes",
        type: "float",
        default: 0
      },
      {
        name: "all_line_items_total_charges",
        type: "float",
        default: 0
      },
      {
        name: "all_line_items_total_amount",
        type: "float",
        default: 0
      },
      {
        name: "order_level_charges",
        type: "float",
        default: 0
      },
      {
        name: "order_level_taxes",
        type: "float",
        default: 0
      },
      {
        name: "total_order_amount",
        type: "float",
        default: 0
      }
    ];
    const tableColumns = columns.map(column => new TableColumn(column));
    await queryRunner.addColumns("order", tableColumns);

    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["shipping_address_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "address"
      })
    );

    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["billing_address_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "address"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
