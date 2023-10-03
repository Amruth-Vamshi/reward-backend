import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
  TableForeignKey
} from "typeorm";

export class addColumnChargeTypeCode1583907284473
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "charge_type",
      new TableColumn({
        name: "chargeTypeCode",
        type: "varchar",
        isNullable: false
      })
    );

    await queryRunner.createIndex(
      "charge_type",
      new TableIndex({
        columnNames: ["organization_id", "chargeTypeCode"],
        name: "IDX_UNIQUE_CHARGE_TYPE_CODE_NAME_FOR_ORG_ID",
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
