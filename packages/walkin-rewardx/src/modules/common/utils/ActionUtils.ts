import {
  LOYALTY_ACTION_TYPE,
  RULE_TYPE,
  RULE_LEVEL,
  LOYALTY_TRANSACTION_STATUS
} from "../constants/constant";
import { includes, isEmpty } from "lodash";
import { getBusinessRuleConfiguration } from "@walkinserver/walkin-core/src/modules/rule/utils/BusinessRuleUtils";
import { roundOff } from "./MathUtils";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { LoyaltyTransactionProvider } from "../../loyalty-transaction/loyalty-transaction.provider";
import { getStatusByStatusCode } from "./CommonUtils";
import { executeAction } from "@walkinserver/walkin-core/src/modules/actions/action.executor";
import {
  Customer,
  Store,
  BusinessRule,
  ActionDefinition
} from "@walkinserver/walkin-core/src/entity";
import { LoyaltyTransaction } from "../../../entity";
import {
  burnAmountCalc,
  earnAmountCalc,
  processInputData,
  isLoyaltyEnabled,
  verifyLoyaltyTransaction
} from "./JFLImplAction";
import { REWARDX_ERRORS } from "../constants/errors";
import { STATUS } from "@walkinserver/walkin-core/src/modules/common/constants/constants";

export type ActionDataInput = {
  orderExtraData: any;
  store: any[]; //TODO: Change it to a single store
  loyaltyTransaction: LoyaltyTransaction;
  customer: Customer;
  businessRules: Object;
  transactionData: any; //TransactionData sent as input
  burnFromLoyaltyCard: Boolean;
  storeCode: String;
};

export class ActionUtils {
  // public static async findActionByActionName(
  //   entityManager,
  //   actionName,
  //   organizationId
  // ) {
  //   let actionDefintion = await entityManager.findOne(ActionDefinition, {
  //     where: {
  //       name: actionName,
  //       organization: organizationId,
  //       status: STATUS.ACTIVE
  //     },
  //     relations: ["organization"]
  //   });
  //   return actionDefintion;
  // }

  // public static async executeAction(
  //   entityManager,
  //   organizationId,
  //   actionName,
  //   data: ActionDataInput
  // ) {
  //   let actionDefiniton = await this.findActionByActionName(
  //     entityManager,
  //     actionName,
  //     organizationId
  //   );
  //   let outputData = await executeAction(actionDefiniton, { request: data });
  //   console.log("outputData ", outputData);
  //   if (!isEmpty(outputData.errors)) {
  //     throw new WCoreError(outputData.errors);
  //   }
  //   let result = outputData.result;
  //   console.log("result ", result);
  //   return result;
  // }
  public static async findActionByActionName(
    entityManager,
    actionName,
    organizationId
  ) {
    switch (actionName) {
      case LOYALTY_ACTION_TYPE.EARN_ACTION: {
        return true;
        break;
      }
      case LOYALTY_ACTION_TYPE.BURN_ACTION: {
        return true;
        break;
      }
      case LOYALTY_ACTION_TYPE.EARN_BURN_ACTION: {
        return true;
        break;
      }
      case LOYALTY_ACTION_TYPE.LOYALTY_ENABLE_ACTION: {
        return true;
        break;
      }
      case LOYALTY_ACTION_TYPE.ISSUANCE_INPUT: {
        return true;
        break;
      }
    }
    return false;
  }

  public static async executeAction(
    entityManager,
    organizationId,
    actionName,
    data: ActionDataInput
  ) {
    switch (actionName) {
      case LOYALTY_ACTION_TYPE.EARN_ACTION:
        return earnAmountCalc(data);
        break;

      case LOYALTY_ACTION_TYPE.BURN_ACTION: {
        // console.log("Burn Action");
        let burnPoints = await burnAmountCalc(data);
        return burnPoints;
        break;
      }
      case LOYALTY_ACTION_TYPE.ISSUANCE_INPUT: {
        let inputData = await processInputData(data);
        return inputData;
        break;
      }
      case LOYALTY_ACTION_TYPE.LOYALTY_ENABLE_ACTION: {
        let loyaltyEnabled = await isLoyaltyEnabled(data);
        return loyaltyEnabled;
        break;
      }
      case LOYALTY_ACTION_TYPE.LOYALTY_TRANSACTION_REVIEW: {
        let isValidLoyaltyTransaction = await verifyLoyaltyTransaction(data);
        return isValidLoyaltyTransaction;
        break;
      }
      default:
        console.log("default");
    }
  }
}
