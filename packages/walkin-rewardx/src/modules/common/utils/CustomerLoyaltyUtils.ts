import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../constants/errors";
import { CustomerLoyaltyProvider } from "../../customer-loyalty/customer-loyalty.provider";
import {
  LoyaltyTransaction,
  LoyaltyProgram,
  CustomerLoyalty
} from "../../../entity";
import moment = require("moment");
import {
  Audience,
  Customer,
  LoyaltyTotals,
  Organization
} from "@walkinserver/walkin-core/src/entity";
import {
  EntityManager,
  MoreThan,
  Equal,
  Index,
  LessThanOrEqual,
  MoreThanOrEqual,
  In
} from "typeorm";
import { RuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers";
import { LOYALTY_LEDGER_TYPE, LOYALTY_PROGRAM } from "../constants/constant";
import {
  validationDecorator,
  isValidPhone
} from "@walkinserver/walkin-core/src/modules/common/validations/Validations";
import {
  findCustomerByExternalCustomerId,
  findOrganizationById,
  isDateWithin
} from "./CommonUtils";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import {
  CACHING_KEYS,
  STATUS
} from "@walkinserver/walkin-core/src/modules/common/constants";
import { removeValueFromCache } from "../../../../../walkin-core/src/modules/common/utils/redisUtils";
/*
 * @param {JSON} customerLoyaltyData
 * return customer loyalty if all conditions suceeds else throw error
 */
export async function validateCustomerLoyaltyData(
  entityManager,
  injector,
  customerLoyaltyData
) {
  let externalCustomerId = customerLoyaltyData.externalCustomerId;
  let loyaltyCardCode = customerLoyaltyData.loyaltyCardCode;
  let loyaltyReferenceId = customerLoyaltyData.loyaltyReferenceId;
  let loyaltyCode = customerLoyaltyData.loyaltyCode;
  let transactionType = customerLoyaltyData.transactionType;
  let createCustomerIfNotExist = customerLoyaltyData.createCustomerIfNotExist;
  if (!loyaltyReferenceId) {
    throw new WCoreError(REWARDX_ERRORS.REFERENCE_ID_NOT_FOUND);
  }
  if (loyaltyCode == undefined || loyaltyCode == null) {
    //|| !(loyaltyCode == 'PAYMENT')
    throw new WCoreError(REWARDX_ERRORS.LOYALTY_TYPE_NOT_FOUND);
  }
  let customerLoyalty;
  // To create customer or customer loyalty if not exist
  if (createCustomerIfNotExist) {
    customerLoyalty = await createCustomerAndCustomerLoyalty(
      entityManager,
      customerLoyaltyData
    );
  } else {
    customerLoyalty = await validateCustomerLoyalty(
      entityManager,
      injector,
      externalCustomerId,
      loyaltyCardCode,
      customerLoyaltyData.organizaitonId
    );
  }
  return customerLoyalty;
}

export async function getLoyaltyTransactionByLoyaltyReferenceIdUpdated(
  entityManager: EntityManager,
  id: string,
  organizationId: string
) {
  // store, customerLoyaltyProgram, customerLoyalty, customer, and organization joins removed
  const loyaltyTransaction = await entityManager
    .getRepository(LoyaltyTransaction)
    .createQueryBuilder("transaction")
    .select("transaction.id")
    .addSelect("transaction.pointsRedeemed")
    .addSelect("transaction.pointsIssued")
    .leftJoinAndSelect("transaction.statusCode", "statusCode")
    .addSelect("transaction.statusCode")
    .where("transaction.loyaltyReferenceId = :id", { id })
    .andWhere("transaction.organization.id = :orgId", { orgId: organizationId })
    .getOne();
  return loyaltyTransaction;
}

export async function getLoyaltyTransactionByLoyaltyReferenceIdForCancelTransaction(
  entityManager: EntityManager,
  id: string,
  organizationId: string
) {
  const loyaltyTransaction = await entityManager
    .getRepository(LoyaltyTransaction)
    .createQueryBuilder("transaction")
    .leftJoinAndSelect("transaction.statusCode", "statusCode")
    .leftJoin("transaction.store", "store")
    .addSelect("store.id")
    .addSelect("store.code")
    .leftJoin("transaction.customerLoyaltyProgram", "customerLoyaltyProgram")
    .addSelect("customerLoyaltyProgram.id")
    .leftJoinAndSelect(
      "customerLoyaltyProgram.customerLoyalty",
      "customerLoyalty"
    )
    .leftJoin("customerLoyalty.customer", "customer")
    .addSelect("customer.id")
    .addSelect("customer.externalCustomerId")
    .where("transaction.loyaltyReferenceId = :id", { id })
    .andWhere("transaction.organization.id = :orgId", { orgId: organizationId })
    .getOne();
  return loyaltyTransaction;
}

export async function getLoyaltyTransactionByLoyaltyReferenceId(
  entityManager: EntityManager,
  id: string,
  organizationId: string
) {
  const loyaltyTransaction = await entityManager
    .getRepository(LoyaltyTransaction)
    .createQueryBuilder("transaction")
    .leftJoinAndSelect("transaction.statusCode", "statusCode")
    .leftJoinAndSelect("transaction.store", "store")
    .leftJoinAndSelect(
      "transaction.customerLoyaltyProgram",
      "customerLoyaltyProgram"
    )
    .leftJoinAndSelect(
      "customerLoyaltyProgram.customerLoyalty",
      "customerLoyalty"
    )
    .leftJoinAndSelect("customerLoyalty.customer", "customer")
    .leftJoinAndSelect("customer.organization", "organization")
    .where("transaction.loyaltyReferenceId = :id", { id })
    .andWhere("organization.id = :orgId", { orgId: organizationId })
    .getOne();
  return loyaltyTransaction;
}

/*
 * @param {String} externalCustomerId
 * @param {String} loyaltyTransaction
 * return true if all conditions suceeds else throw error
 */
export async function validateCustomerLoyalty(
  entityManager,
  injector,
  externalCustomerId,
  loyaltyCardCode,
  organizaitonId
) {
  let customerLoyalty = await customerLoyaltyByLoyaltyCardCodeAndCustomerId(
    entityManager,
    externalCustomerId,
    loyaltyCardCode,
    organizaitonId
  );
  if (!customerLoyalty) {
    throw new WCoreError(REWARDX_ERRORS.CUSTOMER_LOYALTY_NOT_FOUND);
  }
  return customerLoyalty;
}

export async function checkIfCustomerBelongsToCampaign(
  entityManager: EntityManager,
  injector,
  loyaltyCode,
  loyaltyCardCode,
  customer: Customer,
  processType
) {
  try {
    let ruleType;
    if (processType === LOYALTY_LEDGER_TYPE.ISSUE) {
      ruleType = "loyaltyEarnRule";
    } else if (
      processType == LOYALTY_LEDGER_TYPE.REDUCE ||
      processType === LOYALTY_LEDGER_TYPE.BLOCK
    ) {
      ruleType = "loyaltyBurnRule";
    } else if (processType == "EXPIRY") {
      ruleType = "loyaltyExpiryRule";
    }
    const loyaltyProgram = await entityManager
      .getRepository(LoyaltyProgram)
      .createQueryBuilder("loyaltyProgram")
      .innerJoinAndSelect("loyaltyProgram.campaign", "campaign")
      .innerJoinAndSelect("loyaltyProgram.loyaltyCard", "loyaltyCard")
      .innerJoinAndSelect("loyaltyProgram." + ruleType, ruleType)
      .where(
        `loyaltyProgram.${ruleType}.id=${ruleType}.id and loyaltyCard.code = '${loyaltyCardCode}' and loyaltyProgram.code='${loyaltyCode}' and campaign.status='ACTIVE' and campaign.startTime<='${moment
          .utc()
          .format(
            "YYYY-MM-DD hh:mm:ss"
          )}' and campaign.endTime>='${moment
          .utc()
          .format("YYYY-MM-DD hh:mm:ss")}'`
      )
      .orderBy("campaign.priority", "ASC")
      .getMany();
    if (loyaltyProgram.length === 0) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_PROGRAM_NOT_FOUND);
    } else {
      return { loyaltyProgram: loyaltyProgram[0], ruleValidated: true };
      let campaignIds = [];
      for (let i in Object.keys(loyaltyProgram)) {
        // console.log("loyalty program is:-", loyaltyProgram[i].campaign.id);
        campaignIds.push(loyaltyProgram[i].campaign.id);
      }
      // console.log("campaign ids are:-", campaignIds);
      let audiences = await entityManager.find(Audience, {
        where: {
          campaign: {
            id: In(campaignIds)
          }
        },
        relations: ["segment", "segment.rule", "campaign"]
      });
      if (audiences.length === 0) {
        throw new WCoreError(REWARDX_ERRORS.AUDIENCE_NOT_FOUND);
      } else {
        for (let j in Object.keys(audiences)) {
          let ruleEvaluationResult = await injector
            .get(RuleProvider)
            .evaluateRule(entityManager, {
              data: { Customer: customer },
              organizationId: customer.organization.id,
              ruleId: audiences[j].segment.rule.id,
              ruleName: audiences[j].segment.rule.name
            });
          // console.log("evaluation result", ruleEvaluationResult);
          if (ruleEvaluationResult.evaluationResult) {
            // console.log("audiance is:-", audiences[j])
            let matchingLoyaltyPrograms = await loyaltyProgram.filter(
              eachLoyaltyProgram => {
                return (
                  eachLoyaltyProgram.campaign.id === audiences[j].campaign.id
                );
              }
            );
            // console.log("campaign ids are:-", matchingLoyaltyPrograms);
            return {
              loyaltyProgram: matchingLoyaltyPrograms[0],
              ruleValidated: true
            };
          } else {
            continue;
          }
        }
        return { loyaltyProgram: null, ruleValidated: false };
      }
    }
  } catch (err) {
    throw err;
  }
}

/*
 * @param {loyaltyReferenceId}
 * @param {loyaltyCode}
 * return Loyalty Transaction record of customer
 */

export async function findLoyaltyTransactionByLoyalytReferenceIdAndLoyaltyCode(
  entityManager,
  loyaltyReferenceId,
  loyaltyCode
) {
  return entityManager.findOne(LoyaltyTransaction, {
    where: {
      loyaltyReferenceId: loyaltyReferenceId,
      code: loyaltyCode
    },
    relations: [
      "statusCode",
      "customerLoyaltyProgram",
      "customerLoyaltyProgram.customerLoyalty"
    ]
  });
}

/**
 * retrive the  customer loyalty.
 * @param {mobileNumber}
 * @param {loyaltyCardCode}
 * @returns {{
 *	id: number,
 *	customer: Customer,
 *	loyaltyCard: LoyaltyCard,
 * }}
 */
export async function customerLoyaltyByLoyaltyCardCodeAndCustomerId(
  entityManager,
  externalCustomerId,
  loyaltyCardCode,
  organizationId
): Promise<CustomerLoyalty> {
  let where_clause = `(customer.externalCustomerId = :externalCustomerId and loyaltyCard.code = :loyaltyCardCode and organization.id = :organizationId) or (customer.externalCustomerId = :externalCustomerId and loyaltyCard.code = :loyaltyCardCode and organization.id = :organizationId and customerLoyalty.loyalty_totals is Null)`;
  let where_clause_params = {
    externalCustomerId,
    loyaltyCardCode,
    organizationId
  };
  const customerLoyalty = await entityManager
    .getRepository(CustomerLoyalty)
    .createQueryBuilder("customerLoyalty")
    .innerJoinAndSelect("customerLoyalty.customer", "customer")
    .innerJoinAndSelect("customer.organization", "organization")
    .innerJoinAndSelect("customerLoyalty.loyaltyCard", "loyaltyCard")
    .leftJoinAndSelect("customerLoyalty.loyaltyTotals", "loyaltyTotals")
    .where(where_clause, where_clause_params)
    .getOne();
  return customerLoyalty;
}

export async function createCustomerAndCustomerLoyalty(
  entityManager,
  customerLoyalty
) {
  let validationPromises = [];
  let organization;
  let organizationId = customerLoyalty.organizationId;
  if (!organizationId) {
    throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_ORGANIZATION);
  } else {
    organization = await findOrganizationById(entityManager, organizationId);
    validationPromises.push(
      Organization.availableById(entityManager, organizationId)
    );
  }
  let createCustomerLoyaltyAction = async () => {
    let newCustomerLoyalty = await entityManager.create(
      CustomerLoyalty,
      customerLoyalty
    );
    let foundCustomer;
    // create or find customer
    if (customerLoyalty.externalCustomerId) {
      foundCustomer = await findCustomerByExternalCustomerId(
        entityManager,
        customerLoyalty.externalCustomerId,
        organizationId
      );
      if (foundCustomer) {
        let existedcustomerLoyalty = await customerLoyaltyByLoyaltyCardCodeAndCustomerId(
          entityManager,
          customerLoyalty.externalCustomerId,
          customerLoyalty.loyaltyCardCode,
          organizationId
        );
        if (existedcustomerLoyalty) {
          return existedcustomerLoyalty;
        }
      } else {
        // if (!customerLoyalty.phoneNumber) {
        //   throw new WCoreError(WCORE_ERRORS.PHONE_NUMBER_REQUIRED);
        // }
        // if (!isValidPhone(customerLoyalty.phoneNumber)) {
        //   throw new WCoreError(REWARDX_ERRORS.INVALID_MOBILE_NUMBER);
        // }
        // if (!customerLoyalty.customerIdentifier) {
        //   throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMER_IDENTIFIER);
        // }
        await entityManager.connection.queryResultCache.remove([
          "customer_" + customerLoyalty.externalCustomerId
        ]);
        let newCustomer = await entityManager.create(Customer, {
          phoneNumber: customerLoyalty.phoneNumber,
          externalCustomerId: customerLoyalty.externalCustomerId,
          organization: organization,
          customerIdentifier: customerLoyalty.customerIdentifier
        });
        foundCustomer = await entityManager.save(newCustomer);
      }
    }
    newCustomerLoyalty.customer = foundCustomer;
    newCustomerLoyalty.organization = organization;
    newCustomerLoyalty.loyaltyCard = customerLoyalty.loyaltyCard;
    let loyaltyTotals = await entityManager.create(
      LoyaltyTotals,
      customerLoyalty.loyaltyTotals
    );
    newCustomerLoyalty.loyaltyTotals = await entityManager.save(loyaltyTotals);
    let result;
    try {
      result = await entityManager.save(newCustomerLoyalty);
      result.organization = organization;
    } catch (error) {
      if (error) {
        if (error.code == "ER_DUP_ENTRY") {
          throw new WCoreError(REWARDX_ERRORS.CUSTOMER_LOYALTY_EXISTS);
        }
      }
    }
    return result;
  };
  return validationDecorator(createCustomerLoyaltyAction, validationPromises);
}

export async function getCustomerLoyaltyTotals(
  queryRunner,
  customerLoyaltyId,
  orderDate,
  customerLoyaltyTotals,
  timeFrame
) {
  let query;
  switch (timeFrame) {
    case "day":
      query = `select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
      where
      clp.customer_loyalty_id=${customerLoyaltyId}
      and
      ltd.date>="${orderDate} 00:00:00"
      and
      ltd.date<="${orderDate} 23:59:59"
      and
      lt.points_issued>0
      and
      lt.status_code=102;`;
      let daily = await queryRunner.manager.query(query);
      customerLoyaltyTotals.daily_points = daily[0]["SUM(lt.points_issued)"]
        ? daily[0]["SUM(lt.points_issued)"]
        : 0;
      customerLoyaltyTotals.daily_transactions = daily[0]["COUNT(*)"];
      break;
    case "week":
      query = `select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
      where
      clp.customer_loyalty_id=${customerLoyaltyId}
      and
      ltd.date>="${moment(orderDate)
        .startOf("week")
        .format("YYYY-MM-DD")} 00:00:00"
      and
      ltd.date<="${moment(orderDate)
        .endOf("week")
        .format("YYYY-MM-DD")} 23:59:59"
        and
      lt.points_issued>0
      and
      lt.status_code=102;`;
      let weekly = await queryRunner.manager.query(query);
      customerLoyaltyTotals.weekly_points = weekly[0]["SUM(lt.points_issued)"]
        ? weekly[0]["SUM(lt.points_issued)"]
        : 0;
      customerLoyaltyTotals.weekly_transactions = weekly[0]["COUNT(*)"];
      break;
    case "month":
      query = `select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
      where
      clp.customer_loyalty_id=${customerLoyaltyId}
      and
      ltd.date>="${moment(orderDate)
        .startOf("month")
        .format("YYYY-MM-DD")} 00:00:00"
      and
      ltd.date<="${moment(orderDate)
        .endOf("month")
        .format("YYYY-MM-DD")} 23:59:59"
        and
      lt.points_issued>0
      and
      lt.status_code=102;`;
      let monthly = await queryRunner.manager.query(query);
      customerLoyaltyTotals.monthly_points = monthly[0]["SUM(lt.points_issued)"]
        ? monthly[0]["SUM(lt.points_issued)"]
        : 0;
      customerLoyaltyTotals.monthly_transactions = monthly[0]["COUNT(*)"];
      break;
    case "year":
      query = `select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
      where
      clp.customer_loyalty_id=${customerLoyaltyId}
      and
      ltd.date>="${moment(orderDate)
        .startOf("year")
        .format("YYYY-MM-DD")} 00:00:00"
      and
      ltd.date<="${moment(orderDate)
        .endOf("year")
        .format("YYYY-MM-DD")} 23:59:59"
        and
      lt.points_issued>0
      and
      lt.status_code=102;`;
      let yearly = await queryRunner.manager.query(query);
      customerLoyaltyTotals.yearly_points = yearly[0]["SUM(lt.points_issued)"]
        ? yearly[0]["SUM(lt.points_issued)"]
        : 0;
      customerLoyaltyTotals.yearly_transactions = yearly[0]["COUNT(*)"];
      break;
    default:
      customerLoyaltyTotals.daily_points = 0;
      customerLoyaltyTotals.weekly_points = 0;
      customerLoyaltyTotals.monthly_points = 0;
      customerLoyaltyTotals.yearly_points = 0;
      customerLoyaltyTotals.overall_points = 0;
      (customerLoyaltyTotals.daily_transactions = 0),
        (customerLoyaltyTotals.weekly_transactions = 0),
        (customerLoyaltyTotals.monthly_transactions = 0),
        (customerLoyaltyTotals.yearly_transactions = 0),
        (customerLoyaltyTotals.overall_transactions = 0);
  }
}

export async function getCustomerLoyaltyProgramTotals(
  queryRunner,
  customerLoyaltyProgramId,
  orderDate,
  customerLoyaltyProgramTotals,
  timeFrame
) {
  let query;
  switch (timeFrame) {
    case "day":
      query = `select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
      where
      clp.id='${customerLoyaltyProgramId}'
      and
      ltd.date>="${orderDate} 00:00:00"
      and
      ltd.date<="${orderDate} 23:59:59"
      and
      lt.points_issued>0
      and
      lt.status_code=102;`;
      let daily = await queryRunner.manager.query(query);
      customerLoyaltyProgramTotals.daily_points = daily[0][
        "SUM(lt.points_issued)"
      ]
        ? daily[0]["SUM(lt.points_issued)"]
        : 0;
      customerLoyaltyProgramTotals.daily_transactions = daily[0]["COUNT(*)"];
      break;
    case "week":
      query = `select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
      where
      clp.id='${customerLoyaltyProgramId}'
      and
      ltd.date>="${moment(orderDate)
        .startOf("week")
        .format("YYYY-MM-DD")} 00:00:00"
      and
      ltd.date<="${moment(orderDate)
        .endOf("week")
        .format("YYYY-MM-DD")} 23:59:59"
        and
      lt.points_issued>0
      and
      lt.status_code=102;`;
      let weekly = await queryRunner.manager.query(query);
      customerLoyaltyProgramTotals.weekly_points = weekly[0][
        "SUM(lt.points_issued)"
      ]
        ? weekly[0]["SUM(lt.points_issued)"]
        : 0;
      customerLoyaltyProgramTotals.weekly_transactions = weekly[0]["COUNT(*)"];
      break;
    case "month":
      query = `select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
      where
      clp.id='${customerLoyaltyProgramId}'
      and
      ltd.date>="${moment(orderDate)
        .startOf("month")
        .format("YYYY-MM-DD")} 00:00:00"
      and
      ltd.date<="${moment(orderDate)
        .endOf("month")
        .format("YYYY-MM-DD")} 23:59:59"
        and
      lt.points_issued>0
      and
      lt.status_code=102;`;
      let monthly = await queryRunner.manager.query(query);
      customerLoyaltyProgramTotals.monthly_points = monthly[0][
        "SUM(lt.points_issued)"
      ]
        ? monthly[0]["SUM(lt.points_issued)"]
        : 0;
      customerLoyaltyProgramTotals.monthly_transactions =
        monthly[0]["COUNT(*)"];
      break;
    case "year":
      query = `select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      inner join customer_loyalty_program as clp on lt.customer_loyalty_program_id=clp.id
      where
      clp.id='${customerLoyaltyProgramId}'
      and
      ltd.date>="${moment(orderDate)
        .startOf("year")
        .format("YYYY-MM-DD")} 00:00:00"
      and
      ltd.date<="${moment(orderDate)
        .endOf("year")
        .format("YYYY-MM-DD")} 23:59:59"
        and
      lt.points_issued>0
      and
      lt.status_code=102;`;
      let yearly = await queryRunner.manager.query(query);
      customerLoyaltyProgramTotals.yearly_points = yearly[0][
        "SUM(lt.points_issued)"
      ]
        ? yearly[0]["SUM(lt.points_issued)"]
        : 0;
      customerLoyaltyProgramTotals.yearly_transactions = yearly[0]["COUNT(*)"];
      break;
    default:
      customerLoyaltyProgramTotals.daily_points = 0;
      customerLoyaltyProgramTotals.weekly_points = 0;
      customerLoyaltyProgramTotals.monthly_points = 0;
      customerLoyaltyProgramTotals.yearly_points = 0;
      customerLoyaltyProgramTotals.overall_points = 0;
      (customerLoyaltyProgramTotals.daily_transactions = 0),
        (customerLoyaltyProgramTotals.weekly_transactions = 0),
        (customerLoyaltyProgramTotals.monthly_transactions = 0),
        (customerLoyaltyProgramTotals.yearly_transactions = 0),
        (customerLoyaltyProgramTotals.overall_transactions = 0);
  }
}

export async function getStoreTotals(
  queryRunner,
  store_id,
  orderDate,
  storeTotals,
  timeFrame
) {
  switch (timeFrame) {
    case "day":
      let daily = await queryRunner.manager
        .query(`select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      where
      lt.store_id="${store_id}"
      and
      ltd.date>="${orderDate} 00:00:00"
      and
      ltd.date<="${orderDate} 23:59:59"
      and
      lt.points_issued>0
      and
      lt.status_code=102;
      `);
      storeTotals.daily_points = daily[0]["SUM(lt.points_issued)"]
        ? daily[0]["SUM(lt.points_issued)"]
        : 0;
      storeTotals.daily_transactions = daily[0]["COUNT(*)"];
      break;
    case "week":
      let weekly = await queryRunner.manager
        .query(`select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      where
      lt.store_id="${store_id}"
      and
      ltd.date>="${moment(orderDate)
        .startOf("week")
        .format("YYYY-MM-DD")} 00:00:00"
      and
      ltd.date<="${moment(orderDate)
        .endOf("week")
        .format("YYYY-MM-DD")} 23:59:59"
      and
      lt.points_issued>0
      and
      lt.status_code=102;
      `);
      storeTotals.weekly_points = weekly[0]["SUM(lt.points_issued)"]
        ? weekly[0]["SUM(lt.points_issued)"]
        : 0;
      storeTotals.weekly_transactions = weekly[0]["COUNT(*)"];
      break;
    case "month":
      let monthly = await queryRunner.manager
        .query(`select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      where
      lt.store_id="${store_id}"
      and
      ltd.date>="${moment(orderDate)
        .startOf("month")
        .format("YYYY-MM-DD")} 00:00:00"
      and
      ltd.date<="${moment(orderDate)
        .endOf("month")
        .format("YYYY-MM-DD")} 23:59:59"
      and
      lt.points_issued>0
      and
      lt.status_code=102;
      `);
      storeTotals.monthly_points = monthly[0]["SUM(lt.points_issued)"]
        ? monthly[0]["SUM(lt.points_issued)"]
        : 0;
      storeTotals.monthly_transactions = monthly[0]["COUNT(*)"];
      break;
    case "year":
      let yearly = await queryRunner.manager
        .query(`select SUM(lt.points_issued),COUNT(*) from
      loyalty_transaction as lt
      inner join loyalty_transaction_data as ltd on lt.id=ltd.loyalty_transaction_id
      where
      lt.store_id="${store_id}"
      and
      ltd.date>="${moment(orderDate)
        .startOf("year")
        .format("YYYY-MM-DD")} 00:00:00"
      and
      ltd.date<="${moment(orderDate)
        .endOf("year")
        .format("YYYY-MM-DD")} 23:59:59"
      and
      lt.points_issued>0
      and
      lt.status_code=102;
      `);
      storeTotals.yearly_points = yearly[0]["SUM(lt.points_issued)"]
        ? yearly[0]["SUM(lt.points_issued)"]
        : 0;
      storeTotals.yearly_transactions = yearly[0]["COUNT(*)"];
      break;
    default:
      storeTotals.daily_points = 0;
      storeTotals.weekly_points = 0;
      storeTotals.monthly_points = 0;
      storeTotals.yearly_points = 0;
      storeTotals.overall_points = 0;
      (storeTotals.daily_transactions = 0),
        (storeTotals.weekly_transactions = 0),
        (storeTotals.monthly_transactions = 0),
        (storeTotals.yearly_transactions = 0),
        (storeTotals.overall_transactions = 0);
  }
}

export async function customerLoyaltyTotalsForOrderDate(
  queryRunner,
  customerLoyaltyId,
  orderDate
) {
  let customerLoyalty_isOrderWithin = {
    day: true,
    week: true,
    month: true,
    year: true
  };
  let customerLoyaltyTotals = await queryRunner.manager.query(
    `select * from loyalty_totals where id = (select loyalty_totals from customer_loyalty where id='${customerLoyaltyId}')`
  );
  let current_customerLoyaltyTotals = {};
  if (customerLoyaltyTotals && customerLoyaltyTotals.length) {
    customerLoyaltyTotals = Object(customerLoyaltyTotals[0]);
    current_customerLoyaltyTotals = JSON.parse(
      JSON.stringify(customerLoyaltyTotals)
    );
    customerLoyaltyTotals.last_transaction_date = customerLoyaltyTotals.last_transaction_date
      ? moment(customerLoyaltyTotals.last_transaction_date).format("YYYY-MM-DD")
      : moment(orderDate).format("YYYY-MM-DD");
    let getTotalsForDate = moment(orderDate).isAfter(
      moment(
        moment(customerLoyaltyTotals.last_transaction_date).format("YYYY-MM-DD")
      )
    )
      ? orderDate
      : moment(customerLoyaltyTotals.last_transaction_date).format(
          "YYYY-MM-DD"
        );

    if (
      !isDateWithin(
        customerLoyaltyTotals.last_transaction_date,
        "day",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      customerLoyalty_isOrderWithin.day = false;
      await getCustomerLoyaltyTotals(
        queryRunner,
        customerLoyaltyId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        customerLoyaltyTotals,
        "day"
      );
    }
    if (
      !isDateWithin(
        customerLoyaltyTotals.last_transaction_date,
        "week",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      customerLoyalty_isOrderWithin.week = false;
      await getCustomerLoyaltyTotals(
        queryRunner,
        customerLoyaltyId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        customerLoyaltyTotals,
        "week"
      );
    }
    if (
      !isDateWithin(
        customerLoyaltyTotals.last_transaction_date,
        "month",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      customerLoyalty_isOrderWithin.month = false;
      await getCustomerLoyaltyTotals(
        queryRunner,
        customerLoyaltyId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        customerLoyaltyTotals,
        "month"
      );
    }
    if (
      !isDateWithin(
        customerLoyaltyTotals.last_transaction_date,
        "year",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      customerLoyalty_isOrderWithin.year = false;
      await getCustomerLoyaltyTotals(
        queryRunner,
        customerLoyaltyId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        customerLoyaltyTotals,
        "year"
      );
    }
  } else {
    customerLoyaltyTotals = {
      id: null,
      daily_points: 0,
      weekly_points: 0,
      monthly_points: 0,
      yearly_points: 0,
      overall_points: 0,
      daily_transactions: 0,
      weekly_transactions: 0,
      monthly_transactions: 0,
      yearly_transactions: 0,
      overall_transactions: 0,
      last_transaction_date: null
    };
    current_customerLoyaltyTotals = JSON.parse(
      JSON.stringify(customerLoyaltyTotals)
    );
  }
  return {
    customerLoyaltyTotals,
    current_customerLoyaltyTotals,
    customerLoyalty_isOrderWithin
  };
}

export async function customerLoyaltyProgramTotalsForOrderDate(
  queryRunner,
  customerLoyaltyProgramId,
  orderDate
) {
  let customerLoyaltyProgram_isOrderWithin = {
    day: true,
    week: true,
    month: true,
    year: true
  };
  let customerLoyaltyProgramTotals = await queryRunner.manager.query(
    `select * from loyalty_totals where id = (select loyalty_totals from customer_loyalty_program where id='${customerLoyaltyProgramId}')`
  );
  let current_customerLoyaltyProgramTotals = {};
  if (customerLoyaltyProgramTotals && customerLoyaltyProgramTotals.length) {
    customerLoyaltyProgramTotals = Object(customerLoyaltyProgramTotals[0]);
    current_customerLoyaltyProgramTotals = JSON.parse(
      JSON.stringify(customerLoyaltyProgramTotals)
    );
    customerLoyaltyProgramTotals.last_transaction_date = customerLoyaltyProgramTotals.last_transaction_date
      ? moment(customerLoyaltyProgramTotals.last_transaction_date).format(
          "YYYY-MM-DD"
        )
      : moment(orderDate).format("YYYY-MM-DD");
    let getTotalsForDate = moment(orderDate).isAfter(
      moment(
        moment(customerLoyaltyProgramTotals.last_transaction_date).format(
          "YYYY-MM-DD"
        )
      )
    )
      ? orderDate
      : moment(customerLoyaltyProgramTotals.last_transaction_date).format(
          "YYYY-MM-DD"
        );
    if (
      !isDateWithin(
        customerLoyaltyProgramTotals.last_transaction_date,
        "day",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      customerLoyaltyProgram_isOrderWithin.day = false;
      await getCustomerLoyaltyProgramTotals(
        queryRunner,
        customerLoyaltyProgramId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        customerLoyaltyProgramTotals,
        "day"
      );
    }
    if (
      !isDateWithin(
        customerLoyaltyProgramTotals.last_transaction_date,
        "week",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      customerLoyaltyProgram_isOrderWithin.week = false;
      await getCustomerLoyaltyProgramTotals(
        queryRunner,
        customerLoyaltyProgramId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        customerLoyaltyProgramTotals,
        "week"
      );
    }
    if (
      !isDateWithin(
        customerLoyaltyProgramTotals.last_transaction_date,
        "month",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      customerLoyaltyProgram_isOrderWithin.month = false;
      await getCustomerLoyaltyProgramTotals(
        queryRunner,
        customerLoyaltyProgramId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        customerLoyaltyProgramTotals,
        "month"
      );
    }
    if (
      !isDateWithin(
        customerLoyaltyProgramTotals.last_transaction_date,
        "year",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      customerLoyaltyProgram_isOrderWithin.year = false;
      await getCustomerLoyaltyProgramTotals(
        queryRunner,
        customerLoyaltyProgramId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        customerLoyaltyProgramTotals,
        "year"
      );
    }
  } else {
    customerLoyaltyProgramTotals = {
      id: null,
      daily_points: 0,
      weekly_points: 0,
      monthly_points: 0,
      yearly_points: 0,
      overall_points: 0,
      daily_transactions: 0,
      weekly_transactions: 0,
      monthly_transactions: 0,
      yearly_transactions: 0,
      overall_transactions: 0,
      last_transaction_date: null
    };
    current_customerLoyaltyProgramTotals = JSON.parse(
      JSON.stringify(customerLoyaltyProgramTotals)
    );
  }
  return {
    customerLoyaltyProgramTotals,
    current_customerLoyaltyProgramTotals,
    customerLoyaltyProgram_isOrderWithin
  };
}

export async function storeLoyaltyTotalsForOrderDate(
  queryRunner,
  organizationId,
  storeCode,
  storeId,
  orderDate
) {
  let store_isOrderWithin = {
    day: true,
    week: true,
    month: true,
    year: true
  };
  let storeTotals = await queryRunner.manager.query(
    `select * from loyalty_totals where id = (select loyalty_totals from store where organization_id ='${organizationId}' and code='${storeCode}' and status='${STATUS.ACTIVE}')`
  );
  let current_storeTotals = {};
  if (storeTotals && storeTotals.length) {
    storeTotals = Object(storeTotals[0]);
    current_storeTotals = JSON.parse(JSON.stringify(storeTotals));
    storeTotals.last_transaction_date = storeTotals.last_transaction_date
      ? moment(storeTotals.last_transaction_date).format("YYYY-MM-DD")
      : moment(orderDate).format("YYYY-MM-DD");
    let getTotalsForDate = moment(orderDate).isAfter(
      moment(moment(storeTotals.last_transaction_date).format("YYYY-MM-DD"))
    )
      ? orderDate
      : moment(storeTotals.last_transaction_date).format("YYYY-MM-DD");
    if (
      !isDateWithin(
        storeTotals.last_transaction_date,
        "day",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      store_isOrderWithin.day = false;
      await getStoreTotals(
        queryRunner,
        storeId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        storeTotals,
        "day"
      );
    }
    if (
      !isDateWithin(
        storeTotals.last_transaction_date,
        "week",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      store_isOrderWithin.week = false;
      await getStoreTotals(
        queryRunner,
        storeId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        storeTotals,
        "week"
      );
    }
    if (
      !isDateWithin(
        storeTotals.last_transaction_date,
        "month",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      store_isOrderWithin.month = false;
      await getStoreTotals(
        queryRunner,
        storeId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        storeTotals,
        "month"
      );
    }
    if (
      !isDateWithin(
        storeTotals.last_transaction_date,
        "year",
        moment(orderDate).format("YYYY-MM-DD")
      )
    ) {
      store_isOrderWithin.year = false;
      await getStoreTotals(
        queryRunner,
        storeId,
        moment(getTotalsForDate).format("YYYY-MM-DD"),
        storeTotals,
        "year"
      );
    }
  } else {
    storeTotals = {
      id: null,
      daily_points: 0,
      weekly_points: 0,
      monthly_points: 0,
      yearly_points: 0,
      overall_points: 0,
      daily_transactions: 0,
      weekly_transactions: 0,
      monthly_transactions: 0,
      yearly_transactions: 0,
      overall_transactions: 0,
      last_transaction_date: null
    };
    current_storeTotals = JSON.parse(JSON.stringify(storeTotals));
  }
  return { storeTotals, current_storeTotals, store_isOrderWithin };
}

export async function getUpdatedLoyaltyTotals(
  orderDate: string,
  loyaltyTotals: any,
  current_loyaltyTotals: any,
  isOrderWithin: any,
  pointsIssued: Number
): Promise<Object> {
  orderDate = moment(orderDate).format("YYYY-MM-DD");
  const isTheFirstTransaction = moment(orderDate).isAfter(
    moment(moment(loyaltyTotals.last_transaction_date).format("YYYY-MM-DD"))
  );

  if (!loyaltyTotals.id) {
    return {
      id: null,
      created_by: "defaultuser",
      last_modified_by: "defaultuser",
      dailyPoints: pointsIssued,
      weeklyPoints: pointsIssued,
      monthlyPoints: pointsIssued,
      yearlyPoints: pointsIssued,
      overallPoints: pointsIssued,
      dailyTransactions: pointsIssued > 0 ? 1 : 0,
      weeklyTransactions: pointsIssued > 0 ? 1 : 0,
      monthlyTransactions: pointsIssued > 0 ? 1 : 0,
      yearlyTransactions: pointsIssued > 0 ? 1 : 0,
      overallTransactions: pointsIssued > 0 ? 1 : 0,
      lastTransactionDate: orderDate
    };
  } else {
    return {
      id: current_loyaltyTotals.id,
      created_by: "defaultuser",
      last_modified_by: "defaultuser",
      dailyPoints: isOrderWithin.day
        ? loyaltyTotals.daily_points + pointsIssued
        : isTheFirstTransaction
        ? pointsIssued
        : loyaltyTotals.daily_points,
      weeklyPoints: isOrderWithin.week
        ? loyaltyTotals.weekly_points + pointsIssued
        : isTheFirstTransaction
        ? pointsIssued
        : loyaltyTotals.weekly_points,
      monthlyPoints: isOrderWithin.month
        ? loyaltyTotals.monthly_points + pointsIssued
        : isTheFirstTransaction
        ? pointsIssued
        : loyaltyTotals.monthly_points,
      yearlyPoints: isOrderWithin.year
        ? loyaltyTotals.yearly_points + pointsIssued
        : isTheFirstTransaction
        ? pointsIssued
        : loyaltyTotals.yearly_points,
      overallPoints: loyaltyTotals.overall_points + pointsIssued,
      dailyTransactions: isOrderWithin.day
        ? parseInt(loyaltyTotals.daily_transactions) +
          (pointsIssued > 0 ? 1 : 0)
        : isTheFirstTransaction
        ? 1
        : loyaltyTotals.daily_transactions,
      weeklyTransactions: isOrderWithin.week
        ? parseInt(loyaltyTotals.weekly_transactions) +
          (pointsIssued > 0 ? 1 : 0)
        : isTheFirstTransaction
        ? 1
        : loyaltyTotals.weekly_transactions,
      monthlyTransactions: isOrderWithin.month
        ? parseInt(loyaltyTotals.monthly_transactions) +
          (pointsIssued > 0 ? 1 : 0)
        : isTheFirstTransaction
        ? 1
        : loyaltyTotals.monthly_transactions,
      yearlyTransactions: isOrderWithin.year
        ? parseInt(loyaltyTotals.yearly_transactions) +
          (pointsIssued > 0 ? 1 : 0)
        : isTheFirstTransaction
        ? 1
        : loyaltyTotals.yearly_transactions,
      overallTransactions:
        parseInt(loyaltyTotals.overall_transactions) +
        (pointsIssued > 0 ? 1 : 0),
      lastTransactionDate: loyaltyTotals.last_transaction_date
        ? isTheFirstTransaction
          ? orderDate
          : moment(loyaltyTotals.last_transaction_date).format("YYYY-MM-DD")
        : orderDate
    };
  }
}

export async function getUpdatedLoyaltyTotalsForCancelledLoyaltyTransaction(
  isTransactionWithin: any,
  loyaltyTotals: any,
  pointsIssued: any
): Promise<Object> {
  return {
    id: loyaltyTotals.id,
    created_by: "defaultuser",
    last_modified_by: "defaultuser",
    dailyPoints:
      isTransactionWithin.day &&
      pointsIssued > 0 &&
      loyaltyTotals.daily_points >= pointsIssued
        ? loyaltyTotals.daily_points - pointsIssued
        : loyaltyTotals.daily_points,
    weeklyPoints:
      isTransactionWithin.week &&
      pointsIssued > 0 &&
      loyaltyTotals.weekly_points >= pointsIssued
        ? loyaltyTotals.weekly_points - pointsIssued
        : loyaltyTotals.weekly_points,
    monthlyPoints:
      isTransactionWithin.month &&
      pointsIssued > 0 &&
      loyaltyTotals.monthly_points >= pointsIssued
        ? loyaltyTotals.monthly_points - pointsIssued
        : loyaltyTotals.monthly_points,
    yearlyPoints:
      isTransactionWithin.year &&
      pointsIssued > 0 &&
      loyaltyTotals.yearly_points >= pointsIssued
        ? loyaltyTotals.yearly_points - pointsIssued
        : loyaltyTotals.yearly_points,
    overallPoints:
      pointsIssued > 0 && loyaltyTotals.overall_points >= pointsIssued
        ? loyaltyTotals.overall_points - pointsIssued
        : loyaltyTotals.overall_points,
    dailyTransactions:
      isTransactionWithin.day &&
      pointsIssued > 0 &&
      loyaltyTotals.daily_transactions > 0 &&
      loyaltyTotals.daily_points >= pointsIssued
        ? parseInt(loyaltyTotals.daily_transactions) - 1
        : loyaltyTotals.daily_transactions,
    weeklyTransactions:
      isTransactionWithin.week &&
      pointsIssued > 0 &&
      loyaltyTotals.weekly_transactions > 0 &&
      loyaltyTotals.weekly_points >= pointsIssued
        ? parseInt(loyaltyTotals.weekly_transactions) - 1
        : loyaltyTotals.weekly_transactions,
    monthlyTransactions:
      isTransactionWithin.month &&
      pointsIssued > 0 &&
      loyaltyTotals.monthly_transactions > 0 &&
      loyaltyTotals.monthly_points >= pointsIssued
        ? parseInt(loyaltyTotals.monthly_transactions) - 1
        : loyaltyTotals.monthly_transactions,
    yearlyTransactions:
      isTransactionWithin.year &&
      pointsIssued > 0 &&
      loyaltyTotals.yearly_transactions > 0 &&
      loyaltyTotals.yearly_points >= pointsIssued
        ? parseInt(loyaltyTotals.yearly_transactions) - 1
        : loyaltyTotals.yearly_transactions,
    overallTransactions:
      pointsIssued > 0 && loyaltyTotals.overall_transactions > 0
        ? parseInt(loyaltyTotals.overall_transactions) - 1
        : loyaltyTotals.overall_transactions,
    lastTransactionDate: loyaltyTotals.last_transaction_date
  };
}

export async function validateEnrollmentDate(
  customerLoyaltyStartDate,
  eventDate,
  customerId,
  loyaltyCardId
) {
  const isOrderdate_before = moment(
    moment(customerLoyaltyStartDate).format("YYYY-MM-DD HH:mm:ss")
  ).isSameOrBefore(moment(moment(eventDate).format("YYYY-MM-DD HH:mm:ss")));
  if (!isOrderdate_before) {
    const ClKeys = [
      `${CACHING_KEYS.CUSTOMER_LOYALTY}_${customerId}_${loyaltyCardId}`
    ];
    await removeValueFromCache(ClKeys);
    throw new WCoreError(REWARDX_ERRORS.TRANSACTION_BEFORE_ENROLLMENT_DATE);
  }
  return;
}
