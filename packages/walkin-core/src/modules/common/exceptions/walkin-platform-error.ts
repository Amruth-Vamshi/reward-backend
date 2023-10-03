import i18n from "i18n";

import { ApolloError } from "apollo-server";

/**
 * This is the base class for WalkinPlatformError.
 * Error message will take from the configuration based on errorCode.
 * Status can be set while creating the object elses status will be 500.
 */

export class WalkinPlatformError extends Error {
  public status: number;
  public errorCode: string;
  public errorMessage: string;
  public rejectedValues: any;
  public time: Date;
  public additionalInformation: any;
  constructor(
    errorCode?,
    errorName?,
    rejectedValues?,
    statusCode?,
    additionalInfo?
  ) {
    super(i18n.__(`${errorName ? errorName : `errors.${errorCode}.message`}`));
    this.status =
      statusCode || i18n.__(`errors.${errorCode}.statusCode`) || 500;
    this.errorCode = i18n.__(`errors.${errorCode}.code`);
    this.name = i18n.__(`errors.names.${errorName}`);
    this.errorMessage = i18n.__(
      `${errorName ? errorName : `errors.${errorCode}.message`}`
    );
    this.rejectedValues = rejectedValues;
    this.time = new Date();
    this.additionalInformation = additionalInfo;
  }
}

export class WalkinError extends ApolloError {
  public validationErrors: any;
  constructor(
    message?: string,
    code?: string,
    properties?: any,
    validationErrors?: any[]
  ) {
    code = code || "WALKIN_ERROR";
    super(message, code, properties);
    this.validationErrors = formatValidationErrors(
      validationErrors,
      message,
      code
    );
  }
}

export class WalkinRecordNotFoundError extends WalkinError {
  constructor(message?: string, properties?: any, validationErrors?: any[]) {
    super(message, "RECORD_NOT_FOUND", properties, validationErrors);
  }
}

const formatValidationErrors = (errors, defaultMessage, defaultCode) => {
  if (!errors) {
    return [{ message: defaultMessage, code: defaultCode }];
  }
  return errors.map(({ id, message }) => {
    return { id, message: i18n.__(`errors.${message}.message`) };
  });
};
