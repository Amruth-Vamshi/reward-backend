import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey
} from "typeorm";

export class addTableProductPriceValue1584019291681
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "product_price_value",
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
            name: "price_value",
            type: "float",
            isNullable: false
          }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      "product_price_value",
      new TableForeignKey({
        columnNames: ["store_format"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_format"
      })
    );

    await queryRunner.createForeignKey(
      "product_price_value",
      new TableForeignKey({
        columnNames: ["channel"],
        referencedColumnNames: ["id"],
        referencedTableName: "channel"
      })
    );

    await queryRunner.createForeignKey(
      "product_price_value",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const productPriceValue = await queryRunner.getTable("product_price_value");
    if (productPriceValue) {
      await queryRunner.dropTable("product_price_value");
    }
  }
}
