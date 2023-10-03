import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class policyChanges1573539741171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "policy",
      "type",
      new TableColumn({
        type: "varchar",
        name: "type",
        isNullable: false
      })
    );
    await queryRunner.changeColumn(
      "policy",
      "resource",
      new TableColumn({
        type: "varchar",
        name: "resource",
        isNullable: false
      })
    );
    await queryRunner.changeColumn(
      "policy",
      "permission",
      new TableColumn({
        type: "varchar",
        name: "permission",
        isNullable: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // No down migrations required, This should be the the only default behaviour of these columns
  }
}
