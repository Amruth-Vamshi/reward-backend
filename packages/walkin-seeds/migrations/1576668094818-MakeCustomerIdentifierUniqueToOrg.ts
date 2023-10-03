import {
  MigrationInterface,
  QueryRunner,
  TableIndex,
  TableColumn
} from "typeorm";

export class MakeCustomerIdentifierUniqueToOrg1576668094818
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "customer",
      "customerIdentifier",
      new TableColumn({
        name: "customerIdentifier",
        type: "varchar(255)",
        isNullable: false
      })
    );

    await queryRunner.createIndex(
      "customer",
      new TableIndex({
        name: "UNIQUE_CUSTOMER_IDENTIFIER_FOR_ORG",
        columnNames: ["customerIdentifier", "organization_id"],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex(
      "customer",
      "UNIQUE_CUSTOMER_IDENTIFIER_FOR_ORG"
    );
  }
}
