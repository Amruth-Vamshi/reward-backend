import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
  TableColumn
} from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";

export class AddColumnOrderPayments1586758364559 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const columns = [
      {
        name: "external_order_id",
        type: "varchar(255)",
        isNullable: true
      },
      {
        name: "external_payment_id",
        type: "varchar(255)",
        isNullable: true
      },
      {
        name: "external_payment_details",
        type: "text",
        isNullable: true
      },
      {
        name: "payment_status",
        type: "varchar",
        isNullable: true
      },
      {
        name: "payment_status_code",
        type: "int",
        isNullable: true
      }
    ];
    const tableColumns = columns.map(column => new TableColumn(column));
    await queryRunner.addColumns("order_payment", tableColumns);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
