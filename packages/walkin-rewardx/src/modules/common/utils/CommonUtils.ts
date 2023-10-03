import { Store } from "@walkinserver/walkin-core/src/entity/Store";
import {
  STATUS,
  BUSINESS_RULE_LEVELS,
  CACHING_KEYS,
  CACHE_TTL,
  EXPIRY_MODE
} from "@walkinserver/walkin-core/src/modules/common/constants/constants";
import { Customer, Organization } from "@walkinserver/walkin-core/src/entity";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { Status } from "../../../entity/status";
import {
  LOYALTY_PROGRAM_TYPE,
  SCHEDULE_TIME_SLOT,
  TIME_FORMAT,
  RULE_TYPE
} from "../constants/constant";
import moment = require("moment");
import { BusinessRuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/business_rule.provider";
import { keyBy } from "lodash";
import { getBusinessRuleDetailValues } from "@walkinserver/walkin-core/src/modules/rule/utils/BusinessRuleUtils";
import { CollectionItemsRepository } from "../../collection-items/collection-items.repository";
import { EntityManager } from "typeorm";
import { evaluateRuleSet } from "./RuleUtils";
import { getValueFromCache, setValueToCache } from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
import { WalkinRecordNotFoundError } from "@walkinserver/walkin-core/src/modules/common/exceptions/walkin-platform-error";

/*
 * @param organizationId
 * return organization if exists else throw error
 */
export async function findOrganizationById(entityManager, organizationId) {
  let organization = await entityManager.findOne(Organization, {
    where: { id: organizationId },
    cache: {
      id: "organization_" + organizationId,
      milliseconds: 86400000
    }
  });
  if (!organization || organization == "") {
    // To clear the cahe if no organization  exist
    await entityManager.connection.queryResultCache.remove([
      "organization_" + organizationId
    ]);
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }
  return organization;
}

/*
 * @param externalCustomerId
 * return customer
 */
export async function findCustomerByExternalCustomerId(
  entityManager,
  externalCustomerId,
  organizaitonId
) {
  const key = `${CACHING_KEYS.CUSTOMER}_${organizaitonId}_${externalCustomerId}`;
  let customer: any = await getValueFromCache(key);
  if (!customer) {
    customer = await entityManager.findOne(Customer, {
      where: {
        externalCustomerId: externalCustomerId,
        organization: {
          id: organizaitonId
        }
      },
      // cache: {
      //   id: "customer_" + externalCustomerId,
      //   milliseconds: 86400000
      // }
    });
    if (customer) {
      await setValueToCache(key, customer, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      console.log("Fetched Customer from database and Added to Cache with key: ", key);
    } 
  } else {
    console.log("Fetched Customer from Cache with key :", key);
  }
  return customer;
}

export async function getStoreCodes(transactionalEntityManager, storeCode) {
  let storeCodesList = [];
  let stores = await transactionalEntityManager
    .getRepository(Store)
    .createQueryBuilder("store")
    .select("store.code as storeCode")
    .where("store.STATUS=:storeStatus and store.code=:storeCode", {
      storeStatus: STATUS.ACTIVE,
      storeCode: storeCode
    })
    .cache({
      id: "store_code_" + storeCode,
      milliseconds: 86400000
    })
    .getRawMany();
  if (stores && stores.length > 0) {
    for (let index in stores) {
      storeCodesList.push(stores[index].storeCode);
    }
  }
  return storeCodesList;
}

export async function getStatusByStatusCode(
  transactionalEntityManager,
  statusCodeOrId
) {
  console.log("statusCodeOrId ", statusCodeOrId);
  let status = await transactionalEntityManager.findOne(Status, {
    where: [
      {
        statusCode: statusCodeOrId
      },
      {
        statusId: statusCodeOrId
      }
    ],
    cache: {
      id: "status_" + statusCodeOrId,
      milliseconds: 86400000
    }
  });
  console.log("Status ", status);
  return status;
}

export async function validateRule(entityManager, ruleObj) {
  let rule = "";
  switch (ruleObj.type) {
    case LOYALTY_PROGRAM_TYPE.CASHBACK: {
      rule = ruleObj.value;
      break;
    }
    case LOYALTY_PROGRAM_TYPE.PERCENTAGE_OF_TOTAL_AMOUNT: {
      rule = ruleObj.value / 100 + "*(Loyalty['totalAmount'])";
      break;
    }
    default:
      return null;
  }
  return rule + ":0";
}

export async function getyBusinessRuleDataByKey(
  entityManager,
  injector,
  businessRuleType,
  organizationId
) {
  let result = null;
  let businessRules = await injector
    .get(BusinessRuleProvider)
    .getRules(entityManager, { ruleLevel: BUSINESS_RULE_LEVELS.ORGANIZATION });
  businessRules = await getBusinessRuleDetailValues(
    businessRules,
    organizationId
  );
  if (businessRules && businessRules.length > 0) {
    let businessRuleData = keyBy(businessRules, "ruleType");
    if (businessRuleData && businessRuleData[businessRuleType]) {
      result = businessRuleData[businessRuleType].ruleDefaultValue;
    }
  }
  return result;
}

export async function getLoyaltyTotals_rawQuery(
  transactionalEntityManager: EntityManager,
  whereOptions: Object
) {
  let query = "SELECT * FROM loyalty_totals";
  let i = 0;
  for (const key in whereOptions) {
    const value = whereOptions[`${key}`];
    if (i == 0)
      query += ` WHERE ${key}=${typeof value == "string" ? `'${value}'` : value
        }`;
    else
      query += ` and ${key}=${typeof value == "string" ? `'${value}'` : value}`;
    i++;
  }
  const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
  let loyaltyTotals = await queryRunner.manager.query(query);
  await queryRunner.release();
  return loyaltyTotals;
}

export async function validateProduct(
  entityManager,
  injector,
  queryRunner,
  productsInOrderData,
  loyalty_program_detail,
  allowProductValidation,
  collectionList
) {
  if (allowProductValidation === "TRUE") {
    let productIds = "", productObj = {}, Products: any = [];
    for (let i = 0; i < productsInOrderData.length; i++) {
      let product = await queryRunner.manager.query(
        `SELECT * FROM product WHERE code = '${productsInOrderData[i].productCode}' AND organization_id = '${loyalty_program_detail.organization_id}'`
      );
      if (product.length > 0) {
        productObj[productsInOrderData[i].productCode] = product[0].id;
        product[0]["pricePerQty"] = productsInOrderData[i].pricePerQty;
        product[0]["productType"] = productsInOrderData[i].productType;
        product[0]["quantity"] = productsInOrderData[i].quantity;
        productIds += `${i > 0 ? ", " : ""}"${product[0].id}"`;
        Products.push({ ...product[0] });
      }
    }
    let prodDiffCheck1 =
      Object.keys(productsInOrderData).length - Object.keys(productObj).length;
    if (prodDiffCheck1 != 0) {
      throw new WCoreError({
        HTTP_CODE: 404,
        MESSAGE: `Organization doesn't have ${prodDiffCheck1} Product(s).`,
        CODE: "NVP"
      });
    }
    let productsPartOfLoyaltyProgram = await injector
      .get(CollectionItemsRepository)
      .getCollectionItems_rawQuery(entityManager, {
        item_ids: productIds,
        collections_id: loyalty_program_detail.collection_ids.slice(1, -1)
      });
    if (productsPartOfLoyaltyProgram.length < 1) {
      for (let index in collectionList["dynamicCollections"]) {
        if (collectionList["dynamicCollections"][index].entity == "PRODUCT") {
          for (let index2 in Products) {
            let result = await evaluateDynamicCollections(
              entityManager,
              injector,
              collectionList["dynamicCollections"][index],
              { Product: Products[index2] }
            );
            if (result == true) {
              productsPartOfLoyaltyProgram.push({ ...Products[index2] });
            }
          }
        }
      }
    } else {
      let temp = productsPartOfLoyaltyProgram;
      productsPartOfLoyaltyProgram = [];
      for (let i in temp) {
        for (let j in Products) {
          if (temp[i].item_id == Products[j].id) {
            productsPartOfLoyaltyProgram.push(Products[j]);
          }
        }
      }
    }
    let prodDiffCheck2 =
      Object.keys(productObj).length - productsPartOfLoyaltyProgram.length;
    if (prodDiffCheck2 != 0) {
      throw new WCoreError({
        HTTP_CODE: 404,
        MESSAGE: `${prodDiffCheck2} Product(s) not support by this loyalty program`,
        CODE: "PNSLP"
      });
    } else {
      return productsPartOfLoyaltyProgram;
    }
  } else {
    return null;
  }
}

export async function evaluateDynamicCollections(
  entityManager,
  injector,
  dynamicCollection,
  ruleData
) {
  let entity = dynamicCollection.entity.charAt(0).toUpperCase() + dynamicCollection.entity.slice(1).toLowerCase();
  ruleData[`${entity}`]['extend'] = ruleData[`${entity}`]?.extend ? JSON.parse(ruleData[`${entity}`]?.extend) : ruleData[`${entity}`]?.extend;
  let passCount = 0,
    dynamicCollections = 0;
  if (dynamicCollection != null || dynamicCollection != undefined) {
    dynamicCollections++;
    let res = await evaluateRuleSet(
      entityManager,
      injector,
      dynamicCollection.rule_set_id,
      ruleData
    );
    if (res.status) {
      passCount++;
    }
  }
  if (passCount == dynamicCollections) {
    return true;
  } else {
    throw new WCoreError({
      HTTP_CODE: 404,
      MESSAGE: `${entity.toUpperCase()} Not Supported for this Loyalty Program Detail`,
      CODE: "SnSfLPD"
    });
  }
}

export function isDateWithin(date, timeFrame: "day" | "week" | "month" | "year", compareDate = moment().format('YYYY-MM-DD')) {
  return moment(date).isBetween(moment(compareDate).startOf(timeFrame).format('YYYY-MM-DD'), moment(compareDate).endOf(timeFrame).format('YYYY-MM-DD'), undefined, '[]')
}