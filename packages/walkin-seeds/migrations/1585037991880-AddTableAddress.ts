import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey
} from "typeorm";

export class AddTableAddress1585037991880 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "address",
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
            name: "name",
            type: "varchar",
            isNullable: false
          },
          {
            name: "addressLine1",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "city",
            type: "varchar",
            isNullable: false
          },
          {
            name: "state",
            type: "varchar",
            isNullable: false
          },
          {
            name: "country",
            type: "varchar",
            isNullable: false
          },
          {
            name: "zip",
            type: "varchar",
            isNullable: false
          },
          {
            name: "contactNumber",
            type: "varchar",
            isNullable: false
          },
          {
            name: "addressTitle",
            type: "varchar",
            isNullable: false
          },
          {
            name: "addressType",
            type: "varchar",
            isNullable: false
          }
        ]
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const address = await queryRunner.getTable("address");
    if (address) {
      await queryRunner.dropTable("address");
    }
  }
}
