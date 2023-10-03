import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../constants/errors";
import { LoyaltyProgram } from "../../../entity/loyalty-program";
import {
  validateCustomerLoyaltyData,
  getLoyaltyTransactionByLoyaltyReferenceId,
  checkIfCustomerBelongsToCampaign,
  findLoyaltyTransactionByLoyalytReferenceIdAndLoyaltyCode
} from "./CustomerLoyaltyUtils";
import { EntityManager, getManager } from "typeorm";
import {
  JSON_SCHEMA,
  LOYALTY_LEDGER_TYPE
} from "../constants/constant";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { Injector } from "@graphql-modules/di";
import { CustomerRepository } from "@walkinserver/walkin-core/src/modules/customer/customer.repository";
import { CollectionItemsRepository } from "../../collection-items/collection-items.repository";
import { CollectionsRepository } from "../../collections/collections.repository";
import { LoyaltyProgramDetailRepository } from "../../loyalty-program-detail/loyalty-program-detail.repository";
import { CustomerLoyaltyRepository } from "../../customer-loyalty/customer-loyalty.repository";
import { LoyaltyCardRepository } from "../../loyalty-card/loyalty-card.repository";
import { CustomerLoyaltyProgramRepository } from "../../customer-loyalty-program/customer-loyalty-program.repository";
import { LoyaltyProgramConfigRepository } from "../../loyalty-program-config/loyalty-program-config.repository";
import { ActionUtils } from "./ActionUtils";
import { BusinessRuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers";
import { BUSINESS_RULE_LEVELS } from "@walkinserver/walkin-core/src/modules/common/constants";
import { getBusinessRuleDetailValues } from "@walkinserver/walkin-core/src/modules/rule/utils/BusinessRuleUtils";
import { evaluateJexl } from "./RuleUtils";
import { LoyaltyTransactionRepository } from "../../loyalty-transaction/loyalty-transaction.repository";
import Container from "typedi";
import { evaluateDynamicCollections } from "./CommonUtils";
import { listOutCollectionsOfLoyaltyProgram } from "./CollectionItemsUtils";
import { REWARDX_SCHEMA } from "../schema/loyalty-transaction-apis.schema";
import Ajv from "ajv";
import { formatLoyaltyProgramCode } from "../../../../../walkin-core/src/modules/common/utils/utils";
const ajv = new Ajv()

export async function getLoyaltyProgramByLoyaltyCodeAndTransactionTYpe(
  entityManager,
  loyaltyCode,
  processType
) {
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
    .innerJoinAndSelect("loyaltyProgram." + ruleType, ruleType)
    .where(
      "loyaltyProgram." +
      ruleType +
      ".id=" +
      ruleType +
      ".id and loyaltyProgram.code = :loyaltyCode",
      { loyaltyCode },
      {
        relations: ["loyaltyCard", ruleType]
      }
    )
    .getOne();
  return loyaltyProgram;
}

/**
 * 1. Checking whether customer loyalty exists or not
 * 2. Checking whether transaction reference Id exists or not
 * 3. Get Loyalty code by loyalty card
 */
export async function validateInputAndReturnLoyalty(
  entityManager: EntityManager,
  injector,
  transactionType,
  data
) {
  let loyaltyReferenceId = data.loyaltyReferenceId;
  let loyaltyCode = data.loyaltyCode;
  let loyaltyCardCode = data.loyaltyCardCode;
  let loyaltyProgram = null;
  // Validates all customer loyalty data and return customer loyalty
  let customerLoyalty = await validateCustomerLoyaltyData(
    entityManager,
    injector,
    data
  );
  const existedLoyaltyTransaction = await getLoyaltyTransactionByLoyaltyReferenceId(
    entityManager,
    loyaltyReferenceId,
    data.organizaitonId
  );
  if (
    !(
      existedLoyaltyTransaction == undefined ||
      existedLoyaltyTransaction == null
    )
  ) {
    if (existedLoyaltyTransaction.statusCode.statusCode === "COMPLETED") {
      throw new WCoreError(
        REWARDX_ERRORS.LOYALTY_TRANSACTION_ALREADY_COMPLETED
      );
    }
    if (existedLoyaltyTransaction.statusCode.statusCode === "CANCELLED") {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_CANCELLED);
    }
  }

  let isCustomerBelongsToCampaign = await checkIfCustomerBelongsToCampaign(
    entityManager,
    injector,
    loyaltyCode,
    loyaltyCardCode,
    customerLoyalty.customer,
    transactionType
  );
  if (isCustomerBelongsToCampaign.ruleValidated) {
    loyaltyProgram = isCustomerBelongsToCampaign.loyaltyProgram;
    if (!loyaltyProgram) {
      throw new WCoreError(
        REWARDX_ERRORS.TRANSACTION_POINT_LOYALTY_PROGRAM_NOT_CONFIGURED
      );
    }
  } else {
    throw new WCoreError(REWARDX_ERRORS.LOYALTY_RULE_DOESNT_SATISFY);
  }
  let loyaltyTransaction = await findLoyaltyTransactionByLoyalytReferenceIdAndLoyaltyCode(
    entityManager,
    loyaltyReferenceId,
    loyaltyCode
  );
  return {
    loyaltyTransaction,
    loyaltyProgram,
    customerLoyalty
  };
}

export async function getLoyaltyProgramDataByExternalCustomerId(
  entityManager: EntityManager,
  injector: Injector,
  externalCustomerId,
  organizationId,
  experiment_code
) {
  experiment_code = formatLoyaltyProgramCode(experiment_code);

  let loyalty_program_detail: any = [], loyalty_program_config;

  let customer = await injector
    .get(CustomerRepository)
    .getCustomerByExternalCustomerId_rawQuery(
      entityManager,
      externalCustomerId,
      organizationId
    );
  if (!customer) throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);

  let collectionItems = await injector
    .get(CollectionItemsRepository)
    .getCollectionItems_rawQuery(entityManager, { item_id: customer[0].id });
  if (collectionItems) {
    for (let index in collectionItems) {
      let collection = await injector
        .get(CollectionsRepository)
        .getCollections_rawQuery(entityManager, {
          id: collectionItems[index].collections_id,
          organization_id: organizationId
        });
      if (!(collection && collection.length)) {
        continue;
      }
      collection = collection[0];
      loyalty_program_detail = await injector
        .get(LoyaltyProgramDetailRepository)
        .getLoyaltyProgramDetail_rawQuery(entityManager, {
          "loyalty_program_detail.organization_id": organizationId,
          "collection_id": collection.id,
          "loyalty_program_detail.experiment_code": experiment_code
        });
      if (loyalty_program_detail && loyalty_program_detail.length) {
        loyalty_program_detail = loyalty_program_detail[0];
        break;
      }
    }
  }
  if (loyalty_program_detail.length == 0) {
    loyalty_program_detail = await getLoyaltyProgramDetailForDynamicCollections(
      entityManager,
      injector,
      externalCustomerId,
      organizationId,
      experiment_code
    );
  }
  if (loyalty_program_detail) {
    loyalty_program_config = await getLoyaltyProgramConfigByID(
      entityManager,
      injector,
      organizationId,
      loyalty_program_detail.loyalty_program_config_id
    );
  } else {
    throw new WCoreError({
      HTTP_CODE: 404,
      MESSAGE: "Customer doesnt have any loyalty program attached.",
      CODE: "CDNHLP"
    });
  }
  return { loyalty_program_detail, loyalty_program_config };
}

export async function getCustomerLoyaltyDataByExternalCustomerId(
  entityManager: EntityManager,
  injector: Injector,
  organizationId: string,
  externalCustomerId: string,
  loyaltyCardId: number | string,
  programConfigCode: string,
  experimentCode: string
) {
  experimentCode = formatLoyaltyProgramCode(experimentCode);

  let customer = await injector
    .get(CustomerRepository)
    .getCustomer_rawQuery(entityManager, {
      externalCustomerId: externalCustomerId,
      organization_id: organizationId
    });
  if (!customer[0]) throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
  try {
    customer = customer[0];
  } catch (e) {
    throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
  }

  let loyaltyCard = await injector
    .get(LoyaltyCardRepository)
    .getLoyaltyCard_rawQuery(entityManager, {
      id: loyaltyCardId
    });
  if (!(loyaltyCard && loyaltyCard.length)) {
    throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
  }
  loyaltyCard = loyaltyCard[0];
  
  let customerLoyalty = await injector
    .get(CustomerLoyaltyRepository)
    .getCustomerLoyalty_rawQueryWithRecordLock(entityManager, {
      customer_id: customer.id,
      loyalty_card_id: loyaltyCardId
    });
  if (!(customerLoyalty && customerLoyalty.length)) {
    let newCustomerLoyalty = await injector
      .get(CustomerLoyaltyRepository)
      .createCustomerLoyalty(entityManager, {
        "externalCustomerId": externalCustomerId,
        "loyaltyCardCode": loyaltyCard.code,
        "organization_id": organizationId
      });

    customerLoyalty = [{
      id: newCustomerLoyalty[0].id,
      points: newCustomerLoyalty[0].points,
      points_blocked: newCustomerLoyalty[0].pointsBlocked,
      redeemed_transactions: newCustomerLoyalty[0].redeemedTransactions,
      issued_transactions: newCustomerLoyalty[0].issuedTransactions,
      customer_id: newCustomerLoyalty[0].customer,
      loyalty_card_id: newCustomerLoyalty[0].loyaltyCard,
      negative_points: 0,
      start_date: newCustomerLoyalty[0].startDate,
      end_date: newCustomerLoyalty[0].endDate,
      status: newCustomerLoyalty[0].status,
      loyalty_totals: newCustomerLoyalty[0].loyaltyTotals
    }];
  }
  customerLoyalty = customerLoyalty[0];

  // Finding Customer Loyalty Program
  let customerLoyaltyProgram = await injector
    .get(CustomerLoyaltyProgramRepository)
    .getCustomerLoyaltyProgram_rawQuery(entityManager, {
      customer_loyalty_id: customerLoyalty.id,
      loyalty_experiment_code: experimentCode,
      loyalty_program_code: programConfigCode
    });
  if (!(customerLoyaltyProgram && customerLoyaltyProgram.length)) {
    let newCustomerLoyaltyProgram = await injector
      .get(CustomerLoyaltyProgramRepository)
      .createCustomerLoyaltyProgram(entityManager, {
        "customer_loyalty_id": customerLoyalty.id,
        "loyalty_experiment_code": experimentCode,
        "loyalty_program_code": programConfigCode
      });
    customerLoyaltyProgram = [{
      id: newCustomerLoyaltyProgram[0].id,
      loyalty_program_code: newCustomerLoyaltyProgram[0].loyaltyProgramCode,
      loyalty_experiment_code: newCustomerLoyaltyProgram[0].loyaltyExperimentCode,
      redeemed_transactions: newCustomerLoyaltyProgram[0].redeemedTransactions,
      issued_transactions: newCustomerLoyaltyProgram[0].issuedTransactions,
      customer_loyalty_id: newCustomerLoyaltyProgram[0].customerLoyalty,
      status: newCustomerLoyaltyProgram[0].status
    }];
  }
  customerLoyaltyProgram = customerLoyaltyProgram[0];
  return { customerLoyalty, customerLoyaltyProgram, loyaltyCard, customer };
}

export async function getLoyaltyProgramConfigByID(
  entityManager: EntityManager,
  injector: Injector,
  organizationId: string,
  idFromLoyaltyProgramDetail: number | string
) {
  let loyaltyProgramConfig = await injector
    .get(LoyaltyProgramConfigRepository)
    .getLoyaltyProgramConfig_rawQuery(entityManager, {
      "loyalty_program_config.organization_id": organizationId,
      "loyalty_program_config.id": idFromLoyaltyProgramDetail
    });
  loyaltyProgramConfig = loyaltyProgramConfig[0];
  if (loyaltyProgramConfig == null && loyaltyProgramConfig == undefined) {
    throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_CONFIG_NOT_FOUND);
  }

  return loyaltyProgramConfig;
}

export async function getLoyaltyProgramDetailForDynamicCollections(
  entityManager: EntityManager,
  injector,
  externalCustomerId,
  organizationId,
  experiment_code
) {
  let Customer, loyalty_program_detail;
  Customer = await injector
    .get(CustomerRepository)
    .getCustomer_rawQuery(entityManager, {
      externalCustomerId: externalCustomerId,
      organization_id: organizationId
    });
  loyalty_program_detail = await injector
    .get(LoyaltyProgramDetailRepository)
    .getLoyaltyProgramDetail_rawQuery(entityManager, {
      "loyalty_program_detail.organization_id": organizationId,
      "loyalty_program_detail.experiment_code": experiment_code
    });
  if (!loyalty_program_detail.length || JSON.stringify(loyalty_program_detail) == '[]') {
    return null;
  }
  const queryRunner = await entityManager.connection.createQueryRunner();
  const loyaltyCard = await queryRunner.manager.query(
    `SELECT * FROM loyalty_card WHERE id = (SELECT loyalty_card_id FROM loyalty_program_config WHERE id = '${loyalty_program_detail[0].loyalty_program_config_id}')`
  );
  let collectionList = await listOutCollectionsOfLoyaltyProgram(injector, entityManager, loyalty_program_detail[0]);
  let validDynamicCollection: any;

  for (let index in collectionList["dynamicCollections"]) {
    if (collectionList["dynamicCollections"][index].entity == "CUSTOMER") {
      validDynamicCollection = await evaluateDynamicCollections(
        entityManager,
        injector,
        collectionList["dynamicCollections"][index],
        { Customer: Customer[0] }
      );
    }
  }

  await queryRunner.release();

  if (validDynamicCollection) {
    let clp = await createCustomerLoyaltyProgramForCustomerInDynamicCollection(entityManager, Customer[0], experiment_code, injector, loyaltyCard);
    return loyalty_program_detail[0];
  }

}

export async function createCustomerLoyaltyProgramForCustomerInDynamicCollection(
  entityManager: EntityManager,
  Customer,
  experimentCode,
  injector,
  loyaltyCard
) {
  let customerLoyalty = await injector
    .get(CustomerLoyaltyRepository)
    .getCustomerLoyalty_rawQuery(entityManager, {
      "customer_id": Customer.id,
      loyalty_card_id: loyaltyCard[0].id
    });
  if (customerLoyalty.length == 0) {
    customerLoyalty = await injector
      .get(CustomerLoyaltyRepository)
      .createCustomerLoyalty(entityManager, {
        "externalCustomerId": Customer.externalCustomerId,
        "loyaltyCardCode": loyaltyCard[0].code,
        "organization_id": Customer.organization_id
      })
  }
  let queryRunner = await entityManager.connection.createQueryRunner();
  let programCode = await queryRunner.manager.query(
    `SELECT loyalty_program_config.code FROM loyalty_program_detail 
      LEFT JOIN loyalty_program_config ON loyalty_program_detail.loyalty_program_config_id =  loyalty_program_config.id
      WHERE loyalty_program_detail.experiment_code = '${experimentCode}' and 
      loyalty_program_detail.organization_id='${Customer.organization_id}' `
  );
  await queryRunner.release();
  let customerLoyaltyProgram = await injector
    .get(CustomerLoyaltyProgramRepository)
    .getCustomerLoyaltyProgram_rawQuery(entityManager, {
      customer_loyalty_id: customerLoyalty[0].id,
      loyalty_experiment_code: experimentCode,
      loyalty_program_code: programCode[0].code
    });
  if (customerLoyaltyProgram.length != 0) {
    return customerLoyaltyProgram[0];
  } else {
    customerLoyaltyProgram = await injector
      .get(CustomerLoyaltyProgramRepository)
      .createCustomerLoyaltyProgram(entityManager, {
        customer_loyalty_id: customerLoyalty[0].id,
        loyalty_experiment_code: experimentCode,
        loyalty_program_code: programCode[0].code
      }
      );
    return customerLoyaltyProgram;
  }
}

export async function evaluateLoyaltyProgram(
  entityManager: EntityManager,
  injector: Injector,
  organizationId: any,
  loyaltyProgramDetailId: Number,
  data: object
): Promise<Object> {
  try {
    data["organizationId"] = organizationId;
    //TODO: Validate this based on event type(use PROCESS_LOYALTY_ISSUANCE schema for earn and PROCESS_LOYALTY_REDEMPTION for burn) 
    const validate = ajv.compile(REWARDX_SCHEMA[JSON_SCHEMA.PROCESS_LOYALTY_ISSUANCE])
    const valid = validate(data)
    if (!valid) {
      throw new Error(validate.errors.map(e => e.message).join(","))
    }
    const queryRunner = await entityManager.connection.createQueryRunner();

    let loyaltyProgramDetail = await queryRunner.manager.query(`select * from loyalty_program_detail where id ='${loyaltyProgramDetailId}' and organization_id = '${organizationId}'`);

    if (!(loyaltyProgramDetail && loyaltyProgramDetail.length > 0)) {
      throw new WCoreError({
        HTTP_CODE: 400,
        MESSAGE: "loyalty Program Detail not found.",
        CODE: "LPDNF"
      });
    }
    loyaltyProgramDetail = loyaltyProgramDetail[0]

    let loyaltyProgramConfig = await queryRunner.manager.query(`select * from loyalty_program_config where id ='${loyaltyProgramDetail?.loyalty_program_config_id}' and organization_id = '${organizationId}'`);

    if (!(loyaltyProgramConfig && loyaltyProgramConfig.length > 0)) {
      throw new WCoreError({
        HTTP_CODE: 400,
        MESSAGE: "loyalty Program Config not found.",
        CODE: "LPDNF"
      });
    }
    loyaltyProgramConfig = loyaltyProgramConfig[0]
    await queryRunner.release();

    data['loyaltyType'] = loyaltyProgramDetail?.experiment_code;
    let rule_result;
    if (loyaltyProgramDetail.loyalty_earn_rule_set_id && !loyaltyProgramConfig.loyalty_burn_rule_set_id) {
      rule_result = 'ISSUE'
    } else if (!loyaltyProgramDetail.loyalty_earn_rule_set_id && loyaltyProgramConfig.loyalty_burn_rule_set_id) {
      rule_result = 'REDEEM'
    }

    if (!rule_result) {
      if ("order" in data) {
        const queryRunner = await entityManager.connection.createQueryRunner();
        let transaction_status = await queryRunner.manager.query(
          `select status_code from loyalty_transaction where loyalty_reference_id='${data["loyaltyReferenceId"]}'`
        );
        await queryRunner.release();
        try {
          transaction_status =
            transaction_status && transaction_status.length > 0
              ? transaction_status[0].status_code
              : null;
        } catch (e) { }
        if (!transaction_status) transaction_status = data["statusCode"];
        if (!transaction_status)
          throw new WCoreError({
            HTTP_CODE: 400,
            MESSAGE: "Transaction status not found",
            CODE: "TSNF"
          });

        let businessRules: any = await injector
          .get(BusinessRuleProvider)
          .getRules(entityManager, {
            ruleLevel: BUSINESS_RULE_LEVELS.ORGANIZATION,
            ruleType: "LOYALTY_TRANSACTION_STATUS_CHECK"
          });
        businessRules = await getBusinessRuleDetailValues(
          businessRules,
          organizationId
        );
        rule_result = await evaluateJexl(businessRules[0].ruleDefaultValue, {
          LOYALTY: { status: transaction_status }
        });
      }
    }
    if (!rule_result) rule_result = "ISSUE"
    let result;
    switch (rule_result) {
      case "ISSUE":
        result = await getManager().transaction(
          async transactionalEntityManager => {
            data["createCustomerIfNotExist"] = true;
            data["statusCode"] = 102;
            let res = await injector
              .get(LoyaltyTransactionRepository)
              .issuePoints(transactionalEntityManager, injector, data);
            return res;
          }
        );
        return { status: result.message.length ? false : true, message: result.message.length ? result.message : "", result };
      case "REDEEM":
        result = await getManager().transaction(
          async transactionalEntityManager => {
            data["burnFromLoyaltyCard"] = true;
            data["statusCode"] = 104;
            let res = await injector
              .get(LoyaltyTransactionRepository)
              .burnPoints(transactionalEntityManager, injector, data);
            return res;
          }
        );
        return { status: result.message.length ? false : true, message: result.message.length ? result.message : "", result };
      default:
        throw new WCoreError({
          HTTP_CODE: 400,
          MESSAGE: "Transaction cannot be proccessed",
          CODE: "TCNP"
        });
    }
  } catch (e) {
    return { status: false, message: e.message, result: {} };
  }
}

export async function getTransactionCountForCancelling(
  entityManager,
  transactionObject
) {
  const { id, customerLoyaltyProgram } = transactionObject;
  let issuedCount = 0;
  let redeemedCount = 0;

  const issuedTransaction = await entityManager.query(
    `select lt.id from loyalty_ledger ll
    inner join loyalty_transaction lt on lt.id = ll.loyalty_transaction_id
    where lt.id='${id}' and lt.status_code = 102 and lt.points_issued > 0 and ll.type = "ISSUE"
    and lt.customer_loyalty_program_id="${customerLoyaltyProgram.id}";`
  );
  if (issuedTransaction.length > 0) {
    issuedCount += 1;
  }

  const redeemedTransaction = await entityManager.query(
    `select lt.id from loyalty_ledger ll
    inner join loyalty_transaction lt on lt.id = ll.loyalty_transaction_id
    where lt.id='${id}' and (lt.status_code = 102 or lt.status_code = 101) and lt.points_redeemed > 0 and ll.type = "REDUCE"
    and lt.customer_loyalty_program_id="${customerLoyaltyProgram.id}";`
  );
  if (redeemedTransaction.length > 0) {
    redeemedCount += 1;
  }

  const result = {
    redeemedCount,
    issuedCount
  }
  return result;
}
