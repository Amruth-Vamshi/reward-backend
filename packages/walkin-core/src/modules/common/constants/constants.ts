export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
};

export const ENTITY_NAME = {
  COLLECTION: "Collection",
  RULE_SET: "RuleSet",
  RULE_CONDITION:"RuleCondition",
  RULE_EFFECT:"RuleEffect"
};

export const FORBIDDEN_PATTERNS = [
  /(\b|[\s(])eval\s*\(/i,
  /(\b|[\s(])Function\s*\(/i,
  /(\b|[\s(])setTimeout\s*\(/i,
  /(\b|[\s(])setInterval\s*\(/i,
  /(\b|[\s(])exec\s*\(/i,
  /(\b|[\s(])spawn\s*\(/i,
  /(\b|[\s(])XMLHttpRequest\s*\(/i,
  /(\b|[\s(])import\s*\(/i,
  /(\b|[\s(])require\s*\(/i,
  /(\b|[\s(])open\s*\(/i,
  // Add more patterns as needed(based on requirements)
];

export const FORBIDDEN_KEYWORDS = [
  'window',
  'document',
  'process',
  'global',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'fetch',
  'import',
  'require',
  'eval',
  'setTimeout',
  'setInterval',
  'XMLHttpRequest',
  'open',
  'exec',
  'spawn',
  'child_process',
  'fs',
  'path',
  // Add more keywords as needed(based on requirements)
];

export const FORBIDDEN_METHODS = [
  '.innerHTML',
  '.appendChild',
  '.insertAdjacentHTML',
  '.setAttribute',
  '.createContextualFragment',
  '.cloneNode',
  '.execScript',
  '.write',
  '.writeln',
  '.open',
  '.replace',
  '.cookie',
  '.setImmediate',
  '.createScript',
  '.requestAnimationFrame',
  '.mozSetMessageHandler',
  '.webkitPostMessage',
  '.postMessage',
  '.onmessage',
  // Add more methods as needed(based on requirements)
];


export const COMPARISON_TYPE = {
  LIKE: "LIKE",
  EQUAL_TO: "="
};

export const REGEX_STRING = {
  LIKE_COMPARISON: /[%_"]/g,
  EQUAL_TO_COMPARISON: /["]/g
};

export enum AREA_TYPE {
  PINCODE = "PINCODE",
  GEO_AREA = "GEO_AREA"
}

export enum StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}
export enum EnumStatus {
  ACTIVE,
  INACTIVE
}

export const ENUM_DAY = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY"
};

export const RULE_TYPE = {
  SIMPLE: "SIMPLE",
  CUSTOM: "CUSTOM"
};

export enum RULE_TYPEEnum {
  SIMPLE = "SIMPLE",
  CUSTOM = "CUSTOM"
}

export const ENUM_DELIVERY_LOCATION_TYPE = {
  PINCODE: "PINCODE",
  GEO_POINT: "GEO_POINT"
};

export const DEFAULT_RULE_EXPRESSION = {
  CHECK_REWARDX_CAMPAIGN_TYPE: "(Campaign['campaignType'] == 'LOYALTY' )",
  ALWAYS_TRUE_RULE: "( 1 === 1 )",
  CHECK_OFFER_CATEGORY:
    "(  Offer['offerCategory'] == 'COUPONS' || Offer['offerCategory'] == 'AUTO_APPLY' )"
};

export const HYPERX_CURRENT_VERSION = {
  VERSION_01: "1"
};

export const ORDERX_CURRENT_VERSION = {
  VERSION_01: "1"
};

export const ENTITY_TYPE = {
  ORGANIZATION: "Organization",
  PRODUCT: "Product",
  CATEGORY: "Category",
  ORDER: "Order",
  STORE: "Store",
  CUSTOMER: "Customer",
  CAMPAIGN: "Campaign",
  SEGMENT: "Segment",
  EVENT: "Event",
  EVENT_TYPE: "EventType"
};

export const WORKFLOW_ENTITY_TYPE = {
  CAMPAIGN: "Campaign",
  OFFER: "Offer",
  ORDER: "Order"
};

export const DEFAULT_RULES = {
  STATUS_IS_ACTIVE: "status is active",
  ALWAYS_TRUE_RULE: "Always true rule",
  _COMMS_AUTHORIZATION: "_COMMS_AUTHORIZATION",
  _COMMS_CHANNEL: "COMMS_CHANNEL",
  DEFAULT: "DEFAULT",
  CUSTOMER_IS_VALID: "customer is valid",
  CAMPAIGN_WORKFLOW_DETERMINATION: "CAMPAIGN_WORKFLOW_DETERMINATION"
};

export const DEFAULT_APP = {
  NAME: "DEFAULT_APP",
  PLATFORM: "CONSOLE"
};

/**
 * These are all available actions,
 * only the queues in EXPOSED_WALKIN_ACTIONS will be available to users for
 * Event subscriptions
 */
export enum WALKIN_QUEUES {
  HYPERX_EVENTS_QUEUE = "HYPERX_EVENTS_QUEUE",
  NEARX = "NEARX",
  WEBHOOK = "WEBHOOK",
  WALKIN_COMMS_QUEUE = "WALKIN_COMMS_QUEUE",
  EVENT_PROCESSING = "EVENT_PROCESSING",
  REFINEX_SEND_FEEDBACK = "REFINEX_SEND_FEEDBACK",
  CUSTOM = "CUSTOM",
  ORDERX_DELIVERY_PROCESSING = "ORDERX_DELIVERY_PROCESSING",
  SCHEDULED_CAMPAIGN = "SCHEDULED_CAMPAIGN"
}

export enum EXPOSED_WALKIN_ACTIONS {
  NEARX = "NEARX",
  CUSTOM = "CUSTOM",
  WEBHOOK = "WEBHOOK",
  REFINEX_SEND_FEEDBACK = "REFINEX_SEND_FEEDBACK",
  ORDERX_DELIVERY_PROCESSING = "ORDERX_DELIVERY_PROCESSING"
}

export const VALUE_TYPE = {
  NUMBER: "NUMBER",
  STRING: "STRING",
  OBJECT: "OBJECT",
  BOOLEAN: "BOOLEAN",
  ARRAY: "ARRAY"
};

export const PRODUCT_TYPE = {
  REGULAR: "REGULAR",
  VARIANT: "VARIANT",
  FIXED_BUNDLE: "FIXED_BUNDLE",
  DYNAMIC_BUNDLE: "DYNAMIC_BUNDLE",
  PRODUCT: "PRODUCT",
  ADDON: "ADDON",
  COMBO: "COMBO",
  PRODUCT_ALTERNATIVES: "PRODUCT_ALTERNATIVES"
};

export const PRODUCT_RELATIONSHIP = {
  PRODUCT_VARIANT: "PRODUCT_VARIANT",
  PRODUCT_ADDONS: "PRODUCT_ADDONS",
  PRODUCT_COMBO: "PRODUCT_COMBO"
};

/**
 * action types
 */
export const ACTION_TYPE = {
  NOTIFICATION: "NOTIFICATION",
  EXTERNAL_API: "EXTERNAL_API",
  CREATE_CUSTOMER_FEEDBACK_FORM: "CREATE_CUSTOMER_FEEDBACK_FORM"
};

/**
 * jSON schema Format
 */
export const SCHEMA_FORMAT = {
  JSON: "JSON",
  XML: "XML"
};

/**
 * Content type of posted data
 */
export const CONTENT_TYPE = {
  JSON_CONTENT: "application/json"
};

/**
 * Cloud Event versions
 */
export const CLOUD_EVENT_VERIONS = {
  VERSION_0_2: "0.2"
};

/**
 * Metric Type
 */
export const METRIC_TYPE = {
  SCALAR: "SCALAR",
  SEQUENCE: "SEQUENCE",
  MATRIX: "MATRIX"
};

/****
 * Metric Filter Type
 ****/
export const METRIC_FILTER_TYPE = {
  NUMBER: "NUMBER",
  STRING: "STRING",
  DATETIME: "DATETIME"
};

/**
 * jSON schema Format
 */
export const ACTION_RESULT = {
  INITIATED: "INITIATED",
  FAILED: "FAILED",
  SUCCESS: "SUCCESS",
  TERMINATED: "TERMINATED",
  CANCELLED: "CANCELLED"
};

export const EXPRESSION_TYPE = {
  EQUALS: "EQUALS",
  NOT_EQUALS: "NOT_EQUALS",
  LESS_THAN: "LESS_THAN",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN_OR_EQUAL: "LESS_THAN_OR_EQUAL",
  GREATER_THAN_OR_EQUAL: "GREATER_THAN_OR_EQUAL",
  LIKE: "LIKE",
  IN: "IN"
};

export const ALLOWED_EXPRESSIONS = {
  NUMBER: [
    EXPRESSION_TYPE.EQUALS,
    EXPRESSION_TYPE.LESS_THAN,
    EXPRESSION_TYPE.GREATER_THAN,
    EXPRESSION_TYPE.GREATER_THAN_OR_EQUAL,
    EXPRESSION_TYPE.LESS_THAN,
    EXPRESSION_TYPE.LESS_THAN_OR_EQUAL,
    EXPRESSION_TYPE.NOT_EQUALS
  ],
  BOOLEAN: [EXPRESSION_TYPE.EQUALS, EXPRESSION_TYPE.NOT_EQUALS],
  STRING: [EXPRESSION_TYPE.EQUALS, EXPRESSION_TYPE.NOT_EQUALS],
  OBJECT: [EXPRESSION_TYPE.EQUALS, EXPRESSION_TYPE.NOT_EQUALS],
  ARRAY: [
    EXPRESSION_TYPE.EQUALS,
    EXPRESSION_TYPE.NOT_EQUALS,
    EXPRESSION_TYPE.IN
  ]
};

export const WALKIN_PRODUCTS = {
  REFINEX: "REFINEX",
  NEARX: "NEARX",
  REWARDX: "REWARDX",
  HYPERX: "HYPERX",
  ORDERX: "ORDERX"
};

export const RELEASED_WALKIN_PRODUCTS = {
  REWARDX: "REWARDX"
};

export const PACKAGE_NAMES = {
  HYPERX: "walkin-hyperx",
  NEARX: "walkin-nearx",
  FRONTX: "walkin-frontx",
  CORE: "walkin-core",
  REFINEX: "walkin-refinex",
  REWARDX: "walkin-rewardx",
  ORDERX: "walkin-orderx"
};

export const GET_COUNT = "GET_COUNT";
export const GET_ALL = "GET_ALL";

export const SQL_EXPRESSIONS = {
  EQUAL: "=",
  NOT_EQUALS: "!=",
  LESS_THAN: "<",
  GREATER_THAN: ">",
  LESS_THAN_OR_EQUAL: "<=",
  GREATER_THAN_OR_EQUAL: ">=",
  LIKE: "like"
};

export const MATHEMATICAL_EXPRESSIONS = {
  EQUALS: "==",
  NOT_EQUALS: "!=",
  LESS_THAN: "<",
  GREATER_THAN: ">",
  LESS_THAN_OR_EQUAL: "<=",
  GREATER_THAN_OR_EQUAL: ">=",
  IN: "IN"
};

export const ORGANIZATION_TYPES = {
  ORGANIZATION: "ORGANIZATION",
  STORE: "STORE"
};

export const COMBINATOR = {
  AND: "and",
  OR: "or"
};
export const SearchExpression = {
  EQUALS: "EQUALS"
};

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER"
};

export const SLUGTYPE = {
  DATE: "DATE",
  TIMESTAMP: "TIMESTAMP",
  TIME: "TIME",
  SHORT_TEXT: "SHORT_TEXT",
  LONG_TEXT: "LONG_TEXT",
  NUMBER: "NUMBER",
  CHOICES: "CHOICES",
  BOOLEAN: "BOOLEAN",
  JSON: "JSON"
};

export const MAP_TYPE_TO_SLUGTYPE = {
  varchar: "SHORT_TEXT",
  datetime: "TIME",
  integer: "NUMBER",
  boolean: "BOOLEAN",
  uuid: "LONG_TEXT",
  json: "JSON"
};

export const EXTEND_ENTITIES = {
  customer: "Customer",
  customerSearch: "CustomerSearch",
  customerDevice: "CustomerDevice",
  product: "Product",
  store: "Store",
  organization: "Organization",
  user: "User",
  session: "Session",
  category: "Category",
  order: "Order"
};

export const REQUEST_METHOD = {
  POST: "POST",
  GET: "GET"
};

export enum MESSAGE_FORMAT {
  SMS = "SMS",
  PUSH = "PUSH",
  EMAIL = "EMAIL"
}

export enum SUPPORT_TYPE {
  REWARDX = "REWARDX"
}

export enum SUPPORT_SUBTYPE {
  PAYMENTS = "PAYMENTS",
  ONBOARDING = "ONBOARDING",
  OTHERS = "OTHERS"
}

export const VARIABLE_FORMAT = {
  DATE_YYYYMMDD: "YYYYMMDD",
  TIME_HHMM: "HHMM",
  NO_FORMATING: "NO_FORMATING"
};

export const VARIABLE_TYPE = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  DATE: "DATE"
};

export const TEMPLATE_STYLE = {
  MUSTACHE: "MUSTACHE"
};

export const ENVIRONMENT_TYPES = {
  TEST: "TEST",
  PRODUCTION: "PRODUCTION",
  DEVELOPMENT: "DEVELOPMENT"
};

export const BUSINESS_RULE_LEVELS = {
  ORGANIZATION: "ORGANIZATION",
  STORE: "STORE",
  APPLICATION: "APPLICATION",
  LOYALTY: "LOYALTY"
};

export const SEGMENT_TYPE = {
  CUSTOM: "CUSTOM"
};

export const CAMPAIGN_TRIGGER_TYPE = {
  SCHEDULED: "SCHEDULED",
  EVENT: "EVENT"
};

export const CAMPAIGN_SCHEDULE_NAME = {
  BIRTHDAY_CAMPAIGN: "BIRTHDAY_CAMPAIGN"
};

export const CAMPAIGN_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  ENDED: "ENDED"
};

export enum CAMPAIGN_TYPE {
  // OFFER = "OFFER",
  // FEEDBACK = "FEEDBACK",
  MESSAGING = "MESSAGING",
  LOYALTY = "LOYALTY",
  REFERRAL = "REFERRAL",
  COUPON = "COUPON",
  DISCOUNT = "DISCOUNT"
}

export const CORE_WEBHOOK_EVENTS = {
  CREATE_CUSTOMER: "customer.create.success",
  CREATE_CUSTOMER_DEVICE: "customer_devices.create.success",
  UPDATE_CUSTOMER: "customer.update.success",
  UPDATE_CUSTOMER_DEVICE: "customer_devices.update.success",
  DISABLE_CUSTOMER: "customer.disable.success",
  DISABLE_CUSTOMER_DEVICE: "customer_devices.disable.success",
  CAMPAIGN_CREATE_SUCESS: "campaign.create.success",
  CAMPAIGN_UPDATE_SUCESS: "campaign.update.success",
  CAMPAIGN_LAUNCH_SUCESS: "campaign.launch.success",
  CAMPAIGN_PAUSE_SUCESS: "campaign.pause.success",
  CAMPAIGN_UNPAUSE_SUCESS: "campaign.unpause.success",
  CAMPAIGN_COMPLETE_SUCESS: "campaign.complete.success",
  CAMPAIGN_ABANDONED_SUCESS: "campaign.abandoned.success",
  CAMPAIGN_DISABLED_SUCESS: "campaign.disabled.success"
};

export const SORTING_DIRECTIONS = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING"
};

export const ORDER = {
  ASC: "ASC",
  DESC: "DESC"
};

export const DB_SOURCE = {
  CORE: "CORE",
  WAREHOUSE: "WAREHOUSE"
};

export const BASIC_METRICS = {
  CUSTOMER_COUNTS: "CUSTOMER_COUNTS",
  TOTAL_CAMPAIGNS: "TOTAL_CAMPAIGNS"
};

export const COMMUNICATION_FREQUENCY = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  DAILY: "DAILY"
};

export const COMMUNICATION_DAYS = {
  SUNDAY: "SUNDAY",
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY"
};

export const COMMUNICATION_ENTITY_TYPE = {
  CAMPAIGN: "CAMPAIGN",
  OFFER: "OFFER",
  LOYALTY: "LOYALTY"
};

export const COMMUNICATION_STATUS = {
  ADDED: "ADDED",
  STARTED: "STARTED",
  ERROR: "ERROR",
  COMPLETE: "COMPLETE"
};

export const COMMUNICATION_RUN_TYPE = {
  FIRST: "FIRST",
  REPEAT: "REPEAT"
};

export const ENTITY_SEARCH_SYNC_TYPE = {
  FULL: "FULL",
  DELTA: "DELTA"
};

export const ACCESS_TYPES = {
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC"
};

export const FILE_SYSTEM_TYPES = {
  S3: "S3",
  CLOUDINARY: "CLOUDINARY"
};
export const WORKFLOW_STATES = {
  DRAFT: "DRAFT",
  LIVE: "LIVE",
  COMPLETE: "COMPLETE",
  PAUSE: "PAUSE",
  ABANDONED: "ABANDONED",
  NO_STATE: "NO_STATE",
  CLOSED: "CLOSED"
};

export const BASIC_MODULE_PATH = "/src/modules/basic/basic.module";
export const BASIC_PROVIDER_PATH = "/src/modules/basic/basic.providers";
export const TRACE_WCORE_UTIL_TO_PACKAGE = "../../../../../";

/**
 * action definition types
 */
export const ACTION_DEFINITION_TYPE = {
  GET: "GET",
  POST: "POST",
  AXIOS_REQUEST: "AXIOS_REQUEST",
  SCRIPT: "SCRIPT"
};

export const DEFAULT_PAGE_NUMBER = 1;

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGE_OPTIONS = {
  page: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE
};

export const DEFAULT_SORT_OPTIONS = {
  sortBy: "createdTime",
  sortOrder: "DESC"
};

export const DEFAULT_TEMPLATES = {
  PASSWORD_RESET_MAIL_TEMPLATE: "PASSWORD_RESET_MAIL_TEMPLATE",
  NEW_USER_CONFIRM_MAIL_TEMPLATE: "NEW_USER_CONFIRM_MAIL_TEMPLATE",
  PASSWORD_RESET_CONFIRMATION: "PASSWORD_RESET_CONFIRMATION",
  NEW_ORDER_CREATION_TEMPLATE: "NEW_ORDER_CREATION_TEMPLATE",
  ORDER_DELIVERY_FOUND_TEMPLATE: "ORDER_DELIVERY_FOUND_TEMPLATE",
  ORDER_SHIPPED_TEMPLATE: "ORDER_SHIPPED_TEMPLATE",
  ORDER_DELIVERED_TEMPLATE: "ORDER_DELIVERED_TEMPLATE",
  USER_PASSWORD_RESET_TEMPLATE: "USER_PASSWORD_RESET_TEMPLATE",
  ORDER_ACCEPTANCE_TEMPLATE: "ORDER_ACCEPTANCE_TEMPLATE",
  ORDER_REJECTED_TEMPLATE: "ORDER_REJECTED_TEMPLATE",
  ORDER_CANCELED_TEMPLATE: "ORDER_CANCELED_TEMPLATE"
};

export const PARTNER_TYPE = {
  PAYMENT: "PAYMENT",
  DELIVERY: "DELIVERY"
};

export const ADDRESS_TYPE = {
  BILLING: "BILLING",
  SHIPPING: "SHIPPING"
};

export const STAFF_ROLE = {
  DELIVERY: "DELIVERY",
  STORE_MANAGER: "STORE_MANAGER"
};

export const ACCOUNT_TYPE = {
  PRIMARY: "PRIMARY",
  SECONDARY: "SECONDARY"
};

export const STORE_CHARGE_TYPE = {
  DELIVERY_CHARGE: "DELIVERY_CHARGE",
  PACKAGING_CHARGE: "PACKAGING_CHARGE"
};

export enum STORE_SERVICE_AREA_TYPE {
  RADIUS = "RADIUS"
}

export const DEFAULT_SERVICE_AREA_RADIUS = "8000";

export const STORE_CHARGE_VALUE_TYPE = {
  ABSOLUTE: "ABSOLUTE"
};

export const BUSINESS_TYPE = {
  PRIVATE_LIMITED: "PRIVATE_LIMITED",
  PROPRIETORSHIP: "PROPRIETORSHIP",
  PARTNERSHIP: "PARTNERSHIP",
  INDIVIDUAL: "INDIVIDUAL",
  PUBLIC_LIMITED: "PUBLIC_LIMITED",
  LLP: "LLP"
};

export const DISCOUNT_VALUE_TYPE = {
  ABSOLUTE: "ABSOLUTE",
  PERCENTAGE: "PERCENTAGE"
};

export const LEGAL_DOCUMENT_TYPE = {
  GST_NUMBER: "GST_NUMBER",
  PAN_NUMBER: "PAN_NUMBER",
  FSSAI_LICENSE_NUMBER: "FSSAI_LICENSE_NUMBER",
  ADDRESS_PROOF: "ADDRESS_PROOF"
};

// DEFAULT CACHE TTL - 24HR 60 * 60 * 24

export const CACHE_TTL = 86400;

// LONG TERM CACHE VALUE WILL BE 7 DAYS 60 * 60 * 24 * 7
export const LONG_CACHE_TTL = 604800;
// tslint:disable-next-line:interface-name
export interface PageOptions {
  page: number;
  pageSize: number;
}

export const CACHING_KEYS = {
  CUSTOMER: "customer",
  STORE: "store",
  WORKFLOW_PROCESS_TRANSITION: "WorkFlowProcessTransition",
  ORGANIZATION: "organization",
  CHANNEL: "channel",
  PRODUCT: "product",
  ORDER: "order",
  ENTITY_EXTEND: "entityExtend",
  WORKFLOW_ENTITY: "workflowEntity",
  WORKFLOW_ENTITY_TRANSITION: "workflowEntityTransition",
  WORKFLOW_STATE: "workflowState",
  WORKFLOW_PROCESS_NAME: "workflowProcessName",
  USER: "user",
  API_KEY: "apiKey",
  ACTION: "action",
  STORE_CHARGES: "storeCharges",
  STORE_INVENTORY: "storeInventory",
  FILE_SYSTEM: "fileSystem",
  STORE_FORMAT: "storeFormat",
  CHARGE_TYPE: "chargeType",
  TAX_TYPE: "taxType",
  DISCOUNT_TYPE: "discountType",
  PRODUCT_TAG: "productTag",
  PRODUCT_RELATIONSHIP: "productRelationship",
  CATALOG_CATEGORIES: "catalog_categories",
  CATEGORY: "category",
  CATALOG: "catalog",
  PRODUCT_CATEGORY: "productCategory",
  CATEGORY_PRODUCT_OPTION: "categoryProductOption",
  PRODUCT_OPTION_VALUE: "productOptionValue",
  OPTION_VALUE: "optionValue",
  OPTION: "option",
  MENU_TIMINGS: "menuTimings",
  MENU_TIMINGS_FOR_CATEGORY: "menuTimingsForCategory",
  MENU_TIMINGS_FOR_PRODUCT: "menuTimingsForProduct",
  STORE_INVENTORY_AVAILABLE: "storeInventoryAvailable",
  INVOICE: "invoice",
  PUBLISHED_CATALOG: "publishedCatalog",
  LOYALTY_CARD: "loyaltyCard",
  LOYALTY_PROGRAM_CONFIG: "loyaltyProgramConfig",
  LOYALTY_PROGRAM_DETAIL: "loyaltyProgramDetail",
  CUSTOMER_LOYALTY: "customerLoyalty",
  CUSTOMER_LOYALTY_PROGRAM: "customerLoyaltyProgram",
  LOYALTY_TRANSACTION: "loyaltyTransaction",
  RULE_CONDITION: "ruleCondition",
  RULE_EFFECT: "ruleEffect",
  LOYALTY_LEDGER: "loyaltyLedger",
  COLLECTIONS_ITEMS: "collectionsItems",
  COLLECTIONS: "collections",
  CAMPAIGN: "campaign",
  TIER: "tier",
  RULE: "rule"
};

export const SHORT_CACHE_TTL = 3600;

export const EXPIRY_MODE = {
  EXPIRE: "EX"
};

/**
 * All cache related to typeorm is in ms and is store for a very short duration of either 1 minute or 20sec
 */
export const TYPEORM_CACHE_TTL = 60000;
export const TYPEORM_SHORT_CACHE_TTL = 20000;

export const WEBHOOK_TYPE = {
  INTERNAL: "INTERNAL",
  EXTERNAL: "EXTERNAL"
};

export const INTERNAL_WEBHOOK_URL = {
  WEBHOOK_WHATSAPP_BOT_URL: "WEBHOOK_WHATSAPP_BOT_URL",
  WEBHOOK_SPOT_URL: "WEBHOOK_SPOT_URL",
  WEBHOOK_BFF_URL: "WEBHOOK_BFF_URL",
  WEBHOOK_MERAKI_ORDER_UPDATE_URL: "WEBHOOK_MERAKI_ORDER_UPDATE_URL",
  WEBHOOK_DELIVERY_MS_URL: "WEBHOOK_DELIVERY_MS_URL",
  WEBHOOK_SETTLEMENT_MS_URL: "WEBHOOK_SETTLEMENT_MS_URL",
  WEBHOOK_PAYMENT_URL: "WEBHOOK_PAYMENT_URL",
  WEBHOOK_ORDER_STATUS_URL: "WEBHOOK_ORDER_STATUS_URL"
};

export const ACCEPTED_INTERNAL_WEBHOOKS = () => {
  return [...Object.values(INTERNAL_WEBHOOK_URL)];
};

export const CONDITION_TYPE = {
  ...EXPRESSION_TYPE,
  CUSTOM_EXPRESSION: "CUSTOM_EXPRESSION"
};

export const RULE_EFFECT_TYPE = {
  CUSTOM_EXPRESSION: "CUSTOM_EXPRESSION",
  API_TRIGGER: "API_TRIGGER"
};

export const CACHING_PERIOD = {
  VERY_SHORT_CACHING_PERIOD: 900, // 15 mins
  SHORT_CACHING_PERIOD: 10800, // 3 hours
  MEDIUM_CACHING_PERIOD: 86400, // 1 day
  LONG_CACHING_PERIOD: 604800, // 1 week
  VERY_LONG_CACHING_PERIOD: 2592000 // 1 month
};

export const ENTITY_CACHING_PERIOD = {
  LOYALTY_CARD: CACHING_PERIOD.VERY_LONG_CACHING_PERIOD,
  LOYALTY_PROGRAM_CONFIG: CACHING_PERIOD.LONG_CACHING_PERIOD,
  LOYALTY_PROGRAM_DETAIL: CACHING_PERIOD.LONG_CACHING_PERIOD,
  CUSTOMER_LOYALTY: CACHING_PERIOD.SHORT_CACHING_PERIOD,
  CUSTOMER_LOYALTY_PROGRAM: CACHING_PERIOD.SHORT_CACHING_PERIOD,
  LOYALTY_TRANSACTION: CACHING_PERIOD.SHORT_CACHING_PERIOD,
  RULE_CONDITION: CACHING_PERIOD.LONG_CACHING_PERIOD,
  RULE_EFFECT: CACHING_PERIOD.LONG_CACHING_PERIOD,
  LOYALTY_LEDGER: CACHING_PERIOD.VERY_SHORT_CACHING_PERIOD,
  COLLECTIONS_ITEMS: CACHING_PERIOD.LONG_CACHING_PERIOD,
  COLLECTIONS: CACHING_PERIOD.LONG_CACHING_PERIOD,
  CUSTOMER: CACHING_PERIOD.VERY_SHORT_CACHING_PERIOD
};

export interface IScheduleCampaignProcessor {
  getItems(transactionManager, organizationId?): any;
  processItems(transactionManager, input): any;
}

export const DATE_OF_BIRTH_REGEX = /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/; // YYYY-MM-DD

export const DEFAULT_JOB_FAIL_REASON = "Marking Job as Failed";

export enum ADDITIONAL_JOBS {
  EXPIRE_CAMPAIGN = "EXPIRE_CAMPAIGN",
  EXPIRE_CUSTOMER_LOYALTY_POINTS = "EXPIRE_CUSTOMER_LOYALTY_POINTS"
}

export const EMOJI_PATTERN = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

export const SUPPORT_MAIL_CONFIGURATION = {
  HOST: "smtp.sendgrid.net",
  PORT: 587,
  FILE_SIZE_LIMIT: 10 * 1024 * 1024 // 10mb
};
