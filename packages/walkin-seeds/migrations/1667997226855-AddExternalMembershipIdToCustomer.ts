import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex
} from "typeorm";

export class AddExternalMembershipIdToCustomer1667997226855
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    /**
     * Add new column externalMembershipId to customer
     * externalMembershipId is unique within an organization
     */

    const tableName = "customer";
    const columnName = "externalMembershipId";
    const hasColumn = await queryRunner.hasColumn(tableName, columnName);

    if (!hasColumn) {
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "externalMembershipId",
          type: "varchar(255)",
          default: null,
          isNullable: true
        })
      );

      await queryRunner.createIndex(
        "customer",
        new TableIndex({
          name: "UNIQUE_EXTERNAL_MEMBERSHIP_ID_FOR_ORG",
          columnNames: ["externalMembershipId", "organization_id"],
          isUnique: true
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
