import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class addTableProductRelationship1583932294666
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "product_relationship",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true
          },
          {
            name: "parent_type",
            type: "varchar",
            isNullable: false
          },
          {
            name: "child_type",
            type: "varchar",
            isNullable: false
          },
          {
            name: "relationship",
            type: "varchar",
            isNullable: false
          },
          {
            name: "parent_id",
            isNullable: false,
            type: "varchar(36)"
          },
          {
            name: "child_id",
            type: "varchar(36)",
            isNullable: false
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
          }
        ]
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const productRelationship = await queryRunner.getTable(
      "product_relationship"
    );
    if (productRelationship) {
      await queryRunner.dropTable("product_relationship");
    }
  }
}
