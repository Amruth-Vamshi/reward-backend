import { LoyaltyLedger } from "../../../entity";
import { LOYALTY_LEDGER_TYPE } from "../constants/constant";

import { CustomerLoyaltyRepository } from "../../customer-loyalty/customer-loyalty.repository";
import { getUpdatedLoyaltyTotals } from "./CustomerLoyaltyUtils";
import { LoyaltyTotals } from "@walkinserver/walkin-core/src/entity";
/*
 * @param {Float} Points
 * @param {LoyaltyTransaction} loyaltyTransaction
 * @param {CustomerLoyalty} customerLoyalty
 * @param {Date} expiryDate
 * return Loyalty Earn Ledger record
 */
export async function createEarnLedger(
  entityManager,
  injector,
  points,
  loyaltyTransaction,
  customerLoyalty,
  expiryDate,
  cancelTransactionRules
) {
  let overAllPoints,
    pointsRemaining = points;
  if (
    cancelTransactionRules.trackNegativePoints &&
    customerLoyalty.negativePoints &&
    customerLoyalty.negativePoints > 0
  ) {
    customerLoyalty.negativePoints = customerLoyalty.negativePoints - points;
    if (customerLoyalty.negativePoints < 0) {
      overAllPoints = -customerLoyalty.negativePoints;
      pointsRemaining = overAllPoints;
      customerLoyalty.negativePoints = 0;
    } else {
      overAllPoints = 0;
      pointsRemaining = 0;
    }
  } else {
    overAllPoints = customerLoyalty.points + points;
  }

  let earnLedger = entityManager.create(LoyaltyLedger, {
    loyaltyTransaction,
    type: LOYALTY_LEDGER_TYPE.ISSUE,
    points,
    balanceSnapshot: overAllPoints,
    expiryDate,
    pointsRemaining: pointsRemaining,
    remarks: !loyaltyTransaction.referredExternalCustomerId ?
      "Earned " +
      points +
      " points for ref#" +
      loyaltyTransaction.loyaltyReferenceId : points +
      " points earned by referring#" +
      loyaltyTransaction.referredExternalCustomerId
  });
  let savedLoyaltyLedger = await entityManager.save(earnLedger);
  customerLoyalty.points = overAllPoints;
  await injector.get(CustomerLoyaltyRepository).updateCustomerLoyaltyById(entityManager,customerLoyalty.id,customerLoyalty);
  return savedLoyaltyLedger;
}

/*
 * @param {Float} Points
 * @param {LoyaltyTransaction} loyaltyTransaction
 * @param {CustomerLoyalty} customerLoyalty
 * return Loyalty Burn Ledger record
 */
export async function createBurnLedger(
  entityManager,
  points,
  loyaltyTransaction,
  customerLoyalty,
  reduceDetails
) {
  let overAllPoints = customerLoyalty.points - points;
  let burnLedger = entityManager.create(LoyaltyLedger, {
    loyaltyTransaction,
    type: LOYALTY_LEDGER_TYPE.REDUCE,
    points,
    balanceSnapshot: overAllPoints,
    details: reduceDetails,
    pointsRemaining: 0,
    remarks:
      "Redeemed " +
      points +
      " points for ref#" +
      loyaltyTransaction.loyaltyReferenceId
  });
  let savedLoyaltyLedger = await entityManager.save(burnLedger);
  // Update Customer Loyalty with OverAll Points
  customerLoyalty.points = overAllPoints;
  let updatedCustomerLoyalty = await entityManager.save(customerLoyalty);
  return savedLoyaltyLedger;
}

/*
 * @param {blockPoints}
 * @param {LoyaltyTransaction}
 * @param {CustomerLoyalty}
 * return Loyalty block Ledger record
 */
export async function createBlockLedger(
  entityManager,
  blockPoints,
  loyaltyTransaction,
  customerLoyalty
) {
  let overAllBlockedPoints = customerLoyalty.pointsBlocked + blockPoints;
  let blockLedger = entityManager.create(LoyaltyLedger, {
    loyaltyTransaction,
    type: LOYALTY_LEDGER_TYPE.BLOCK,
    points: blockPoints,
    balanceSnapshot: customerLoyalty.points,
    pointsRemaining: 0,
    remarks:
      "Blocked points " +
      blockPoints +
      " points for ref#" +
      loyaltyTransaction.loyaltyReferenceId
  });
  let savedLoyaltyLedger = await entityManager.save(blockLedger);
  // Update Customer Loyalty with OverAll Points
  customerLoyalty.pointsBlocked = overAllBlockedPoints;
  let updatedCustomerLoyalty = await entityManager.save(customerLoyalty);
  return savedLoyaltyLedger;
}

/*
 * @param {blockPoints}
 * @param {LoyaltyTransaction}
 * @param {CustomerLoyalty}
 * return Loyalty block Ledger record
 */
export async function createUnBlockLedger(
  entityManager,
  unBlockPoints,
  loyaltyTransaction,
  customerLoyalty
) {
  let overAllBlockedPoints = customerLoyalty.pointsBlocked - unBlockPoints;
  let blockLedger = entityManager.create(LoyaltyLedger, {
    loyaltyTransaction,
    type: LOYALTY_LEDGER_TYPE.UNBLOCK,
    points: unBlockPoints,
    balanceSnapshot: customerLoyalty.points,
    pointsRemaining: 0,
    remarks:
      "UnBlocked points " +
      unBlockPoints +
      " points for ref#" +
      loyaltyTransaction.loyaltyReferenceId
  });
  let savedLoyaltyLedger = await entityManager.save(blockLedger);
  // Update Customer Loyalty with OverAll Points
  customerLoyalty.pointsBlocked = overAllBlockedPoints;
  let updatedCustomerLoyalty = await entityManager.save(customerLoyalty);
  return savedLoyaltyLedger;
}

/*
 * @param {Date} currentDate
 * @param {String} externalCustomerId
 * return Loyalty ledgers ransactions record of a customer
 */
export async function earnLedgerTransactions(
  entityManager,
  customerLoyaltyId,
  currentDate
) {
  let where_clause =
    "customerLoyaltyProgram.customer_loyalty_id = :customerLoyaltyId and loyaltyLedger.pointsRemaining > 0 and loyaltyLedger.expiryDate >=:expiryDate order by loyaltyLedger.expiryDate";
  let where_clause_params = {
    customerLoyaltyId,
    expiryDate: currentDate
  };
  const ledgerTransactions = await entityManager
    .getRepository(LoyaltyLedger)
    .createQueryBuilder("loyaltyLedger")
    .innerJoinAndSelect(
      "loyaltyLedger.loyaltyTransaction",
      "loyaltyTransaction"
    )
    .innerJoinAndSelect(
      "loyaltyTransaction.customerLoyaltyProgram",
      "customerLoyaltyProgram"
    )
    .where(where_clause, where_clause_params)
    .getMany();
  return ledgerTransactions;
}

/*
 * @param {String} loyaltyReferenceId
 * return Loyalty ledgers blocked transactions record of a transaction
 */
export async function getLedgerTransactionsByTypeAndRefernceId(
  entityManager,
  loyaltyReferenceId,
  ledgerType
) {
  let where_clause =
    "loyaltyTransaction.loyaltyReferenceId=:loyaltyReferenceId and loyaltyLedger.type=:ledgerType";
  let where_clause_params = {
    loyaltyReferenceId,
    ledgerType
  };
  const ledgerTransactions = await entityManager
    .getRepository(LoyaltyLedger)
    .createQueryBuilder("loyaltyLedger")
    .innerJoinAndSelect(
      "loyaltyLedger.loyaltyTransaction",
      "loyaltyTransaction"
    )
    .innerJoinAndSelect(
      "loyaltyTransaction.customerLoyaltyProgram",
      "customerLoyaltyProgram"
    )
    .innerJoinAndSelect("customerLoyalty.customer", "customer")
    .where(where_clause, where_clause_params)
    .getMany();
  return ledgerTransactions;
}
