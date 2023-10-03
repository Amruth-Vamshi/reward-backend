import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class AddTableDiscountType1625406733162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "discount_type",
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
            name: "name",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "organization_id",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "discount_type_Code",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "status",
            type: "varchar(36)",
            isNullable: true,
            default: "'ACTIVE'"
          },
          {
            name: "enabled",
            type: "boolean",
            isNullable: true,
            default: true
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "discount_type",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
