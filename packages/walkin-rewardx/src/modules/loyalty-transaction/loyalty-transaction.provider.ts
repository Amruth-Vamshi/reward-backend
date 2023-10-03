import { EntityManager, MoreThan, LessThanOrEqual } from "typeorm";
import { Injectable, Inject, Injector } from "@graphql-modules/di";
import moment from "moment";
import {
  Status,
  CustomerLoyalty,
  LoyaltyTransaction,
  LoyaltyLedger,
  LoyaltyTransactionData,
  CustomerLoyaltyProgram
} from "../../entity";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../common/constants/errors";
import {
  LOYALTY_LEDGER_TYPE,
  LOYALTY_TRANSACTION_STATUS,
  CURRENCY_CODE,
  LOYALTY_PROGRAM
} from "../common/constants/constant";
import {
  findCustomerByExternalCustomerId,
  findOrganizationById,
  getStatusByStatusCode,
  validateProduct,
  evaluateDynamicCollections
} from "../common/utils/CommonUtils";
import {
  getCustomerLoyaltyDataByExternalCustomerId,
  getLoyaltyProgramDataByExternalCustomerId,
  getTransactionCountForCancelling,
  validateInputAndReturnLoyalty
} from "../common/utils/LoyaltyProgramUtils";
import {
  createBurnLedger,
  createBlockLedger,
  getLedgerTransactionsByTypeAndRefernceId,
  createUnBlockLedger
} from "../common/utils/LoyaltyLedgerUtils";
import { RuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/rule.provider";
import { CurrencyProvider } from "../currency/currency.provider";
import {
  validateCustomerLoyaltyData,
  validateCustomerLoyalty,
  getLoyaltyTransactionByLoyaltyReferenceId,
  customerLoyaltyTotalsForOrderDate,
  storeLoyaltyTotalsForOrderDate,
  customerLoyaltyProgramTotalsForOrderDate,
  getUpdatedLoyaltyTotalsForCancelledLoyaltyTransaction,
  getUpdatedLoyaltyTotals,
  getLoyaltyTransactionByLoyaltyReferenceIdForCancelTransaction,
  validateEnrollmentDate
} from "../common/utils/CustomerLoyaltyUtils";
import {
  LoyaltyTotals,
  Organization
} from "@walkinserver/walkin-core/src/entity";
import {
  BUSINESS_RULE_LEVELS,
  PageOptions,
  CACHING_KEYS
} from "@walkinserver/walkin-core/src/modules/common/constants";
import { CommunicationProvider } from "@walkinserver/walkin-core/src/modules/communication/communication.providers";
import { LOYALTY_ATTRIBUTE_ENTITY_NAME } from "../common/constants/constant";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { getBusinessRuleDetailValues } from "@walkinserver/walkin-core/src/modules/rule/utils/BusinessRuleUtils";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { keyBy } from "lodash";
import { BusinessRuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers";
import { addPaginateInfo } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import {
  checkBurnBusinessRules,
  checkEarnBusinessRules,
  evaluateRuleSet
} from "../common/utils/RuleUtils";
import { CollectionItemsRepository } from "../collection-items/collection-items.repository";
import { clearKeysByPattern } from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
import { LoyaltyTransactionRepository } from "./loyalty-transaction.repository";
import { LoyaltyProgramDetailProvider } from "../loyalty-program-detail/loyalty-program-detail.provider";
import { LoyaltyProgramConfigProvider } from "../loyalty-program-config/loyalty-program-config.provider";
import { sendToWehbookSubscribers } from "@walkinserver/walkin-core/src/modules/common/utils/webhookUtils";
import { listOutCollectionsOfLoyaltyProgram } from "../common/utils/CollectionItemsUtils";
import { isEmojiPresent } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";

@Injectable()
export class LoyaltyTransactionProvider {
  public async earnableBurnablePoints(
    entityManager: EntityManager,
    injector,
    earnableBurnableInput
  ): Promise<Object> {
    //validation
    let organizationId = earnableBurnableInput.organizationId;
    Organization.availableById(entityManager, organizationId);

    //general flow - START
    let eventDate = earnableBurnableInput.data.date;
    if (eventDate != null && typeof eventDate == "object") {
      eventDate = `${eventDate[0]}-${`${eventDate[1]}`.length == 1 ? `0${eventDate[1]}` : eventDate[1]
        }-${`${eventDate[2]}`.length == 1 ? `0${eventDate[2]}` : eventDate[2]} ${eventDate[3] ? (eventDate[3] == 0 ? 12 : eventDate[3]) : 12
        }:${eventDate[4] ? eventDate[4] : "00"}:${eventDate[5] ? eventDate[5] : "00"
        }`;
    } else {
      eventDate = moment()
        .utcOffset(330)
        .format("YYYY-MM-DD HH:mm:ss");
    }

    let businessRules = await injector
      .get(BusinessRuleProvider)
      .getRules(entityManager, {
        ruleLevel: BUSINESS_RULE_LEVELS.ORGANIZATION
      });
    businessRules = await getBusinessRuleDetailValues(
      businessRules,
      organizationId
    );
    let businessRuleData;
    if (businessRules && businessRules.length > 0) {
      businessRuleData = keyBy(businessRules, "ruleType");
    }

    const {
      loyalty_program_config,
      loyalty_program_detail
    } = await getLoyaltyProgramDataByExternalCustomerId(
      entityManager,
      injector,
      earnableBurnableInput.externalCustomerId,
      organizationId,
      earnableBurnableInput.loyaltyType
    );
    const {
      customerLoyalty,
      customerLoyaltyProgram,
      loyaltyCard,
      customer
    } = await getCustomerLoyaltyDataByExternalCustomerId(
      entityManager,
      injector,
      organizationId,
      earnableBurnableInput.externalCustomerId,
      loyalty_program_config.loyalty_card_id,
      loyalty_program_config.code,
      loyalty_program_detail.experiment_code
    );

    await validateEnrollmentDate(customerLoyalty.start_date, eventDate, customer.id, loyaltyCard.id);

    let collectionList = await listOutCollectionsOfLoyaltyProgram(
      injector,
      entityManager,
      loyalty_program_detail
    );

    const queryRunner = await entityManager.connection.createQueryRunner();

    let { customerLoyaltyTotals } = await customerLoyaltyTotalsForOrderDate(
      queryRunner,
      customerLoyalty.id,
      eventDate
    );
    customerLoyalty["customerLoyaltyTotals"] = customerLoyaltyTotals;

    let {
      customerLoyaltyProgramTotals
    } = await customerLoyaltyProgramTotalsForOrderDate(
      queryRunner,
      customerLoyaltyProgram.id,
      eventDate
    );
    customerLoyaltyProgram[
      "customerLoyaltyProgramTotals"
    ] = customerLoyaltyProgramTotals;
    //general flow - END

    //store flow - START
    let orderData = earnableBurnableInput.data.order;
    const storeCode =
      "store" in earnableBurnableInput.data
        ? earnableBurnableInput.data.store.externalStoreId
        : orderData
          ? orderData.externalStoreId
          : null;

    if (storeCode) {
      let store = await queryRunner.manager.query(
        `SELECT * FROM store WHERE code='${storeCode}' AND STATUS='ACTIVE' AND organization_id='${organizationId}'`
      );
      if (store.length == 0) throw new WCoreError(WCORE_ERRORS.STORE_NOT_FOUND);
      let storeId = store[0].id;

      let isStorePartOfLoyaltyProgram = await injector
        .get(CollectionItemsRepository)
        .getCollectionItems_rawQuery(entityManager, {
          item_id: storeId,
          collections_id: loyalty_program_detail.collection_ids.slice(1, -1)
        });
      if (
        !(isStorePartOfLoyaltyProgram && isStorePartOfLoyaltyProgram.length)
      ) {
        for (let index in collectionList["dynamicCollections"]) {
          if (collectionList["dynamicCollections"][index].entity == "STORE") {
            await evaluateDynamicCollections(
              entityManager,
              injector,
              collectionList["dynamicCollections"][index],
              { Store: store[0] }
            );
          }
        }
      }
      let { storeTotals } = await storeLoyaltyTotalsForOrderDate(
        queryRunner,
        organizationId,
        storeCode,
        storeId,
        eventDate
      );
      if (!("store" in earnableBurnableInput["data"]))
        earnableBurnableInput["data"]["store"] = {};
      earnableBurnableInput["data"]["store"]["storeTotals"] = storeTotals;
      earnableBurnableInput["data"]["store"] = {
        ...earnableBurnableInput["data"]["store"],
        ...store[0],
        extend: store[0].extend ? JSON.parse(store[0].extend) : null
      };
    }
    //store flow - END

    //order flow - START
    if ("order" in earnableBurnableInput.data) {
      let validProducts = await validateProduct(
        entityManager,
        injector,
        queryRunner,
        earnableBurnableInput.data.order.products,
        loyalty_program_detail,
        businessRuleData.ALLOW_PRODUCT_VALIDATION.ruleDefaultValue.toUpperCase(),
        collectionList
      );

      let totalPrice = 0;

      if (validProducts != null) {
        for (let index in validProducts) {
          let product = validProducts[index];
          totalPrice +=
            parseFloat(product.pricePerQty) * parseInt(product.quantity);
        }
      } else {
        for (let index in earnableBurnableInput.data.order.products) {
          let product = earnableBurnableInput.data.order.products[index];
          totalPrice += product.pricePerQty * product.quantity;
        }
      }

      earnableBurnableInput["data"]["order"] = {
        ...earnableBurnableInput["data"]["order"],
        products: earnableBurnableInput["data"]["order"].products.map(p => ({
          ...p,
          extend: p.extend ? JSON.parse(p.extend) : null
        })),
        totalAmount: totalPrice
      };
    }
    //order flow - END
    await queryRunner.release();
    let maxPointsAllowedToIssue = Infinity;
    earnableBurnableInput["data"]["customer"] = earnableBurnableInput["data"][
      "customer"
    ]
      ? earnableBurnableInput["data"]["customer"]
      : {};
    let customData = JSON.parse(JSON.stringify(earnableBurnableInput["data"]));
    delete customData.order;
    delete customData.customer;
    delete customData.store;
    customData["date"] = JSON.parse(
      moment(eventDate).format(
        '{["year"]:"YYYY",["month"]:"MM",["day"]:"DD",["hour"]:"HH",["minute"]:"mm",["second"]:"ss",["dayName"]:"dddd"}'
      )
    );
    let ruleData = {
      LOYALTY: earnableBurnableInput["data"]["order"]
        ? earnableBurnableInput["data"]["order"]
        : {},
      customer: {
        ...earnableBurnableInput["data"]["customer"],
        ...customer,
        extend: customer.extend ? JSON.parse(customer.extend) : null,
        customerLoyalty,
        customerLoyaltyProgram
      },
      store: earnableBurnableInput["data"]["store"]
        ? earnableBurnableInput["data"]["store"]
        : {},
      data: customData
    };
    let burnablePoints = 0;
    let message = [];
    let res;
    if (loyalty_program_config.loyalty_burn_rule_set_id) {
      res = await evaluateRuleSet(
        entityManager,
        injector,
        loyalty_program_config.loyalty_burn_rule_set_id,
        ruleData
      );
      if (!res["status"]) {
        message.push(`BURN: ${res["message"]}`);
      } else {
        burnablePoints = res["results"][0];
        burnablePoints = await checkBurnBusinessRules(
          orderData,
          businessRuleData,
          burnablePoints
        );
        customerLoyalty.points = parseFloat(customerLoyalty.points);
        if (burnablePoints > customerLoyalty.points) {
          burnablePoints = customerLoyalty.points;
        }
      }
    }
    let earnedPointsExpiryValue = loyalty_program_config.expiry_value;
    let earnedPointsExpiryUnit = loyalty_program_config.expiry_unit;
    let tobeIssuedPoints = 0;
    ruleData["LOYALTY"]["totalAmount"] = earnableBurnableInput["data"]["order"]
      ? earnableBurnableInput["data"]["order"].totalAmount - burnablePoints
      : 0;

    if (loyalty_program_detail.loyalty_earn_rule_set_id) {
      res = await evaluateRuleSet(
        entityManager,
        injector,
        loyalty_program_detail.loyalty_earn_rule_set_id,
        ruleData
      );
      if (!res["status"]) {
        message.push(`EARN: ${res["message"]}`);
        tobeIssuedPoints = 0;
      } else {
        tobeIssuedPoints = res["results"][0];
        tobeIssuedPoints = await checkEarnBusinessRules(
          orderData,
          businessRuleData,
          tobeIssuedPoints
        );
        for (let i = 1; i < res["results"].length; i++) {
          let current_result = res["results"][i];
          try {
            current_result = JSON.parse(current_result);
            if (
              current_result["maxPointsAllowedToIssueCustomerLoyalty"] ||
              current_result["maxPointsAllowedToIssueCustomerLoyalty"] == 0
            ) {
              maxPointsAllowedToIssue = parseInt(
                current_result["maxPointsAllowedToIssueCustomerLoyalty"]
              );
              tobeIssuedPoints = Math.min(
                tobeIssuedPoints,
                maxPointsAllowedToIssue
              );
            }
            if (
              current_result["maxPointsAllowedToIssueCustomerLoyaltyProgram"] ||
              current_result["maxPointsAllowedToIssueCustomerLoyaltyProgram"] ==
              0
            ) {
              maxPointsAllowedToIssue = parseInt(
                current_result["maxPointsAllowedToIssueCustomerLoyaltyProgram"]
              );
              tobeIssuedPoints = Math.min(
                tobeIssuedPoints,
                maxPointsAllowedToIssue
              );
            }
            if (
              current_result["maxPointsAllowedToIssueStore"] ||
              current_result["maxPointsAllowedToIssueStore"] == 0
            ) {
              maxPointsAllowedToIssue = parseInt(
                current_result["maxPointsAllowedToIssueStore"]
              );
              tobeIssuedPoints = Math.min(
                tobeIssuedPoints,
                maxPointsAllowedToIssue
              );
            }
          } catch (e) {
            console.log("max points issue: ", e.message);
          }
        }
      }
    }
    let result = {};
    result["loyaltyCardCode"] = loyaltyCard.code;
    result["earnablePoints"] = tobeIssuedPoints;
    result["earnableAmount"] = tobeIssuedPoints;
    result["burnablePoints"] = burnablePoints;
    result["burnableAmount"] = burnablePoints;
    result["overallPoints"] = customerLoyalty.points;
    result["overallAmount"] = customerLoyalty.points;
    result["earnedPointsExpiryValue"] = earnedPointsExpiryValue;
    result["earnedPointsExpiryUnit"] = earnedPointsExpiryUnit;
    result["message"] = message;
    return result;
  }

  public async issuePoints(
    entityManager: EntityManager,
    injector,
    processLoyaltyIssuance
  ): Promise<Object> {
    let result = await injector
      .get(LoyaltyTransactionRepository)
      .issuePoints(entityManager, injector, processLoyaltyIssuance);
    return result;
  }

  /*
   * @param {id} String
   * return Loyalty Transaction record
   */
  async getLoyaltyTransaction(
    entityManager: EntityManager,
    injector,
    externalCustomerId: string,
    cardCode: string,
    organizaitonId = null
  ) {
    let customerLoyalty = await validateCustomerLoyalty(
      entityManager,
      injector,
      externalCustomerId,
      cardCode,
      organizaitonId
    );
    let loayltyTransaction = await entityManager.find(LoyaltyTransaction, {
      where: {
        customerLoyaltyId: customerLoyalty.id
      },
      relations: [
        "customerLoyaltyProgram",
        "customerLoyaltyProgram.customerLoyalty"
      ]
    });
    return loayltyTransaction;
  }

  public async burnPoints(
    entityManager: EntityManager,
    injector,
    processLoyaltyRedemption
  ): Promise<Object> {
    let result = await injector
      .get(LoyaltyTransactionRepository)
      .burnPoints(entityManager, injector, processLoyaltyRedemption);
    return result;
  }

  /*
   * @param {JSON} processLoyalty
   * return {Float} contains earn amount
   */
  async issueAmountCalc(transactionalEntityManager, injector, processLoyalty) {
    let earnAmount = 0;
    let transactionData = processLoyalty.transactionData;
    let organizationId = processLoyalty.organizationId;
    let loyaltyProgram = processLoyalty.loyaltyProgram;
    let conversionRatio = 0;
    if (loyaltyProgram && loyaltyProgram.loyaltyEarnRule) {
      let loyaltyEarnRule = loyaltyProgram.loyaltyEarnRule;
      let ruleName = loyaltyEarnRule.name;
      let ruleConfiguration = loyaltyEarnRule.ruleConfiguration;
      let transactionRuleData = {};

      transactionRuleData[LOYALTY_ATTRIBUTE_ENTITY_NAME] = transactionData;
      // Based on Rules will consider the percentage
      let evaluatedRule = await injector
        .get(RuleProvider)
        .evaluateRule(transactionalEntityManager, {
          ruleName,
          data: transactionRuleData,
          organizationId
        });
      earnAmount = evaluatedRule
        ? evaluatedRule.evaluationResult
        : conversionRatio;
    } else {
      let currency = await injector
        .get(CurrencyProvider)
        .getCurrencyByCode(transactionalEntityManager, CURRENCY_CODE.DEFAULT);
      conversionRatio = currency ? currency.conversionRatio : conversionRatio;
      let totalPrice = transactionData.totalAmount;
      earnAmount = totalPrice > 0 ? totalPrice * (conversionRatio / 100) : 0;
    }
    return earnAmount;
  }

  async burnAmountCalc(transactionalEntityManager, injector, processLoyalty) {
    let burnAmount = 0;
    let transactionData = processLoyalty.transactionData;
    let organizationId = processLoyalty.organizationId;
    let loyaltyProgram = processLoyalty.loyaltyProgram;
    let conversionRatio = 0;
    if (loyaltyProgram && loyaltyProgram.loyaltyBurnRule) {
      let loyaltyBurnRule = loyaltyProgram.loyaltyBurnRule;
      let ruleName = loyaltyBurnRule.name;
      let ruleConfiguration = loyaltyBurnRule.ruleConfiguration;
      let transactionRuleData = {};
      transactionRuleData[LOYALTY_ATTRIBUTE_ENTITY_NAME] = transactionData;

      let evaluatedRule = await injector
        .get(RuleProvider)
        .evaluateRule(transactionalEntityManager, {
          ruleName,
          data: transactionRuleData,
          organizationId
        });
      burnAmount = evaluatedRule
        ? evaluatedRule.evaluationResult
        : conversionRatio;
    } else {
      let currency = await injector
        .get(CurrencyProvider)
        .getCurrencyByCode(transactionalEntityManager, CURRENCY_CODE.DEFAULT);
      conversionRatio = currency ? currency.conversionRatio : conversionRatio;
      let totalPrice = transactionData.totalAmount;
      burnAmount = totalPrice > 0 ? totalPrice * (conversionRatio / 100) : 0;
    }
    return burnAmount;
  }

  async expirePointsUpdated(
    entityManager: EntityManager,
    injector: Injector,
    organizationId
  ) {
    console.log(
      "Expiry invoked",
      moment()
        .utcOffset(330)
        .format("YYYY-MM-DD HH:mm:ss")
    );

    const dateToCompare = moment()
      .utcOffset(330)
      .format("YYYY-MM-DD HH:mm:ss");

    // Implement batch processing
    let loyaltyLedgers = [];
    const batchSize = 100000; // Number of records to retrieve in each batch
    let offset = 0; // Starting offset
    while (true) {
      const query = `
        SELECT JSON_OBJECT('id', ll.id, 'pointsRemaining', ll.points_remaining, 
          'loyaltyTransactionId', ll.loyalty_transaction_id, 'loyaltyReferenceId', lt.loyalty_reference_id) as loyaltyLedger,
          JSON_OBJECT('id', cl.id, 'points', cl.points) as customerLoyalty
        FROM loyalty_ledger ll
        LEFT JOIN loyalty_transaction lt ON lt.id = ll.loyalty_transaction_id
        LEFT JOIN customer_loyalty_program clp ON clp.id = lt.customer_loyalty_program_id
        LEFT JOIN customer_loyalty cl ON cl.id = clp.customer_loyalty_id
        WHERE ll.points_remaining > 0 AND ll.expiry_date <= "${dateToCompare}" AND lt.organization_id = "${organizationId}"
        LIMIT ${batchSize} OFFSET ${offset};`;

      // Execute the query
      const results = await entityManager.query(query);
      console.log("Expired results:", results.length);
      if (results && results.length > 0) {
        loyaltyLedgers.push(...results);
      }

      // Increment the offset for the next batch
      offset += batchSize;

      // Check if there are more records to retrieve
      if (results.length < batchSize) {
        break; // Exit the loop if no more records
      }
    }

    for (let record of loyaltyLedgers) {
      try {
        let { loyaltyLedger, customerLoyalty } = record;
        loyaltyLedger = JSON.parse(loyaltyLedger);
        customerLoyalty = JSON.parse(customerLoyalty);

        let existedCustomerLoyalty = await entityManager.create(
          CustomerLoyalty,
          {
            ...customerLoyalty
          }
        );
        let updatableCustomerLoyalty = await entityManager.findOne(
          CustomerLoyalty,
          {
            where: {
              id: existedCustomerLoyalty.id
            },
            select: ["id", "points"]
          }
        );

        if (updatableCustomerLoyalty.points >= loyaltyLedger.pointsRemaining) {
          updatableCustomerLoyalty.points = updatableCustomerLoyalty.points - loyaltyLedger.pointsRemaining;
          updatableCustomerLoyalty = await entityManager.save(
            updatableCustomerLoyalty
          );
        }

        let updatableLoyaltyLedger = await entityManager.create(LoyaltyLedger, {
          ...loyaltyLedger
        });
        updatableLoyaltyLedger.pointsRemaining = 0;
        let updatedLoyaltyLedger = await entityManager.save(
          updatableLoyaltyLedger
        );

        let expiryLedger = await entityManager.create(LoyaltyLedger, {
          type: "EXPIRED",
          points: loyaltyLedger.pointsRemaining,
          balanceSnapshot: updatableCustomerLoyalty.points,
          loyaltyTransaction: loyaltyLedger.loyaltyTransactionId,
          remarks: `Points expired for ref#${loyaltyLedger.loyaltyReferenceId} based on "unredeemed points"`
        });
        let savedExpiryLedger = await entityManager.save(expiryLedger);
        sendToWehbookSubscribers(
          entityManager,
          "ON_EXPIRY",
          savedExpiryLedger,
          organizationId,
          injector
        );
      } catch (error) {
        console.log("Error in expire points API", error);
      }
    }
    return true;
  }

  async expirePoints(
    entityManager: EntityManager,
    injector: Injector,
    organizationId
  ) {
    console.log(
      "Expiry invoked",
      moment()
        .utcOffset(330)
        .format("YYYY-MM-DD HH:mm:ss")
    );
    let loyaltyLedgers = await entityManager.find(LoyaltyLedger, {
      where: {
        pointsRemaining: MoreThan(0),
        expiryDate: LessThanOrEqual(
          moment()
            .utcOffset(330)
            .format("YYYY-MM-DD HH:mm:ss")
        )
      },
      relations: [
        "loyaltyTransaction",
        "loyaltyTransaction.customerLoyaltyProgram",
        "loyaltyTransaction.customerLoyaltyProgram.customerLoyalty"
      ]
    });
    for (let index in loyaltyLedgers) {
      try {
        let eachLoyaltyLedger = loyaltyLedgers[index];
        let existedCustomerLoyalty = await entityManager.create(
          CustomerLoyalty,
          {
            //@ts-ignore
            ...eachLoyaltyLedger.loyaltyTransaction.customerLoyaltyProgram
              .customerLoyalty
          }
        );
        const updatableCustomerLoyalty = await entityManager.findOne(
          CustomerLoyalty,
          {
            where: {
              id: existedCustomerLoyalty.id
            }
          }
        );
        updatableCustomerLoyalty.points =
          updatableCustomerLoyalty.points - eachLoyaltyLedger.pointsRemaining;
        // if (updatableCustomerLoyalty.points <= 0) {
        //   throw new WCoreError(REWARDX_ERRORS.INSUFFICIENT_WALLET_BALANCE);
        // }

        let updatedCustomerLoyalty = await entityManager.save(
          updatableCustomerLoyalty
        );
        let updatableLoyaltyLedger = await entityManager.create(LoyaltyLedger, {
          ...eachLoyaltyLedger
        });
        updatableLoyaltyLedger.pointsRemaining = 0;
        let updatedLoyaltyLedger = await entityManager.save(
          updatableLoyaltyLedger
        );

        let expiryLedger = await entityManager.create(LoyaltyLedger, {
          type: "EXPIRED",
          points: eachLoyaltyLedger.pointsRemaining,
          balanceSnapshot: updatedCustomerLoyalty.points,
          loyaltyTransaction: eachLoyaltyLedger.loyaltyTransaction,
          remarks: `Points expired for ref#${eachLoyaltyLedger.loyaltyTransaction.loyaltyReferenceId} based on "unredeemed points"`
        });
        let savedExpiryLedger = await entityManager.save(expiryLedger);
        sendToWehbookSubscribers(
          entityManager,
          "ON_EXPIRY",
          savedExpiryLedger,
          organizationId,
          injector
        );
      } catch (err) {
        //Add logging functionality here.
        console.log(err);
      }
    }
    return true;
  }

  public async blockPoints(
    entityManager: EntityManager,
    injector,
    processLoyaltyRedemption
  ): Promise<Object> {
    let externalCustomerId = processLoyaltyRedemption.externalCustomerId;
    let loyaltyCardCode = processLoyaltyRedemption.loyaltyCardCode;
    let loyaltyReferenceId = processLoyaltyRedemption.loyaltyReferenceId;
    let loyaltyCode = LOYALTY_PROGRAM.TRANSACTION;
    let orderData = processLoyaltyRedemption.orderData;
    let blockPoints = processLoyaltyRedemption.blockPoints;
    let organizationId = processLoyaltyRedemption.organizationId;
    let transactionData = processLoyaltyRedemption.transactionData;
    let currentDate = moment().format("YYYY-MM-DD");

    let organization = await entityManager.findOne(Organization, {
      where: { id: processLoyaltyRedemption.organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    processLoyaltyRedemption.loyaltyCode = LOYALTY_PROGRAM.TRANSACTION;
    let loyalty = await validateInputAndReturnLoyalty(
      entityManager,
      injector,
      LOYALTY_LEDGER_TYPE.BLOCK,
      processLoyaltyRedemption
    );
    let { loyaltyProgram, loyaltyTransaction, customerLoyalty } = loyalty;
    let burnablePoints = await this.burnAmountCalc(entityManager, injector, {
      transactionData,
      loyaltyProgram,
      organizationId
    });

    if (!loyaltyTransaction) {
      loyaltyTransaction = entityManager.create(LoyaltyTransaction, {
        ...loyaltyTransaction
      });
    }
    loyaltyTransaction.type = loyaltyCode;
    loyaltyTransaction.loyaltyReferenceId = loyaltyReferenceId;
    loyaltyTransaction.data = processLoyaltyRedemption;
    loyaltyTransaction.customerLoyalty = customerLoyalty;
    loyaltyTransaction.name =
      "Customer with externalCustomerId_" +
      externalCustomerId +
      "_Transaction_" +
      currentDate;
    if (processLoyaltyRedemption.statusCode) {
      let statusCode = await entityManager.findOne(Status, {
        where: {
          statusId: processLoyaltyRedemption.statusCode
        }
      });
      // To be update based on status code
      loyaltyTransaction.statusCode = statusCode;
    }
    loyaltyTransaction.pointsBlocked =
      (loyaltyTransaction.pointsBlocked
        ? loyaltyTransaction.pointsBlocked
        : 0) + burnablePoints;
    let savedLoyaltyTransaction = await entityManager.save(loyaltyTransaction);
    let blockLedger = await createBlockLedger(
      entityManager,
      burnablePoints,
      savedLoyaltyTransaction,
      customerLoyalty
    );
    let result = {};
    result["loyaltyCardCode"] = loyaltyCardCode;
    result["loyaltyReferenceId"] = loyaltyReferenceId;
    result["blockedPoints"] = burnablePoints;
    return result;
  }

  public async applyBlock(
    entityManager: EntityManager,
    injector,
    loyaltyRefernceId
  ): Promise<any> {
    // check loyalty transaction completed or not
    let isTransactionCompleted = await this.isLoyaltyTransactionCompleted(
      entityManager,
      loyaltyRefernceId
    );
    if (isTransactionCompleted) {
      throw new WCoreError(REWARDX_ERRORS.TRANSACTION_ALREADY_COMPLETED);
    }
    let blockedLedgerTransactions = await getLedgerTransactionsByTypeAndRefernceId(
      entityManager,
      loyaltyRefernceId,
      LOYALTY_LEDGER_TYPE.BLOCK
    );
    if (
      !blockedLedgerTransactions ||
      (blockedLedgerTransactions && blockedLedgerTransactions.length == 0)
    ) {
      throw new WCoreError(REWARDX_ERRORS.BLOCKED_POINTS_NOT_FOUND);
    } else {
      let totalBlockedPoints = 0;
      blockedLedgerTransactions.forEach(blockedTransaction => {
        totalBlockedPoints += blockedTransaction.points;
      });
      let loyaltyTransaction = blockedLedgerTransactions[0].loyaltyTransaction;
      let customerLoyalty = loyaltyTransaction.customerLoyalty;
      let ublockLedger = await createUnBlockLedger(
        entityManager,
        totalBlockedPoints,
        loyaltyTransaction,
        customerLoyalty
      );
      loyaltyTransaction.pointsBlocked =
        loyaltyTransaction.pointsBlocked - totalBlockedPoints;
      if (totalBlockedPoints > customerLoyalty.points) {
        throw new WCoreError(
          REWARDX_ERRORS.BLOCKED_POINTS_CANNOT_BE_GREATER_THAN_EARN_POINTS
        );
      }
      let customer = customerLoyalty.customer ? customerLoyalty.customer : null;
      let reduceDetails = await injector
        .get(LoyaltyTransactionRepository)
        .reduceIssuePoints(
          entityManager,
          totalBlockedPoints,
          customer.externalCustomerId,
          injector,
          customerLoyalty,
          null
        );
      let burnLedger = await createBurnLedger(
        entityManager,
        totalBlockedPoints,
        loyaltyTransaction,
        customerLoyalty,
        reduceDetails
      );
      loyaltyTransaction.pointsRedeemed =
        (loyaltyTransaction.pointsRedeemed
          ? loyaltyTransaction.pointsRedeemed
          : 0) + totalBlockedPoints;
      let updatedLoyaltyTransaction = await entityManager.save(
        loyaltyTransaction
      );
    }
  }

  /*
   * @param loyaltyReferenceId
   *
   * return boolean
   * {false} if status code or loyalty transaction  existed
   *  {true} if status code completed
   */
  public async isLoyaltyTransactionCompleted(
    entityManager,
    loyaltyReferenceId
  ): Promise<Boolean> {
    let where_clause =
      "loyaltyTransaction.loyaltyReferenceId=:loyaltyReferenceId";
    let where_clause_params = {
      loyaltyReferenceId
    };
    const loyaltyTransactionStatus = await entityManager
      .getRepository(LoyaltyTransaction)
      .createQueryBuilder("loyaltyTransaction")
      .innerJoinAndSelect("loyaltyTransaction.statusCode", "statusCode")
      .where(where_clause, where_clause_params)
      .getOne();
    if (loyaltyTransactionStatus) {
      let status = loyaltyTransactionStatus.statusCode;
      if (
        status &&
        status.statusCode === LOYALTY_TRANSACTION_STATUS.COMPLETED
      ) {
        return true;
      }
    }
    return false;
  }

  public async updateStatus(
    entityManager: EntityManager,
    referalStatus: LoyaltyTransaction
  ): Promise<any> {
    const updateStatus = await entityManager.findOne(Status, {
      where: {
        statusCode: "COMPLETED"
      }
    });
    if (!updateStatus) {
      throw new WCoreError(REWARDX_ERRORS.STATUS_ID_NOT_FOUND);
    }
    const loyaltyTransaction = new LoyaltyTransaction();
    loyaltyTransaction.id = referalStatus.id;
    loyaltyTransaction.loyaltyReferenceId = referalStatus.loyaltyReferenceId;
    loyaltyTransaction.statusCode = updateStatus.statusId;
    const savedLoyalty = await entityManager.save(loyaltyTransaction);
    return savedLoyalty;
  }
  public async cancelLoyaltyTransaction(
    entityManager: EntityManager,
    injector,
    cancelLoyalty
  ): Promise<any> {
    let loyaltyReferenceId = cancelLoyalty.loyaltyReferenceId;
    let customerId = cancelLoyalty.externalCustomerId;
    let organizationId = cancelLoyalty.organizationId;

    let organization = await entityManager.findOne(Organization, {
      where: { id: cancelLoyalty.organizationId },
      select: ["id"]
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }

    if (!customerId) {
      throw new WCoreError(REWARDX_ERRORS.PLEASE_PROVIDE_CUSTOMER_ID);
    }

    // check external customer id should exist in customer table
    let externalCustomer = await findCustomerByExternalCustomerId(
      entityManager,
      customerId,
      organizationId
    );
    if (!externalCustomer) {
      await entityManager.connection.queryResultCache.remove([
        "customer_" + customerId
      ]);
      throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
    }
    if (!loyaltyReferenceId) {
      throw new WCoreError(REWARDX_ERRORS.REFERENCE_ID_NOT_FOUND);
    }

    //code to find to cancelTransaction rules
    let tempCustomer = await entityManager
      .getRepository(CustomerLoyalty)
      .createQueryBuilder("customerLoyalty")
      .leftJoin("customerLoyalty.loyaltyCard", "loyaltyCard")
      .select([
        "customerLoyalty.id",
        "loyaltyCard.id",
        "loyaltyCard.code"
      ])
      .where("customerLoyalty.customer_id =:customerId", { customerId: externalCustomer.id })
      .getOne();

    let input = {
      detailCode: cancelLoyalty.loyaltyType,
      loyaltyCardCode: tempCustomer.loyaltyCard.code,
      organizationId: organizationId
    };
    // const loyaltyProgram: any = await getManager().transaction(manager => {
    //   return injector
    //     .get(LoyaltyProgramProvider)
    //     .getLoyaltyProgramsByCode(manager, injector, input);
    // });

    const loyaltyProgramDetail = await injector
      .get(LoyaltyProgramDetailProvider)
      .getLoyaltyProgramDetailByCodeSpecificFields(entityManager, injector, input);

    input["configId"] = loyaltyProgramDetail.loyaltyProgramConfig.id;

    const loyaltyProgramConfig = await injector
      .get(LoyaltyProgramConfigProvider)
      .getLoyaltyProgramConfigsByIdSpecificFields(entityManager, injector, input);

    if (!loyaltyProgramConfig.cancelTransactionRules.allowCancellation) {
      throw new Error(
        "Cancellation of Transactions is not allowed for this Loyalty Program"
      );
    }

    const transactionObject = await getLoyaltyTransactionByLoyaltyReferenceIdForCancelTransaction(
      entityManager,
      loyaltyReferenceId,
      organizationId
    );

    if (!transactionObject) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_NOT_FOUND);
    }
    if (!(transactionObject == undefined || transactionObject == null)) {
      if (
        transactionObject.statusCode.statusCode === "COMPLETED" &&
        !loyaltyProgramConfig.cancelTransactionRules.allowCancelForCompleted
      ) {
        throw new WCoreError(
          REWARDX_ERRORS.LOYALTY_TRANSACTION_ALREADY_COMPLETED
        );
      }
      if (transactionObject.statusCode.statusCode === "CANCELLED") {
        throw new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_CANCELLED);
      }
    }

    // get all totals related to this transaction and update according to current_date
    const queryRunner = await entityManager.connection.createQueryRunner();
    let transaction_data = await queryRunner.manager.query(
      `select * from loyalty_transaction_data where loyalty_transaction_id = '${transactionObject.id}'`
    );

    let transaction_date = moment(transaction_data[0].date).format(
      "YYYY-MM-DD"
    );

    // update transaction count for both cl and clp
    const { redeemedCount, issuedCount } = await getTransactionCountForCancelling(entityManager, transactionObject);
    let {
      customerLoyaltyTotals,
      current_customerLoyaltyTotals,
      customerLoyalty_isOrderWithin
    } = await customerLoyaltyTotalsForOrderDate(
      queryRunner,
      transactionObject.customerLoyaltyProgram.customerLoyalty.id,
      transaction_date
    );
    // console.log('customerLoyaltyTotals:', customerLoyaltyTotals)
    customerLoyaltyTotals = await getUpdatedLoyaltyTotalsForCancelledLoyaltyTransaction(
      customerLoyalty_isOrderWithin,
      customerLoyaltyTotals,
      transactionObject.pointsIssued
    );
    // console.log('updated customerLoyaltyTotals:', customerLoyaltyTotals)

    customerLoyaltyTotals = await entityManager.save(
      LoyaltyTotals,
      customerLoyaltyTotals
    );

    let {
      customerLoyaltyProgramTotals,
      current_customerLoyaltyProgramTotals,
      customerLoyaltyProgram_isOrderWithin
    } = await customerLoyaltyProgramTotalsForOrderDate(
      queryRunner,
      transactionObject.customerLoyaltyProgram.id,
      transaction_date
    );
    // console.log('customerLoyaltyProgramTotals:', customerLoyaltyProgramTotals)
    customerLoyaltyProgramTotals = await getUpdatedLoyaltyTotalsForCancelledLoyaltyTransaction(
      customerLoyaltyProgram_isOrderWithin,
      customerLoyaltyProgramTotals,
      transactionObject.pointsIssued
    );
    // console.log('updated customerLoyaltyProgramTotals:', customerLoyaltyProgramTotals)

    customerLoyaltyProgramTotals = await entityManager.save(
      LoyaltyTotals,
      customerLoyaltyProgramTotals
    );

    if (transactionObject.store) {
      let storeData = await storeLoyaltyTotalsForOrderDate(
        queryRunner,
        organizationId,
        transactionObject.store.code,
        transactionObject.store.id,
        transaction_date
      );
      let storeTotals = storeData.storeTotals;
      let current_storeTotals = storeData.current_storeTotals;
      let store_isOrderWithin = storeData.store_isOrderWithin;
      // console.log('storeTotals:', storeData)
      storeTotals = await getUpdatedLoyaltyTotalsForCancelledLoyaltyTransaction(
        store_isOrderWithin,
        storeTotals,
        transactionObject.pointsIssued
      );
      storeTotals = await entityManager.save(LoyaltyTotals, storeTotals);
      // console.log('updated store totals', storeTotals);
    }

    //@ts-ignore
    let customerLoyalty =
      transactionObject.customerLoyaltyProgram.customerLoyalty;
    let existingCustomer = customerLoyalty.customer;
    if (
      (existingCustomer && existingCustomer.externalCustomerId) !== customerId
    ) {
      throw new WCoreError(REWARDX_ERRORS.MISMATCH_EXTERNAL_CUSTOMER_ID);
    }
    let ledgerRecords = await this.getLedgerRecordsWithReferenceId(
      entityManager,
      transactionObject.id
    );

    let customerPoints = customerLoyalty.points;
    let customerNegativePoints = customerLoyalty.negativePoints;
    let blockPoints = transactionObject.pointsBlocked;
    for (const index in ledgerRecords) {
      let ledgerRecord = ledgerRecords[index];
      let balanceSnapshotsArray: LoyaltyLedger[] = await this.cancelLedger(
        entityManager,
        ledgerRecord,
        customerPoints,
        customerId,
        injector,
        cancelLoyalty.loyaltyType,
        loyaltyProgramConfig,
        customerLoyalty
      );

      customerPoints =
        balanceSnapshotsArray[balanceSnapshotsArray.length - 1].balanceSnapshot;
    }

    //to get updated customerLoyalty
    customerLoyalty = await entityManager.findOne(CustomerLoyalty, {
      where: { id: transactionObject.customerLoyaltyProgram.customerLoyalty.id }
    });

    if (customerLoyalty) {
      customerLoyalty.redeemedTransactions = redeemedCount > 0 && parseInt(customerLoyalty.redeemedTransactions) >= redeemedCount
        ? parseInt(customerLoyalty.redeemedTransactions) - redeemedCount : customerLoyalty.redeemedTransactions;

      customerLoyalty.issuedTransactions = issuedCount > 0 && parseInt(customerLoyalty.issuedTransactions) >= issuedCount
        ? parseInt(customerLoyalty.issuedTransactions) - issuedCount : customerLoyalty.issuedTransactions;
    }
    let updatedCustomerLoyalty = await this.updateCustomerLoyalty(
      entityManager,
      customerLoyalty,
      customerPoints,
      blockPoints
    );

    await this.updateCustomerLoyaltyProgramTransactionCount(
      entityManager,
      transactionObject.customerLoyaltyProgram.id,
      redeemedCount,
      issuedCount)

    let updateLoyaltyTranasction = await this.updateLoyaltyTranasction(
      entityManager,
      transactionObject
    );
    let updateStatusCode = await this.updateStatusCancelled(
      entityManager,
      transactionObject
    );
    const result = {};
    result["loyaltyReferenceId"] = loyaltyReferenceId;
    result["status"] = LOYALTY_TRANSACTION_STATUS.CANCELLED;
    result["externalCustomerId"] = customerId;
    result["loyaltyReferenceId"] = loyaltyReferenceId;
    result["totalPoints"] = updatedCustomerLoyalty.points;
    result["totalAmount"] = updatedCustomerLoyalty.points;
    sendToWehbookSubscribers(
      entityManager,
      "TRANSACTION_CANCEL",
      result,
      input.organizationId,
      injector
    );
    return result;
  }

  public async cancelLedger(
    entityManager: EntityManager,
    ledgerRecord,
    customerPoints,
    customerId,
    injector,
    loyaltyCode,
    loyaltyProgram,
    customerLoyalty
  ): Promise<any> {
    let currentDate = moment().format("YYYY-MM-DD HH:mm:SS");
    const duplicateledger = entityManager.create(LoyaltyLedger, {
      ...ledgerRecord
    });
    let duplicateLedgerArray = [];
    if (duplicateledger.type === "ISSUE") {
      duplicateledger.id = null;
      duplicateledger.type = "REDUCE";
      let points = duplicateledger.points;
      const reducePointsDetails = await injector
        .get(LoyaltyTransactionRepository)
        .reduceIssuePoints(
          entityManager,
          points,
          customerId,
          injector,
          loyaltyCode,
          customerLoyalty,
          "CANCEL"
        );
      duplicateledger.balanceSnapshot =
        customerPoints - duplicateledger.points < 0
          ? 0
          : customerPoints - duplicateledger.points;
      duplicateledger.pointsRemaining = 0;
      duplicateledger.details = reducePointsDetails;
      duplicateledger.expiryDate = null;
      duplicateledger.remarks = "Payment Revert Order ";
      const saveLoyaltyTransaction = await entityManager.save(duplicateledger);
      duplicateLedgerArray.push(saveLoyaltyTransaction);
      if (customerPoints - duplicateledger.points < 0) {
        customerLoyalty.negativePoints =
          -(customerPoints - duplicateledger.points) +
          customerLoyalty.negativePoints;
        await entityManager.save(customerLoyalty);
      }
      return duplicateLedgerArray;
    } else if (duplicateledger.type === "REDUCE") {
      const details = duplicateledger.details;
      var keys = Object.keys(details);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        const ledger = await entityManager.findOne(LoyaltyLedger, {
          where: { id: key }
        });
        if (key == ledger.id) {
          duplicateledger.id = null;
          duplicateledger.expiryDate = ledger.expiryDate;
          duplicateledger.points = details[key];
          console.log(
            "new Date() ",
            new Date(),
            "ledger.expiryDate ",
            ledger.expiryDate
          );
          if (ledger.expiryDate <= new Date()) {
            duplicateledger.details = null;
            duplicateledger.pointsRemaining = 0;
            duplicateledger.balanceSnapshot = customerPoints;
            duplicateledger.remarks = `Points expired unredeemed points`;
            duplicateledger.type = "EXPIRED";
          } else {
            duplicateledger.type = "ISSUE";
            duplicateledger.remarks = "Payment Revert Order ";
            if (
              loyaltyProgram.cancelTransactionRules.trackNegativePoints &&
              customerLoyalty.negativePoints &&
              customerLoyalty.negativePoints > 0
            ) {
              if (customerPoints == 0) {
                let nPoints = customerLoyalty.negativePoints;
                customerLoyalty.negativePoints =
                  customerLoyalty.negativePoints - details[key];
                if (customerLoyalty.negativePoints < 0) {
                  duplicateledger.balanceSnapshot = -customerLoyalty.negativePoints;
                  duplicateledger.pointsRemaining =
                    duplicateledger.balanceSnapshot;
                  customerLoyalty.negativePoints = 0;
                } else {
                  duplicateledger.balanceSnapshot = 0;
                  duplicateledger.pointsRemaining = 0;
                }
                duplicateledger.details["Negative Points removed"] =
                  nPoints - customerLoyalty.negativePoints;
              } else {
                throw new Error(
                  "Normal points and Negative Points exist simultaneously in CustomerLoyalty."
                );
              }
            } else {
              duplicateledger.details = null;
              duplicateledger.balanceSnapshot = customerPoints + details[key];
              duplicateledger.pointsRemaining = details[key];
              customerPoints += details[key];
              customerLoyalty.points = customerPoints;
            }
            await entityManager.save(customerLoyalty);
          }
        }
        duplicateLedgerArray.push({ ...duplicateledger });
      }
      const ledger = entityManager.create(LoyaltyLedger, duplicateLedgerArray);
      const duplicateLedgerRecord = await entityManager.save(ledger);
      return duplicateLedgerRecord;
    } else if (duplicateledger.type === "BLOCK") {
      duplicateledger.id = null;
      duplicateledger.type = "UNBLOCK";
      const saveLoyaltyTransaction = await entityManager.save(duplicateledger);
      duplicateLedgerArray.push(saveLoyaltyTransaction);
      return duplicateLedgerArray;
    }
  }

  public async getLedgerRecordsWithReferenceId(
    entityManager: EntityManager,
    id: string
  ): Promise<any> {
    const loyaltyLedger = await entityManager.find(LoyaltyLedger, {
      where: { loyaltyTransaction: id },
      order: { type: "DESC" }, //ORDER IS REDUCE, ISSUE, BLOCK
      relations: [
        "loyaltyTransaction",
        "loyaltyTransaction.customerLoyaltyProgram",
        "loyaltyTransaction.customerLoyaltyProgram.customerLoyalty"
      ]
    });
    return loyaltyLedger;
  }

  public async updateLoyaltyTranasction(
    entityManager: EntityManager,
    transactionObject: any
  ): Promise<LoyaltyTransaction> {
    const loyaltyTransaction: any = new LoyaltyTransaction();
    loyaltyTransaction.id = transactionObject.id;
    loyaltyTransaction.loyaltyReferenceId =
      transactionObject.loyaltyReferenceId;
    loyaltyTransaction.pointsBlocked = 0;
    const savedLoyalty = await entityManager.save(loyaltyTransaction);
    return savedLoyalty;
  }


  public async updateCustomerLoyaltyProgramTransactionCount(
    entityManager,
    customerLoyaltyProgramId,
    redeemedCount,
    issuedCount
  ) {
    const customerLoyaltyProgram = await entityManager.findOne(CustomerLoyaltyProgram, {
      where: { id: customerLoyaltyProgramId }
    });

    if (customerLoyaltyProgram) {
      customerLoyaltyProgram.redeemedTransactions = redeemedCount > 0 && parseInt(customerLoyaltyProgram.redeemedTransactions) >= redeemedCount
        ? parseInt(customerLoyaltyProgram.redeemedTransactions) - redeemedCount : customerLoyaltyProgram.redeemedTransactions;

      customerLoyaltyProgram.issuedTransactions = issuedCount > 0 && parseInt(customerLoyaltyProgram.issuedTransactions) >= issuedCount
        ? parseInt(customerLoyaltyProgram.issuedTransactions) - issuedCount : customerLoyaltyProgram.issuedTransactions;

      await entityManager.save(customerLoyaltyProgram);
    }

    return;
  }

  public async updateCustomerLoyalty(
    entityManager: EntityManager,
    customerLoyalty: object,
    points: number,
    blockPoints: number
  ) {
    const customerPointsUpdate = entityManager.create(CustomerLoyalty, {
      ...customerLoyalty
    });
    customerPointsUpdate.points = points;
    customerPointsUpdate.pointsBlocked =
      customerPointsUpdate.pointsBlocked - blockPoints;
    const updatedCustomerLoyalty = await entityManager.save(
      customerPointsUpdate
    );
    return updatedCustomerLoyalty;
  }

  public async updateStatusCancelled(
    entityManager: EntityManager,
    referalStatus: LoyaltyTransaction
  ): Promise<any> {
    const updateStatus = await entityManager.findOne(Status, {
      where: { statusCode: "CANCELLED" }
    });
    if (!updateStatus) {
      throw new WCoreError(REWARDX_ERRORS.STATUS_ID_NOT_FOUND);
    }
    const loyaltyTransaction = new LoyaltyTransaction();
    loyaltyTransaction.id = referalStatus.id;
    loyaltyTransaction.loyaltyReferenceId = referalStatus.loyaltyReferenceId;
    loyaltyTransaction.statusCode = updateStatus.statusId;
    const savedLoyalty = await entityManager.save(loyaltyTransaction);
    return savedLoyalty;
  }

  /* 1. Only referenceId is required. Make it compulsory
           2. Txn entry exists or not with referenceId */
  public async loyaltyTransactionCompleted(
    entityManager: EntityManager,
    injector,
    referenceId,
    organizationId
  ): Promise<any> {
    const loyaltyReferenceId = referenceId;
    const transactionObject = await getLoyaltyTransactionByLoyaltyReferenceId(
      entityManager,
      loyaltyReferenceId,
      organizationId
    );
    if (transactionObject.statusCode.statusCode === "COMPLETED") {
      throw new WCoreError(
        REWARDX_ERRORS.LOYALTY_TRANSACTION_ALREADY_COMPLETED
      );
    }
    if (transactionObject.statusCode.statusCode === "CANCELLED") {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_CANCELLED);
    }
    const updateStatusCode = await this.updateStatus(
      entityManager,
      transactionObject
    );
    console.log("Updated statuscode as completed");
    const result = {};
    result["loyaltyReferenceId"] = loyaltyReferenceId;
    result["statusCode"] = updateStatusCode.statusCode;
    return result;
  }

  public async createLoyaltyTransactionStatusCodes(
    entityManager: EntityManager,
    injector,
    input
  ): Promise<any> {
    let statusCodeCreation = await entityManager.save(Status, {
      statusId: input.statusId,
      statusCode: input.statusCode,
      statusType: input.statusType,
      description: input.description
    });
    return statusCodeCreation;
  }

  /**
   * @param {*} entityManager
   * @param {String} customerLoyaltyId
   * Return Loyalty Transaction Count And Balance of the Customer
   */
  public async getLoyaltyTransactionCountAndBalanceByCustomerLoyaltyId(
    transactionalEntityManager,
    customerLoyaltyProgramId
  ) {
    if (customerLoyaltyProgramId) {
      const loyaltyTransaction = await transactionalEntityManager
        .getRepository(LoyaltyTransaction)
        .createQueryBuilder("loyaltyTransaction")
        .select("SUM(loyaltyTransaction.pointsIssued) as loyaltyBalance")
        .addSelect("COUNT(loyaltyTransaction.id) AS loyaltyTransactionCount")
        .where(
          "loyaltyTransaction.customerLoyaltyProgram=  :customerLoyaltyProgramId",
          {
            customerLoyaltyProgramId: customerLoyaltyProgramId
          }
        )
        .groupBy("loyaltyTransaction.customerLoyaltyProgram")
        .getRawOne();

      return loyaltyTransaction;
    } else {
      return null;
    }
  }

  @addPaginateInfo
  async getPageWiseLoyaltyTransaction(
    entityManager: EntityManager,
    pageOptions: PageOptions,
    sortOptions,
    injector,
    externalCustomerId: string,
    cardCode: string,
    organizationId: string
  ) {
    if (!cardCode) {
      let loyaltyCards = await injector
        .get(LoyaltyCardProvider)
        .getLoyaltyCardsForOrganization(entityManager, organizationId);
      cardCode = loyaltyCards[0].code;

      if (!loyaltyCards) {
        throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
      }
    }
    let customerLoyalty = await validateCustomerLoyalty(
      entityManager,
      injector,
      externalCustomerId,
      cardCode,
      organizationId
    );
    let options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    options.relations = [
      "customerLoyaltyProgram",
      "customerLoyaltyProgram.customerLoyalty",
      "statusCode"
    ];
    options.where = {
      customerLoyalty: customerLoyalty.id
    };
    let loayltyTransaction = await entityManager.findAndCount(
      LoyaltyTransaction,
      options
    );
    return loayltyTransaction;
  }

  public async createOrUpdateLoyaltyTransaction(
    entityManager: EntityManager,
    injector,
    loyaltyTransactionInput
  ): Promise<any> {
    let loyaltyReferenceId = loyaltyTransactionInput.loyaltyReferenceId;
    let externalCustomerId = loyaltyTransactionInput.externalCustomerId;
    let loyaltyCode = loyaltyTransactionInput.loyaltyType;
    let loyaltyTransactionStatus = loyaltyTransactionInput.statusCode;
    let organizationId = loyaltyTransactionInput.organizationId;
    if (!loyaltyReferenceId) {
      throw new WCoreError(REWARDX_ERRORS.REFERENCE_ID_NOT_FOUND);
    }
    if (isEmojiPresent(loyaltyReferenceId)) {
      throw new WCoreError(REWARDX_ERRORS.NOT_VALID_REFERENCE_ID);
    }
    let loyaltyTransaction = await getLoyaltyTransactionByLoyaltyReferenceId(
      entityManager,
      loyaltyReferenceId,
      organizationId
    );
    let status = await getStatusByStatusCode(
      entityManager,
      loyaltyTransactionStatus
    );
    if (!status) {
      await entityManager.connection.queryResultCache.remove([
        "status_" + loyaltyTransactionStatus
      ]);
      throw new WCoreError(REWARDX_ERRORS.STATUS_ID_NOT_FOUND);
    }
    // If loyalty transaction already exits update status code with given input
    let loyaltyTransactionData: any;
    if (loyaltyTransaction) {
      loyaltyTransactionData = await entityManager.findOne(
        LoyaltyTransactionData,
        {
          relations: ["loyaltyTransaction"],
          where: {
            loyaltyTransaction: loyaltyTransaction.id
          }
        }
      );
      let loyaltyTransactionStatusCode = loyaltyTransaction.statusCode;
      if (loyaltyTransactionStatusCode) {
        if (
          loyaltyTransactionStatusCode.statusCode ==
          LOYALTY_TRANSACTION_STATUS.COMPLETED
        ) {
          throw new WCoreError(
            REWARDX_ERRORS.LOYALTY_TRANSACTION_ALREADY_COMPLETED
          );
        } else if (
          loyaltyTransactionStatusCode.statusCode ==
          LOYALTY_TRANSACTION_STATUS.CANCELLED
        ) {
          throw new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_CANCELLED);
        }
      }
      loyaltyTransaction.statusCode = status;
    } else {
      if (!loyaltyTransactionInput.data) {
        throw new WCoreError({
          HTTP_CODE: 400,
          MESSAGE: "Please provide transactionData as data in the input.",
          CODE: "SNF"
        });
      }
      let eventDate = loyaltyTransactionInput.data.date;
      if (eventDate != null && typeof eventDate == "object") {
        eventDate = `${eventDate[0]}-${`${eventDate[1]}`.length == 1 ? `0${eventDate[1]}` : eventDate[1]
          }-${`${eventDate[2]}`.length == 1 ? `0${eventDate[2]}` : eventDate[2]
          } ${eventDate[3] ? (eventDate[3] == 0 ? 12 : eventDate[3]) : 12}:${eventDate[4] ? eventDate[4] : "00"
          }:${eventDate[5] ? eventDate[5] : "00"}`;
      } else {
        eventDate = moment()
          .utcOffset(330)
          .format("YYYY-MM-DD HH:mm:ss");
      }
      const {
        loyalty_program_config,
        loyalty_program_detail
      } = await getLoyaltyProgramDataByExternalCustomerId(
        entityManager,
        injector,
        loyaltyTransactionInput.externalCustomerId,
        organizationId,
        loyaltyTransactionInput.loyaltyType
      );
      let {
        customerLoyalty,
        customerLoyaltyProgram,
        loyaltyCard,
        customer
      } = await getCustomerLoyaltyDataByExternalCustomerId(
        entityManager,
        injector,
        organizationId,
        loyaltyTransactionInput.externalCustomerId,
        loyalty_program_config.loyalty_card_id,
        loyalty_program_config.code,
        loyalty_program_detail.experiment_code
      );

      await validateEnrollmentDate(customerLoyalty.start_date, eventDate, customer.id, loyaltyCard.id);

      if (!loyaltyTransaction) {
        loyaltyTransaction = entityManager.create(LoyaltyTransaction, {
          ...loyaltyTransaction,
          customerLoyaltyProgram: customerLoyaltyProgram.id
        });
        loyaltyTransactionData = entityManager.create(LoyaltyTransactionData, {
          date: eventDate,
          dataInput: JSON.stringify(loyaltyTransactionInput)
        });
      }
      loyaltyTransaction.type = loyaltyCode;
      loyaltyTransaction.loyaltyReferenceId = loyaltyReferenceId;
      loyaltyTransaction.name =
        "Customer with externalCustomerId_" +
        externalCustomerId +
        "_Transaction_" +
        eventDate;
      // To be update based on status code
      loyaltyTransaction.statusCode = status;
      loyaltyTransaction.organization = organizationId;
    }
    let newLoyaltyTransaction = await entityManager.save(loyaltyTransaction);
    loyaltyTransactionData.loyaltyTransaction = newLoyaltyTransaction;
    let newLoyaltyTransactionData = await entityManager.save(
      loyaltyTransactionData
    );
    clearKeysByPattern(`${CACHING_KEYS.LOYALTY_TRANSACTION}_*`);
    return newLoyaltyTransactionData.loyaltyTransaction;
  }

  public async issuePointsWithOrderId(
    entityManager: EntityManager,
    injector,
    loyaltyReferenceId,
    organizationId
  ): Promise<any> {
    if (!loyaltyReferenceId) {
      throw new WCoreError(REWARDX_ERRORS.REFERENCE_ID_NOT_FOUND);
    }
    let existedLoyaltyTransaction = await getLoyaltyTransactionByLoyaltyReferenceId(
      entityManager,
      loyaltyReferenceId,
      organizationId
    );
    if (!existedLoyaltyTransaction) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_NOT_FOUND);
    }
    //@ts-ignore
    let data = existedLoyaltyTransaction.data;
    data["statusCode"] = LOYALTY_TRANSACTION_STATUS.COMPLETED;
    let reuslt = await this.issuePoints(entityManager, injector, data);
    return reuslt;
  }

  public async initiateLoyaltyTransaction(
    entityManager: EntityManager,
    injector,
    loyaltyTransactionInput
  ) {
    let eventType = loyaltyTransactionInput.eventType;
    let loyaltyDate = loyaltyTransactionInput.loyaltyDate;
    let result = await this.statusReducer({ status: "success" });
    return result;
  }

  public async statusReducer(result) {
    return result;
  }

  public async getLoyaltyTransactionStatus(
    entityManager: EntityManager,
    injector,
    loyaltyReferenceId,
    organizationId
  ) {
    if (!loyaltyReferenceId) {
      throw new WCoreError(REWARDX_ERRORS.REFERENCE_ID_NOT_FOUND);
    }
    let loyaltyTransaction = await getLoyaltyTransactionByLoyaltyReferenceId(
      entityManager,
      loyaltyReferenceId,
      organizationId
    );
    if (!loyaltyTransaction) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_NOT_FOUND);
    }
    let statusCode = loyaltyTransaction.statusCode
      ? loyaltyTransaction.statusCode.statusCode
      : "";
    return { status: statusCode };
  }

  public async getTotalEarnedAndBurnedPointsForCustomerLoyalty(
    entityManager: EntityManager,
    loyaltyCardId,
    externalCustomerId,
    organizationId
  ) {
    let totalEarnedPoints;
    let totalBurnedPoints;
    const queryRunner = await entityManager.connection.createQueryRunner();
    const query = `select SUM(lt.points_issued) as totalEarned, SUM(lt.points_redeemed) as totalBurned from
    loyalty_transaction as lt
    inner join customer_loyalty_program as clp on clp.id = lt.customer_loyalty_program_id
    inner join customer_loyalty as cl on cl.id = clp.customer_loyalty_id
    inner join customer as c on c.id = cl.customer_id
    where ( lt.points_issued > 0 OR lt.points_redeemed > 0 )
    and lt.status_code IN ("102", "101")
    and cl.loyalty_card_id = '${loyaltyCardId}'
    and c.externalCustomerId = '${externalCustomerId}'
    and c.organization_id = '${organizationId}';`;
    const result = await queryRunner.manager.query(query);
    totalEarnedPoints = result[0]?.totalEarned || 0;
    totalBurnedPoints = result[0]?.totalBurned || 0;
    return {
      totalEarnedPoints,
      totalBurnedPoints
    };
  }
}
