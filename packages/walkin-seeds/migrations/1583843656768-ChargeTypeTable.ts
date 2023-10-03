import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey
} from "typeorm";

export class ChargeTypeTable1583843656768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "charge_type",
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
            name: "name",
            type: "varchar",
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

    await queryRunner.createIndex(
      "charge_type",
      new TableIndex({
        columnNames: ["organization_id", "name"],
        name: "IDX_UNIQUE_CHARGE_TYPE_NAME_FOR_ORG_ID",
        isUnique: true
      })
    );

    await queryRunner.createForeignKey(
      "charge_type",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const chargeType = await queryRunner.getTable("charge_type");
    if (chargeType) {
      await queryRunner.dropTable("charge_type");
    }
  }
}
