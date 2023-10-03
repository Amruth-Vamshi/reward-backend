import { WalkinError } from "./../exceptions/walkin-platform-error";
import { WCoreError } from "../exceptions";
import { WCORE_ERRORS } from "../constants/errors";
import {
  Organization,
  User,
  MessageTemplate,
  Metric,
  MetricFilter,
  TaxType,
  Catalog,
  Channel,
  ChargeType,
  StoreFormat,
  DiscountType
} from "../../../entity";
import {
  validateIfExists,
  validateIfExistsForOrg
} from "./UniquenessValidation";
import { isValidString, resetValues } from "../utils/utils";
import { ACCEPTED_INTERNAL_WEBHOOKS, EMOJI_PATTERN, RELEASED_WALKIN_PRODUCTS, WEBHOOK_TYPE } from "../constants";
export const validationDecorator = async (
  wrappedFunction: () => any,
  validationsArray: any[],
  errorType?: any
) => {
  return Promise.all(validationsArray).then(results => {
    if (results.every(value => value === true)) {
      return wrappedFunction();
    } else {
      const errors = [];
      results.forEach((element, index, array) => {
        if (element.hasOwnProperty("MESSAGE")) {
          errors.push(element);
        }
        if (index + 1 === array.length) {
          throw new WCoreError({
            HTTP_CODE: 404,
            MESSAGE: errors[0].MESSAGE,
            CODE: errors[0].CODE
          });
        }
      });
    }
  });
};

/**
 * check weather the fields of the object actually contains a value or not
 * e.g. {name:"",age:"21"} will fail. add an error "name cannot be null"
 * e.g. {name:"someone",age:"21"} will pass
 * @param {{}} input
 * @param {[]} required
 * @param {[]} errors
 * @returns {[{}]} an array of  errors
 */
export const checkEmptyFields = (input, required = [], errors = []) => {
  Object.keys(input).map(key => {
    if (
      input[key] !== undefined &&
      input[key] !== null &&
      input[key].length === 0 &&
      ((required.length !== 0 && required.includes(key)) ||
        required.length === 0)
    ) {
      errors.push({
        message: `${key} cannot be null`,
        code: "WALKIN_ERROR"
      });
    }
  });
  return errors;
};

/**
 * Checks weather the number is valid or not. it will match phone numbers like +91-1234567890, +911234567890, 1234567890
 * @param {number} phoneNumber
 * @returns {Boolean} either true or false
 */

export const isValidPhone = (phoneNumber) => {
  if (phoneNumber.trim().length === 0) {
    return false;
  }
  if (phoneNumber.length < 10) {
    return false;
  }
  // regex for matching phone number. it will match phone numbers +91-9234567890, +919234567890, 916929292945, 9929292945, 6929292945
  const pattern = /^([+]?\d{2}[.-\s]?)?([6-9]\d{9}$)/g;
  return phoneNumber.match(pattern) ? true : false;
};

export const isEmojiPresent = text => {
  let emojiRegexPattern = EMOJI_PATTERN;
  return text.match(emojiRegexPattern) ? true : false;
}

export const isValidEmail = email => {
  if (isEmojiPresent(email)) {
    return false;
  }
  const pattern = /\S+@\S+\.\S+/;
  return email.match(pattern) ? true : false;
};

export const isValidDateOfBirth = dateOfBirth => {
  const dob = new Date(dateOfBirth);
  const d: Date = new Date();
  return d < dob ? false : true;
};

export const isValidKey = key => {
  // lower case characters, numbers  and _ only
  const regEx = new RegExp("^[a-z0-9_]*$");
  return regEx.test(key);
};

export const isValidOrg = async (entityManager, input) => {
  input = input ? input : {};
  const code = input.code !== undefined ? input.code : "";
  const name = input.name !== undefined ? input.name : "";
  // Org code should contain only alphanumeric and unique
  // if (code) {
  if (!code.match(/^[a-zA-Z0-9_]+$/)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_ORG_CODE);
  }

  if (input.name && input.name === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  const hasCode = await validateIfExists(
    entityManager,
    Organization,
    "code",
    code
  );

  if (hasCode) {
    throw new WCoreError(WCORE_ERRORS.ORG_CODE_EXISTS);
    // }
  }
  // Name should contain only alphanumeric, underscores and spaces
  if (name && !name.match(/^[0-9a-zA-Z_\s]+$/)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_ORG_NAME);
  }
  return true;
};

export const validateWalkinProducts = (walkinProducts = []) => {
  if (walkinProducts.length > 0) {
    const allowedWalkinProducts = Object.values(RELEASED_WALKIN_PRODUCTS);

    for (const walkinProduct of walkinProducts) {
      const validString = isValidString(walkinProduct);
      const validStatus = allowedWalkinProducts.includes(walkinProduct);
      if (!validString || !validStatus) {
        throw new WCoreError(WCORE_ERRORS.INVALID_WALKIN_PRODUCT);
      }
    }
  }
  return;
}

export const isValidUser = async (entityManager, input) => {
  const email = input.email !== undefined ? input.email : "";

  if (input.firstName === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  // Email should be valid & unique
  if (email) {
    if (!email.match(/\S+@\S+\.\S+/)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_EMAIL);
    }

    const hasEmail = await validateIfExists(
      entityManager,
      User,
      "email",
      email
    );

    if (hasEmail) {
      throw new WCoreError(WCORE_ERRORS.EMAIL_EXISTS);
    }
  }

  const { password } = input;
  if (!isValidString(password)) {
    throw new WCoreError(WCORE_ERRORS.PASSWORD_CANNOT_BE_EMPTY);
  }

  return true;
};

export const isValidMessageTemplate = async (entityManager, input) => {
  const name = input.name !== undefined ? input.name : "";
  const organization =
    input.organization_id !== undefined ? input.organization_id : "";
  const options = {
    name,
    organization
  };

  if (input.name === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  if (name) {
    const hasName = await validateIfExistsForOrg(
      entityManager,
      MessageTemplate,
      options
    );

    if (hasName) {
      throw new WCoreError(WCORE_ERRORS.NAME_NOT_UNIQUE_TO_ORG);
    }
    return true;
  }
};

export const isValidMetric = async (entityManager, input) => {
  input = resetValues(input, undefined, "");

  const hasOrganization = await validateIfExists(
    entityManager,
    Organization,
    "id",
    input.organizationId
  );

  if (!hasOrganization) {
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }

  if (input.name === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  if (input.name) {
    const hasMetricName = await validateIfExists(
      entityManager,
      Metric,
      "name",
      input.name
    );

    if (hasMetricName) {
      throw new WCoreError(WCORE_ERRORS.METRIC_NAME_NOT_UNIQUE);
    }
  }
};

export const isValidTaxType = async (entityManager, input) => {
  input = resetValues(input, undefined, null);
  const hasOrganization = await validateIfExists(
    entityManager,
    Organization,
    "id",
    input.organizationId
  );

  if (!hasOrganization) {
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }

  if (input.name === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  if (input.name) {
    let hasTaxTypeCode = false;
    const options = {
      organization: input.organizationId,
      taxTypeCode: input.taxTypeCode
    };

    hasTaxTypeCode = await validateIfExistsForOrg(
      entityManager,
      TaxType,
      options
    );
    console.log(hasTaxTypeCode);
    if (hasTaxTypeCode) {
      throw new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_UNIQUE);
    }
  }
};

export const isValidStoreFormat = async (entityManager, input) => {
  input = resetValues(input, undefined, null);
  const hasOrganization = await validateIfExists(
    entityManager,
    Organization,
    "id",
    input.organizationId
  );

  if (!hasOrganization) {
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }

  if (input.name === "" || input.storeFormatCode === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  if (input.name) {
    let hasStoreFormat = false;
    const options = {
      organization: input.organizationId,
      storeFormatCode: input.storeFormatCode
    };

    hasStoreFormat = await validateIfExistsForOrg(
      entityManager,
      StoreFormat,
      options
    );
    if (hasStoreFormat) {
      throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_UNIQUE);
    }
  }
};

export const isValidChannel = async (entityManager, input) => {
  input = resetValues(input, undefined, null);
  const hasOrganization = await validateIfExists(
    entityManager,
    Organization,
    "id",
    input.organizationId
  );

  if (!hasOrganization) {
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }

  if (input.name === "" || input.channelCode === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  if (input.name && input.channelCode) {
    let hasChannel = false;
    const options = {
      organization: input.organizationId,
      channelCode: input.channelCode
    };

    hasChannel = await validateIfExistsForOrg(entityManager, Channel, options);
    if (hasChannel) {
      throw new WCoreError(WCORE_ERRORS.CHANNEL_CODE_EXISTS);
    }
  }
};

export const isValidChargeType = async (entityManager, input) => {
  input = resetValues(input, undefined, null);

  const hasOrganization = await validateIfExists(
    entityManager,
    Organization,
    "id",
    input.organizationId
  );

  if (!hasOrganization) {
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }

  if (input.name === "" || input.chargeTypeCode === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  if (input.name && input.chargeTypeCode) {
    let hasChargeType = false;
    const options1 = {
      organization: input.organizationId,
      chargeTypeCode: input.chargeTypeCode
    };

    hasChargeType = await validateIfExistsForOrg(
      entityManager,
      ChargeType,
      options1
    );

    if (hasChargeType) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_CODE_EXISTS);
    }
    let hasChargeTypeName = false;
    const options2 = {
      organization: input.organizationId,
      name: input.name
    };

    hasChargeTypeName = await validateIfExistsForOrg(
      entityManager,
      ChargeType,
      options2
    );

    if (hasChargeTypeName) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NAME_EXISTS);
    }
  }
};

export const isValidMetricFilter = async (entityManager, input) => {
  input = resetValues(input, undefined, null);

  const hasOrganization = await validateIfExists(
    entityManager,
    Organization,
    "id",
    input.organizationId
  );

  if (!hasOrganization) {
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }

  if (input.name) {
    if (input.name === "") {
      throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
    }

    const hasMetricName = await validateIfExists(
      entityManager,
      MetricFilter,
      "name",
      input.name
    );

    if (hasMetricName) {
      throw new WCoreError(WCORE_ERRORS.METRIC_FILTER_NAME_NOT_UNIQUE);
    }
  }

  if (input.key) {
    // Key should adhere to expression
    const validKey = isValidKey(input.key);

    if (validKey !== null && !validKey) {
      throw new WCoreError(WCORE_ERRORS.MALFORMED_DATA);
    }
  }
};

export const isValidDiscountType = async (entityManager, input) => {
  input = resetValues(input, undefined, null);

  const hasOrganization = await validateIfExists(
    entityManager,
    Organization,
    "id",
    input.organizationId
  );

  if (!hasOrganization) {
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }

  if (input.name === "" || input.discountTypeCode === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  if (input.name && input.discountTypeCode) {
    let hasDiscountType = false;
    const options1 = {
      organization: input.organizationId,
      discountTypeCode: input.discountTypeCode
    };

    hasDiscountType = await validateIfExistsForOrg(
      entityManager,
      DiscountType,
      options1
    );

    if (hasDiscountType) {
      throw new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_CODE_EXISTS);
    }
    let hasDiscountTypeName = false;
    const options2 = {
      organization: input.organizationId,
      name: input.name
    };

    hasDiscountTypeName = await validateIfExistsForOrg(
      entityManager,
      DiscountType,
      options2
    );

    if (hasDiscountTypeName) {
      throw new WCoreError(WCORE_ERRORS.DISCOUNT_TYPE_NAME_EXISTS);
    }
  }
};

export const isValidCatalog = async (entityManager, input) => {
  input = resetValues(input, undefined, "");

  const hasOrganization = await validateIfExists(
    entityManager,
    Organization,
    "id",
    input.organizationId
  );

  if (!hasOrganization) {
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }

  if (input.name && input.name === "") {
    throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
  }

  if (input.catalogCode) {
    const options = {
      organization: input.organizationId,
      catalogCode: input.catalogCode
    };

    const hasCatalogCode = await validateIfExistsForOrg(
      entityManager,
      Catalog,
      options
    );

    if (hasCatalogCode) {
      throw new WCoreError(WCORE_ERRORS.CATALOG_CODE_ALREADY_EXISTS);
    }
  }
};

export const isValidURLName = urlName => {
  if (ACCEPTED_INTERNAL_WEBHOOKS().includes(urlName)) {
    return true;
  }
  return false;
};

export const isValidWebhook = (webhookType, url) => {
  if (webhookType === WEBHOOK_TYPE.INTERNAL) {
    return isValidURLName(url);
  }
  return true;
};
