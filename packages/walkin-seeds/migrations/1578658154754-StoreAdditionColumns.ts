import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class StoreAdditionColumns1578658154754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        type: "boolean",
        name: "wifi",
        default: false
      })
    );

    await queryRunner.addColumn(
      "store",
      new TableColumn({
        type: "varchar",
        name: "email",
        isNullable: true
      })
    );

    await queryRunner.addColumn(
      "store",
      new TableColumn({
        type: "varchar",
        name: "latitude",
        isNullable: true
      })
    );

    await queryRunner.addColumn(
      "store",
      new TableColumn({
        type: "varchar",
        name: "longitude",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("store", "wifi");
    await queryRunner.dropColumn("store", "email");
    await queryRunner.dropColumn("store", "latitude");
    await queryRunner.dropColumn("store", "longitude");
  }
}
