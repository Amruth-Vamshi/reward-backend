import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class AddTableProductDiscountValue1625406801192
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "product_discount_value",
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
            name: "product_id",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "store_format",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "channel",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "discount_value",
            type: "float",
            isNullable: false
          },
          {
            name: "discount_value_type",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "discount_type",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "status",
            type: "varchar(255)",
            isNullable: true,
            default: "'ACTIVE'"
          }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      "product_discount_value",
      new TableForeignKey({
        columnNames: ["discount_type"],
        referencedColumnNames: ["id"],
        referencedTableName: "discount_type"
      })
    );

    await queryRunner.createForeignKey(
      "product_discount_value",
      new TableForeignKey({
        columnNames: ["store_format"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_format"
      })
    );

    await queryRunner.createForeignKey(
      "product_discount_value",
      new TableForeignKey({
        columnNames: ["channel"],
        referencedColumnNames: ["id"],
        referencedTableName: "channel"
      })
    );

    await queryRunner.createForeignKey(
      "product_discount_value",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
