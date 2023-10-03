import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class AddTableOrderLineItem1585227364654 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "order_line_item",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: true
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: true
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          },
          {
            name: "line_total_amount",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "line_total_charge",
            type: "varchar",
            isNullable: false
          },
          {
            name: "line_total_tax",
            type: "varchar",
            isNullable: false
          },
          {
            name: "line_total_product_prices",
            type: "varchar",
            isNullable: false
          },
          {
            name: "status",
            type: "varchar",
            isNullable: false
          },
          {
            name: "product_price",
            type: "varchar",
            isNullable: false
          },
          {
            name: "product_price_value_id",
            type: "varchar",
            isNullable: false
          },
          {
            name: "order_id",
            type: "varchar",
            isNullable: false
          },
          {
            name: "product_id",
            type: "varchar",
            isNullable: false
          },
          {
            name: "organization_id",
            type: "varchar",
            isNullable: false
          }
        ]
      }),
      true
    );
    await queryRunner.createForeignKey(
      "order_line_item",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );

    await queryRunner.createForeignKey(
      "order_line_item",
      new TableForeignKey({
        columnNames: ["order_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "order"
      })
    );
    await queryRunner.createForeignKey(
      "order_line_item",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product"
      })
    );
    await queryRunner.createForeignKey(
      "order_line_item",
      new TableForeignKey({
        columnNames: ["product_price_value_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product_price_value"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const orderLineItem = await queryRunner.getTable("order_line_item");
    if (orderLineItem) {
      await queryRunner.dropTable("order_line_item");
    }
  }
}
