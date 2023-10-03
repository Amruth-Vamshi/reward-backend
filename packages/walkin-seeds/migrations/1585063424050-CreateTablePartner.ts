import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateTablePartner1585063424050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const partner = await queryRunner.getTable("partner");
    if (!partner) {
      await queryRunner.createTable(
        new Table({
          name: "partner",
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
              name: "code",
              type: "varchar(255)",
              isNullable: true
            },
            {
              name: "partnerType",
              type: "enum",
              isNullable: false,
              enum: ["PAYMENT", "DELIVERY"]
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
        "partner",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization"
        })
      );

      await queryRunner.createIndex(
        "partner",
        new TableIndex({
          name: "UNIQUE_PARTNER_CODE_FOR_ORG",
          columnNames: ["code", "organization_id"],
          isUnique: true
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // DO nothing
  }
}
