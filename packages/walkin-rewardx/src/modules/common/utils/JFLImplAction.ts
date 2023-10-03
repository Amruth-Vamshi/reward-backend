import { includes } from "lodash";
import { ActionDataInput } from "./ActionUtils";
import { roundOff } from "./MathUtils";
import {
  RULE_TYPE,
  ORDER_CHANNEL,
  ORDER_TYPE,
  LOYALTY_TRANSACTION_STATUS
} from "../constants/constant";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../constants/errors";

export async function burnAmountCalc(actionData: ActionDataInput) {
  let {
    orderExtraData,
    store,
    loyaltyTransaction,
    businessRules,
    storeCode
  } = actionData;
  let isTransactionLimitRequired =
    orderExtraData.isTransactionLimitRequired == undefined ||
    orderExtraData.isTransactionLimitRequired
      ? true
      : false;
  let burnAmount = 0;
  let transactionOrderChannel =
    businessRules[ORDER_CHANNEL.LOYALTY_TRANSACTION_BURN_ORDER_CHANNEL];
  let transactionOrderType =
    businessRules[ORDER_TYPE.LOYALTY_TRANSACTION_BURN_ORDER_TYPE];

  let transactionOrderChannels = transactionOrderChannel
    ? JSON.parse(transactionOrderChannel.ruleDefaultValue)
    : null;
  let transactionOrderTypes = transactionOrderType
    ? JSON.parse(transactionOrderType.ruleDefaultValue)
    : null;

  // if (
  //   (orderExtraData.order.couponCode &&
  //     orderExtraData.order.couponCode.length > 0) ||
  //   !orderExtraData.order.externalStoreId ||
  //   !includes(store, orderExtraData.order.externalStoreId.toUpperCase())
  // ) {
  //   return burnAmount;
  // }
  if (!storeCode) {
    return burnAmount;
  }
  if (
    (transactionOrderChannel && !orderExtraData.order.orderChannel) ||
    !includes(
      transactionOrderChannels,
      orderExtraData.order.orderChannel.toUpperCase()
    ) ||
    ((transactionOrderType && !orderExtraData.order.orderType) ||
      !includes(
        transactionOrderTypes,
        orderExtraData.order.orderType.toUpperCase()
      ))
  ) {
    return burnAmount;
  }
  const {
    order: { products }
  } = orderExtraData;
  products.sort(function(a, b) {
    return (
      parseFloat(b.pricePerQty) * parseFloat(b.quantity) -
      parseFloat(a.pricePerQty) * parseFloat(a.quantity)
    );
  });
  for (let index in products) {
    let product = products[index];
    if (
      !product.productType ||
      //product.productType.toUpperCase() === "PIZZA-MANIA" ||
      //product.productType.toUpperCase() === "SIDECOMBOS" ||
      product.isEDVOApplied === true
    ) {
      continue;
    }
    let totalPrice = product.pricePerQty * product.quantity;
    if (totalPrice > 0) {
      burnAmount = burnAmount + totalPrice * (10 / 100);
      burnAmount = await roundOff(burnAmount);
    }
  }
  try {
    let burnBusinessRule =
      businessRules[RULE_TYPE.LOYALTY_TRANSACTION_BURN_LIMIT];
    if (burnBusinessRule && isTransactionLimitRequired) {
      let maxBurnedAmount = burnBusinessRule.ruleDefaultValue;
      burnAmount = Math.min(burnAmount, maxBurnedAmount);
    }
  } catch (err) {
    console.log("No Business rule defined for Loyalty burn");
  }
  return burnAmount;
  // }
}

export async function earnAmountCalc(actionData: ActionDataInput) {
  let {
    orderExtraData,
    store,
    loyaltyTransaction,
    businessRules,
    transactionData,
    storeCode
  } = actionData;
  let isTransactionLimitRequired =
    orderExtraData.isTransactionLimitRequired == undefined ||
    orderExtraData.isTransactionLimitRequired
      ? true
      : false;
  let burnAmt = transactionData.burnAmt ? transactionData.burnAmt : 0;
  let burnedAmount = parseFloat(burnAmt);
  let earnAmount = 0;
  let transactionOrderChannel =
    businessRules[ORDER_CHANNEL.LOYALTY_TRANSACTION_EARN_ORDER_CHANNEL];
  let transactionOrderType =
    businessRules[ORDER_TYPE.LOYALTY_TRANSACTION_EARN_ORDER_TYPE];
  let transactionOrderChannels = transactionOrderChannel
    ? JSON.parse(transactionOrderChannel.ruleDefaultValue)
    : null;
  let transactionOrderTypes = transactionOrderType
    ? JSON.parse(transactionOrderType.ruleDefaultValue)
    : null;
  // if (
  //   !orderExtraData.order.externalStoreId ||
  //   !includes(store, orderExtraData.order.externalStoreId.toUpperCase())
  // ) {
  //   // console.log("orderExtraData.order.couponCode ", orderExtraData.order.couponCode);
  //   return earnAmount;
  // }
  if (!storeCode) {
    return earnAmount;
  }
  if (
    (transactionOrderChannel && !orderExtraData.order.orderChannel) ||
    !includes(
      transactionOrderChannels,
      orderExtraData.order.orderChannel.toUpperCase()
    ) ||
    ((transactionOrderType && !orderExtraData.order.orderType) ||
      !includes(
        transactionOrderTypes,
        orderExtraData.order.orderType.toUpperCase()
      ))
  ) {
    // console.log("transactionOrderChannel ", transactionOrderChannel);
    return earnAmount;
  }
  const {
    order: { products }
  } = orderExtraData;
  products.sort(function(a, b) {
    return (
      parseFloat(b.pricePerQty) * parseFloat(b.quantity) -
      parseFloat(a.pricePerQty) * parseFloat(a.quantity)
    );
  });
  for (let index in products) {
    let product = products[index];
    if (
      !product.productType ||
      //product.productType.toUpperCase() === "PIZZA-MANIA" ||
      //product.productType.toUpperCase() === "SIDECOMBOS" ||
      product.isEDVOApplied === true
    ) {
      continue;
    }
    let totalPrice = product.pricePerQty * product.quantity;
    const burnableAmount = Math.min(totalPrice * (10 / 100), burnedAmount);
    totalPrice = totalPrice - burnableAmount;
    if (totalPrice > 0) {
      earnAmount = earnAmount + totalPrice * (10 / 100);
      earnAmount = await roundOff(earnAmount);
    }
    burnedAmount = burnedAmount - burnableAmount;
  }
  try {
    //To verify  Maximum earn amount per transaction
    let earnBusinessRule =
      businessRules[RULE_TYPE.LOYALTY_TRANSACTION_EARN_LIMIT];
    if (earnBusinessRule && isTransactionLimitRequired) {
      let maxEarnAmount = earnBusinessRule.ruleDefaultValue;
      earnAmount = Math.min(earnAmount, maxEarnAmount);
    }
  } catch (err) {}
  return earnAmount;
}

export async function processInputData(actionData: ActionDataInput) {
  let { orderExtraData, store, loyaltyTransaction, businessRules } = actionData;
  let processLoyaltyInput = <any>{};
  // console.log("orderExtraData ", orderExtraData);
  processLoyaltyInput.externalCustomerId = orderExtraData.externalCustomerId;
  processLoyaltyInput.loyaltyCode = orderExtraData.loyaltyType;
  processLoyaltyInput.loyaltyReferenceId = orderExtraData.loyaltyReferenceId;
  processLoyaltyInput.organizationId = orderExtraData.organizationId;
  processLoyaltyInput.pointsToRedeem = orderExtraData.pointsToRedeem;
  processLoyaltyInput.experiment_code = orderExtraData.loyaltyType;
  processLoyaltyInput.products = orderExtraData.data.order.products;
  // let status = orderExtraData.pointsToRedeem ?
  //      await getStatusByStatusCode(entityManager, LOYALTY_TRANSACTION_STATUS.INITIATED) :
  //     await getStatusByStatusCode(entityManager, LOYALTY_TRANSACTION_STATUS.COMPLETED);
  // processLoyaltyInput.statusCode = orderExtraData.pointsToRedeem ? 101 : 102;
  processLoyaltyInput.statusCode = 101;
  let orderData = orderExtraData.data;
  if (orderData) {
    processLoyaltyInput.burnFromLoyaltyCard = orderData.burnFromWallet;
    let productData = orderData.order;
    processLoyaltyInput.orderData = orderData;
    let transactionData = <any>{};
    transactionData.transactionType = productData.orderType;
    transactionData.transactionDate = productData.orderDate;
    transactionData.transactionChannel = productData.orderChannel;
    transactionData.totalAmount = productData.totalAmount;
    transactionData.externalStoreId = productData.externalStoreId;
    processLoyaltyInput.transactionData = transactionData;
  }
  // console.log("Process Loyalty Input ", processLoyaltyInput);
  return processLoyaltyInput;
}

export async function isLoyaltyEnabled(actionData: ActionDataInput) {
  let {
    orderExtraData,
    store,
    loyaltyTransaction,
    transactionData,
    businessRules,
    storeCode
  } = actionData;
  let loyaltyEnabled = false;
  const storeId = orderExtraData.order.externalStoreId;
  // let isLNAFSValidationRequired = transactionData.isLNAFSValidationRequired;
  if (
    parseFloat(transactionData.loyaltyTransactionCount) > 0 &&
    parseFloat(transactionData.loyaltyTransactionAmount) > 0
  ) {
    loyaltyEnabled = true;
    if (!storeCode || !storeId) {
      loyaltyEnabled = false;
    }
    // if (
    //   isLNAFSValidationRequired
    //   // &&
    //   // storeId &&
    //   // !includes(store, storeId.toUpperCase())
    // ) {
    //   throw new WCoreError(WCORE_ERRORS.LOYALTY_NOT_ACTIVATED_FOR_STORE);
    // }
  } else if (storeId && includes(store, storeId.toUpperCase())) {
    loyaltyEnabled = true;
  }
  return loyaltyEnabled;
}

export async function verifyLoyaltyTransaction(actionData: ActionDataInput) {
  let {
    orderExtraData,
    store,
    loyaltyTransaction,
    transactionData,
    businessRules
  } = actionData;
  if (loyaltyTransaction) {
    let status = loyaltyTransaction.statusCode;
    if (
      status &&
      (status.statusCode != LOYALTY_TRANSACTION_STATUS.REVIEW &&
        status.statusCode != LOYALTY_TRANSACTION_STATUS.CALCULATE)
    ) {
      throw new WCoreError(REWARDX_ERRORS.TRANSACTION_NOT_ELIGIBLE_FOR_REVIEW);
    }
    console.log("verifyLoyaltyTransaction ", loyaltyTransaction);
  }
  return loyaltyTransaction;
}
