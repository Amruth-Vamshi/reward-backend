import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateTableDeliveryType1585063941708
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const deliveryType = await queryRunner.getTable("delivery_type");
    if (!deliveryType) {
      await queryRunner.createTable(
        new Table({
          name: "delivery_type",
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
        "delivery_type",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization"
        })
      );

      await queryRunner.createIndex(
        "delivery_type",
        new TableIndex({
          name: "UNIQUE_DELIVERY_TYPE_CODE_FOR_ORG",
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
