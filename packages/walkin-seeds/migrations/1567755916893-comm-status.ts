import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class CommStatus1567755916893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "communication",
      new TableColumn({
        name: "status",
        type: "varchar",
        length: "36",
        default: "'ACTIVE'"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("communication", "status");
  }
}
