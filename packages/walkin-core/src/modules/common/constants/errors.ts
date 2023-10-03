import * as status from "http-status-codes";
export const WCORE_ERRORS = {
  INVALID_RULES: {
    HTTP_CODE: 500,
    MESSAGE: `Invalid rules`,
    CODE: "IR"
  },
  QUEUE_NOT_INITIALIZED: {
    HTTP_CODE: status.INTERNAL_SERVER_ERROR,
    MESSAGE: "Queue not initialized",
    CODE: "QNI"
  },
  UNABLE_TO_ADD_TO_QUEUE: {
    HTTP_CODE: status.INTERNAL_SERVER_ERROR,
    MESSAGE: "Unable to add to queue",
    CODE: "Ubable to add to queue"
  },
  COMMUNICATION_CHANNEL_NOT_SPECIFIED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Communication channel not specified",
    CODE: "CCNS"
  },
  CUSTOMER_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Customer Not Found",
    CODE: "CNF"
  },
  EMAIL_NOT_PROVIDED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Email Not provided",
    CODE: "ENP"
  },
  CUSTOMER_COULDNT_BE_CREATED: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Customer couldn't be created",
    CODE: "CCBC"
  },
  ORGANIZATION_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Organization Not Found",
    CODE: "ONF"
  },
  CANT_ACCESS_OTHER_ORGANIZATION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Logged in organization doesn't match with provided organization id",
    CODE: "CAOO"
  },
  ORGANIZATION_NOT_ACTIVE: {
    HTTP_CODE: 400,
    MESSAGE: "Organization is not ACTIVE.",
    CODE: "ONA"
  },
  CANNOT_ACCESS_OTHER_ORGANIZATION: {
    HTTP_CODE: status.NOT_ACCEPTABLE,
    MESSAGE:
      "User cannot access other Organization.Please check entered Organization Id",
    CODE: "CAOO"
  },
  PLEASE_PROVIDE_CUSTOMERID: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Must provide externalCustomerId",
    CODE: "PPCID"
  },
  PLEASE_PROVIDE_EXTERNAL_PRODUCT_ID: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Must provide externalProductId",
    CODE: "PPEPID"
  },
  INVALID_EXTERNAL_MEMBERSHIP_ID: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Invalid External membership ID",
    CODE: "IEMID"
  },
  EXTERNAL_MEMBERSHIP_ID_NOT_UNIQUE: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "External membership ID is not unique",
    CODE: "EMIDNU"
  },
  EXTERNAL_CUSTOMER_NOT_UNIQUE: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "External customer is not unique",
    CODE: "ECNU"
  },
  EXTERNAL_CUSTOMER_ID_ORG_REQUIRED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Both External Customer Id and organization are required",
    CODE: "CIOR"
  },
  INVALID_EXTERNAL_CUSTOMER_ID: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Invalid External customer ID",
    CODE: "IECID"
  },
  EXTERNAL_CUSTOMER_ID_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "External Customer Id not found",
    CODE: "ECINF"
  },
  PLEASE_PROVIDE_ORGANIZATION: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Must provide organizationId",
    CODE: "PPOID"
  },
  INVALID_TRANSFORM_ERROR: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Transform function is not valid.",
    CODE: "ITE"
  },
  DUPLICATE_TRANSFORM_ERROR: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Duplicate Transform Function provided",
    CODE: "DTFP"
  },
  RULE_CONFIGURATION_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "For simple rule type, ruleConfiguration should be provided",
    CODE: "RCNF"
  },
  RULE_EXPRESSION_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "For custom rule type, ruleExpression should be provided",
    CODE: "RENF"
  },
  RULE_EXIST_WITH_ORGANIZATION: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Rule name exists with same organization",
    CODE: "REWO"
  },
  RULE_CONDITION_NOT_VALID:{
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Rule Condition ID passed is not valid",
    CODE: "RCIPNV"
  },
  RULE_EFFECT_NOT_VALID:{
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Rule Effect ID passed is not valid",
    CODE: "REIPNV"
  },
  RULE_ID_NOT_PASSED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Rule ID not passed ",
    CODE: "RINP"
  },
  RULE_SET_ID_NOT_FOUND:{
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide valid Rule Set id",
    CODE: "RSINF"
  },
  RULE_SET_ORGANIZATION_ID_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide organization id for the rule set",
    CODE: "RSONF"
  },
  RULE_SET_NAME_PROVIDED_IS_WRONG: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Invalid Rule set name provided",
    CODE: "RSNPIW"
  },
  RULE_SET_NO_FIELDS:{
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "No fields were provided for updation",
    CODE: "RSNF"
  },
  PRODUCTS_MANDATORY_FIELDS_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please send products along with all mandatory fields",
    CODE: "PMFNF"
  },
  INVALID_SESSION: {
    HTTP_CODE: status.FORBIDDEN,
    MESSAGE: "Authentication Issue",
    CODE: "IS"
  },
  UNAUTHORIZED: {
    HTTP_CODE: status.UNAUTHORIZED,
    MESSAGE: "Resource not permitted",
    CODE: "UNTH"
  },
  AUTHENTICATION_ERROR: {
    HTTP_CODE: status.NETWORK_AUTHENTICATION_REQUIRED,
    MESSAGE: "Authentication Error",
    CODE: "AE"
  },
  INVALID_WEBHOOK_ID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "invalid webhook_id or the webhook is inactive",
    CODE: "IWID"
  },
  RULE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide a valid rule",
    CODE: "RNF"
  },
  EVENT_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Event Not Found",
    CODE: "ENF"
  },
  WEBHOOK_ONLY_POST_SUPPORTED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Only post is supported as of now",
    CODE: "WOPS"
  },
  FAILED_TO_CREATE_CUSTOMER_FEEDBACK: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Failed to Create Customer feedback",
    CODE: "FTCCF"
  },
  CAMPAIGN_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Campaign not found",
    CODE: "CNF"
  },
  CAMPAIGN_SCHEDULE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Campaign Schedule not found",
    CODE: "CNF"
  },
  CAMPAIGN_SCHEDULE_CANNOT_BE_UPDATED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Cannot update Campaign Schedule for ENDED Campaign",
    CODE: "CSCBU"
  },
  CAMPAIGN_NOT_IN_DRAFT_STATE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Campaign can only be updated in DRAFT state",
    CODE: "CNIDS"
  },
  CAMPAIGN_STATUS_CANNOT_BE_CHANGED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Campaign status cannot be changed",
    CODE: "CSCBC"
  },
  APPLICATION_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Application Not Found!",
    CODE: "ANF"
  },
  EVENT_TYPE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Event Type Not Found",
    CODE: "ETNF"
  },
  INVALID_EVENT_TYPE_CODE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid code for Event Type",
    CODE: "IETC"
  },
  EVENT_SUBSCRIPTION_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Event Subscription Not Found",
    CODE: "ESNF"
  },
  EVENT_SUBSCRIPTION_ALREADY_PRESENT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Event Subscription already present",
    CODE: "ESAP"
  },
  EVENT_TYPE_INVALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Event Type",
    CODE: "ETI"
  },
  EVENT_TYPE_ID_MANDATORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide valid Event Type ID",
    CODE: "ETIM"
  },
  EVENT_TYPE_ALREADY_PRESENT_FOR_APPLICATION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Event type already present for application",
    CODE: "ETAPA"
  },
  NOT_AN_EVENT_TRIGGERED_CAMPAIGN: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE:
      "EventType cannot be added since it is not an event triggered campaign",
    CODE: "NAETC"
  },
  EVENT_TYPE_CODE_ALREADY_PRESENT_FOR_ORGANIZATION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Event type with the code already present for Organization",
    CODE: "ETCAPFO"
  },
  EVENT_TYPE_CREATE_FAILED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Event type already present for application",
    CODE: "ETAPA"
  },
  MALFORMED_DATA: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Malformed Data",
    CODE: "MD"
  },
  EVENT_WRONG_SPECVERSION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Bad event spec version",
    CODE: "EWS"
  },
  EVENT_BAD_CONTENTTYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Bad Content Type",
    CODE: "EBC"
  },
  INVALID_JSON_SCHEMA: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid JSON Schema",
    CODE: "IJS"
  },
  SEGMENT_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Segment Not Found",
    CODE: "SEGNF"
  },
  DUPLICATE_SEGMENT_NAMR: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Duplicate Segment Name",
    CODE: "SEGDN"
  },
  APPLICATION_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Application already exists",
    CODE: "APE"
  },
  QUERY_EXECUTION_FAILED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE:
      "Error while executing query, please recheck the metric query during creation",
    CODE: "MEER"
  },
  METRIC_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Metric not found",
    CODE: "MNF"
  },
  METRIC_FILTER_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Filter not found",
    CODE: "MFNF"
  },
  METRIC_SOURCE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Metric source not found or incorrect",
    CODE: "MSNF"
  },
  WAREHOUSE_QUERY_INVALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Query execution failed. Check for valid inputs",
    CODE: "WBC"
  },
  INVALID_RULE_EXPRESSION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid rule expression",
    CODE: "Rule expression is invalid"
  },
  USER_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "User not found",
    CODE: "UNF"
  },
  USER_EMAIL_NOT_VERIFIED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Email not verified",
    CODE: "ENV"
  },
  INVALID_QUERY_PARAMS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Query params are invalid",
    CODE: "QPIN"
  },
  ENTITY_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Entity not found",
    CODE: "ENF"
  },
  RULE_ENTITY_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Rule entity not found",
    CODE: "RENF"
  },
  FAILED_TO_CREATE_RULE_ATTRIBUTE_FOR_THE_ENTITY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Failed to create Rule Attribute for the given entity",
    CODE: "RAF"
  },
  CAMPAIGN_SETUP_INCOMPLETE: {
    HTTP_CODE: status.INTERNAL_SERVER_ERROR,
    MESSAGE: "Campaign setup is incomplete. Please rerun",
    CODE: "HYPERX0012"
  },
  CAMPAGIN_STATUS_NOT_DRAFT: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Campaign status is not draft",
    CODE: "HYPERX0006"
  },
  CAMPAIGN_NOT_SCHEDULED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Campaign not scheduled",
    CODE: "HYPERX0008"
  },
  USER_ORGANIZATION_DOESNOT_MATCH: {
    HTTP_CODE: status.FORBIDDEN,
    MESSAGE: "Users organization doesnot match",
    CODE: "IS"
  },
  FAILED_TO_CREATE_DEFAULT_WEBHOOKS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "FAILED_TO_CREATE_DEFAULT_WEBHOOKS",
    CODE: "WBF"
  },
  APPLICATION_ALREADY_CONNECTED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Application already connected",
    CODE: "AAC"
  },
  NO_SUCH_APPLICATION_CONNECTED_TO_CAMPAIGN: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "No such application connected to campaign",
    CODE: "NSACTC"
  },
  INVALID_FCM_TOKEN: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid FCM token",
    CODE: "NSACTC"
  },
  UNABLE_TO_CREATE_EVENT_SUBSCRIPTION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Unable to create Event Subscription",
    CODE: "UTECS"
  },
  FOUND_DIFFERENT_CUSTOMERS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Found different customers for the communications",
    CODE: "FDC"
  },
  EMAIL_COMMUNICATION_NOT_CONFIGURED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Email communication not configured",
    CODE: "ECNC"
  },
  DUPLICATE_ENTRY_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Duplicate entry found",
    CODE: "DEF"
  },
  ENTITY_FIELDS_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Entity extend fields not found for the entity",
    CODE: "EEFNF"
  },
  LIVE_CAMPAIGN_CANNOT_BE_UPDATED: {
    HTTP_CODE: status.FORBIDDEN,
    MESSAGE: "Forbidden. Cannot update entities associated to live campaign",
    CODE: "CUF"
  },
  CAMPAIGN_NOT_LIVE: {
    HTTP_CODE: status.FORBIDDEN,
    MESSAGE: "Forbidden. Campaign is not live",
    CODE: "CNLF"
  },
  ENTITY_EXTEND_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Entity extend not found",
    CODE: "EENF"
  },
  POLICY_ALREADY_PRESENT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Policy already present with given parameters, try linking it.",
    CODE: "PAP"
  },
  ROLE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Role not found",
    CODE: "RNF"
  },
  ROLE_ID_MANDATORY: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Role id is mandatory",
    CODE: "RIM"
  },
  POLICIES_MANDATORY: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Policies is mandatory",
    CODE: "PM"
  },
  POLICY_IDS_MANDATORY: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Policy IDs is mandatory",
    CODE: "PIDM"
  },
  INVALID_PERMISSION: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Invalid permission",
    CODE: "IP"
  },
  API_KEY_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Api key not found",
    CODE: "AKNF"
  },
  API_KEY_ALREADY_INACTIVE: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Api key already Inactive",
    CODE: "AKAI"
  },
  WRONG_PASSWORD: {
    HTTP_CODE: status.UNAUTHORIZED,
    MESSAGE: "Wrong password",
    CODE: "WP"
  },
  CAMPAIGN_ALREADY_EXPIRED: {
    HTTP_CODE: status.FORBIDDEN,
    MESSAGE: "Campaign already expired",
    CODE: "CAE"
  },
  UNABLE_TO_GENERATE_SHORT_LINK: {
    HTTP_CODE: status.INTERNAL_SERVER_ERROR,
    MESSAGE: "Enable to generate shortlink",
    CODE: "UTGSL"
  },
  DUPLICATE_WEBHOOK_EVENT_TYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Duplicate webhook event found",
    CODE: "DWET"
  },
  WEBHOOK_DETAILS_ALREADY_PRESENT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Webhook details already present for same event and same url",
    CODE: "WDAP"
  },
  WEBHOOK_EVENT_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Webhook Event Not Found",
    CODE: "WENF"
  },
  WEBHOOK_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Webhook Not Found",
    CODE: "WNF"
  },
  UNABLE_TO_SEND_MESSAGE: {
    HTTP_CODE: status.INTERNAL_SERVER_ERROR,
    MESSAGE: "Unable to send message",
    CODE: "UTSM"
  },
  CUSTOMER_TAG_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Customer Tag exists",
    CODE: "CTE"
  },
  AUDITABLE_ENTITIES_NOT_DEFINED: {
    HTTP_CODE: status.INTERNAL_SERVER_ERROR,
    MESSAGE: "Auditable entities not available in environment variable",
    CODE: "AENF"
  },
  UNABLE_TO_CREATE_COMMUNICATION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Unable to create communication",
    CODE: "Unable to create communication"
  },
  UNABLE_TO_CREATE_MESSAGE_TEMPLATE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Unable to create message template",
    CODE: "Unable to create message template"
  },
  REPORT_CONFIG_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "ReportConfig Not Found",
    CODE: "RCNF"
  },
  REPORT_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Report Not Found",
    CODE: "RNF"
  },
  REPORT_CONFIG_DUPLICATE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "ReportConfig name is duplicate",
    CODE: "RCND"
  },
  FILE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "File Not Found",
    CODE: "FND"
  },
  FIREBASE_DYNAMIC_URL_API_NOT_CONFIGURED: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Firebase dynamic url API not configured",
    CODE: "FDUANC"
  },
  INVALID_ORG_ID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid organization id",
    CODE: "IOC"
  },
  INVALID_ORG_CODE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid org code, only alphanumeric characters allowed",
    CODE: "IOC"
  },
  INVALID_ORG_NAME: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE:
      "Invalid org name, only alphanumeric, spaces and underscore allowed",
    CODE: "ION"
  },
  INVALID_EMAIL: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid email address",
    CODE: "IE"
  },
  EMAIL_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Email address is already taken, please use other address",
    CODE: "EAE"
  },
  ORG_CODE_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Org code already exists",
    CODE: "OCE"
  },
  NAME_NOT_UNIQUE_TO_ORG: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Name exists for the organization",
    CODE: "NE"
  },
  MESSAGE_FORMAT_NOT_CONFIGURED: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Message format not configured",
    CODE: "MFNC"
  },
  INVALID_PAGINATION_INFO: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Page and perPage numbers   should be greater than 0",
    CODE: "IPI"
  },
  LOYALTY_NOT_ACTIVATED_FOR_STORE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty not activated for store",
    CODE: "LNAFS"
  },
  STORE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Store not found",
    CODE: "STNF"
  },
  BUSINESS_RULE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Business Rule not found",
    CODE: "BRNF"
  },
  COMMUNICATION_DATES_OUTFLOW_CAMPAIGN_DATES: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Communication dates outflow campaign dates",
    CODE: "CDOC"
  },
  METRIC_NAME_NOT_UNIQUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Metric name already exists for org",
    CODE: "MNE"
  },
  METRIC_FILTER_NAME_NOT_UNIQUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Metric filter name already exists for org",
    CODE: "MFNE"
  },
  INVALID_PHONE_NUMBER: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Phone Number",
    CODE: "IPN"
  },
  FILE_SYSTEM_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "FileSystem Not Found",
    CODE: "FSNF"
  },
  ACTION_DEFINITION_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Action Defnition Not Found",
    CODE: "ADNF"
  },
  ACTION_DEFINITION_NOT_ACTIVE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Action Defnition not active",
    CODE: "ADNF"
  },
  INPUT_SCHEMA_VALIDATION_FAILED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Input schema validation failed",
    CODE: "ADNF"
  },
  USER_ID_NOT_SET: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "User Id is not set in comms input",
    CODE: "UINS"
  },
  ACTION_NOT_ALLOWED: {
    HTTP_CODE: status.UNAUTHORIZED,
    MESSAGE: "Action not allowed to perform",
    CODE: "ANA"
  },
  TAX_TYPE_NOT_UNIQUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Tax Type is not unique",
    CODE: "TTNU"
  },
  TAX_TYPE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Tax Type not found",
    CODE: "TTNF"
  },
  STORE_FORMAT_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Store Format not found",
    CODE: "SFNF"
  },
  STORE_FORMAT_NOT_UNIQUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Store Format is not unique",
    CODE: "SFNU"
  },
  CHANNEL_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Channel not found",
    CODE: "CNF"
  },
  INTERNAL_SERVER_ERROR: {
    HTTP_CODE: status.INTERNAL_SERVER_ERROR,
    MESSAGE: "Internal server error",
    CODE: "ISE"
  },
  CHARGE_TYPE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Charge Type not found",
    CODE: "CTNF"
  },
  CHANNEL_CHARGE_TYPE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Channel Charge Type not found",
    CODE: "CCTNF"
  },
  CATALOG_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Catalog not found",
    CODE: "CLNF"
  },
  PRODUCT_TAX_VALUE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Product tax value not found",
    CODE: "PTVNF"
  },
  PRODUCT_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Product not found",
    CODE: "PNF"
  },
  TAX_VALUE_INVALID: {
    HTTP_CODE: status.UNPROCESSABLE_ENTITY,
    MESSAGE: "Tax Value cannot be less the 0",
    CODE: "TVI"
  },
  PRODUCT_CHARGE_VALUE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Product charge value not found",
    CODE: "PCVNF"
  },
  CHARGE_VALUE_INVALID: {
    HTTP_CODE: status.UNPROCESSABLE_ENTITY,
    MESSAGE: "Charge Value cannot be less then 0",
    CODE: "CVI"
  },
  PRODUCT_PRICE_VALUE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Product price value not found",
    CODE: "PPVNF"
  },
  PRODUCT_PRICE_VALUES_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE:
      "Product price values not found for given store format and channel",
    CODE: "PPVSNF"
  },
  PRODUCT_PRICE_INVALID: {
    HTTP_CODE: status.UNPROCESSABLE_ENTITY,
    MESSAGE: "Product price value cannot be less then 0",
    CODE: "PPI"
  },
  TAG_NAME_ALREADY_EXISTS: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Tag with this name already exists",
    CODE: "TNAE"
  },
  TAG_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Tag not Found",
    CODE: "TNF"
  },
  TAG_ALREADY_DEACTIVATED: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Tag already deactivated",
    CODE: "TAD"
  },
  TAG_ALREADY_ACTIVE: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Tag already active",
    CODE: "TAA"
  },
  COLLECTION_ALREADY_EXISTS: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Collection with this name already exists",
    CODE: "CAE"
  },
  COLLECTION_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Collection not found",
    CODE: "CNF"
  },
  COLLECTIONS_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Collections not found",
    CODE: "CsNF"
  },
  COLLECTIONS_IDS_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Collections ids not passed in the query ",
    CODE: "CsNF"
  },
  COLLECTION_ITEM_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Collection item not found",
    CODE: "CINF"
  },
  COLLECTION_ITEM_ALREADY_EXISTS: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Collection item already exists for collection",
    CODE: "CIAE"
  },
  COLLECTION_ALREADY_DEACTIVATED: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Collection already deactivated",
    CODE: "CAD"
  },
  COLLECTION_ALREADY_ACTIVE: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Collection already active",
    CODE: "CAA"
  },
  STORE_CODE_NOT_UNIQUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Store code is not unique",
    CODE: "SCNU"
  },
  STORE_ADMIN_LEVEL_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "StoreAdmin level not found",
    CODE: "Store admin level not found"
  },
  CATEGORY_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "No categories found",
    CODE: "CTNF"
  },
  PRODUCT_VARIANT_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "No product variant not found",
    CODE: "PVNF"
  },
  PRODUCT_COLLECTION_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Product collection not found for given input",
    CODE: "PCNF"
  },
  PRODUCT_TAG_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Product tag not found for given input",
    CODE: "PTNF"
  },
  ADDRESS_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Address Not Found",
    CODE: "ANF"
  },
  ADDRESS_NOT_FOUND_FOR_CUSTOMER: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Address Not Found For the Customer",
    CODE: "ANF"
  },
  ADDRESS_MISMATCH: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Address Id doesn't match with the Address Id the customer has.",
    CODE: "ANF"
  },
  DUPLICATE_ADDRESS: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Duplicate name given for address",
    CODE: "DA"
  },
  PARTNER_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Partner not found",
    CODE: "PNF"
  },
  PARTNER_TYPE_ALREADY_EXISTS: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Partner with this code already exists",
    CODE: "PTAE"
  },
  PAYMENT_TYPE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Payment type not found",
    CODE: "PTNF"
  },
  PAYMENT_TYPE_ALREADY_EXISTS: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Payment type already exists",
    CODE: "PAE"
  },
  DELIVERY_TYPE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Delivery type not found",
    CODE: "DTNF"
  },
  DELIVERY_TYPE_ALREADY_EXISTS: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE: "Delivery type already exists with this code",
    CODE: "DTAE"
  },
  STORE_CHARGE_TYPE_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Charge type already exists to store",
    CODE: "CTAETS"
  },
  OPTION_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Option was not found",
    CODE: "OPNF"
  },
  OPTION_INVALID: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Invalid Option",
    CODE: "IOP"
  },
  OPTION_DETAILS_EMPTY: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide option details",
    CODE: "OPDE"
  },
  NAME_INVALID: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Invalid Option Name",
    CODE: "ION"
  },
  CATALOG_CODE_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Catalog code already exists",
    CODE: "CAE"
  },
  INVALID_INPUT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid name",
    CODE: "NI"
  },
  INVALID_CODE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid code",
    CODE: "CI"
  },
  INVALID_CATEGORY_CODE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Category code",
    CODE: "ICC"
  },
  STORE_OPEN_TIMING_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Store Open timing ID not found",
    CODE: "STNF"
  },
  STORE_ALREADY_ENABLED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Store already enabled",
    CODE: "SAE"
  },
  STORE_ALREADY_DISABLED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Store already disabled",
    CODE: "SAD"
  },
  STORE_DELIVERY_AREA_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Store delivery area not found",
    CODE: "SDANF"
  },
  PLEASE_PROVIDE_DELIVERY_AREA_VALID_VALUES: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide correct delivery area values (lat,long)",
    CODE: "PPDAVV"
  },
  CHANNEL_CODE_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Channel exists",
    CODE: "CHE"
  },
  CHARGE_TYPE_CODE_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Charge type code exists",
    CODE: "CTCE"
  },
  CHARGE_TYPE_NAME_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Charge type name exists",
    CODE: "CTNE"
  },
  PAYMENT_REQUEST_FAILED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Payment request failed",
    CODE: "PRF"
  },
  SHIPPING_ADDRESS_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Shipping Address not found",
    CODE: "SANF"
  },
  STAFF_MEMBER_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Staff Member Not found",
    CODE: "SMNF"
  },
  STAFF_MEMBER_ALREADY_ACTIVE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Staff Member already active",
    CODE: "SMAA"
  },
  STAFF_MEMBER_ALREADY_INACTIVE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Staff Member already inactive",
    CODE: "SMAA"
  },
  BANK_DETAILS_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Bank details not found",
    CODE: "BDNF"
  },
  BANK_ACCOUNT_ALREADY_ACTIVE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Bank account already active",
    CODE: "BAAA"
  },
  BANK_ACCOUNT_ALREADY_INACTIVE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Bank account already inactive",
    CODE: "BAAI"
  },
  UPDATE_NOT_ALLOWED_TO_VERIFIED_ACCOUNTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Bank account update is not allowed to verified accounts",
    CODE: "UNATVA"
  },
  BANK_ACCOUNT_ALREADY_PRIMARY_ACCOUNT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Bank account is already a primary bank account",
    CODE: "BAAPA"
  },
  BANK_ACCOUNT_NUMBER_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Bank account already exists",
    CODE: "BAAE"
  },
  PLEASE_VERIFY_BANK_ACCOUNT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please verify bank account",
    CODE: "PVBA"
  },
  BANK_ACCOUNT_ALREADY_VERIFIED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Bank account already verified",
    CODE: "BAAV"
  },
  STORE_CHARGE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Store Charge Not found",
    CODE: "SCNF"
  },
  REFUND_REQUEST_FAILED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Refund Request failed",
    CODE: "RRF"
  },
  ERROR_FETCHING_REFUNDS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Error while fetching refunds",
    CODE: "EFR"
  },
  STORE_TIME_INVALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Store time is invalid",
    CODE: "STI"
  },
  PRODUCT_CHARGE_VALUE_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product Charge value already exists",
    CODE: "PCVAE"
  },
  PRODUCT_PRICE_VALUE_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product price value already exists",
    CODE: "PPVAE"
  },
  PRODUCT_TAX_VALUE_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product tax value already exists",
    CODE: "PTVAE"
  },
  STAFF_MEMBER_ALREADY_EXIST_IN_STORE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Staff Member already exists in this store",
    CODE: "SMAEFS"
  },
  STORE_SERVICE_AREA_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Service Area not found",
    CODE: "SSANF"
  },
  STORE_SERVICE_AREA_ALREADY_ACTIVE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Service Area already active",
    CODE: "SSAAA"
  },
  STORE_SERVICE_AREA_ALREADY_INACTIVE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Service Area already INactive",
    CODE: "SSAAI"
  },
  STORE_CATALOG_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Store Catalog Not found",
    CODE: "SCNF"
  },
  STORE_OPEN_TIMING_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Store opening timings already exists",
    CODE: "SOTAE"
  },
  PLEASE_PROVIDE_STORE_OPENING_TIMINGS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide store opening timings",
    CODE: "PPSOT"
  },
  PRODUCT_ALREADY_AVAILABLE_IN_CATEGORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product already available in this category",
    CODE: "PAAIC"
  },
  USER_ALREADY_ADDED_TO_STORE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "User already added to store",
    CODE: "UAATS"
  },
  LEGAL_DOCUMENT_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Legal document not found",
    CODE: "LDNF"
  },
  USER_NAME_ALREADY_TAKEN: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Username already taken, please select another one",
    CODE: "UNAT"
  },
  PLEASE_PROVIDE_VALID_INPUTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide valid username",
    CODE: "PPVI"
  },
  INVALID_LOGIN_INPUT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide either username or email",
    CODE: "ILI"
  },
  PRODUCT_NAME_NOT_UNIQUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide a unique name for the product",
    CODE: "PNNU"
  },
  USER_PASSWORD_DOES_NOT_MATCH: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "User password does not match",
    CODE: "UPDNM"
  },
  ENTITY_EXTEND_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Entity Extend already exists",
    CODE: "EEAE"
  },
  TOKEN_NOT_VALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Token Not valid",
    CODE: "tnv"
  },
  PASSWORD_CANNOT_BE_EMPTY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Password cannot be empty",
    CODE: "PCBE"
  },
  PINCODE_NOT_VALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Pincode Not valid",
    CODE: "PNV"
  },
  PASSWORD_NOT_VALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Password does not meet the required conditions",
    CODE: "EPNV"
  },
  OLD_PASSWORD_NEW_PASSWORD_CANNOT_BE_SAME: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Old password and new password cannot be same",
    CODE: "OPNPCBS"
  },
  ENTITY_EXTEND_DATA_NOT_VALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Entity extend data not valid",
    CODE: "EEDNV"
  },
  SPOT_NOT_CONFIGURED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Spot not configured",
    CODE: "SNC"
  },
  SHIPPING_ADDRESS_NOT_VALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Shipping address not valid",
    CODE: "SANV"
  },
  BILLING_ADDRESS_NOT_VALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Billing address not valid",
    CODE: "BANV"
  },
  ADDRESS_INPUT_NOT_VALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Address input not valid",
    CODE: "ANV"
  },
  ADDRESS_LINE_MANDATORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "addressLine1 is mandatory",
    CODE: "ALM"
  },
  CITY_IS_MANDATORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "city is mandatory",
    CODE: "CIM"
  },
  STATE_IS_MANDATORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "state is mandatory",
    CODE: "SIM"
  },
  OPERATION_NOT_ALLOWED: {
    HTTP_CODE: status.UNAUTHORIZED,
    MESSAGE: "Operation not allowed",
    CODE: "ONA"
  },
  API_CURRENTLY_NOT_ENABLED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "API currently not enabled",
    CODE: "ANE"
  },
  DISCOUNT_TYPE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Discount type not found",
    CODE: "DTNF"
  },
  DISCOUNT_TYPE_VALUE_INVALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Discount type input not valid",
    CODE: "DTVI"
  },
  DISCOUNT_TYPE_NAME_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Discount type name already exists",
    CODE: "DTNE"
  },
  DISCOUNT_TYPE_CODE_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Discount type code already exists",
    CODE: "DTCE"
  },
  PRODUCT_DISCOUNT_VALUE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product discount value not found",
    CODE: "PDVNF"
  },
  PRODUCT_DISCOUNT_INVALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product discount value not valid",
    CODE: "IDV"
  },
  PRODUCT_DISCOUNT_VALUE_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product discount value already exists",
    CODE: "PDVAE"
  },
  PARENT_PRODUCT_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Parent product not found",
    CODE: "PPNF"
  },
  CHILD_PRODUCT_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Child product not found",
    CODE: "CPNF"
  },
  PRODUCT_RELATIONSHIP_ALREADY_EXISTS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product relationship already exists",
    CODE: "PRAE"
  },
  PRODUCT_RELATIONSHIP_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product relationship not found",
    CODE: "PRNF"
  },
  INVALID_WEBHOOK_TYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Provided URL for the event type Internal is invalid",
    CODE: "URLNF"
  },
  INVALID_INPUT_PASSED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide valid inputs.",
    CODE: "IIP"
  },
  PERSON_NOT_UNIQUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Identifier for the person exists in the database",
    CODE: "PNU"
  },
  PERSON_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Person not found",
    CODE: "PNF"
  },
  INVALID_PERSON_SEARCH_INPUT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Either personIdentifier or personId is mandatory",
    CODE: "INP"
  },
  PERSON_NOT_LINKED_WITH_ORG: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Person is not associated with any org",
    CODE: "PONF"
  },
  DUPLICATE_MENU_TIMING_NAME: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide unique name",
    CODE: "DMTN"
  },
  DUPLICATE_MENU_TIMING_CODE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide unique code",
    CODE: "DMTC"
  },
  MENU_TIMING_EMPTY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide menu timings",
    CODE: "MTE"
  },
  MENU_TIMING_IDS_EMPTY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timings ID cannot be empty",
    CODE: "MTIDE"
  },
  INVALID_DAYS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide valid days",
    CODE: "PVD"
  },
  DUPLICATE_DAYS_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Duplicate menutimings for days found",
    CODE: "DMTF"
  },
  CONLFICT_IN_MENU_TIMINGS_FOR_DAYS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Conflict found with existing menutimings on the specified days",
    CODE: "MTCF"
  },
  OPEN_TIME_INVALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide correct open time",
    CODE: "IOPT"
  },
  CLOSE_TIME_INVALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide correct close time",
    CODE: "ICLT"
  },
  INCORRECT_MENU_TIMING: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Open time cannot be >= close time",
    CODE: "IOPCLT"
  },
  INVALID_MENU_TIMING_CODE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timing code cannot be empty",
    CODE: "IMTC"
  },
  INVALID_MENU_TIMING_NAME: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timing name cannot be empty",
    CODE: "IMTN"
  },
  MENU_TIMING_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timing cannot be found",
    CODE: "MTNF"
  },
  MENU_TIMING_CODE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timing code does not exist",
    CODE: "MTCNF"
  },
  MENU_TIMING_CODE_USED_FOR_CATEGORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timing code is being used for category",
    CODE: "MTCUC"
  },
  MENU_TIMING_CODE_USED_FOR_PRODUCT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timing code is being used for product",
    CODE: "MTCUP"
  },
  MENU_TIMING_ALREADY_EXISTS_FOR_CATEGORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timing already exists for category",
    CODE: "MTAEC"
  },
  MENU_TIMING_ALREADY_EXISTS_FOR_PRODUCT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timing already exists for product",
    CODE: "MTAEP"
  },
  MENU_TIMING_NOT_FOUND_FOR_CATEGORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timings not found for category",
    CODE: "MTNFC"
  },
  MENU_TIMING_NOT_FOUND_FOR_PRODUCT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timings not found for product",
    CODE: "MTNFP"
  },
  INVALID_MENU_TIMINGS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Menu timings invalid",
    CODE: "MTIV"
  },
  INVALID_TAX_TYPE_VALUE_INPUT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE:
      "Either provide productTaxTypeValueId or (productId, storeFormatId, ChannelId and taxLevel) as filter input",
    CODE: "ITTVI"
  },
  INVALID_CHARGE_TYPE_VALUE_INPUT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE:
      "Either provide productChargeValueId or (productId, storeFormatId, ChannelId and chargeType) as filter input",
    CODE: "ICTVI"
  },
  PRODUCT_CATEGORY_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Product category not found",
    CODE: "PCNF"
  },
  PERSON_ALREADY_INACTIVE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Person is not found or inactive",
    CODE: "PINF"
  },
  CUSTOMER_IDENTIFIER_NOT_UNIQUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Customer Identifier not unique",
    CODE: "CINU"
  },
  CUSTOMER_IDENTIIFER_ORG_REQUIRED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Both Customer Identifier and organization are required",
    CODE: "CIOR"
  },
  CUSTOMER_IDENTIFIER_NOT_FOUND: {
    HTTP_CODE: 400,
    MESSAGE: "Customer Identifier Not Found",
    CODE: "CINF"
  },
  PLEASE_PROVIDE_CUSTOMER_IDENTIFIER: {
    HTTP_CODE: 400,
    MESSAGE: "Please Provide Customer Identifier",
    CODE: "PPCI"
  },
  CUSTOMER_PHONE_NUMBER_ORG_REQUIRED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Both phone number and organization are required",
    CODE: "CPOR"
  },
  PHONE_NUMBER_NOT_UNIQUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "phone number is not unique",
    CODE: "CPNU"
  },
  PHONE_NUMBER_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "phone number not found",
    CODE: "PNNF"
  },
  PERSON_NOT_ASSOCIATED_WITH_CUSTOMER: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Person is not associated with customer",
    CODE: "PNAC"
  },
  CUSTOMER_PHONE_NUMBER_DOES_NOT_MATCH_WITH_PERSON: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Customers phone number does not match with person",
    CODE: "CPDM"
  },
  OPTION_VALUE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Option value not found",
    CODE: "OPVNF"
  },
  OPTION_VALUE_DETAILS_EMPTY: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide option value details",
    CODE: "OPVNF"
  },
  INVALID_ORDER_TYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Order Type",
    CODE: "IOT"
  },
  INVALID_ENTITY_TYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Entity Type",
    CODE: "IET"
  },
  INVALID_COLLECTIONS_NAME: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Collections Name or Collections name not provided",
    CODE: "ICN"
  },
  INVALID_COLLECTIONS_TYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Collections type",
    CODE: "ICT"
  },
  COLLECTIONS_ALREADY_EXISTS: {
    HTTP_CODE: status.CONFLICT,
    MESSAGE:
      "Collections with this entity type already exists for the campaign",
    CODE: "CAEFC"
  },
  INVALID_STATUS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid status",
    CODE: "IS"
  },
  RULE_ENTITY_AND_RULE_ATTRIBUTE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide rule enity and rule attribute",
    CODE: "EANF"
  },
  RULE_ATTRIBUTE_NAME_NOT_PROVIDED:{
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Rule Attribute Name",
    CODE: "IRA"
  },
  RULE_CONDITION_NAME_NOT_VALID:{
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Rule Condition Name",
    CODE: "IRCN"
  },
  RULE_CONDITION_ID_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide rule condition id",
    CODE: "RCINF"
  },
  RULE_EFFECT_NAME_NOT_VALID : {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Rule Effect Name",
    CODE: "RENV"
  },
  RULE_ENTITY_NAME_NOT_VALID : {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Rule Entity Name",
    CODE: "REENV"
  },
  RULE_NAME_NOT_VALID : {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Rule  Name",
    CODE: "REV"
  },
  RULE_SET_NAME_NOT_VALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Rule Set Name",
    CODE: "RESV"
  },
  STORE_NAME_NOT_VALID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid store Name",
    CODE: "ISN"
  },
  LOYALTY_PROGRAM_CONFIG_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Loyalty Program Config not found",
    CODE: "LPCNF"
  },
  LOYALTY_PROGRAM_DETAIL_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Loyalty Program Detail not found",
    CODE: "LPCNF"
  },
  LOYALTY_PROGRAM_CONFIG_ID_MANDATORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty Program config id is mandatory",
    CODE: "LPCIM"
  },
  ITEM_DETAILS_CANNOT_BE_EMPTY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Item not found, item details cannot be empty",
    CODE: "IDCBE"
  },
  REQUIRED_FIELD_NOT_PROVIDED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Required field not provided",
    CODE: "RFNP"
  },
  PHONE_NUMBER_REQUIRED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Phone number required",
    CODE: "PNR"
  },
  CUSTOMER_LOYALTY_PROGRAM_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Customer Loyalty Program not found",
    CODE: "CLPNF"
  },
  INVALID_APPLICATION_METHOD: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Application Method",
    CODE: "IAM"
  },
  INVALID_START_TIME: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Start Time",
    CODE: "IST"
  },
  INVALID_END_TIME: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid End Time",
    CODE: "IET"
  },
  INVALID_CAMPAIGN_TYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Campaign Type",
    CODE: "ICT"
  },
  INVALID_CAMPAIGN_TRIGGER_TYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Campaign Trigger Type",
    CODE: "ICTT"
  },
  INVALID_CAMPAIGN_STATUS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Campaign Status",
    CODE: "ICS"
  },
  INVALID_CAMPAIGN_STATUS_WHILE_CREATING: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Campaign status Invalid while creating",
    CODE: "ICSWC"
  },
  INVALID_DATA: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Data",
    CODE: "ID"
  },
  INVALID_CRON_EXPRESSION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Cron Expression",
    CODE: "ICE"
  },
  CRON_EXPRESSION_MANDATORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Cron Expression is Mandatory for Scheduled Campaign",
    CODE: "CEM"
  },
  EXTERNAL_STORE_ID_MANDATORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "externalStoreId is Mandatory",
    CODE: "ESIDM"
  },
  CAN_NOT_CREATE_COLLECTION_ITEM_FOR_DYNAMIC_COLLECTION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Can't create collectionItems for a Dynamic Collection",
    CODE: "ESIDM"
  },
  CAMPAIGN_SCHEDULE_NAME_MANDATORY: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "campaignScheduleName is Mandatory for Scheduled Campaign",
    CODE: "CSNM"
  },
  INVALID_CAMPAIGN_SCHEDULE_NAME: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid Campaign Schedule Name",
    CODE: "ICSN"
  },
  FAILED_TO_CREATE_CAMPAIGN_SCHEDULE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Failed to create Campaign Schedule",
    CODE: "FTCCS"
  },
  FAILED_TO_CREATE_JOB_DETAILS: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Failed to create Job Details",
    CODE: "FTCJD"
  },
  JOB_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Job not found",
    CODE: "JNF"
  },
  FAILED_TO_REMOVE_SCHEDULED_JOB: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Failed to remove scheduled job",
    CODE: "FTRSJ"
  },
  INVALID_DATE_OF_BIRTH: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please enter valid DOB",
    CODE: "INDOB"
  },
  INVALID_DATE_OF_BIRTH_FORMAT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please enter DOB in YYYY-MM-DD format",
    CODE: "INDOBF"
  },
  INVALID_USER_ID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide valid user id",
    CODE: "IUID"
  },
  INVALID_EXISTING_ROLE_ID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide valid existingRoleId",
    CODE: "IERID"
  },
  INVALID_NEW_ROLE_ID: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide valid newRoleId",
    CODE: "INRID"
  },
  EXISTING_ROLE_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Existing role not found",
    CODE: "ERNF"
  },
  NEW_ROLE_NOT_FOUND: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "New Role not found",
    CODE: "NRNF"
  },
  NEW_ROLE_ALREADY_PRESENT: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "New Role already present for user",
    CODE: "NRAP"
  },
  INVALID_ORGANIZATION_TYPE: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide valid organizationType",
    CODE: "IOT"
  },
  INVALID_BUSINESS_TYPE: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide valid businessType",
    CODE: "IBT"
  },
  INVALID_WALKIN_PRODUCT: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide valid walkinProduct",
    CODE: "IWP"
  },
  INVALID_ROLE_NAME: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide valid Role name",
    CODE: "IRN"
  },
  INVALID_QUEUE_NAME: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide valid Queue name",
    CODE: "IQN"
  },
  INVALID_JOB_PURPOSE: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Please provide valid Job purpose",
    CODE: "IJB"
  },
  CRON_EXPRESSION_NOT_PROVIDED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide cron expression",
    CODE: "CEM"
  },
  TIER_NOT_FOUND: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Tier not found for the given input.",
    CODE: "TNF"
  },
  PROVIDE_PRE_DEFINED_TIER: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide a pre-defined tier.",
    CODE: "PPDT"
  },
  TIERS_NOT_FOUND_FOR_ORGANIZATION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Tiers not found for your organization.",
    CODE: "TNFFO"
  },
  PROVIDE_CODE_FOR_TIER: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide the code for tier.",
    CODE: "PCFT"
  },
  PROVIDE_CODE_OR_ID_FOR_TIER: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide either code or id or both.",
    CODE: "PCIFT"
  },
  TIERS_NOT_DEFINED_FOR_ORGANIZATION: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Tiers are not defined for your organization.",
    CODE: "TNDFO"
  },
  INVALID_GENDER: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid gender",
    CODE: "IG"
  },
  INVALID_HEADER_VALUE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Please provide valid value for x-customer-id header",
    CODE: "IHV"
  },
  ISSUE_API_INTERNAL_ERROR: {
    HTTP_CODE: status.NOT_FOUND,
    MESSAGE: "Internal Server Error for Issue API",
    CODE: "IAIE"
  },
  ORDER_ID_NOT_PROVIDED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Order ID not provided",
    CODE: "ONP"
  },
  LOYALTY_PROGRAM_CONFIG_ID_ALREADY_LINKED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE:
      "Loyalty Program Config id is already linked to a Loyalty Program Detail",
    CODE: "LPCIAL"
  },
  LOYALTY_CARD_ID_NOT_PROVIDED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Loyalty card id not provided",
    CODE: "LCINT"
  },
  INVALID_SUPPORT_TYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid support type",
    CODE: "IST"
  },
  INVALID_SUPPORT_SUBTYPE: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid support subtype",
    CODE: "ISS"
  },
  INVALID_CONTENT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid content",
    CODE: "IC"
  },
  INVALID_SUBJECT: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Invalid subject",
    CODE: "IS"
  },
  SUPPORT_EMAIL_TO_IDS_NOT_DEFINED: {
    HTTP_CODE: status.BAD_REQUEST,
    MESSAGE: "Support email TO email ids not defined",
    CODE: "SETIDND"
  }
};
