import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class AddTableOrder1585226350549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "order",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: true
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: true
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          },
          {
            name: "order_status",
            type: "varchar",
            isNullable: false
          },
          {
            name: "customer_id",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "order_type",
            type: "varchar",
            isNullable: false
          },
          {
            name: "status",
            type: "varchar",
            isNullable: false
          },
          {
            name: "store_id",
            type: "varchar",
            isNullable: false
          },
          {
            name: "channel_id",
            type: "varchar",
            isNullable: false
          },
          {
            name: "order_status_code",
            type: "varchar",
            isNullable: false
          },
          {
            name: "organization_id",
            type: "varchar",
            isNullable: false
          }
        ]
      }),
      true
    );
    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );

    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["channel_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "channel"
      })
    );

    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["store_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store"
      })
    );

    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const order = await queryRunner.getTable("order");
    if (order) {
      await queryRunner.dropTable("order");
    }
  }
}
