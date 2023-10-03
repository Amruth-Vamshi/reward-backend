import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey
} from "typeorm";

export class CreateMenuTimingsTable1633598055047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "menu_timings",
        columns: [
          {
            name: "id",
            type: "varchar(36)",
            isPrimary: true
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "name",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "code",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "days",
            type: "varchar(255)",
            isNullable: false
          },
          {
            name: "openTime",
            type: "int",
            isNullable: false
          },
          {
            name: "closeTime",
            type: "int",
            isNullable: false
          },
          {
            name: "organization_id",
            type: "varchar(36)",
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createIndex(
      "menu_timings",
      new TableIndex({
        name: "MENU_CODE_INDEX",
        columnNames: ["code"],
        isUnique: false
      })
    );

    await queryRunner.createForeignKey(
      "menu_timings",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
