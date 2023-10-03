import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class AlterColumnShippingAddress1586844549067
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const orderTable = await queryRunner.getTable("order");
    const addressForeignKey = orderTable.foreignKeys.find(
      fk => fk.columnNames.indexOf("billing_address_id") !== -1
    );
    await queryRunner.dropForeignKey(orderTable, addressForeignKey);
    await queryRunner.dropColumn(orderTable, "billing_address_id");
    await queryRunner.addColumn(
      "order",
      new TableColumn({
        name: "billing_address_id",
        type: "varchar(255)",
        isNullable: true
      })
    );
    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["billing_address_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "address"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
