import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddOverallPointsAndOverallTransactionsColumnsToLoyaltyTotalsTable1673943040685
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "loyalty_totals",
      new TableColumn({
        name: "overall_points",
        type: "float",
        isNullable: false,
        default: 0
      })
    );
    await queryRunner.addColumn(
      "loyalty_totals",
      new TableColumn({
        name: "overall_transactions",
        type: "bigint",
        isNullable: false,
        default: 0
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
