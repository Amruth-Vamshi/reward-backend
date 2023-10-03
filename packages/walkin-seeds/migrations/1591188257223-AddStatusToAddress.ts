import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStatusToAddress1591188257223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "address",
      new TableColumn({
        name: "status",
        isNullable: false,
        type: "varchar",
        default: "'ACTIVE'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
