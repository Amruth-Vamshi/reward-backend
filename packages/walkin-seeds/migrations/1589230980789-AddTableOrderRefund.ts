import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class AddTableOrderRefund1589230980789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "order_refund",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true,
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "order_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "organization_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "payment_partner_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "external_order_id",
            type: "varchar(255)",
            isNullable: true,
          },
          {
            name: "external_refund_id",
            type: "varchar(255)",
            isNullable: true,
          },
          {
            name: "external_refund_details",
            type: "text",
            isNullable: true,
          },
          {
            name: "refund_status",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "refund_status_code",
            type: "int",
            isNullable: true,
          },
          {
            name: "payment_type",
            type: "varchar",
            isNullable: true,
          },
        ],
      }),
      true
    );
    await queryRunner.createForeignKey(
      "order_refund",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
      })
    );
    await queryRunner.createForeignKey(
      "order_refund",
      new TableForeignKey({
        columnNames: ["payment_partner_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "partner",
      })
    );

    await queryRunner.createForeignKey(
      "order_refund",
      new TableForeignKey({
        columnNames: ["payment_type"],
        referencedColumnNames: ["id"],
        referencedTableName: "payment_type",
      })
    );
    await queryRunner.createForeignKey(
      "order_refund",
      new TableForeignKey({
        columnNames: ["order_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "order",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const orderRefund = await queryRunner.getTable("order_refund");
    if (orderRefund) {
      await queryRunner.dropTable("order_refund");
    }
  }
}
