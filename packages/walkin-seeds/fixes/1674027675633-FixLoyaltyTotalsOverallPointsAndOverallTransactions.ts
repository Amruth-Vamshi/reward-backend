import { LoyaltyTotals } from "@walkinserver/walkin-core/src/entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class FixLoyaltyTotalsOverallPointsAndOverallTransactions1674027675633
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let customerLoyaltyIds: any = await queryRunner.manager.query(
      "SELECT id,loyalty_totals FROM customer_loyalty"
    );
    for (let i = 0; i < customerLoyaltyIds.length; i++) {
      let query = `select SUM(lt.points_issued),COUNT(*) from
                  loyalty_transaction as lt
                  inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
                  inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
                  where
                  clp.customer_loyalty_id=${customerLoyaltyIds[i].id}
                  and
                  lt.points_issued>0
                  and
                  lt.status_code=102;`;
      let overall: any = await queryRunner.manager.query(query);
      let overall_points = overall[0]["SUM(lt.points_issued)"]
        ? overall[0]["SUM(lt.points_issued)"]
        : 0;
      let overall_transactions = overall[0]["COUNT(*)"];

      let loyalty_totals = await queryRunner.manager.update(
        LoyaltyTotals,
        { id: customerLoyaltyIds[i].loyalty_totals },
        {
          overallPoints: overall_points,
          overallTransactions: overall_transactions
        }
      );
    }

    let customerLoyaltyProgramIds: any = await queryRunner.manager.query(
      "SELECT id,loyalty_totals FROM customer_loyalty_program"
    );

    for (let i = 0; i < customerLoyaltyProgramIds.length; i++) {
      let query = `select SUM(lt.points_issued),COUNT(*) from
                    loyalty_transaction as lt
                    inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
                    inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
                    where
                    clp.id='${customerLoyaltyProgramIds[i].id}'
                    and
                    lt.points_issued>0
                    and
                    lt.status_code=102;`;
      let overall: any = await queryRunner.manager.query(query);
      let overall_points = overall[0]["SUM(lt.points_issued)"]
        ? overall[0]["SUM(lt.points_issued)"]
        : 0;
      let overall_transactions = overall[0]["COUNT(*)"];

      let loyalty_totals = await queryRunner.manager.update(
        LoyaltyTotals,
        { id: customerLoyaltyProgramIds[i].loyalty_totals },
        {
          overallPoints: overall_points,
          overallTransactions: overall_transactions
        }
      );
    }

    let storeIds: any = await queryRunner.manager.query(
      "SELECT id,loyalty_totals FROM store"
    );
    for (let i = 0; i < storeIds.length; i++) {
      let query = `select SUM(lt.points_issued),COUNT(*) from
                    loyalty_transaction as lt
                    inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
                    where
                    lt.store_id="${storeIds[i].id}"
                    and
                    lt.points_issued>0
                    and
                    lt.status_code=102;`;
      let overall: any = await queryRunner.manager.query(query);
      let overall_points = overall[0]["SUM(lt.points_issued)"]
        ? overall[0]["SUM(lt.points_issued)"]
        : 0;
      let overall_transactions = overall[0]["COUNT(*)"];

      let loyalty_totals = await queryRunner.manager.update(
        LoyaltyTotals,
        { id: storeIds[i].loyalty_totals },
        {
          overallPoints: overall_points,
          overallTransactions: overall_transactions
        }
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
