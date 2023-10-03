import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from "typeorm";

// tslint:disable-next-line:class-name
export class communicationLog1569569567911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("coupon");
    if (table) {
      await queryRunner.dropTable("coupon");
    }

    await queryRunner.createTable(
      new Table({
        name: "communication_log",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
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
            name: "communication_id",
            type: "int",
            isNullable: true
          },
          {
            name: "startTime",
            type: "datetime(6)",
            isNullable: false
          },
          {
            name: "endTime",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          },
          {
            name: "runType",
            type: "varchar",
            isNullable: true
          },
          {
            name: "communicationStatus",
            type: "varchar",
            isNullable: true
          },
          {
            name: "status",
            type: "varchar",
            isNullable: true
          },
          {
            name: "log",
            type: "JSON",
            isNullable: true
          },
          {
            name: "organization_id",
            type: "varchar",
            isNullable: true
          }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      "communication_log",
      new TableForeignKey({
        columnNames: ["communication_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "communication"
      })
    );
  }

  // tslint:disable-next-line:no-empty
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
