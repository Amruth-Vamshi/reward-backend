/**
 * HTTP_STATUS_CODES Based on https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * useful for SOFA API
 *
 */
import * as status from "http-status-codes";

export const REWARDX_ERRORS = {
  ERROR_FOR_EXPIRY_COMMUNICATION: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE:
      "Loyalty program not found (or) Loyalty Program does not come under the specified Loyalty Card ",
    CODE: "EFEC"
  },
  CUSTOMER_LOYALTY_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Customer does not have the loyalty account",
    CODE: "CLNF"
  },
  CUSTOMER_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Customer not found",
    CODE: "CNF"
  },
  INVALID_MOBILE_NUMBER: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Mobile Number",
    CODE: "IMN"
  },
  CUSTOMER_LOYALTY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Customer loyalty already exists",
    CODE: "CLAE"
  },
  LOYALTY_CARD_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty card not found",
    CODE: "WTNF"
  },
  CURRENCY_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Currency not found",
    CODE: "CYNF"
  },
  REFERENCE_ID_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "In input, LoyaltyReferenceId is a mandatory field",
    CODE: "RINF"
  },
  LOYALTY_TYPE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "LoyaltyType not found",
    CODE: "LTNF"
  },
  MISMATCH_EXTERNAL_CUSTOMER_ID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE:
      "Mismatch in externalCustomerId of initiate or process transaction",
    CODE: "MECID"
  },
  TRANSACTION_ALREADY_COMPLETED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Transaction Reference already completed",
    CODE: "TAC"
  },

  LOYALTY_TRANSACTION_ALREADY_PROCESSED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty transaction is already in processed status",
    CODE: "LTAP"
  },
  LOYALTY_TRANSACTION_CANCELLED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty transaction already cancelled",
    CODE: "LTAC"
  },
  LOYALTY_TRANSACTION_REJECTED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty transaction already rejected",
    CODE: "LTAR"
  },
  TRANSACTION_POINT_LOYALTY_PROGRAM_NOT_CONFIGURED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Transaction point loyalty program not configured",
    CODE: "TPLPNC"
  },
  LOYALTY_PROGRAM_EXISTS_FOR_LOYALTY_TYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty program with LoyaltyType already exists",
    CODE: "LPEFLT"
  },
  CUSTOMER_LOYALTY_LEDGER_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty Ledgers for customer not found",
    CODE: "CLLNF"
  },
  BURN_POINTS_CANNOT_BE_GREATER_THAN_EARN_POINTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Burn points cannot be greater than earned points",
    CODE: "BPCGTEP"
  },
  BLOCKED_POINTS_CANNOT_BE_GREATER_THAN_EARN_POINTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Blocked points cannot be greater than earned points",
    CODE: "BLPCGTEP"
  },
  INSUFFICIENT_WALLET_BALANCE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Insufficient card balance.",
    CODE: "CLIB400"
  },
  BLOCKED_POINTS_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "No blocked points available for customer",
    CODE: "BPNF"
  },
  STATUS_ID_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Status code not found",
    CODE: "SNF"
  },
  LOYALTY_TRANSACTION_ALREADY_COMPLETED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty transaction already completed",
    CODE: "LTAC"
  },
  LOYALTY_TRANSACTION_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty transaction already exists",
    CODE: "LTAE"
  },
  LOYALTY_PROGRAM_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty program not found.",
    CODE: "LPNF"
  },
  AUDIENCE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Audience not found.",
    CODE: "ANF"
  },
  LOYALTY_RULE_DOESNT_SATISFY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty rules are not satisfied.",
    CODE: "ANF"
  },
  CURRENCY_CODE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Currency code not found",
    CODE: "CCNF"
  },
  CURRENCY_NAME_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Currency name not found",
    CODE: "CNNF"
  },
  CURRENCY_ID_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Currency id is mandatory to update existing currency",
    CODE: "CINF"
  },
  REDUCE_POINTS_SHOULD_BE_GT_ZERO: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Reduce points should be greater than 0",
    CODE: "RPSBGZ"
  },
  PLEASE_PROVIDE_CUSTOMER_ID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide external customer id",
    CODE: "PPCI"
  },
  LOYALTY_TRANSACTION_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty transaction not found",
    CODE: "LTNF"
  },
  PLEASE_ENTER_VALID_START_DATE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please enter a valid start Date",
    CODE: "PEVSD"
  },
  PLEASE_ENTER_VALID_END_DATE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please enter a valid end date",
    CODE: "PEVED"
  },
  PLEASE_ENTER_VALID_PAGINATION_DATA: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please enter valid pagination data",
    CODE: "PEVPD"
  },
  PAGE_NUMBER_WITH_START_ID_NOT_ALLOWED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please dont use start Id and page number together",
    CODE: "PNWSINA"
  },
  PLEASE_PROVIDE_CORRECT_START_ID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide correct value for start id",
    CODE: "PPCSI"
  },
  TRANSACTION_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Transaction not found",
    CODE: "TNF"
  },
  INSUFFICIENT_BALANCE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Insufficient balance",
    CODE: "IB"
  },
  TRANSACTION_NOT_ELIGIBLE_FOR_REVIEW: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Transaction has not been marked eligible for Review",
    CODE: "TNER"
  },
  EXPIRY_COMMUNICATION_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Expiry Communication not found",
    CODE: "ECNF"
  },
  CUSTOMER_LOYALTY_PROGRAM_NOT_FOUND: {
    HTTP_CODE: 404,
    MESSAGE: "Customer Loyalty Program(s) not found.",
    CODE: "CLPNF"
  },
  REFERRER_REFEREE_CAN_NOT_BE_SAME: {
    HTTP_CODE: 400,
    MESSAGE: "Referrer and referee can not be same",
    CODE: "RRCNS"
  },
  REFERRED_EXTERNAL_CUSTOMER_ID_NOT_FOUND: {
    HTTP_CODE: 400,
    MESSAGE: "referredExternalCustomerId is a mandatory field",
    CODE: "RECIM"
  },
  REFERRED_EXTERNAL_CUSTOMER_NOT_FOUND: {
    HTTP_CODE: 400,
    MESSAGE: "Referred external customer not found.",
    CODE: "RECNF"
  },
  EXTERNAL_CUSTOMER_ID_MISMATCH: {
    HTTP_CODE: 400,
    MESSAGE:
      "The loyaltyTransaction with this loyaltyReferenceId already exists for a different Customer.",
    CODE: "ECIM"
  },
  NOT_VALID_REFERENCE_ID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide a valid loyaltyReferenceId.",
    CODE: "NVRI"
  },
  TRANSACTION_BEFORE_ENROLLMENT_DATE: {
    HTTP_CODE: 400,
    MESSAGE: "Can't make a transaction before enrollment date.",
    CODE: "CMTBED"
  }
};
