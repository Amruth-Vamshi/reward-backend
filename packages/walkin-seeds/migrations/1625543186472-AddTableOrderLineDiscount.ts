import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class AddTableOrderLineDiscount1625543186472
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "order_line_discount",
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
            name: "product_discount",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "product_discount_value_id",
            type: "varchar",
            isNullable: false
          },
          {
            name: "status",
            type: "varchar",
            isNullable: false
          },
          {
            name: "product_id",
            type: "varchar",
            isNullable: false
          },
          {
            name: "order_line_item_id",
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
      "order_line_discount",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );

    await queryRunner.createForeignKey(
      "order_line_discount",
      new TableForeignKey({
        columnNames: ["product_discount_value_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product_discount_value"
      })
    );

    await queryRunner.createForeignKey(
      "order_line_discount",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product"
      })
    );

    await queryRunner.createForeignKey(
      "order_line_discount",
      new TableForeignKey({
        columnNames: ["order_line_item_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "order_line_item"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
