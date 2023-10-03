import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class AddTableProductCollection1584526038010
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "product_collection",
        columns: [
          {
            name: "id",
            type: "varchar(36)",
            isPrimary: true
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "product_id",
            type: "varchar(36)",
            isNullable: false
          },
          {
            name: "collection_id",
            type: "varchar(36)",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "product_collection",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      "product_collection",
      new TableForeignKey({
        columnNames: ["collection_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "collection",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const productCollection = await queryRunner.getTable("product_collection");
    if (productCollection) {
      await queryRunner.dropTable("product_collection");
    }
  }
}
