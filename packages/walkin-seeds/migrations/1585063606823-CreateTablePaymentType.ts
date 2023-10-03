import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateTablePaymentType1585063606823 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const paymentType = await queryRunner.getTable("payment_type");
    if (!paymentType) {
      await queryRunner.createTable(
        new Table({
          name: "payment_type",
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
              name: "organization_id",
              type: "varchar(36)",
              isNullable: false
            }
          ]
        })
      );

      await queryRunner.createForeignKey(
        "payment_type",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization"
        })
      );

      await queryRunner.createIndex(
        "payment_type",
        new TableIndex({
          name: "UNIQUE_PAYMENT_TYPE_CODE_FOR_ORG",
          columnNames: ["code", "organization_id"],
          isUnique: true
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // Do nothing
  }
}
