import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from "typeorm";

export class AddJoinTableUserStore1592762648036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "store_users_store",
        columns: [
          {
            name: "user_id",
            type: "varchar(36)",
            isNullable: false,
          },
          {
            name: "store_id",
            type: "varchar(36)",
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            default: "'ACTIVE'",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "store_users_store",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "store_users_store",
      new TableForeignKey({
        columnNames: ["store_id"],
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
