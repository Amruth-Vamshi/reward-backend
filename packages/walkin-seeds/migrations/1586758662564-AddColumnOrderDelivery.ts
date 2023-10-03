import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
  TableColumn
} from "typeorm";

export class AddColumnOrderDelivery1586758662564 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const columns = [
      {
        name: "external_order_id",
        type: "varchar(255)",
        isNullable: true
      },
      {
        name: "external_delivery_details",
        type: "text",
        isNullable: true
      },
      {
        name: "delivery_status",
        type: "varchar",
        isNullable: true
      },
      {
        name: "delivery_status_code",
        type: "int",
        isNullable: true
      }
    ];
    const tableColumns = columns.map(column => new TableColumn(column));
    await queryRunner.addColumns("order_delivery", tableColumns);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
