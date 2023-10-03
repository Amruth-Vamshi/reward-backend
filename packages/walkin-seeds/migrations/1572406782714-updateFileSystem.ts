import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class updateFileSystem1572406782714 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "file_system",
      new TableColumn({
        name: "enabled",
        type: "boolean",
        isNullable: true,
        default: true
      })
    );

    const file_system = await queryRunner.getTable("file_system");
    await queryRunner.dropColumn(file_system, "file_system_status");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const file_system = await queryRunner.getTable("file_system");
    await queryRunner.dropColumn(file_system, "enabled");

    await queryRunner.addColumn(
      "file_system",
      new TableColumn({
        name: "file_system_status",
        type: "varchar",
        isNullable: true,
        default: "'ACTIVE'"
      })
    );
  }
}
