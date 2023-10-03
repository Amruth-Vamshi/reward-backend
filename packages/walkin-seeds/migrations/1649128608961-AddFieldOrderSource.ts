import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldOrderSource1648108476719 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "order",
      new TableColumn({
        name: "orderSource",
        isNullable: true,
        type: "varchar",
        default: "'PEPPO_PWA'"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}