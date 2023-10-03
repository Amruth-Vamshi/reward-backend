import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey
} from "typeorm";

export class CreateCustomerTagMappingTable1575961856442
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "customer_customer_tag",
        columns: [
          {
            name: "customer_tag_id",
            type: "int",
            isNullable: false,
            isPrimary: true
          },
          {
            name: "customer_id",
            type: "varchar(36)",
            isNullable: false,
            isPrimary: true
          }
        ]
      }),
      true
    );
    await queryRunner.createIndex(
      "customer_customer_tag",
      new TableIndex({
        columnNames: ["customer_tag_id", "customer_id"],
        name: "IDX_UNIQUE_CUSTOMER_ID_TAG_ID"
      })
    );

    await queryRunner.createForeignKey(
      "customer_customer_tag",
      new TableForeignKey({
        columnNames: ["customer_tag_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer_tag",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "customer_customer_tag",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const customerTagMapping = await queryRunner.getTable(
      "customer_customer_tag"
    );
    if (customerTagMapping) {
      await queryRunner.dropTable("customer_customer_tag");
    }
  }
}
