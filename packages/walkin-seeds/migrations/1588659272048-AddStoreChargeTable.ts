import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from "typeorm";

export class AddStoreChargeTable1588659272048 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const storeCharge = await queryRunner.getTable("store_charge");
    if (!storeCharge) {
      await queryRunner.createTable(
        new Table({
          name: "store_charge",
          columns: [
            {
              name: "id",
              type: "varchar",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "uuid",
            },
            {
              name: "created_by",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "last_modified_by",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "created_time",
              type: "datetime(6)",
              default: "CURRENT_TIMESTAMP(6)",
              isNullable: false,
            },
            {
              name: "last_modified_time",
              type: "datetime(6)",
              default: "CURRENT_TIMESTAMP(6)",
              isNullable: false,
            },
            {
              name: "charge_value",
              type: "float",
              isNullable: false,
            },
            {
              name: "store_id",
              type: "varchar(255)",
              isNullable: false,
            },
            {
              name: "charge_type",
              type: "varchar",
              isNullable: false,
              default: false,
            },
            {
              name: "charge_value_type",
              type: "varchar",
              isNullable: false,
            },
          ],
        })
      );

      await queryRunner.createForeignKey(
        "store_charge",
        new TableForeignKey({
          columnNames: ["store_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "store",
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const storeCharge = await queryRunner.getTable("store_charge");
    if (storeCharge) {
      await queryRunner.dropTable("store_charge");
    }
  }
}
