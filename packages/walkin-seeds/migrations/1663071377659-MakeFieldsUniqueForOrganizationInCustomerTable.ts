import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class MakeFieldsUniqueForOrganizationInCustomerTable1663071377659
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "customer",
      new TableIndex({
        name: "UNIQUE_PHONE_NUMBER_FOR_ORG",
        columnNames: ["phoneNumber", "organization_id"],
        isUnique: true
      })
    );

    await queryRunner.createIndex(
      "customer",
      new TableIndex({
        name: "UNIQUE_EXTERNAL_CUSTOMER_ID_FOR_ORG",
        columnNames: ["externalCustomerId", "organization_id"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex("customer", "UNIQUE_PHONE_NUMBER_FOR_ORG");
    await queryRunner.dropIndex(
      "customer",
      "UNIQUE_EXTERNAL_CUSTOMER_ID_FOR_ORG"
    );
  }
}
