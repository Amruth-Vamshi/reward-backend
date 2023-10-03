import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from "typeorm";

export class AddTableStaffForStore1588228677798 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "staff_store_member",
        columns: [
          {
            name: "storeId",
            type: "varchar(255)",
            isNullable: false,
          },
          {
            name: "staffId",
            type: "varchar(255)",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "staff_store_member",
      new TableForeignKey({
        columnNames: ["staffId"],
        referencedColumnNames: ["id"],
        referencedTableName: "staff",
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "staff_store_member",
      new TableForeignKey({
        columnNames: ["storeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "store",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
