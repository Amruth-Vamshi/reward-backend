import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn
} from "typeorm";

export class Hyperx1567508648592 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "hyperx",
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
            name: "version",
            type: "int",
            isNullable: false
          },
          {
            name: "initStatus",
            type: "varchar",
            isNullable: true
          },
          {
            name: "status",
            type: "varchar",
            isNullable: false,
            default: "'ACTIVE'"
          }
        ]
      }),
      true
    );

    await queryRunner.addColumn(
      "hyperx",
      new TableColumn({
        name: "organization_id",
        type: "varchar(36)"
      })
    );

    await queryRunner.addColumn(
      "hyperx",
      new TableColumn({
        name: "application_id",
        type: "varchar(36)"
      })
    );

    await queryRunner.createForeignKey(
      "hyperx",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "hyperx",
      new TableForeignKey({
        columnNames: ["application_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "application",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("hyperx");
    const table = await queryRunner.getTable("hyperx");
    const organizationForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf("organizationId") !== -1
    );
    await queryRunner.dropForeignKey("organization", organizationForeignKey);
    const applicationForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf("organizationId") !== -1
    );
    await queryRunner.dropForeignKey("application", applicationForeignKey);
  }
}
