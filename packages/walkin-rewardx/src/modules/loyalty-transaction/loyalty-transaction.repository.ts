import { Injectable, Injector } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import {
  BUSINESS_RULE_LEVELS,
  CACHING_KEYS,
  CACHING_PERIOD,
  COMMUNICATION_ENTITY_TYPE,
  EXPIRY_MODE,
  STATUS
} from "@walkinserver/walkin-core/src/modules/common/constants";
import {
  clearKeysByPattern,
  getValueFromCache,
  setValueToCache
} from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
import { CustomerLoyalty, CustomerLoyaltyProgram, LoyaltyProgramDetail, LoyaltyTransaction, LoyaltyTransactionData, Status } from "../../entity";
import { isEmojiPresent, validationDecorator } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";
import { createBurnLedger, createEarnLedger, earnLedgerTransactions } from "../common/utils/LoyaltyLedgerUtils";
import moment from "moment";
import { LOYALTY_ACTION_TYPE, LOYALTY_LEDGER_TYPE, RULE_TYPE, SCHEDULE_TIME_SLOT, TIME_FORMAT } from "../common/constants/constant";
import { ActionUtils } from "../common/utils/ActionUtils";
import { checkBurnBusinessRules, checkEarnBusinessRules, evaluateRuleSet } from "../common/utils/RuleUtils";
import { keyBy } from "lodash";
import { getBusinessRuleDetailValues } from "@walkinserver/walkin-core/src/modules/rule/utils/BusinessRuleUtils";
import { BusinessRuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../common/constants/errors";
import { customerLoyaltyProgramTotalsForOrderDate, customerLoyaltyTotalsForOrderDate, getLoyaltyTransactionByLoyaltyReferenceId, getLoyaltyTransactionByLoyaltyReferenceIdUpdated, getUpdatedLoyaltyTotals, storeLoyaltyTotalsForOrderDate, validateEnrollmentDate } from "../common/utils/CustomerLoyaltyUtils";
import { Communication, Customer, LoyaltyTotals, Organization, Store } from "@walkinserver/walkin-core/src/entity";
import { getLoyaltyProgramDataByExternalCustomerId, getCustomerLoyaltyDataByExternalCustomerId } from "../common/utils/LoyaltyProgramUtils";
import { roundOff } from "../common/utils/MathUtils";
import { evaluateDynamicCollections, validateProduct } from "../common/utils/CommonUtils";
import { CollectionItemsRepository } from "../collection-items/collection-items.repository";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { sendToWehbookSubscribers } from "@walkinserver/walkin-core/src/modules/common/utils/webhookUtils";
import { CommunicationProvider } from "@walkinserver/walkin-core/src/modules/communication/communication.providers";
import { listOutCollectionsOfLoyaltyProgram } from "../common/utils/CollectionItemsUtils";
import { isValidString } from "@walkinserver/walkin-core/src/modules/common/utils/utils";

@Injectable()
export class LoyaltyTransactionRepository {
  public async loyaltyTransactionLoyalty(
    transactionalEntityManager: EntityManager,
    body: any,
    relations: Array<string>
  ): Promise<LoyaltyTransaction> {
    const key = `${CACHING_KEYS.LOYALTY_TRANSACTION}_${body.id}`;
    let loyaltyTransaction: any = await getValueFromCache(key);
    if (!loyaltyTransaction) {
      loyaltyTransaction = await transactionalEntityManager.findOne(
        LoyaltyTransaction,
        {
          where: {
            id: body.id
          },
          relations
        }
      );
    }
    if (loyaltyTransaction) {
      await setValueToCache(
        key,
        loyaltyTransaction,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
    } else {
      loyaltyTransaction = await transactionalEntityManager.create(
        LoyaltyTransaction,
        body
      );
      await setValueToCache(
        key,
        loyaltyTransaction,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
    }
    return loyaltyTransaction;
  }

  public async getLoyaltyTransactionById(
    transactionalEntityManager: EntityManager,
    loyaltyTransactionId: string,
    relations: [string]
  ): Promise<LoyaltyTransaction> {
    const key = `${CACHING_KEYS.LOYALTY_TRANSACTION}_${loyaltyTransactionId}`;
    let loyaltyTransaction: any = await getValueFromCache(key);

    if (!loyaltyTransaction) {
      loyaltyTransaction = await transactionalEntityManager.findOne(
        LoyaltyTransaction,
        {
          where: {
            id: loyaltyTransactionId
          },
          relations
        }
      );

      if (loyaltyTransaction) {
        await setValueToCache(
          key,
          loyaltyTransaction,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
      }
      return loyaltyTransaction;
    }
  }

  public async updateLoyaltyTransactionById(
    transactionalEntityManager: EntityManager,
    loyaltyTransactionId: string,
    body: any
  ): Promise<LoyaltyTransaction> {
    const key = `${CACHING_KEYS.LOYALTY_TRANSACTION}_${loyaltyTransactionId}`;
    let loyaltyTransaction: any = await getValueFromCache(key);

    if (!loyaltyTransaction) {
      loyaltyTransaction = await transactionalEntityManager.findOne(
        LoyaltyTransaction,
        {
          where: {
            id: loyaltyTransactionId
          }
        }
      );
    }

    if (!loyaltyTransaction) return null;

    loyaltyTransaction = await transactionalEntityManager.update(
      LoyaltyTransaction,
      { id: loyaltyTransactionId },
      body
    );

    if (loyaltyTransaction) {
      await setValueToCache(
        key,
        loyaltyTransaction,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
    }
    return loyaltyTransaction;
  }

  public async deleteLoyaltyTransactionById(
    transactionalEntityManager: EntityManager,
    loyaltyTransactionId: string
  ): Promise<boolean> {
    try {
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(
        `delete from loyalty_transaction where id=${loyaltyTransactionId}`
      );
      clearKeysByPattern(`${CACHING_KEYS.LOYALTY_TRANSACTION}_*`);
      await queryRunner.release();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }


  public async issuePoints(
    entityManager: EntityManager,
    injector,
    processLoyaltyIssuance
  ): Promise<Object> {
    let input = JSON.parse(JSON.stringify(processLoyaltyIssuance));
    let organizationId = processLoyaltyIssuance.organizationId;
    Organization.availableById(entityManager, organizationId)

    let burnablePoints = 0;
    let businessRuleData;

    //general flow

    let loyaltyTransaction, loyaltyTransactionData;
    if ("order" in processLoyaltyIssuance.data || processLoyaltyIssuance.loyaltyReferenceId) {
      if (!processLoyaltyIssuance.loyaltyReferenceId)
        throw new WCoreError(REWARDX_ERRORS.REFERENCE_ID_NOT_FOUND)

      if (isEmojiPresent(processLoyaltyIssuance.loyaltyReferenceId)) {
        throw new WCoreError(REWARDX_ERRORS.NOT_VALID_REFERENCE_ID)
      }
      loyaltyTransaction = await getLoyaltyTransactionByLoyaltyReferenceIdUpdated(
        entityManager,
        processLoyaltyIssuance.loyaltyReferenceId,
        organizationId
      );

      if (!(loyaltyTransaction == undefined || loyaltyTransaction == null)) {
        if (loyaltyTransaction.statusCode.statusCode === "COMPLETED") {
          throw new WCoreError(
            REWARDX_ERRORS.LOYALTY_TRANSACTION_ALREADY_COMPLETED
          );
        }
        if (loyaltyTransaction.statusCode.statusCode === "CANCELLED") {
          throw new WCoreError(REWARDX_ERRORS.LOYALTY_TRANSACTION_CANCELLED);
        }
        loyaltyTransactionData = await entityManager.findOne(LoyaltyTransactionData, {
          where: {
            loyaltyTransaction: loyaltyTransaction.id
          }
        })
        if (loyaltyTransactionData) {
          let loyaltyTransactionDataInput = JSON.parse(loyaltyTransactionData.dataInput);
          if (loyaltyTransactionDataInput.externalCustomerId != processLoyaltyIssuance.externalCustomerId) {
            throw new WCoreError(REWARDX_ERRORS.EXTERNAL_CUSTOMER_ID_MISMATCH)
          }
          processLoyaltyIssuance = loyaltyTransactionDataInput
        }
      }
    }

    let eventDate = processLoyaltyIssuance.data.date;
    if (eventDate != null && typeof eventDate == "object") {
      eventDate = `${eventDate[0]}-${`${eventDate[1]}`.length == 1 ? `0${eventDate[1]}` : eventDate[1]}-${`${eventDate[2]}`.length == 1 ? `0${eventDate[2]}` : eventDate[2]} ${eventDate[3] ? (eventDate[3] == 0 ? 12 : eventDate[3]) : 12}:${eventDate[4] ? eventDate[4] : '00'}:${eventDate[5] ? eventDate[5] : '00'}`
    } else {
      eventDate = moment().utcOffset(330).format('YYYY-MM-DD HH:mm:ss')
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
    if (businessRules && businessRules.length > 0) {
      businessRuleData = keyBy(businessRules, "ruleType");
    }

    const {
      loyalty_program_config,
      loyalty_program_detail
    } = await getLoyaltyProgramDataByExternalCustomerId(
      entityManager,
      injector,
      processLoyaltyIssuance.externalCustomerId,
      organizationId,
      processLoyaltyIssuance.loyaltyType
    );

    //for referral
    let referredExternalCustomerId
    if (loyalty_program_config.applicable_events.indexOf("REFERRAL") > 0) {
      if (!processLoyaltyIssuance?.data?.customer?.referredExternalCustomerId)
        throw new WCoreError(REWARDX_ERRORS.REFERRED_EXTERNAL_CUSTOMER_ID_NOT_FOUND)
      if (processLoyaltyIssuance.externalCustomerId == processLoyaltyIssuance?.data?.customer?.referredExternalCustomerId) {
        throw new WCoreError(REWARDX_ERRORS.REFERRER_REFEREE_CAN_NOT_BE_SAME)
      }
      referredExternalCustomerId = processLoyaltyIssuance?.data?.customer?.referredExternalCustomerId

      let referredExternalCustomerData = await entityManager.findOne(Customer, {
        where: {
          externalCustomerId: referredExternalCustomerId,
          organization: organizationId
        }
      })

      if (!referredExternalCustomerData) {
        throw new WCoreError(REWARDX_ERRORS.REFERRED_EXTERNAL_CUSTOMER_NOT_FOUND)
      }
    }

    let {
      customerLoyalty,
      customerLoyaltyProgram,
      loyaltyCard,
      customer
    } = await getCustomerLoyaltyDataByExternalCustomerId(
      entityManager,
      injector,
      organizationId,
      processLoyaltyIssuance.externalCustomerId,
      loyalty_program_config.loyalty_card_id,
      loyalty_program_config.code,
      loyalty_program_detail.experiment_code
    );

    await validateEnrollmentDate(customerLoyalty.start_date, eventDate, customer.id, loyaltyCard.id);

    let collectionList = await listOutCollectionsOfLoyaltyProgram(injector, entityManager, loyalty_program_detail);

    const queryRunner = await entityManager.connection.createQueryRunner();

    let { customerLoyaltyTotals, current_customerLoyaltyTotals, customerLoyalty_isOrderWithin } = await customerLoyaltyTotalsForOrderDate(queryRunner, customerLoyalty.id, eventDate)
    customerLoyalty['customerLoyaltyTotals'] = customerLoyaltyTotals

    let { customerLoyaltyProgramTotals, current_customerLoyaltyProgramTotals, customerLoyaltyProgram_isOrderWithin } = await customerLoyaltyProgramTotalsForOrderDate(queryRunner, customerLoyaltyProgram.id, eventDate);
    customerLoyaltyProgram['customerLoyaltyProgramTotals'] = customerLoyaltyProgramTotals;

    //store flow - START
    let orderData = processLoyaltyIssuance.data.order;
    const storeCode = "store" in processLoyaltyIssuance.data ? processLoyaltyIssuance.data.store.externalStoreId : orderData ? orderData.externalStoreId : null;
    let storeTotals, current_storeTotals, store_isOrderWithin;
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

      let storeData = await storeLoyaltyTotalsForOrderDate(queryRunner, organizationId, storeCode, storeId, eventDate)
      storeTotals = storeData.storeTotals
      current_storeTotals = storeData.current_storeTotals
      store_isOrderWithin = storeData.store_isOrderWithin

      if (!("store" in processLoyaltyIssuance['data'])) processLoyaltyIssuance['data']['store'] = {}
      processLoyaltyIssuance['data']['store']['storeTotals'] = storeTotals
      processLoyaltyIssuance['data']['store'] = {
        ...processLoyaltyIssuance['data']['store'],
        ...store[0],
        extend: store[0].extend ? JSON.parse(store[0].extend) : null
      }
    }
    //store flow - END

    //order flow - START
    if ("order" in processLoyaltyIssuance.data) {
      let validProducts = await validateProduct(
        entityManager,
        injector,
        queryRunner,
        processLoyaltyIssuance.data.order.products,
        loyalty_program_detail,
        businessRuleData.ALLOW_PRODUCT_VALIDATION.ruleDefaultValue.toUpperCase(),
        collectionList
      );

      let totalPrice = 0;

      if (validProducts != null) {
        for (let index in validProducts) {
          let product = validProducts[index];
          totalPrice += parseFloat(product.pricePerQty) * parseInt(product.quantity);
        }
      } else {
        for (let index in processLoyaltyIssuance.data.order.products) {
          let product = processLoyaltyIssuance.data.order.products[index];
          totalPrice += product.pricePerQty * product.quantity;
        }
      }

      processLoyaltyIssuance['data']['order'] = {
        ...processLoyaltyIssuance['data']['order'],
        products: processLoyaltyIssuance['data']['order'].products.map(p => ({ ...p, extend: p.extend ? JSON.parse(p.extend) : null })),
        totalAmount: totalPrice
      }
    }
    //order flow - END

    await queryRunner.release();
    let message = [];
    let earnedPointsExpiryValue = loyalty_program_config.expiry_value;
    let earnedPointsExpiryUnit = loyalty_program_config.expiry_unit;
    let tobeIssuedPoints = 0;
    let maxPointsAllowedToIssue = Infinity;
    burnablePoints = loyaltyTransaction
      ? loyaltyTransaction.pointsRedeemed
      : 0;

    processLoyaltyIssuance['data']['customer'] = processLoyaltyIssuance['data']['customer'] ? processLoyaltyIssuance['data']['customer'] : {};
    let customData = JSON.parse(JSON.stringify(processLoyaltyIssuance['data']));
    delete customData.order
    delete customData.customer
    delete customData.store
    customData['date'] = JSON.parse(moment(eventDate).format('{["year"]:"YYYY",["month"]:"MM",["day"]:"DD",["hour"]:"HH",["minute"]:"mm",["second"]:"ss",["dayName"]:"dddd"}'))
    let ruleData = {
      LOYALTY: processLoyaltyIssuance['data']['order'] ? processLoyaltyIssuance['data']['order'] : {},
      customer: { ...processLoyaltyIssuance['data']['customer'], ...customer, extend: customer.extend ? JSON.parse(customer.extend) : null, customerLoyalty, customerLoyaltyProgram },
      store: processLoyaltyIssuance['data']['store'] ? processLoyaltyIssuance['data']['store'] : {},
      data: customData
    }
    ruleData["LOYALTY"]["totalAmount"] = processLoyaltyIssuance['data']['order'] ? processLoyaltyIssuance['data']['order'].totalAmount - burnablePoints : 0;

    let res = await evaluateRuleSet(
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
        let current_result = res["results"][i]
        try {
          current_result = JSON.parse(current_result)
          if (current_result['maxPointsAllowedToIssueCustomerLoyalty'] || current_result['maxPointsAllowedToIssueCustomerLoyalty'] == 0) {
            maxPointsAllowedToIssue = parseInt(current_result['maxPointsAllowedToIssueCustomerLoyalty'])
            tobeIssuedPoints = Math.min(tobeIssuedPoints, maxPointsAllowedToIssue);
          }
          if (current_result['maxPointsAllowedToIssueCustomerLoyaltyProgram'] || current_result['maxPointsAllowedToIssueCustomerLoyaltyProgram'] == 0) {
            maxPointsAllowedToIssue = parseInt(current_result['maxPointsAllowedToIssueCustomerLoyaltyProgram'])
            tobeIssuedPoints = Math.min(tobeIssuedPoints, maxPointsAllowedToIssue);
          }
          if (current_result['maxPointsAllowedToIssueStore'] || current_result['maxPointsAllowedToIssueStore'] == 0) {
            maxPointsAllowedToIssue = parseInt(current_result['maxPointsAllowedToIssueStore'])
            tobeIssuedPoints = Math.min(tobeIssuedPoints, maxPointsAllowedToIssue);
          }
        } catch (e) { console.log('max points issue: ', e.message) }
      }
    }

    customerLoyaltyTotals = await getUpdatedLoyaltyTotals(eventDate, customerLoyaltyTotals, current_customerLoyaltyTotals, customerLoyalty_isOrderWithin, tobeIssuedPoints)
    customerLoyaltyTotals = await entityManager.save(LoyaltyTotals, customerLoyaltyTotals);

    if (customerLoyalty && tobeIssuedPoints > 0) {
      customerLoyalty.issued_transactions = 'issued_transactions' in customerLoyalty ? parseInt(customerLoyalty.issued_transactions) + 1 : parseInt(customerLoyalty.issuedTransactions) + 1;
    }
    if (!customerLoyalty) {
      customerLoyalty = {
        id: null,
        points: 0,
        pointsBlocked: 0,
        redeemedTransactions: 0,
        issuedTransactions: 0,
        customer: customer.id,
        loyaltyCard: loyalty_program_config.loyalty_card_id,
        negativePoints: 0,
        startDate: moment().format("YYYY-MM-DD"),
        endDate: null,
        status: 'ACTIVE',
        loyaltyTotals: customerLoyaltyTotals
      }
    } else {
      customerLoyalty = {
        id: customerLoyalty.id,
        points: customerLoyalty.points,
        pointsBlocked: customerLoyalty.points_blocked,
        redeemedTransactions: customerLoyalty.redeemed_transactions,
        issuedTransactions: customerLoyalty.issued_transactions,
        customer: customerLoyalty.customer_id,
        loyaltyCard: customerLoyalty.loyalty_card_id,
        negativePoints: customerLoyalty.negative_points,
        startDate: customerLoyalty.start_date,
        endDate: customerLoyalty.end_date,
        status: customerLoyalty.status,
        loyaltyTotals: customerLoyaltyTotals
      }
    }
    customerLoyalty = entityManager.create(CustomerLoyalty, customerLoyalty);
    customerLoyaltyProgramTotals = await getUpdatedLoyaltyTotals(eventDate, customerLoyaltyProgramTotals, current_customerLoyaltyProgramTotals, customerLoyaltyProgram_isOrderWithin, tobeIssuedPoints)
    customerLoyaltyProgramTotals = await entityManager.save(LoyaltyTotals, customerLoyaltyProgramTotals);

    let issuedTransactions;
    if (customerLoyaltyProgram) {
      if (tobeIssuedPoints > 0) {
        issuedTransactions = 'issued_transactions' in customerLoyaltyProgram ? parseInt(customerLoyaltyProgram.issued_transactions) + 1 : parseInt(customerLoyaltyProgram.issuedTransactions) + 1;
        customerLoyaltyProgram = {
          ...customerLoyaltyProgram,
          issuedTransactions
        }
      }
      customerLoyaltyProgram = {
        ...customerLoyaltyProgram,
        loyaltyTotals: customerLoyaltyProgramTotals
      }
    } else {
      issuedTransactions = 0
      customerLoyaltyProgram = {
        id: null,
        createdBy: 'defaultuser',
        lastModifiedBy: 'defaultuser',
        loyaltyProgramCode: loyalty_program_config.code,
        loyaltyExperimentCode: loyalty_program_detail.experiment_code,
        redeemedTransactions: 0,
        issuedTransactions: 0,
        customerLoyalty: customerLoyalty.id,
        status: 'ACTIVE',
        loyaltyTotals: customerLoyaltyProgramTotals
      }
    }
    await entityManager.save(CustomerLoyaltyProgram,
      customerLoyaltyProgram
    );

    if (loyaltyTransaction) {
      burnablePoints = loyaltyTransaction
        ? loyaltyTransaction.pointsRedeemed
        : 0;
    }

    if (!loyaltyTransaction) {
      loyaltyTransaction = entityManager.create(LoyaltyTransaction, {
        ...loyaltyTransaction
      });
    }

    loyaltyTransaction.organization = organizationId;
    loyaltyTransaction.type = loyalty_program_detail.experiment_code;
    loyaltyTransaction.loyaltyReferenceId = processLoyaltyIssuance.loyaltyReferenceId;
    loyaltyTransaction.customerLoyaltyProgram = customerLoyaltyProgram;
    loyaltyTransaction.pointsIssued = loyaltyTransaction.pointsIssued
      ? loyaltyTransaction.pointsIssued + tobeIssuedPoints
      : tobeIssuedPoints;
    loyaltyTransaction.name =
      "Customer with externalCustomerId_" +
      processLoyaltyIssuance.externalCustomerId +
      "_Transaction_" +
      moment().format("YYYY-MM-DD");
    if (processLoyaltyIssuance.statusCode) {
      let statusCode = await entityManager.findOne(Status, {
        where: [
          {
            statusCode: processLoyaltyIssuance.statusCode
          },
          {
            statusId: processLoyaltyIssuance.statusCode
          }
        ]
      });
      // To be update based on status code
      loyaltyTransaction.statusCode = statusCode;
    }
    loyaltyTransaction.store = processLoyaltyIssuance['data']['store']?.id;
    let savedLoyaltyTransaction;
    if (!loyaltyTransactionData) {
      savedLoyaltyTransaction = await entityManager.save(loyaltyTransaction);
      loyaltyTransactionData = entityManager.create(
        LoyaltyTransactionData,
        {
          date: eventDate,
          dataInput: JSON.stringify(input),
          loyaltyTransaction: savedLoyaltyTransaction
        }
      );
    } else {
      loyaltyTransaction.statusCode = await entityManager.findOne(Status, {
        where: { statusId: 102 }
      });
      savedLoyaltyTransaction = await entityManager.save(loyaltyTransaction);
      loyaltyTransactionData.loayltyTransaction = savedLoyaltyTransaction;
    }

    await entityManager.save(loyaltyTransactionData);
    if (referredExternalCustomerId) {
      savedLoyaltyTransaction["referredExternalCustomerId"] = referredExternalCustomerId
    }

    let expiryDate = moment()
      .add(
        parseInt(earnedPointsExpiryValue),
        earnedPointsExpiryUnit.toLowerCase()
      )
      .format("YYYY-MM-DD HH:mm:ss");

    if (tobeIssuedPoints > 0) {
      await createEarnLedger(
        entityManager,
        injector,
        tobeIssuedPoints,
        savedLoyaltyTransaction,
        customerLoyalty,
        expiryDate,
        JSON.parse(loyalty_program_config.cancel_transaction_rules)
      );
    }
    if (storeTotals) {
      storeTotals = await getUpdatedLoyaltyTotals(eventDate, storeTotals, current_storeTotals, store_isOrderWithin, tobeIssuedPoints)
      storeTotals = await entityManager.save(LoyaltyTotals, storeTotals);
      await entityManager.update(Store, { code: storeCode }, { loyaltyTotals: storeTotals.id })
    }
    let result = {};
    result["loyaltyCardCode"] = loyaltyCard.code;
    result["loyaltyReferenceId"] = processLoyaltyIssuance.loyaltyReferenceId;
    result["earnedPoints"] = tobeIssuedPoints;
    result["earnedAmount"] = tobeIssuedPoints;
    result["burnedPoints"] = burnablePoints;
    result["burnedAmount"] = burnablePoints;
    result["earnedPointsExpiryValue"] = earnedPointsExpiryValue;
    result["earnedPointsExpiryUnit"] = earnedPointsExpiryUnit;
    result["blockedPoints"] = 0;
    result["externalCustomerId"] = processLoyaltyIssuance.externalCustomerId;
    result["id"] = loyaltyTransaction.id;
    result["status"] = loyaltyTransaction.statusCode
      ? loyaltyTransaction.statusCode.statusCode
      : "";
    result["message"] = message
    // this.getCommunication(loyaltyProgramId);
    // To send sms only if issue points greater than 0
    if (tobeIssuedPoints > 0) {
      this.sendCommunication(
        entityManager,
        injector,
        loyalty_program_detail.id,
        loyalty_program_config.campaign_id,
        LOYALTY_LEDGER_TYPE.ISSUE,
        customer,
        {
          points: tobeIssuedPoints,
          expiryTime: `${earnedPointsExpiryValue} ${earnedPointsExpiryUnit.toLowerCase()}${parseInt(earnedPointsExpiryValue) > 1 ? "s" : ""}`,
          name: isValidString(customer.firstName) ? customer.firstName + (isValidString(customer.lastName) ? ` ${customer.lastName}` : "") : 'customer'
        },
        businessRuleData
      );
      sendToWehbookSubscribers(
        entityManager,
        "ON_ISSUE",
        result,
        organizationId,
        injector
      );
    }
    clearKeysByPattern(`${CACHING_KEYS.LOYALTY_TRANSACTION}_*`);
    clearKeysByPattern(`${CACHING_KEYS.CUSTOMER_LOYALTY}_*`);
    clearKeysByPattern(`${CACHING_KEYS.CUSTOMER_LOYALTY_PROGRAM}_*`);
    return result;
  }

  public async burnPoints(
    entityManager: EntityManager,
    injector,
    processLoyaltyRedemption
  ): Promise<Object> {
    let input = JSON.parse(JSON.stringify(processLoyaltyRedemption));
    let organizationId = processLoyaltyRedemption.organizationId;
    Organization.availableById(entityManager, organizationId)

    let loyaltyTransaction;
    if ("order" in processLoyaltyRedemption.data || processLoyaltyRedemption.loyaltyReferenceId) {
      if (!processLoyaltyRedemption.loyaltyReferenceId)
        throw new WCoreError(REWARDX_ERRORS.REFERENCE_ID_NOT_FOUND)

      if (isEmojiPresent(processLoyaltyRedemption.loyaltyReferenceId)) {
        throw new WCoreError(REWARDX_ERRORS.NOT_VALID_REFERENCE_ID)
      }
      let loyaltyTransaction = await getLoyaltyTransactionByLoyaltyReferenceIdUpdated(
        entityManager,
        processLoyaltyRedemption.loyaltyReferenceId,
        organizationId
      );

      if (!(loyaltyTransaction == undefined || loyaltyTransaction == null)) {
        throw new WCoreError(
          REWARDX_ERRORS.LOYALTY_TRANSACTION_ALREADY_EXISTS
        );
      }
    }

    let pointsToRedeem = await roundOff(
      processLoyaltyRedemption.pointsToRedeem
    );
    let experiment_code = processLoyaltyRedemption.loyaltyType;

    let eventDate = processLoyaltyRedemption.data.date;
    if (eventDate != null && typeof eventDate == "object") {
      eventDate = `${eventDate[0]}-${`${eventDate[1]}`.length == 1 ? `0${eventDate[1]}` : eventDate[1]}-${`${eventDate[2]}`.length == 1 ? `0${eventDate[2]}` : eventDate[2]} ${eventDate[3] ? (eventDate[3] == 0 ? 12 : eventDate[3]) : 12}:${eventDate[4] ? eventDate[4] : '00'}:${eventDate[5] ? eventDate[5] : '00'}`
    } else {
      eventDate = moment().utcOffset(330).format('YYYY-MM-DD HH:mm:ss')
    }

    let businessRuleData;
    let businessRules = await injector
      .get(BusinessRuleProvider)
      .getRules(entityManager, {
        ruleLevel: BUSINESS_RULE_LEVELS.ORGANIZATION
      });
    businessRules = await getBusinessRuleDetailValues(
      businessRules,
      organizationId
    );
    if (businessRules && businessRules.length > 0) {
      businessRuleData = keyBy(businessRules, "ruleType");
    }

    const {
      loyalty_program_config,
      loyalty_program_detail
    } = await getLoyaltyProgramDataByExternalCustomerId(
      entityManager,
      injector,
      processLoyaltyRedemption.externalCustomerId,
      organizationId,
      experiment_code
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
      processLoyaltyRedemption.externalCustomerId,
      loyalty_program_config.loyalty_card_id,
      loyalty_program_config.code,
      loyalty_program_detail.experiment_code
    );

    await validateEnrollmentDate(customerLoyalty.start_date, eventDate, customer.id, loyaltyCard.id);

    let collectionList = await listOutCollectionsOfLoyaltyProgram(injector, entityManager, loyalty_program_detail);

    const queryRunner = await entityManager.connection.createQueryRunner();

    //store flow - START
    let orderData = processLoyaltyRedemption.data.order;
    const storeCode = "store" in processLoyaltyRedemption.data ? processLoyaltyRedemption.data.store.externalStoreId : orderData ? orderData.externalStoreId : null;

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
      let { storeTotals } = await storeLoyaltyTotalsForOrderDate(queryRunner, organizationId, storeCode, storeId, eventDate)
      if (!("store" in processLoyaltyRedemption['data'])) processLoyaltyRedemption['data']['store'] = {}
      processLoyaltyRedemption['data']['store']['storeTotals'] = storeTotals
      processLoyaltyRedemption['data']['store'] = {
        ...processLoyaltyRedemption['data']['store'],
        ...store[0],
        extend: store[0].extend ? JSON.parse(store[0].extend) : null
      }
    }
    //store flow - END

    if ("order" in processLoyaltyRedemption.data) {
      let validProducts = await validateProduct(
        entityManager,
        injector,
        queryRunner,
        processLoyaltyRedemption.data.order.products,
        loyalty_program_detail,
        businessRuleData.ALLOW_PRODUCT_VALIDATION.ruleDefaultValue.toUpperCase(),
        collectionList
      );

      let totalPrice = 0;

      if (validProducts != null) {
        for (let index in validProducts) {
          let product = validProducts[index];
          totalPrice += parseFloat(product.pricePerQty) * parseInt(product.quantity);
        }
      } else {
        for (let index in processLoyaltyRedemption.data.order.products) {
          let product = processLoyaltyRedemption.data.order.products[index];
          totalPrice += product.pricePerQty * product.quantity;
        }
      }

      processLoyaltyRedemption['data']['order'] = {
        ...processLoyaltyRedemption['data']['order'],
        products: processLoyaltyRedemption['data']['order'].products.map(p => ({ ...p, extend: p.extend ? JSON.parse(p.extend) : null })),
        totalAmount: totalPrice
      }
    }
    processLoyaltyRedemption['data']['customer'] = processLoyaltyRedemption['data']['customer'] ? processLoyaltyRedemption['data']['customer'] : {};
    let customData = JSON.parse(JSON.stringify(processLoyaltyRedemption['data']));
    delete customData.order
    delete customData.customer
    delete customData.store
    customData['date'] = JSON.parse(moment(eventDate).format('{["year"]:"YYYY",["month"]:"MM",["day"]:"DD",["hour"]:"HH",["minute"]:"mm",["second"]:"ss",["dayName"]:"dddd"}'))
    let ruleData = {
      LOYALTY: processLoyaltyRedemption['data']['order'] ? processLoyaltyRedemption['data']['order'] : {},
      customer: { ...processLoyaltyRedemption['data']['customer'], ...customer, extend: customer.extend ? JSON.parse(customer.extend) : null, customerLoyalty },
      store: processLoyaltyRedemption['data']['store'] ? processLoyaltyRedemption['data']['store'] : {},
      data: customData
    }

    let message = [];
    let burnablePoints = 0;
    let res = await evaluateRuleSet(
      entityManager,
      injector,
      loyalty_program_config.loyalty_burn_rule_set_id,
      ruleData
    );
    if (!res["status"]) {
      message.push(`BURN: ${res["message"]}`);
      burnablePoints = 0;
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
    if (pointsToRedeem)
      burnablePoints = Math.min(burnablePoints, pointsToRedeem);
    if (burnablePoints > customerLoyalty.points) {
      throw new WCoreError(REWARDX_ERRORS.INSUFFICIENT_BALANCE);
    }

    // burnablePoints is also 0 when any conditions fails, message will have some value
    if (customerLoyalty && burnablePoints > 0) {
      customerLoyalty.redeemed_transactions = 'redeemed_transactions' in customerLoyalty ? parseInt(customerLoyalty.redeemed_transactions) + 1 : parseInt(customerLoyalty.redeemedTransactions) + 1;
    }

    customerLoyalty = entityManager.create(CustomerLoyalty, {
      id: customerLoyalty.id,
      points: customerLoyalty.points,
      pointsBlocked: customerLoyalty.points_blocked,
      redeemedTransactions: customerLoyalty.redeemed_transactions,
      issuedTransactions: customerLoyalty.issued_transactions,
      customer: customerLoyalty.customer_id,
      loyaltyCard: customerLoyalty.loyalty_card_id,
      negativePoints: customerLoyalty.negative_points,
      startDate: customerLoyalty.start_date,
      endDate: customerLoyalty.end_date,
      status: customerLoyalty.status,
      loyaltyTotals: customerLoyalty.loyalty_totals
    });

    let redeemedTransactions;
    if (customerLoyaltyProgram && burnablePoints > 0) {
      redeemedTransactions = 'redeemed_transactions' in customerLoyaltyProgram ? parseInt(customerLoyaltyProgram.redeemed_transactions) + 1 : parseInt(customerLoyaltyProgram.redeemedTransactions) + 1;
      customerLoyaltyProgram = {
        ...customerLoyaltyProgram,
        redeemedTransactions
      }
      await entityManager.save(CustomerLoyaltyProgram,
        customerLoyaltyProgram
      );
    }

    let reduceDetails = await this.reduceIssuePoints(
      entityManager,
      burnablePoints,
      processLoyaltyRedemption.externalCustomerId,
      injector,
      loyalty_program_config.cancel_transaction_rules,
      customerLoyalty,
      null
    );
    if (!loyaltyTransaction) {
      loyaltyTransaction = entityManager.create(LoyaltyTransaction, {
        ...loyaltyTransaction
      });
    }
    loyaltyTransaction.organization = organizationId;
    loyaltyTransaction.type = loyalty_program_detail.experiment_code;
    loyaltyTransaction.loyaltyReferenceId = processLoyaltyRedemption.loyaltyReferenceId;
    loyaltyTransaction.customerLoyaltyProgram = customerLoyaltyProgram;
    loyaltyTransaction.name =
      "Customer with externalCustomerId_" +
      processLoyaltyRedemption.externalCustomerId +
      "_Transaction_" +
      moment().format("YYYY-MM-DD");
    console.log(
      "processLoyaltyRedemption.statusCode",
      processLoyaltyRedemption.statusCode
    );
    if (processLoyaltyRedemption.statusCode) {
      let statusCode = await entityManager.findOne(Status, {
        where: {
          statusId: processLoyaltyRedemption.statusCode
        }
      });
      // To be update based on status code
      loyaltyTransaction.statusCode = statusCode;
    }
    loyaltyTransaction.pointsRedeemed =
      (loyaltyTransaction.pointsRedeemed
        ? loyaltyTransaction.pointsRedeemed
        : 0) + burnablePoints;
    loyaltyTransaction.store = processLoyaltyRedemption['data']['store']?.id;
    let savedLoyaltyTransaction = await entityManager.save(
      loyaltyTransaction
    );
    let loyaltyTransactionData = entityManager.create(
      LoyaltyTransactionData,
      {
        date: savedLoyaltyTransaction.createdTime,
        dataInput: JSON.stringify(processLoyaltyRedemption),
        loyaltyTransaction: savedLoyaltyTransaction
      }
    );
    await entityManager.save(loyaltyTransactionData);

    let burnLedger = await createBurnLedger(
      entityManager,
      burnablePoints,
      savedLoyaltyTransaction,
      customerLoyalty,
      reduceDetails
    );
    let result = {};
    result["loyaltyReferenceId"] = processLoyaltyRedemption.loyaltyReferenceId;
    result["burnedPoints"] = burnablePoints;
    result["burnedAmount"] = burnablePoints;
    result["blockedPoints"] = 0;
    result["externalCustomerId"] = processLoyaltyRedemption.externalCustomerId;
    result["id"] = loyaltyTransaction.id;
    result["status"] = loyaltyTransaction.statusCode
      ? loyaltyTransaction.statusCode.statusCode
      : "";
    result["message"] = message
    this.sendCommunication(
      entityManager,
      injector,
      loyalty_program_detail.id,
      loyalty_program_config.campaign_id,
      LOYALTY_LEDGER_TYPE.REDUCE,
      customer,
      {
        points: burnablePoints,
        name: isValidString(customer.firstName) ? customer.firstName + (isValidString(customer.lastName) ? ` ${customer.lastName}` : "") : 'customer',
        balancePoints: customerLoyalty.points
      },
      businessRuleData
    );
    clearKeysByPattern(`${CACHING_KEYS.LOYALTY_TRANSACTION}_*`);
    clearKeysByPattern(`${CACHING_KEYS.CUSTOMER_LOYALTY}_*`);
    clearKeysByPattern(`${CACHING_KEYS.CUSTOMER_LOYALTY_PROGRAM}_*`);
    return result;
  }

  /*
   * @param burnablePoints
   * @param externalCustomerId
   * Used to reduce points from issued while burning
   */
  public async reduceIssuePoints(
    entityManager,
    burnablePoints,
    externalCustomerId,
    injector,
    cancelTransactionRules,
    customerLoyalty,
    type = null
  ) {
    let result = {};
    let currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    // Get All Earn ledger transactions
    let earnedLedgerTransactions = await earnLedgerTransactions(
      entityManager,
      customerLoyalty.id,
      currentDate
    );
    let toBeBurnPoints = burnablePoints;

    if (
      type == "CANCEL" &&
      earnedLedgerTransactions.length == 0 &&
      cancelTransactionRules.trackNegativePoints
    ) {
      let currentNegativePoints = customerLoyalty.negativePoints
        ? customerLoyalty.negativePoints
        : 0;
      customerLoyalty.negativePoints = toBeBurnPoints + currentNegativePoints;
      // await entityManager.update(
      //   CustomerLoyalty,
      //   { id: customerLoyalty.id },
      //   { negativePoints: toBeBurnPoints + currentNegativePoints }
      // );
      result["Neagtive Points Added"] = toBeBurnPoints;
      return result;
    }

    for (let index = 0; index < earnedLedgerTransactions.length; index++) {
      if (earnedLedgerTransactions[index] && toBeBurnPoints > 0) {
        let pointsRemaining = earnedLedgerTransactions[index].pointsRemaining;
        if (pointsRemaining > toBeBurnPoints) {
          earnedLedgerTransactions[index].pointsRemaining =
            pointsRemaining - toBeBurnPoints;
          result[earnedLedgerTransactions[index].id] = toBeBurnPoints;
          toBeBurnPoints = 0;
        } else {
          toBeBurnPoints = toBeBurnPoints - pointsRemaining;
          result[earnedLedgerTransactions[index].id] = pointsRemaining;
          earnedLedgerTransactions[index].pointsRemaining = 0;
        }
        let updatedLoyaltyLedger = await entityManager.save(
          earnedLedgerTransactions[index]
        );
      }
    }
    //incase toBeBurnPoints > points that the customer has
    if (
      type == "CANCEL" &&
      toBeBurnPoints > 0 &&
      cancelTransactionRules.trackNegativePoints
    ) {
      customerLoyalty.negativePoints = toBeBurnPoints;
      // await entityManager.update(
      //   CustomerLoyalty,
      //   { id: customerLoyalty.id },
      //   { negativePoints: toBeBurnPoints }
      // );
      result["Neagtive Points Added"] = toBeBurnPoints;
    }
    return result;
  }

  async sendCommunication(
    entityManager: EntityManager,
    injector: Injector,
    loyaltyProgramID,
    campaignId,
    transactionType,
    customerData,
    replacableData,
    businessRuleData
  ) {
    try {
      const communication = await entityManager
        .getRepository(Communication)
        .createQueryBuilder("communication")
        .select([
          "communication.id",
          "communication.commsChannelName",
          "messageTemplate.id",
          "messageTemplate.templateBodyText",
          "messageTemplate.messageFormat",
          "messageTemplate.externalTemplateId",
          "messageTemplate.templateSubjectText",
          "messageTemplate.templateStyle"
        ])
        .innerJoin("communication.messageTemplate", "messageTemplate")
        .where(
          `communication.entityType='${COMMUNICATION_ENTITY_TYPE.LOYALTY}' and communication.entityId=${loyaltyProgramID} and messageTemplate.name like'%${transactionType}%'`
        )
        .getMany();

      if (communication && communication.length > 0) {
        let scheduledHour, scheduledTime, scheduledDateTime;
        // To consider scheduled time based on business rules
        if (
          businessRuleData &&
          businessRuleData[RULE_TYPE.LOYALTY_SCHEDULED_DATE_TIME]
        ) {
          let scheduledHourTime =
            businessRuleData[RULE_TYPE.LOYALTY_SCHEDULED_DATE_TIME]
              .ruleDefaultValue;
          scheduledHour = scheduledHourTime.split(":")[0];
          scheduledTime = scheduledHourTime.split(":")[1];
        }

        let utcTime = moment()
          .utcOffset(330)
          .format("HH:mm:ss");
        let currentTime = moment(utcTime, TIME_FORMAT.HH_MM_SS);
        let nightInTime = moment(
          SCHEDULE_TIME_SLOT.NIGHT_IN_TIME,
          TIME_FORMAT.HH_MM_SS
        );
        let nightOutTime = moment(
          SCHEDULE_TIME_SLOT.NIGHT_OUT_TIME,
          TIME_FORMAT.HH_MM_SS
        );
        let mornInTime = moment(
          SCHEDULE_TIME_SLOT.MORN_IN_TIME,
          TIME_FORMAT.HH_MM_SS
        );
        let mornOutTime = moment(
          SCHEDULE_TIME_SLOT.MORN_OUT_TIME,
          TIME_FORMAT.HH_MM_SS
        );
        // To configure sms based on scheduled time
        if (currentTime.isBetween(nightInTime, nightOutTime)) {
          scheduledDateTime = moment()
            .add(parseInt(process.env.SMS_SCHEDULE_DAY), "days")
            .set({ h: scheduledHour, m: scheduledTime });
        } else if (currentTime.isBetween(mornInTime, mornOutTime)) {
          scheduledDateTime = moment().set({
            h: scheduledHour,
            m: scheduledTime
          });
        }
        // To send communication according to messageTemplate
        for (let i = 0; i < communication.length; i++) {
          // replacableData --> { points: 100, expiryTime: '90 days'| balancePoints: 100, name: 'Pratik Mate' }
          let messageBody: string = communication[i].messageTemplate.templateBodyText;
          for (var key in replacableData) {
            messageBody = messageBody.replace(
              `{{${key}}}`,
              replacableData[key]
            );
          }

          if (communication[i].messageTemplate.messageFormat === "SMS") {
            injector.get(CommunicationProvider).sendSMS(
              customerData.phoneNumber,
              messageBody,
              customerData.id,
              communication[i].commsChannelName,
              process.env.COMMS_LOYALTY_CONSUMER_NAME,
              scheduledDateTime,
              communication[i].messageTemplate.externalTemplateId
            );
          }
          else if (communication[i].messageTemplate.messageFormat === "EMAIL") {
            injector.get(CommunicationProvider).sendEmail(
              customerData.email,
              messageBody,
              customerData.id,
              communication[i].messageTemplate.templateSubjectText,
              process.env.COMMS_LOYALTY_CONSUMER_NAME,
              communication[i].messageTemplate.templateStyle,
              communication[i].messageTemplate.externalTemplateId
            );
          }
        }

        return communication;
      }
      return null;
    } catch (err) {
      throw err;
    }
  }
}
