import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table
} from "typeorm";

export class AddTableUserDevice1610553651606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "user_device",
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
            name: "fcmToken",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "deviceId",
            type: "varchar(255)",
            isNullable: true
          },
          {
            name: "os",
            type: "varchar(36)",
            isNullable: true
          },
          {
            name: "osVersion",
            type: "varchar(36)",
            isNullable: true
          },
          {
            name: "user_id",
            type: "varchar(64)",
            isNullable: true
          },
          {
            name: "extend",
            type: "text",
            isNullable: true
          },
          {
            name: "status",
            type: "boolean",
            default: false,
            isNullable: true
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "user_device",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const user_device = await queryRunner.getTable("user_device");
    if (user_device) {
      await queryRunner.dropTable("user_device");
    }
  }
}
