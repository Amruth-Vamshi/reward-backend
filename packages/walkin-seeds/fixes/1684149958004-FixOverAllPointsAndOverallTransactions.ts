import { MigrationInterface, QueryRunner } from "typeorm";
import { LoyaltyTotals } from "../../walkin-core/src/entity";

export class FixOverAllPointsAndOverallTransactions1684149958004
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.transaction(async transactionManager => {
      // Update customer loyalty
      const customerLoyalty = await transactionManager.query(`
            SELECT cl.id as customerLoyaltyId, 
            cl.loyalty_totals as loyaltyTotalsId,
            lt.yearly_points as yearlyPoints,
            lt.yearly_transactions as yearlyTransactions
            FROM customer_loyalty cl
            inner join loyalty_totals lt on lt.id = cl.loyalty_totals
            where lt.overall_points < lt.yearly_points;
            `);
      for (let record of customerLoyalty) {
        const { loyaltyTotalsId, yearlyPoints, yearlyTransactions } = record;
        await transactionManager.update(
          LoyaltyTotals,
          { id: loyaltyTotalsId },
          {
            overallPoints: yearlyPoints,
            overallTransactions: yearlyTransactions
          }
        );
      }

      // Update customer loyalty program
      const customerLoyaltyProgram = await transactionManager.query(`
      SELECT clp.id as customerLoyaltyProgramId, 
      clp.loyalty_totals as loyaltyTotalsId,
      lt.yearly_points as yearlyPoints,
      lt.yearly_transactions as yearlyTransactions
      FROM customer_loyalty_program clp
      inner join loyalty_totals lt on lt.id = clp.loyalty_totals
      where lt.overall_points < lt.yearly_points;`);
      for (let record of customerLoyaltyProgram) {
        const { loyaltyTotalsId, yearlyPoints, yearlyTransactions } = record;
        await transactionManager.update(
          LoyaltyTotals,
          { id: loyaltyTotalsId },
          {
            overallPoints: yearlyPoints,
            overallTransactions: yearlyTransactions
          }
        );
      }
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
