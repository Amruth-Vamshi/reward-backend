import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTierFieldToCustomerTable1668000826855
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const tableName = "customer";
    const columnName = "tier";
    const hasColumn = await queryRunner.hasColumn(tableName, columnName);

    if (!hasColumn) {
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "tier",
          type: "varchar(255)",
          isNullable: true
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
