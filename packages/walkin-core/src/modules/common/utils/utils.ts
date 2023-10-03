import Redis from "ioredis";
import fetch from "node-fetch";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  Policy,
  Role,
  Organization,
  FileSystem,
  File,
  User,
  Store
} from "../../../entity";
import { DB_SOURCE, FORBIDDEN_PATTERNS, FORBIDDEN_KEYWORDS, FORBIDDEN_METHODS } from "../constants";
import {
  WALKIN_PRODUCTS,
  GET_ALL,
  GET_COUNT,
  MAP_TYPE_TO_SLUGTYPE,
  SQL_EXPRESSIONS,
  PACKAGE_NAMES,
  BASIC_MODULE_PATH,
  BASIC_PROVIDER_PATH,
  TRACE_WCORE_UTIL_TO_PACKAGE,
  CACHING_KEYS,
  CACHE_TTL,
  EXPIRY_MODE,
  STATUS,
  ENTITY_NAME,
  COMPARISON_TYPE,
  REGEX_STRING,
  SUPPORT_TYPE,
  SUPPORT_SUBTYPE
} from "../../../../src/modules/common/constants/constants";
import { clickHouseQuery } from "./clickHouseUtils";
import { WCoreError } from "../exceptions";
import { WCORE_ERRORS } from "../constants/errors";
import { WalkinPlatformError } from "../exceptions/walkin-platform-error";
import {
  getManager,
  getRepository,
  getConnection,
  EntityManager
} from "typeorm";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_EFFECT,
  POLICY_TYPE,
  POLICY_PERMISSION_ENTITY,
  POLICY_ACCESS_LEVEL,
  POLICY_RESOURCES_CONSOLE,
  POLICY_PERMISSION_CONSOLE
} from "../permissions";
import { captureException } from "@sentry/node";

import fs from "fs";
import path from "path";
import moment = require("moment");
import Bull, { Queue } from "bull";
import { URL, URLSearchParams } from "url";
import { toNumber } from "lodash";
import { Moment } from "moment";
import _ from "lodash";
import { getValueFromCache, setValueToCache } from "./redisUtils";
import { createHttpLink } from "apollo-link-http";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { COLLECTIONS_ENTITY_TYPE, COLLECTIONS_TYPE } from "../../../../../walkin-rewardx/src/modules/common/constants/constant";
import cron from "cron-validate";
import { isValidEmail } from "../validations/Validations";
const { createHash } = require('crypto');

const { CLICKHOUSE_DATABASE } = process.env;
const client = new Redis({
  host: process.env.REDIS_HOST,
  // tslint:disable-next-line:radix
  port: parseInt(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

interface sendPushNotificationInput {
  organizationId: String;
  format: String;
  fcmToken: String;
  data: any;
  user_id: String;
  template?: any;
}

export const checkIfPersonAndCustomersPersonAreSame = (customer, person) => {
  if (customer) {
    if (customer.person.id !== person.id) {
      throw new WCoreError(WCORE_ERRORS.PERSON_NOT_ASSOCIATED_WITH_CUSTOMER);
    }
  }
  return true;
};

export const getUTCTimeFromLocalTime = time => {
  const currentDate = new Date();
  // Get Day & Month in 2 digits and Year in 4 digits
  const currentYear = currentDate.getFullYear();
  const currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const currentDay = ("0" + currentDate.getDate()).slice(-2);
  let localDate: any = `${currentYear}-${currentMonth}-${currentDay} ${time} GMT+0530`;
  localDate = new Date(localDate).toUTCString();
  localDate = moment(localDate).format("hh:mm:ss a");
  return localDate;
};

export const getPackageNameForProduct = product => {
  let packageName;
  switch (product) {
    case WALKIN_PRODUCTS.HYPERX:
      packageName = PACKAGE_NAMES.HYPERX;
      break;
    case WALKIN_PRODUCTS.NEARX:
      packageName = PACKAGE_NAMES.NEARX;
      break;
    case WALKIN_PRODUCTS.REWARDX:
      packageName = PACKAGE_NAMES.REWARDX;
      break;
    case WALKIN_PRODUCTS.REFINEX:
      packageName = PACKAGE_NAMES.REFINEX;
      break;
    case WALKIN_PRODUCTS.ORDERX:
      packageName = PACKAGE_NAMES.ORDERX;
      break;
    default:
      packageName = PACKAGE_NAMES.CORE;
      break;
  }
  return packageName;
};

export const getDynamicImports = async packageName => {
  const directoryName = path.resolve(__dirname, TRACE_WCORE_UTIL_TO_PACKAGE);
  const dir = await getDirectories(directoryName, packageName);
  const modulePath = dir + BASIC_MODULE_PATH;
  const providerPath = dir + BASIC_PROVIDER_PATH;
  try {
    const { BasicProvider } = await require(providerPath);
    const { BasicModule } = await require(modulePath);

    const result = {
      BasicModule,
      BasicProvider
    };
    return result;
  } catch (e) {
    console.log(e);
    return;
  }
};
export const getDirectories = async (directoryName, packageName) => {
  try {
    const res = await fs
      .readdirSync(directoryName)
      .map(folderName => {
        if (folderName === packageName) {
          return path.join(directoryName, folderName);
        }
      })
      .filter(pathFound => {
        return pathFound !== undefined;
      });
    if (res.length > 0) {
      return res[0];
    }
  } catch (err) {
    console.log(err);
    return;
  }
};

export const frameTextFromSQLExpresion = (expression, attributeEntityName) => {
  let finalExpression = "";
  const sqlExpressionValues = Object.values(SQL_EXPRESSIONS);
  const sqlExpressionKeys = Object.keys(SQL_EXPRESSIONS);
  const splittedExpression = expression.split(" ");

  for (const splittedText of splittedExpression) {
    // tslint:disable-next-line:prefer-conditional-expression
    if (sqlExpressionValues.indexOf(splittedText) > -1) {
      finalExpression = `${finalExpression} ${sqlExpressionKeys[sqlExpressionValues.indexOf(splittedText)]
        } to`;
    } else {
      finalExpression = `${finalExpression} ${splittedText}`;
    }
  }
  // Remove double quotes;
  finalExpression = finalExpression.split("'").join("");
  // Make it all lowercase
  finalExpression = finalExpression.toLowerCase();
  // Add entityName
  finalExpression = `${attributeEntityName} ${finalExpression}`;

  return finalExpression;
};

export const standardCustomerSearchQuery = (warehouseTableName, fetchBy) => {
  let query;

  switch (fetchBy) {
    case GET_COUNT:
      query = `select count(*) as count from (select c2.id as c2_id, max(last_modified_time) as c2_last_updated from ${CLICKHOUSE_DATABASE}.${warehouseTableName} c2  group by c2.id) as c0 left join ${CLICKHOUSE_DATABASE}.${warehouseTableName} on id = c0.c2_id where last_modified_time = c0.c2_last_updated and`;
      break;
    case GET_ALL:
      query = `select * from (select c2.id as c2_id, max(last_modified_time) as c2_last_updated from ${CLICKHOUSE_DATABASE}.${warehouseTableName} c2  group by c2.id) as c0 left join ${CLICKHOUSE_DATABASE}.${warehouseTableName} on id = c0.c2_id where last_modified_time = c0.c2_last_updated and`;
      break;
    default:
      query = null;
      break;
  }
  return query;
};

export const frameExpression = async filterJSON => {
  const filters = Object.entries(filterJSON);
  let expression: string;
  const filterCount = filters.length;
  let count = 0;
  for (const [cond, value] of filters) {
    if (expression === undefined) {
      expression = `where`;
    }
    expression =
      typeof value === "number" || typeof value === "bigint"
        ? `${expression} ${cond} = ${value}`
        : `${expression} ${cond} = '${value}'`;
    count++;
    if (count < filterCount) {
      expression = `${expression} ${cond}`;
    }
  }
  return expression;
};
const fetchExpression = async exp => {
  switch (exp) {
    case "EQUALS":
      exp = "=";
      break;
    case "LESS_THAN":
      exp = "<";
      break;
    case "LESS_THAN_OR_EQUAL":
      exp = "<=";
      break;
    case "NOT_EQUALS":
      exp = "!=";
      break;
    case "GREATER_THAN":
      exp = ">";
      break;
    case "GREATER_THAN_OR_EQUAL":
      exp = ">=";
      break;
    case "LIKE":
      exp = "like";
  }
  return exp;
};
export const frameDynamicSQLFromJexl = async ruleConfiguration => {
  let condition;
  let expression = "";
  const ruleEntries = Object.entries(ruleConfiguration);
  const attributeValues = [];
  const attributeNames = [];
  const expressions = [];

  for (const [cond, values] of ruleEntries) {
    if (cond === "combinator") {
      condition = values;
    }
    const iteratorValues: any = values;
    if (cond === "rules") {
      for (const value of iteratorValues) {
        for (const [c, v] of Object.entries(value)) {
          switch (c) {
            case "attributeValue":
              attributeValues.push(v);
              break;
            case "attributeName":
              attributeNames.push(v);
              break;
            case "expressionType":
              expressions.push(v);
              break;
          }
        }
      }
    }
  }
  let c1 = 0;
  let finalExpression;
  const count = attributeNames.length;
  // tslint:disable-next-line:forin
  for (const index in attributeNames) {
    c1++;
    const aV = attributeValues[index];
    const aN = attributeNames[index];
    const exp = await fetchExpression(expressions[index]);
    expression =
      typeof aV === "number" || typeof aV === "bigint"
        ? `${expression} lower(${aN})${exp}${aV}`
        : `${expression} lower(${aN})${exp}lower('${aV}')`;
    if (c1 < count) {
      expression = `${expression} ${condition}`;
    }
  }

  finalExpression = `(${expression})`;

  return finalExpression;
};

const subscriber = new Redis({
  host: process.env.REDIS_HOST,
  // tslint:disable-next-line:radix
  port: parseInt(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});
const bullOptions = {
  createClient: type => {
    switch (type) {
      case "client":
        return client;
      case "subscriber":
        return subscriber;
      default:
        return new Redis({
          host: process.env.REDIS_HOST,
          // tslint:disable-next-line:radix
          port: parseInt(process.env.REDIS_PORT),
          maxRetriesPerRequest: null,
          enableReadyCheck: false
        });
    }
  }
};

export const updateEntity = (originalEntity, newEntity) => {
  Object.entries(newEntity).forEach(([key, value]) => {
    if (key !== "id") {
      originalEntity[key] = value;
    }
  });
  return originalEntity;
};

/**
 * @sortOptionBySeq
 * Sorts options wrt sortSeq in ASC order
 */
export const sortOptionBySeq = optionData => {
  optionData = optionData || [];
  optionData.sort((a: any, b: any) => {
    if (a.option.sortSeq < b.option.sortSeq) {
      return -1;
    }
    return 1;
  });
  return;
};

/**
 * @sortOptionValueBySeq
 * Sorts optionValue wrt sortSeq in ASC order
 */
export const sortOptionValueBySeq = optionValues => {
  optionValues = optionValues || [];
  optionValues.sort((a: any, b: any) => {
    if (a.sortSeq < b.sortSeq) {
      return -1;
    }
    return 1;
  });
  return;
};

export const findOrganizationOrThrowError: any = async (
  organizationId: any
) => {
  let foundOrganization: any;
  if (!organizationId) {
    throw new WalkinPlatformError(
      "INVALID_ORGANIZATION_ID",
      "Invalid organization id"
    );
  }
  const key = `${CACHING_KEYS.ORGANIZATION}_${organizationId}`;
  foundOrganization = await getValueFromCache(key);
  if (!foundOrganization) {
    foundOrganization = await Organization.findOne(organizationId);
    if (!foundOrganization) {
      throw new WalkinPlatformError(
        "ORGANIZATION_NOT_FOUND",
        "Organization not found"
      );
    } else {
      await setValueToCache(
        key,
        foundOrganization,
        EXPIRY_MODE.EXPIRE,
        CACHE_TTL
      );
      console.log("Fetched from database and Added to Cache with key: ", key);
    }
  } else {
    console.log("Fetched from Cache with key :", key);
  }
  return foundOrganization;
};

export const isUserPartOfInputOrganization: any = async (
  userOganization: any,
  inputOrganization: any
) => {
  const decendantOrgs = await getManager()
    .getTreeRepository(Organization)
    .findDescendants(userOganization);
  let result = false;
  for (const organization of decendantOrgs) {
    if (
      organization &&
      inputOrganization &&
      organization.id === inputOrganization.id
    ) {
      result = true;
      break;
    }
  }
  return result;
};

export const checkUserPartOfInputOrganizationElseThrowError: any = async (
  userOganization: any,
  inputOrganization: any
) => {
  const result = await isUserPartOfInputOrganization(
    userOganization,
    inputOrganization
  );
  if (!result) {
    throw new WalkinPlatformError(
      "INVALID_ACCESS_ORGANIZATION_ID",
      "Inavlid access to organization ID"
    );
  }
  return result;
};

export const findFileSystemOrThrowError: any = async (
  fileSystemId: any,
  organizationId: string
) => {
  let foundFileSystem: any;

  if (!fileSystemId) {
    throw new WalkinPlatformError(
      "INVALID_FILE_SYSTEM_ID",
      "Invalid FileSystem id"
    );
  }

  foundFileSystem = await FileSystem.findOne(fileSystemId);

  if (!foundFileSystem) {
    throw new WalkinPlatformError(
      "FILE_SYSTEM_NOT_FOUND",
      "FileSystem not found"
    );
  }

  if (foundFileSystem.organization.id === organizationId) {
    throw new WalkinPlatformError(
      "FILE_SYSTEM_NOT_FOUND",
      "FileSystem not found"
    );
  }

  return foundFileSystem;
};

export const linkShortner = async ({
  linkToBeShortened,
  firebaseDynamicLinkPrefix,
  firebaseDynamicLinkAPIURL,
  fireBaseAPIKey
}: {
  linkToBeShortened: string;
  firebaseDynamicLinkPrefix: string;
  firebaseDynamicLinkAPIURL: string;
  fireBaseAPIKey: string;
}) => {
  const body = {
    dynamicLinkInfo: {
      domainUriPrefix: firebaseDynamicLinkPrefix,
      link: linkToBeShortened
    },
    suffix: {
      option: "SHORT"
    }
  };
  if (!firebaseDynamicLinkAPIURL) {
    if (process.env.FIREBASE_DYNAMIC_LINK_API_URL) {
      firebaseDynamicLinkAPIURL = process.env.FIREBASE_DYNAMIC_LINK_API_URL;
    } else {
      throw new WCoreError(
        WCORE_ERRORS.FIREBASE_DYNAMIC_URL_API_NOT_CONFIGURED
      );
    }
  }
  const response = await fetch(firebaseDynamicLinkAPIURL + fireBaseAPIKey, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
  const result = await response.json();
  if (!result || !result.shortLink) {
    captureException(result);
    throw new WCoreError(WCORE_ERRORS.UNABLE_TO_GENERATE_SHORT_LINK);
  }
  return result.shortLink;
};

export const getJWTPayload = (token): string | object => {
  const publicKey = process.env.PUBLIC_KEY;
  const verified: string | object = jwt.verify(token, publicKey);
  return verified;
};

export const addPoliciesToRole = async (
  resources,
  policyPermissions,
  entityManager,
  role
) => {
  for (const resource of resources) {
    for (const permission of policyPermissions) {
      let policy = new Policy();
      policy.effect = POLICY_EFFECT.ALLOW;
      policy.type = POLICY_TYPE.ENTITY;
      policy.resource = POLICY_RESOURCES_ENTITY[resource];
      policy.accessLevel = POLICY_ACCESS_LEVEL.ALL;
      policy.permission = POLICY_PERMISSION_ENTITY[permission];
      policy = await entityManager.save(policy);
      role.policies.push(policy);
    }
  }
  return entityManager.save(role);
};

export const addMissingResourcesToAdminRole = async (
  entityManager,
  foundAdminRole
) => {
  // Filter and add if there are any missing resources for ADMIN role
  const entityResources = Object.keys(POLICY_RESOURCES_ENTITY);
  const entityPolicyPermissions = Object.keys(POLICY_PERMISSION_ENTITY);

  const existingResources = foundAdminRole.policies.map(policy => {
    return policy.resource;
  });

  const resourcesToBeAdded = entityResources.filter(entity => {
    return !existingResources.includes(entity);
  });

  if (resourcesToBeAdded.length > 0) {
    await addPoliciesToRole(
      resourcesToBeAdded,
      entityPolicyPermissions,
      entityManager,
      foundAdminRole
    );
  }
  return foundAdminRole;
};

export const findOrCreateAdminRole = async entityManager => {
  const foundAdminRole = await entityManager.findOne(Role, {
    where: {
      name: "ADMIN"
    },
    relations: ["policies"]
  });
  if (foundAdminRole) {
    // Filter and add if there are any missing resources for ADMIN role

    const entityResources = Object.keys(POLICY_RESOURCES_ENTITY);
    const entityPolicyPermissions = Object.keys(POLICY_PERMISSION_ENTITY);

    const existingResources = foundAdminRole.policies.map(policy => {
      return policy.resource;
    });
    const resourcesToBeAdded = entityResources.filter(entity => {
      return !existingResources.includes(entity);
    });

    if (resourcesToBeAdded.length > 0) {
      await addPoliciesToRole(
        resourcesToBeAdded,
        entityPolicyPermissions,
        entityManager,
        foundAdminRole
      );
    }
    return foundAdminRole;
  } else {
    const newAdminRole = new Role();
    const entityResources = Object.keys(POLICY_RESOURCES_ENTITY);
    const entityPolicyPermissions = Object.keys(POLICY_PERMISSION_ENTITY);

    newAdminRole.name = "ADMIN";
    newAdminRole.policies = [];

    return addPoliciesToRole(
      entityResources,
      entityPolicyPermissions,
      entityManager,
      newAdminRole
    );
  }
};

export const getJWTOptions = (): SignOptions => {
  return {
    issuer: process.env.JWT_ISSUER,
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: process.env.JWT_ALGORITHM as any
  };
};

export const getAPIOptions = (): SignOptions => {
  return {
    issuer: process.env.API_ISSUER,
    expiresIn: process.env.API_EXPIRES_IN,
    algorithm: process.env.API_ALGORITHM as any
  };
};

export const frameDynamicQuery = async (mainQuery, filterValues, source) => {
  // Explicitly Trimming "." since clickhouse doesnt support such date formats

  if (filterValues["from"] && filterValues["to"]) {
    filterValues["from"] = filterValues["from"].split(".")[0];
    filterValues["to"] = filterValues["to"].split(".")[0];
  }

  let whereCondition = "";
  let splitQuery;

  splitQuery =
    mainQuery.indexOf("group") > -1 ? mainQuery.split("group") : mainQuery;

  const query = Array.isArray(splitQuery) ? splitQuery[0] : splitQuery;
  const joinQuery = Array.isArray(splitQuery) ? ` group ${splitQuery[1]}` : "";
  if (Object.keys(filterValues).length > 0) {
    Object.keys(filterValues).forEach(key => {
      if (key !== "from") {
        if (query.indexOf("where") > -1 && query.indexOf("and") > -1) {
          whereCondition = whereCondition;
        } else if (query.indexOf("where") > -1 && query.indexOf("and") === -1) {
          whereCondition = `${whereCondition} and`;
        } else if (
          whereCondition.indexOf("where") > -1 &&
          whereCondition.indexOf("and") > -1 &&
          whereCondition.indexOf("between") > -1
        ) {
          whereCondition = `${whereCondition} and`;
        } else {
          whereCondition = `${whereCondition} where`;
        }
        if (key === "to" && source === DB_SOURCE.CORE) {
          whereCondition = `${whereCondition} created_time between "${filterValues["from"]}" and "${filterValues["to"]}"`;
        } else if (key === "to" && source === DB_SOURCE.WAREHOUSE) {
          whereCondition = `${whereCondition} created between "${filterValues["from"]}" and "${filterValues["to"]}"`;
        } else if (
          key === "in" &&
          whereCondition.indexOf("in") === -1 &&
          typeof Object.values(key) === "object"
        ) {
          if (Object.keys(filterValues[key]).length === 1) {
            const fieldName = Object.keys(filterValues[key]);
            const fieldValues = Object.values(filterValues[key])[0];
            const finalValue =
              "'" + fieldValues[0].split(",").join("','") + "'";
            whereCondition = `${whereCondition} ${fieldName[0]} ${key} (${finalValue})`;
          }
        } else {
          whereCondition = `${whereCondition} ${key} = "${filterValues[key]}"`;
        }
      }
    });

    return `${query} ${whereCondition} ${joinQuery}`;
  }
};

// This utility is unused as of now
export const frameExpressionFromJSON = async filterJSON => {
  const filters = Object.entries(filterJSON);
  let expression: string;
  const filterCount = filters.length;
  let count = 0;
  for (const [cond, value] of filters) {
    if (expression === undefined) {
      expression = `where`;
    }
    expression =
      typeof value === "number" || typeof value === "bigint"
        ? `${expression} ${cond} = ${value}`
        : `${expression} ${cond} = '${value}'`;
    count++;
    if (count < filterCount) {
      expression = `${expression} ${cond}`;
    }
  }
  return expression;
};

export const isUserOrAppAuthorizedToWorkOnOrganization = async (
  user,
  application,
  organizationId
) => {
  // if no organizationId is sent
  if (!organizationId) {
    if (user) {
      return user.organization.id;
    } else if (application) {
      return application.organization.id;
    }
    throw new WCoreError(WCORE_ERRORS.INVALID_ORG_ID);
  }

  if (user) {
    await authorizedToWorkOnOrganization(user, organizationId);
    return organizationId;
  } else if (application) {
    if (application.organization.id === organizationId) {
      return organizationId;
    } else {
      throw new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH);
    }
  } else {
    throw new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH);
  }
};

export const authorizedToWorkOnOrganization = (user, organizationId) => {
  if (user.organization.id === organizationId) {
    return true;
  } else {
    throw new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH);
  }
};

export const getLoggedInOrganizationId = (user, application) => {
  if (user.organization.id) {
    return user.organization.id;
  } else if (application) {
    return application.organization.id;
  } else {
    throw new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH);
  }
};

export interface IJWTPayload {
  org_id: string;
  app_id: string;
  id: string;
  iat: number;
  exp: number;
  iss: string;
}

export const removeDuplicates = rules => {
  rules = rules.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  return rules;
};
export const combineExpressions = async ruleConfiguration => {
  let finalExpression = "";
  let count = 0;
  if (ruleConfiguration.length > 0) {
    for (const ruleConfig of ruleConfiguration) {
      const expression = await frameDynamicSQLFromJexl(ruleConfig);
      // expression = expression.toLowerCase();
      finalExpression = `${finalExpression} ${expression}`;
      count++;
      if (count < ruleConfiguration.length) {
        finalExpression = `(${finalExpression}) and`;
      }
    }
  } else {
    finalExpression = await frameDynamicSQLFromJexl(ruleConfiguration);
    // finalExpression = finalExpression.toLowerCase();
  }
  return finalExpression;
};

export const executeQuery = async (query: string) => {
  const data = await clickHouseQuery(query);
  return data;
};

export const frameFinalQueries = async (
  expression: string,
  orgCode: string,
  pageNumber,
  sort
) => {
  const warehouseTableName = "search_customer_" + orgCode;
  const totalResultQuery = await standardCustomerSearchQuery(
    warehouseTableName,
    GET_COUNT
  );
  const baseQuery = await standardCustomerSearchQuery(
    warehouseTableName,
    GET_ALL
  );
  let finalBaseQuery;

  if (totalResultQuery === undefined || baseQuery === undefined) {
    throw new WCoreError(WCORE_ERRORS.INVALID_QUERY_PARAMS);
  }
  const finalTotalResultQuery = `${totalResultQuery} ${expression}`;
  // tslint:disable-next-line:prefer-conditional-expression
  if (sort && sort.attributeName && sort.order) {
    finalBaseQuery = `${baseQuery} ${expression} order by ${sort.attributeName
      } ${sort.order} limit 100 offset ${pageNumber - 1}`;
  } else {
    finalBaseQuery = `${baseQuery} ${expression} limit 100 offset ${pageNumber -
      1}`;
  }

  return {
    finalTotalResultQuery,
    finalBaseQuery
  };
};

export const getAllEntityNames = async () => {
  // tslint:disable-next-line:no-implicit-dependencies
  const entities = await require("@walkinserver/walkin-core/src/entity");
  const entityNames = Object.keys(entities);
  return entityNames;
};

export const getEntityByEntityName = async searchEntityName => {
  // tslint:disable-next-line:no-implicit-dependencies
  const entities = await require("@walkinserver/walkin-core/src/entity");
  if (entities.hasOwnProperty(searchEntityName)) {
    return entities[searchEntityName];
  }
};
export const mapTypesToColumnSlugType = columns => {
  columns = columns.map(column => {
    if (column.type) {
      let type: any = column.type;
      if (type === `simple-json`) {
        type = "json";
      }
      column.type = MAP_TYPE_TO_SLUGTYPE[type];
    }
    return column;
  });

  return columns;
};

export const createBullProducer = (queueName: string): Queue<any> => {
  const bull = new Bull(queueName, {
    createClient: type => {
      if (type === "client") {
        return new Redis({
          host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
          port: process.env.REDIS_PORT
            ? parseInt(process.env.REDIS_PORT, 10)
            : 6379,
          maxRetriesPerRequest: null,
          enableReadyCheck: false
        });
      }
      return null;
    }
  });
  return bull;
};

export const getCountForEntity = async (
  entityName,
  whereCondition,
  searchParams
) => {
  const tableName = getConnection().getMetadata(entityName).tableName;
  const result = await getRepository(entityName)
    .createQueryBuilder(tableName)
    .select("COUNT(*) as count")
    .where(whereCondition, searchParams)
    .cache(true)
    .execute();
  if (result.length > 0) {
    return result[0].count;
  }
  return result[0];
};

export const getPaginationInfo = (totalItems, perPage, page) => {
  const paginationInfo: IPaginationInfo = {
    totalPages: totalItems > perPage ? Math.ceil(totalItems / perPage) : 1,
    totalItems,
    page,
    perPage
  };

  paginationInfo.hasNextPage = page < paginationInfo.totalPages ? true : false;
  paginationInfo.hasPreviousPage = page !== 1 && page !== 0 ? true : false;

  return paginationInfo;
};
export const resetValues = (input, searchFor, value) => {
  Object.values(input).forEach(i => {
    if (i === searchFor) {
      input.i = value;
    }
  });
  console.log(input);
  return input;
};

export const logMethod = (
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor => {
  if (propertyDescriptor === undefined) {
    propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyName);
  }
  const originalMethod = propertyDescriptor.value;
  propertyDescriptor.value = async (...args: any[]) => {
    const params = args.map(a => {
      return a;
    });
    const result = await originalMethod.apply(this, args);
    console.log(`Call: ${propertyName}(${params}) => ${result}`);
    return result;
  };
  return propertyDescriptor;
};

export function getPaginationInfoOnly(
  pageOptions,
  totalCount
) {
  /**
  * If page and perPage not set then set default values
  *  page = 1
  *  perPage = 10 (alias name pageSize)
  */
  let page = 1;
  let pageSize = 10;

  if (Object.keys(pageOptions).length !== 0) {
    // If no pageOptions are passed
    if (pageOptions.page) {
      page = Number(pageOptions.page);
    }

    if (pageOptions.pageSize) {
      pageSize = Number(pageOptions.pageSize);
    }

  }
  const paginationInfo = getPaginationInfo(totalCount, pageSize, page);

  return paginationInfo;

}


export function addPaginateInfo(
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  if (propertyDescriptor === undefined) {
    propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyName);
  }
  const originalMethod = propertyDescriptor.value;
  propertyDescriptor.value = async function (...args: any[]) {


    const [result, total] = await originalMethod.apply(this, args);
    let paginationInfo = {};
    /**
     * If page and perPage not set then set default values
     *  page = 1
     *  perPage = 10 (alias name pageSize)
     */
    let page = 1;
    let pageSize = 10;

    for (const arg of args) {
      if (arg !== null && arg !== undefined && typeof arg === "object") {
        if (arg.page !== undefined) {
          page = arg.page;
        }
        if (arg.pageSize !== undefined) {
          pageSize = arg.pageSize;
        }
      }
    }

    paginationInfo = getPaginationInfo(total, pageSize, page);
    return {
      data: result,
      paginationInfo
    };
  };
  return propertyDescriptor;
}

export const setOrganizationToInput = (input, user, application) => {
  let organizationId;
  if (user) {
    if (user.organization?.status != 'ACTIVE') {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_ACTIVE)
    }
    organizationId =
      input.organizationId !== undefined && input.organization !== null
        ? input.organizationId
        : user.organization.id;
  } else if (application) {
    if (application.organization?.status != 'ACTIVE') {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_ACTIVE)
    }
    organizationId =
      input.organizationId !== undefined && input.organization !== null
        ? input.organizationId
        : application.organization.id;
  }
  input.organizationId = organizationId;
  return input;
};

export const setOrganizationToInputV2 = (input, user, application) => {
  let organizationId;
  if (user) {
    if (user.organization?.status != 'ACTIVE') {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_ACTIVE)
    }
    organizationId = user.organization.id;
  } else if (application) {
    if (application.organization?.status != 'ACTIVE') {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_ACTIVE)
    }
    organizationId = application.organization.id;
  }
  input.organizationId = organizationId;
  return input;
};

export const callExternalServices = async (url: string, options: IOptions) => {
  const { headers } = options;
  if (headers && headers.username && headers.password) {
    const authString = headers.username + ":" + headers.password;
    const bufferObject = Buffer.from(authString, "utf8");
    const authHeader = bufferObject.toString("base64");
    headers.Authorization = "Basic " + authHeader;
  }
  const formattedUrl = new URL(url);
  const requestOptions = {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers
    }
  };
  if (options.body) {
    requestOptions["body"] = JSON.stringify(options.body);
  }
  if (options.queryString) {
    const params = {
      ...options.queryString
    };
    formattedUrl.search = new URLSearchParams(params).toString();
  }

  const response = await fetch(formattedUrl, {
    ...requestOptions
  });
  const result = await response.json();
  if (!result) {
    captureException(result);
    throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
  }
  return result;
};

export const callLoadStoreSearch = async (storeId: string) => {
  const url = process.env.LAMBDA_GATEWAY_URL + "initiate-load-store-search";
  const options: any = {
    method: "POST",
    headers: {
      "x-api-key": process.env.LAMBDA_GATEWAY_AUTH_KEY
    },
    body: {
      store_id: storeId
    }
  };
  try {
    const response = await callExternalServices(url, options);
    return response;
  } catch (err) {
    captureException(err);
  }
};

/**
 *
 * please refer to the following issue to why date was done this was
 * https://github.com/moment/moment/issues/1199
 */
export const getTime = (dateTime: Moment): Moment => {
  return moment({ h: dateTime.hours(), m: dateTime.minutes() });
};

/**
 * will be used to remove comma from the values 1,200 -> 1200
 */
export const removeComma = (value: number) => {
  let formattedNumber: any = value.toString();
  formattedNumber = formattedNumber.replace(/\,/g, "");
  formattedNumber = toNumber(formattedNumber);
  return formattedNumber;
};

export const capitalizeFirstLetter = (value: string) => {
  const formattedString = value
    .toLowerCase()
    .replace(/(^\w{1})|(\s+\w{1})|(\W\w{1})/g, letter => letter.toUpperCase());

  return formattedString;
};

export const pad = (time: any, width: number = 4) => {
  const padding = "0"; // number to be added as pad to leftmost bit
  let formattedTime = removeComma(time);
  formattedTime = formattedTime.toString();
  if (formattedTime.length > width) {
    throw new WCoreError(WCORE_ERRORS.STORE_TIME_INVALID);
  }
  return formattedTime.length === width
    ? formattedTime
    : new Array(width - formattedTime.length + 1).join(padding) + formattedTime;
};

export const checkTimeValidity = (timeValues: number[]) => {
  for (const time of timeValues) {
    const formattedTime = pad(time);
    const momentTime = getTime(moment(formattedTime, "hhmm"));
    if (!momentTime.isValid()) {
      throw new WCoreError(WCORE_ERRORS.STORE_TIME_INVALID);
    }
  }
  return true;
};

/**
 * refer to the following doc for how pincodes are structured in india
 * https://en.wikipedia.org/wiki/Postal_Index_Number
 */
export const isPincodeValid = (pincode: string) => {
  /**
   * first character is a number from 1-9
   * next two numbers are from 0-9
   * then there might or might not be once space
   * and last three digits are alway a number from 0-9
   */
  const regex = new RegExp(/^[1-9]{1}[0-9]{2}s{0,1}[0-9]{3}$/gi);
  if (pincode.match(regex)) {
    return true;
  }
  return false;
};

/**
 * To which roles password rules will be applied
 */

export const PASSWORD_RULES_VALID_ROLES = ["ADMIN"];

export const applyPasswordRules = (user: User) => {
  const { roles } = user;
  let isPasswordRuleApplied = false;
  for (const role of roles) {
    const isRuleApplied = _.includes(PASSWORD_RULES_VALID_ROLES, role.name);
    if (isRuleApplied) {
      isPasswordRuleApplied = true;
      break;
    }
  }
  return isPasswordRuleApplied;
};

/**
 * Rules for Password validation
 * @param password {string}
 *
 */

export const isPasswordValid = (user: User, password: string) => {
  /**
   * * must contains one digit from 0-9
   * * must contains one lowercase characters
   * * must contains at least one special character
   * * length at least 8 characters and maximum of 20
   */
  if (applyPasswordRules(user)) {
    const regex = new RegExp(
      /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/g
    );
    if (password.match(regex)) {
      return true;
    }
    return false;
  }
  return true;
};

interface IOptions {
  method: string;
  headers?: any;
  body?: any;
  queryString?: any;
}

interface IPaginationInfo {
  totalPages: number;
  totalItems: number;
  page?: number;
  perPage?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export const sendPushNotification = async (
  communicationProvider,
  entityManager: EntityManager,
  input: sendPushNotificationInput
) => {
  const sendMessage = await communicationProvider.sendMessage(entityManager, {
    format: input.format,
    to: input.fcmToken,
    data: input.data,
    user_id: input.user_id
  });

  return true;
};

export const getUsersByStoreId = async (
  entityManager: EntityManager,
  storeId
) => {
  return await entityManager
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.store", "store")
    .where("store.id=:storeId", {
      storeId: storeId
    })
    .select("user.id")
    .getMany();
};

export const convertStringToBoolean = (value: string) => {
  const newValue: boolean = value === "true" ? true : false;
  return newValue;
};

export const emptyStringCheck = (value: string) => {
  if (typeof value !== "string" || value.trim().length == 0) {
    return null;
  }
  return value;
};

export const getAllCombination = (arr: any, prefix) => {
  prefix = prefix || "";
  if (!arr.length) {
    return prefix;
  }
  var resultedArray = arr.reduce((result, value) => {
    let combinationArray = [];
    result.map(obj => {
      value.map(newObj => {
        combinationArray.push(obj + prefix + newObj);
      });
    });
    return combinationArray;
  });

  return resultedArray;
};

const sameChildProducts = (existingChild, newChild) => {
  var foundDuplicateChild = false;
  const newChildIds = newChild.child
    ? newChild.child.map(product => product.id)
    : [];
  for (const [index, product] of existingChild.data.entries()) {
    const existingIds = product.child
      ? product.child.map(product => product.id)
      : [];
    if (_.isEqual(existingIds, newChildIds)) {
      foundDuplicateChild = true;
      existingChild.data[index] = newChild;
    }
  }
  if (!foundDuplicateChild) {
    existingChild.data.push(newChild);
  }
  return;
};

function flatten(arr) {
  return arr.reduce(
    (acc, cur) => acc.concat(Array.isArray(cur) ? flatten(cur) : cur),
    []
  );
}

export const formatInputProducts = (products: any) => {
  let productsById = new Map();

  products.forEach(product => {
    if (productsById.has(product.id)) {
      var existingDay = productsById.get(product.id);
      sameChildProducts(existingDay, product);
    } else {
      productsById.set(product.id, {
        id: product.id,
        data: [product]
      });
    }
  });
  var productsByIdGrouped = Array.from(productsById.values());
  var formattedProducts = [];
  productsByIdGrouped.forEach(products => {
    formattedProducts.push(products.data);
  });

  formattedProducts = flatten(formattedProducts);
  return formattedProducts;
};

export const getSlug = (value: string) => {
  const formattedString = value.toLowerCase().replace(/\s/g, "-");
  return formattedString;
};

export const getFormattedInputMenuTimings = timings => {
  let mappedTiming = [];
  for (const timing of timings) {
    if (!timing.data || (timing.data && timing.data.length === 0)) {
      throw new WCoreError(WCORE_ERRORS.MENU_TIMING_EMPTY);
    }
    for (const time of timing.data) {
      mappedTiming.push({
        days: [timing.days],
        openTime: time.openTime,
        closeTime: time.closeTime
      });
    }
  }

  return mappedTiming;
};

export const foundConflictInTiming = function (time1, time2) {
  return time1 !== time2 &&
    time1.closeTime - time2.openTime >= 0 &&
    time2.closeTime - time1.openTime >= 0
    ? true
    : false;
};

export const checkForDuplicatesAndConflicts = menuTimings => {
  if (!menuTimings || (menuTimings && menuTimings.length === 0)) {
    throw new WCoreError(WCORE_ERRORS.MENU_TIMING_EMPTY);
  }

  let menuTimingsByDay = [];

  // form an array containing time for each day, to make it easy for validation
  menuTimings.forEach(menuTiming => {
    let { openTime, closeTime, days } = menuTiming;
    days = typeof days === "string" ? JSON.parse(days) : days;
    if (days.length === 0) {
      throw new WCoreError(WCORE_ERRORS.INVALID_DAYS);
    }
    days.forEach(day => {
      menuTimingsByDay.push({
        day,
        openTime,
        closeTime
      });
    });
  });

  // check for duplicates
  let formatMenuTimingsByDay = menuTimingsByDay.reduce(
    (accumulator, currentTiming) => {
      if (accumulator.length > 0) {
        for (let [index, timing] of accumulator.entries()) {
          if (_.isEqual(timing, currentTiming)) {
            throw new WCoreError(WCORE_ERRORS.DUPLICATE_DAYS_FOUND);
          } else {
            if (index == accumulator.length - 1) {
              accumulator.push(currentTiming);
              break;
            }
          }
        }
      } else {
        accumulator.push(currentTiming);
      }
      return accumulator;
    },
    []
  );

  // group by day & check for conflicts
  let groupedByDay = _.groupBy(formatMenuTimingsByDay, "day");
  _.each(_.toArray(groupedByDay), function (menuTimings) {
    for (let i = 0; i < menuTimings.length; i++) {
      for (let x = 0; x < menuTimings.length; x++) {
        if (foundConflictInTiming(menuTimings[i], menuTimings[x])) {
          throw new WCoreError(WCORE_ERRORS.CONLFICT_IN_MENU_TIMINGS_FOR_DAYS);
        }
      }
    }
  });
};

export const validateTime = time => {
  const timeStr = padTimeWithLeadingZeros(time);
  const regex = new RegExp("^([01]\\d|2[0-3])([0-5]\\d)$"); // 1345 will be 01:45 PM

  if (timeStr.match(regex)) {
    return true;
  }
  return false;
};

export const padTimeWithLeadingZeros = time => {
  time = time.toString();
  while (time.length < 4) {
    time = "0" + time;
  }
  return time;
};

export const getTimeInMiutes = timeStr => {
  let hours = parseInt(timeStr.slice(0, 2));
  let minutes = parseInt(timeStr.slice(2)) || 0;
  const timeInMinutes = hours * 60 + minutes;
  return timeInMinutes;
};

export const getUniqueDays = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const formatDays = days => {
  const dayValues = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7
  };
  days = typeof days === "string" ? JSON.parse(days) : days;
  const uniqueDays = days.filter(getUniqueDays);
  days.sort((day1, day2) => {
    return dayValues[day1] - dayValues[day2];
  });
  return JSON.stringify(uniqueDays);
};

/**
 * @validateMenuTimings
 * Check for duplicate and overlapping menu timings
 * Validate openTime and closeTime
 * Fetch timings in minutes and validate. openTime should be less than closeTime
 */
export const validateMenuTimings = timings => {
  checkForDuplicatesAndConflicts(timings);

  timings.forEach(timing => {
    let { openTime, closeTime } = timing;
    if (!validateTime(openTime)) {
      throw new WCoreError(WCORE_ERRORS.OPEN_TIME_INVALID);
    }
    if (!validateTime(closeTime)) {
      throw new WCoreError(WCORE_ERRORS.CLOSE_TIME_INVALID);
    }

    let openTimeStr = padTimeWithLeadingZeros(openTime);
    let closeTimeStr = padTimeWithLeadingZeros(closeTime);

    if (getTimeInMiutes(openTimeStr) >= getTimeInMiutes(closeTimeStr)) {
      throw new WCoreError(WCORE_ERRORS.INCORRECT_MENU_TIMING);
    }

    timing.days = formatDays(timing.days);
  });
  return timings;
};

export const formatMenuTimings = timings => {
  if (timings.length === 0) {
    return;
  }
  timings.forEach(menuTiming => {
    menuTiming.days = JSON.parse(menuTiming.days);
  });
  let timingsByDay = new Map();
  timings.forEach(timing => {
    timing.days.forEach(day => {
      if (timingsByDay.has(day)) {
        const existingDay = timingsByDay.get(day);
        existingDay.data.push({
          id: timing.id,
          openTime: timing.openTime,
          closeTime: timing.closeTime
        });
      } else {
        timingsByDay.set(day, {
          days: JSON.stringify([day]),
          data: [
            {
              id: timing.id,
              openTime: timing.openTime,
              closeTime: timing.closeTime
            }
          ]
        });
      }
    });
  });

  const menuTimings = Array.from(timingsByDay.values());
  const formattedMenuTimings = {
    name: timings[0].name,
    code: timings[0].code,
    timings: menuTimings
  };
  return formattedMenuTimings;
};

export const formatMenuTimingsForCode = menuTimings => {
  let formattedMenuTiming = [];

  // Group by each menu timing code
  let groupedByCode = _.groupBy(menuTimings, "code");

  // Format the response to send menuTimings for each code
  _.each(groupedByCode, function (timings) {
    formattedMenuTiming.push(formatMenuTimings(timings));
  });
  return formattedMenuTiming;
};

export const formatUpdateMenuTimingInput = menuTimings => {
  let mappedTiming = [];

  for (const timing of menuTimings) {
    mappedTiming.push({
      id: timing.id,
      days: [timing.days],
      openTime: timing.openTime,
      closeTime: timing.closeTime
    });
  }

  return mappedTiming;
};

export const formatProductCode = (productName: string) => {
  const productCode = productName.replace(/\s+/g, "");
  return productCode;
};

export const getApolloClient = uri =>
  new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: createHttpLink({
      fetch: fetch as any,
      uri
    })
  });

export const generateOrganizationToken = async (organizationId: string) => {
  const PEPPO_URL = process.env.PEPPO_SERVICE_URL;
  const TOKEN_GENERATION_URL = `${PEPPO_URL}/service/sa/get_org_api_key`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      SA_API_KEY: "Bearer " + process.env.SA_API_KEY
    },
    body: JSON.stringify({ org_id: organizationId }),
    json: true
  };
  const response = await fetch(TOKEN_GENERATION_URL, {
    ...options
  });
  const json = await response.json();

  const {
    data: { api_key }
  } = json;
  return api_key;
};



export const isValidString = input => {
  if (input && input.toString().trim().length !== 0) {
    return true;
  }
  return false;
};


/**
 * @hasSqlInjectionCharacters
 * We pass the input string and we are 
 * checking whether any sql injection characters are there.
 */
export function hasSqlInjectionCharacters(entityName, comparisonType, input) {

  const validCombinations = {
    [ENTITY_NAME.COLLECTION]: {
      [COMPARISON_TYPE.LIKE]: REGEX_STRING.LIKE_COMPARISON,
    },
    [ENTITY_NAME.RULE_SET]: {
      [COMPARISON_TYPE.EQUAL_TO]: REGEX_STRING.EQUAL_TO_COMPARISON,
    },
  };

  const regex = validCombinations[entityName]?.[comparisonType];

  // !!regex will be false if there is no valid combination present
  // !!input.match(regex) will be false if input does not contain any of the characters in the regex

  // both !!regex and !!input.match(regex) will be true if the parameter passed is a valid combination and it has injection chars

  return !!regex && !!input.match(regex);
}


export function detectMaliciousCode(code) {

  if (!isValidString(code)) {
    return true;
  }

  const forbiddenPatterns = FORBIDDEN_PATTERNS;

  const forbiddenKeywords = FORBIDDEN_KEYWORDS;

  const forbiddenMethods = FORBIDDEN_METHODS;

  const hasMaliciousCode = (
    forbiddenPatterns.some(pattern => pattern.test(code)) ||
    forbiddenKeywords.some(keyword => code.includes(keyword)) ||
    forbiddenMethods.some(method => code.includes(method))
  );

  return hasMaliciousCode;
}


export const validateStatus = status => {
  const validString = isValidString(status);
  const allowedStatus = Object.values(STATUS);
  const validStatus = allowedStatus.includes(status);

  if (!validString || !validStatus) {
    return false;
  }
  return true;
};

export const validateCollectionsEntity = entity => {
  const isValidEntity = isValidString(entity);
  const allowedEntitySchema = Object.values(COLLECTIONS_ENTITY_TYPE);
  const validEntityType = allowedEntitySchema.includes(entity);

  if (!isValidEntity || !validEntityType) {
    return false;
  }
  return true;
};

export const validateCollectionType = type => {
  const isValidType = isValidString(type);
  const allowedCollectionType = Object.values(COLLECTIONS_TYPE);
  const validCollectionType = allowedCollectionType.includes(type);

  if (!isValidType || !validCollectionType) {
    return false;
  }

  return true;
}

export const getOrganizationIdFromAuthToken = authorization => {
  let organizationId;
  try {
    const token = authorization.split(" ")[1];
    organizationId = getJWTPayload(token)["org_id"];
  } catch (error) {
    // Do nothing - jwt token could be expired
  }
  return organizationId;
};

export function validateCronExpression(cronExpression: string) {
  const cronResult = cron(cronExpression);
  if (!cronResult.isValid()) {
    throw new WCoreError(WCORE_ERRORS.INVALID_CRON_EXPRESSION);
  }
  /**
    * To get value of cron expression
      const validValue = cronResult.getValue();
      console.log("validValue", validValue);
  */
  return {
    cronResult
  };
}

export function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

export const camelizeKeys = async (obj) => {
  if (_.isArray(obj)) {
    return await Promise.all(obj.map(async (item) => {
      return camelizeKeys(item);
    }));
  } else {
    var camelCaseObject = {};
    _.forEach(
      obj,
      function (value, key) {
        if (_.isPlainObject(value) || _.isArray(value)) {
          value = camelizeKeys(value);
        }
        camelCaseObject[_.camelCase(key)] = value;
      }
    );
    return camelCaseObject;
  }
};

export function formatLoyaltyProgramCode(string = "") {
  // test Loyalty  Program___code => TEST_LOYALTY_PROGRAM_CODE
  if (string) {
    string = string.trim().toUpperCase().replace(/\s+/g, "_").replace(/_+/g, "_");
  }
  return string;
}

/**
 * @addDistinctRulesToRuleSets
 * In this function we are getting the array of ruleSets objects and there may be some objects 
 * with ruleSet id (with other properties) repeating and we should maintain unique set of ruleSet objects
 * to maintain the unique set of ruleSet objects we make use of map 
 * and in each value it holds a unique ruleSet object and to that we add the recurring rules object as a part of its array
 * ,and if the rule is not set for the ruleset all the columns of rule will be null for it in that case we should not add that to the ruleSet object
 */
export function addDistinctRulesToRuleSets(ruleSets) {
  const ruleSetMap = new Map<string, any>();

  for (const ruleSet of ruleSets) {
    const { id, rules } = ruleSet;
    const parsedRuleSetRules = JSON.parse(rules);


    if (!ruleSetMap.has(id)) {
      if (parsedRuleSetRules.id != null) {
        ruleSetMap.set(id, { ...ruleSet, rules: [parsedRuleSetRules] });
      }
      else {
        ruleSetMap.set(id, { ...ruleSet, rules: [] });
      }
    } else {
      // For ruleSet which has no rules this part will be executed
      const currentRuleSetObject = ruleSetMap.get(id);
      currentRuleSetObject.rules.push(parsedRuleSetRules);
      ruleSetMap.set(id, currentRuleSetObject);
    }
  }

  const results = [];

  ruleSetMap.forEach((rulesetObject) => {
    results.push(rulesetObject);
  });

  return results;
}


function getPageNumber(pageNumber) {
  if (pageNumber && !(isNaN(pageNumber)) && pageNumber > 0) {
    return pageNumber;
  }

  return 1;

}

function getItemsPerPage(itemsPerPage) {
  if (itemsPerPage && !(isNaN(itemsPerPage)) && itemsPerPage > 0 && itemsPerPage <= 10) {
    return itemsPerPage;
  }

  return 10;

}

// This function tries to parse the json data 
export function parseCollectionData(collection) {
  const {
    id,
    STORE_ENTITY_INFORMATION,
    CUSTOMER_ENTITY_INFORMATION,
    PRODUCT_ENTITY_INFORMATION,
    campaign,
    rule_set
  } = collection;

  const parsedRuleSet = JSON.parse(rule_set);
  const parsedStore = JSON.parse(STORE_ENTITY_INFORMATION);
  const parsedCustomer = JSON.parse(CUSTOMER_ENTITY_INFORMATION);
  const parsedProduct = JSON.parse(PRODUCT_ENTITY_INFORMATION);
  const parsedCampaign = JSON.parse(campaign);

  return {
    id,
    parsedRuleSet,
    parsedStore,
    parsedCustomer,
    parsedProduct,
    parsedCampaign
  };
}


/**
 * This function arranges the duplicate entity information
 * into the respective collection
 */
export function addMultipleEntitiesToRespectiveCollection(collections) {
  const collectionMap = new Map();

  for (const collection of collections) {
    const { id, parsedRuleSet, parsedStore, parsedCustomer, parsedProduct, parsedCampaign } = parseCollectionData(collection);

    if (!collectionMap.has(id)) {
      // If the collection id doesn't exist in the map
      const { STORE_ENTITY_INFORMATION, CUSTOMER_ENTITY_INFORMATION, PRODUCT_ENTITY_INFORMATION, rule_set_id, rule_set, ...filteredCollection } = collection;


      let collectionsItems = null;
      if (parsedStore) {
        collectionsItems = [parsedStore];
      } else if (parsedCustomer) {
        collectionsItems = [parsedCustomer];
      } else if (parsedProduct) {
        collectionsItems = [parsedProduct];
      }

      const updatedCollection = {
        ...filteredCollection,
        ruleSet: parsedRuleSet,
        collectionsItems,
        campaign: parsedCampaign
      };

      collectionMap.set(id, updatedCollection);
    } else {
      // If the collection id already exists in the map
      const currentCollectionObject = collectionMap.get(id);

      if (currentCollectionObject.entity === "STORE") {
        currentCollectionObject.collectionsItems.push(parsedStore);
      } else if (currentCollectionObject.entity === "CUSTOMER") {
        currentCollectionObject.collectionsItems.push(parsedCustomer);
      } else if (currentCollectionObject.entity === "PRODUCT") {
        currentCollectionObject.collectionsItems.push(parsedProduct);
      }

      collectionMap.set(id, currentCollectionObject);
    }
  }

  // Retrieving the collections from the keys of the map and returning the values alone as an array
  return { results: Array.from(collectionMap.values()) };
}



/**
 * @retrivePageinationParams
 * We pass the input object with page and pageSize 
 * and we frame the actual pagination parameters using that
 */
export function retrievePaginationValues(input) {
  const pageNumber = getPageNumber(input.page || input.pageOptions?.page);
  const take = getItemsPerPage(input.pageSize || input.pageOptions?.pageSize);
  const skip = (pageNumber - 1) * take;


  return { skip, take };
}

export async function validateSupportEmailInput(input) {
  const allowedSupportType = Object.values(SUPPORT_TYPE);
  if (!allowedSupportType.includes(input.supportType)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_SUPPORT_TYPE);
  }

  const allowedSupportSubType = Object.values(SUPPORT_SUBTYPE);
  if (!allowedSupportSubType.includes(input.supportSubType)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_SUPPORT_SUBTYPE);
  }

  if (!isValidString(input.content)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_CONTENT);
  }

  if (!isValidString(input.subject)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_SUBJECT);
  }

  if (input.email) {
    const isEmailValid = await isValidEmail(input.email);
    if (!isEmailValid) {
      throw new WCoreError(WCORE_ERRORS.INVALID_EMAIL);
    }
  }

  return;
}


/**
 * @formWhereConditionForArrayMatch
 * We form the where condition to check the match at 
 * least for one value in the column rules
 */
export function formWhereConditionForArrayMatch(includedRulesArray) {
  let conditionString = ` and `;

  for (let rule_id = 0; rule_id < includedRulesArray.length; rule_id++) {
    conditionString += ` FIND_IN_SET(${includedRulesArray[rule_id]} , REPLACE(REPLACE(rules, '[', ''), ']', '')) > 0 `;

    if (rule_id !== includedRulesArray.length - 1) {
      conditionString += ` OR `;
    }

  }

  return conditionString;
}

export function generateSupportMailContent(organization, user, content) {
  const { id: orgId, code: orgCode } = organization;
  const { userName, email: userEmail } = user;
  const messageBody = `
      <p>Hi Team!<p>
      We have received a support request from one of our valued customers, we would greatly appreciate if we address this matter promptly.
      <br/>
      <br/>
      Please find the details below:<br/>
      ${content}
      <br/>
      We kindly request your attention and expertise in looking into this matter.
      <br/>
      <br/>
      Sincerely,<br/>
      ${userName}<br/>
      ${userEmail}
      <br/>
      <p>Organization Info:<br/>
      id: ${orgId}<br/>
      code: ${orgCode}<br/>
      `;

  return messageBody;
}

export const getPageOptions = (input) => {
  const page = parseInt(input.page|| input.pageOptions?.page) || 1;
  // pageSize should not exceed a maximum value of 10
  let pageSize = Math.min(parseInt(input.pageSize || input.pageOptions?.pageSize) || 10, 10);
  
  return { page, pageSize };
}