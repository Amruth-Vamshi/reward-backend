import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddIndexCustomerTable1589173409769 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "customer",
      new TableIndex({
        columnNames: ["organization_id", "customerIdentifier"],
        name: "table_customer_columns_customeridentifier_organization",
      })
    );

    await queryRunner.createIndex(
      "customer",
      new TableIndex({
        columnNames: ["organization_id", "phoneNumber"],
        name: "table_customer_columns_phonenumber_organization",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
