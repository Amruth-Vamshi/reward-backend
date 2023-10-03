import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddEmailOrgIndexToCustomer1677488382039
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "customer",
      new TableIndex({
        name: "EMAIL_ORG_ID_INDEX",
        columnNames: ["email", "organization_id"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
