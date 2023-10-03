import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class CreateStoreFormat1583842303637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const storeFormat = await queryRunner.getTable("store_format");
    if (!storeFormat) {
      await queryRunner.createTable(
        new Table({
          name: "store_format",
          columns: [
            {
              name: "id",
              type: "varchar",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "uuid"
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
              name: "name",
              type: "varchar(255)",
              isNullable: false
            },
            {
              name: "description",
              type: "varchar(255)",
              isNullable: true
            },
            {
              name: "status",
              type: "varchar(36)",
              isNullable: false
            },
            {
              name: "organization_id",
              type: "varchar(36)",
              isNullable: false
            }
          ]
        })
      );

      await queryRunner.createForeignKey(
        "store_format",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization"
        })
      );

      const storeFormatTaxType = await queryRunner.getTable(
        "store_format_tax_type"
      );
      if (!storeFormatTaxType) {
        await queryRunner.createTable(
          new Table({
            name: "store_format_tax_type",
            columns: [
              {
                name: "store_format_id",
                type: "varchar",
                isNullable: false
              },
              {
                name: "tax_type_id",
                type: "varchar",
                isNullable: false
              },
              {
                name: "status",
                type: "varchar",
                isNullable: true
              }
            ]
          })
        );
      }

      await queryRunner.createForeignKey(
        "store_format_tax_type",
        new TableForeignKey({
          columnNames: ["store_format_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "store_format"
        })
      );

      await queryRunner.createForeignKey(
        "store_format_tax_type",
        new TableForeignKey({
          columnNames: ["tax_type_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "tax_type"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
