import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
  TableIndex,
} from "typeorm";

export class AddTableStaff1588091197156 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const staff = await queryRunner.getTable("staff");
    if (!staff) {
      await queryRunner.createTable(
        new Table({
          name: "staff",
          columns: [
            {
              name: "id",
              type: "varchar",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "uuid",
            },
            {
              name: "created_by",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "last_modified_by",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "created_time",
              type: "datetime(6)",
              default: "CURRENT_TIMESTAMP(6)",
              isNullable: false,
            },
            {
              name: "last_modified_time",
              type: "datetime(6)",
              default: "CURRENT_TIMESTAMP(6)",
              isNullable: false,
            },
            {
              name: "name",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "phone",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "staffRole",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "organization_id",
              type: "varchar(255)",
              isNullable: false,
            },
          ],
        })
      );

      await queryRunner.createForeignKey(
        "staff",
        new TableForeignKey({
          columnNames: ["organization_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "organization",
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const staff = await queryRunner.getTable("staff");
    if (staff) {
      await queryRunner.dropTable("staff");
    }
  }
}
