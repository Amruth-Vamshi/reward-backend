import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class AddTableOrderNote1585229676058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "order_note",
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
            name: "status",
            type: "varchar",
            isNullable: false
          },
          {
            name: "note",
            type: "text",
            isNullable: false
          },
          {
            name: "note_type",
            type: "varchar",
            isNullable: false
          },
          {
            name: "order_id",
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
      "order_note",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );

    await queryRunner.createForeignKey(
      "order_note",
      new TableForeignKey({
        columnNames: ["order_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "order"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const orderNote = await queryRunner.getTable("order_note");
    if (orderNote) {
      await queryRunner.dropTable("order_note");
    }
  }
}
