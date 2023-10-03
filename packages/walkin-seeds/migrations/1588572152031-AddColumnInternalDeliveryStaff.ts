import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddColumnInternalDeliveryStaff1588572152031
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_delivery",
      new TableColumn({
        name: "internal_delivery_partner_id",
        isNullable: true,
        type: "varchar(255)",
      })
    );
    await queryRunner.createForeignKey(
      "order_delivery",
      new TableForeignKey({
        columnNames: ["internal_delivery_partner_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "staff",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
