import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class DeleteCollectionTable1663219395105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE product_collection DROP FOREIGN KEY FK_2346dc7fab96336a85a6418b776"
    );
    await queryRunner.query("DROP TABLE collection");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "collection",
        columns: [
          {
            name: "id",
            type: "varchar(36)",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
            isNullable: false
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
            name: "code",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "active",
            type: "tinyint(1)",
            isNullable: true,
            default: 1
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
      "collection",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );

    await queryRunner.createForeignKey(
      "product_collection",
      new TableForeignKey({
        columnNames: ["collection_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "collection"
      })
    );
  }
}
