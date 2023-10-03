import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddColumnDeliveryPartner1588571027979
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order_delivery",
      new TableColumn({
        name: "delivery_partner_id",
        isNullable: true,
        type: "varchar(255)",
      })
    );
    await queryRunner.createForeignKey(
      "order_delivery",
      new TableForeignKey({
        columnNames: ["delivery_partner_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "partner",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
