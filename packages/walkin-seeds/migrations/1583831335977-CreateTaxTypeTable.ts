import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class CreateTaxTypeTable1583831335977 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const taxType = await queryRunner.getTable("tax_type");
    if (!taxType) {
      await queryRunner.createTable(
        new Table({
          name: "tax_type",
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
        "tax_type",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do Nothing
  }
}
