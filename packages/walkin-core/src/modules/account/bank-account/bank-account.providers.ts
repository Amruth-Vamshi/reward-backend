import { Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import UrlSafeString from "url-safe-string";

import { Organization, BankAccount } from "../../../entity";
import { STATUS, ACCOUNT_TYPE } from "../../common/constants";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { Buffer } from "buffer";
import * as status from "http-status-codes";
import {
  addPaginateInfo,
  updateEntity,
  callExternalServices
} from "../../common/utils/utils";
import { stringType } from "aws-sdk/clients/iam";

interface IBankAccountDetails {
  name?: string;
  phone: string;
  email?: string;
  gst_number: string;
  bank_account_number: string;
  ifsc_code: string;
  beneficiaryName?: string;
  user?: any;
}

interface IRazorPayAccountCreation {
  name: string;
  email: string;
  tnc_accepted: boolean;
  account_details: {
    business_name: string;
    business_type: string;
  };
  bank_account: {
    ifsc_code: string;
    beneficiary_name: string;
    account_type?: string;
    account_number: string;
  };
}

interface IBankAccountUpdateDetails {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  gst_number?: string;
  bank_account_number?: string;
  ifsc_code?: string;
  beneficiaryName?: string;
  user?: any;
}

interface IBankAccountStatusChange {
  id: string;
}

interface IBankAccountPrimaryAccountChange {
  bankAccountId: string;
  organizationId: string;
  user?: any;
}

@Injectable()
export class BankAccountProvider {
  public async getBankAccount(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<BankAccount> {
    const { id } = input;
    const bankAccount = await entityManager.findOne(BankAccount, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!bankAccount) {
      throw new WCoreError(WCORE_ERRORS.BANK_DETAILS_NOT_FOUND);
    }
    return bankAccount;
  }

  @addPaginateInfo
  public async getBankAccounts(entityManager: EntityManager, filter: any) {
    const bankAccountsForOrganization = await entityManager.findAndCount(
      BankAccount,
      {
        where: {
          organization: {
            id: filter.organizationId
          }
        },
        relations: ["organization"]
      }
    );

    return bankAccountsForOrganization;
  }

  public async addRazorPayBankDetails(
    entityManager: EntityManager,
    input: IRazorPayAccountCreation
  ) {
    const BASE_URL = process.env.RAZOR_PAY_URL_BETA;
    const ACCOUNT_URL = BASE_URL + "accounts";
    const username = process.env.RAZOR_PAY_API_KEY_ID;
    const password = process.env.RAZOR_PAY_API_SECRED_KEY;
    const result = await callExternalServices(ACCOUNT_URL, {
      headers: {
        username,
        password
      },
      method: "POST",
      body: {
        ...input
      }
    });

    if (result.error) {
      throw new WCoreError({
        MESSAGE: result.error.description,
        HTTP_CODE: status.INTERNAL_SERVER_ERROR,
        CODE: "ISE"
      });
    }
    return result;
  }

  public async addBankAccountDetails(
    entityManager: EntityManager,
    input: IBankAccountDetails,
    organizationId: string
  ): Promise<BankAccount> {
    const {
      name,
      bank_account_number,
      gst_number,
      ifsc_code,
      phone,
      beneficiaryName,
      email,
      user
    } = input;

    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId
      }
    });

    const existingAccountNumberForOrg = await entityManager.findOne(
      BankAccount,
      {
        where: {
          accountNumber: bank_account_number,
          organization: {
            id: organizationId
          }
        },
        relations: ["organization"]
      }
    );

    if (existingAccountNumberForOrg) {
      throw new WCoreError(WCORE_ERRORS.BANK_ACCOUNT_NUMBER_ALREADY_EXISTS);
    }

    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }

    const bankAccountSchema = {
      name,
      accountNumber: bank_account_number,
      ifscCode: ifsc_code,
      phone,
      email,
      organization,
      beneficiaryName
    };
    bankAccountSchema["accountType"] = ACCOUNT_TYPE.SECONDARY;
    const findExistingPrimaryAccount = await entityManager.findOne(
      BankAccount,
      {
        where: {
          organization: {
            id: organizationId
          },
          accountType: ACCOUNT_TYPE.PRIMARY
        },
        relations: ["organization"]
      }
    );
    if (!findExistingPrimaryAccount) {
      bankAccountSchema["accountType"] = ACCOUNT_TYPE.PRIMARY;
      if (!bankAccountSchema.email) {
        // using the dummy email of format - <organizationId>@peppo.co.in
        bankAccountSchema.email =
          organizationId + "@" + process.env.EMAIL_SUFFIX;
      }
    }
    const createBankAccount = entityManager.create(
      BankAccount,
      bankAccountSchema
    );
    const saveBankAccount = await entityManager.save(createBankAccount);
    console.log("saveBankAccount", saveBankAccount);
    return saveBankAccount;
  }

  /**
   * an organization will only be allowed to edit the unverified bank accounts in case some details might be entered wrongly
   */

  public async updateBankAccountDetails(
    entityManager: EntityManager,
    input: IBankAccountUpdateDetails,
    organizationId: string
  ): Promise<BankAccount> {
    const {
      id,
      name,
      bank_account_number,
      email,
      gst_number,
      ifsc_code,
      phone,
      beneficiaryName
    } = input;

    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId
      }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const findExistingAccount = await entityManager.findOne(BankAccount, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!findExistingAccount) {
      throw new WCoreError(WCORE_ERRORS.BANK_DETAILS_NOT_FOUND);
    }
    if (findExistingAccount.verified === true) {
      throw new WCoreError(
        WCORE_ERRORS.UPDATE_NOT_ALLOWED_TO_VERIFIED_ACCOUNTS
      );
    }
    const updateSchema = {
      name,
      accountNumber: bank_account_number,
      ifscCode: ifsc_code,
      phone,
      email,
      beneficiaryName
    };
    if (!updateSchema.email) {
      // using the dummy email of format - <organizationId>@peppo.co.in
      updateSchema.email = organizationId + "@" + process.env.EMAIL_SUFFIX;
    }
    Object.entries(updateSchema).forEach(([key, value]) => {
      if (key !== "id" && value !== undefined) {
        findExistingAccount[key] = value;
      }
    });

    const saveUpdatedEntity = await entityManager.save(findExistingAccount);
    return saveUpdatedEntity;
  }

  /**
   *
   * @param entityManager
   * @param input
   * @param organizationId
   *
   * This api will be used for soft delete of the bank account
   */
  public async deactivateBankAccount(
    entityManager: EntityManager,
    input: IBankAccountStatusChange,
    organizationId: string
  ): Promise<BankAccount> {
    const { id } = input;
    const bankAccount = await entityManager.findOne(BankAccount, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!bankAccount) {
      throw new WCoreError(WCORE_ERRORS.BANK_DETAILS_NOT_FOUND);
    }
    if (bankAccount.status === STATUS.INACTIVE) {
      throw new WCoreError(WCORE_ERRORS.BANK_ACCOUNT_ALREADY_INACTIVE);
    }
    bankAccount.status = STATUS.INACTIVE;
    const saveUpdatedDetails = await entityManager.save(bankAccount);
    return saveUpdatedDetails;
  }

  /**
   *
   * @param entityManager
   * @param input
   * @param organizationId
   *
   * will be used to activated a soft deleted bank account
   */

  public async activateBankAccount(
    entityManager: EntityManager,
    input: IBankAccountStatusChange,
    organizationId: string
  ): Promise<BankAccount> {
    const { id } = input;
    const bankAccount = await entityManager.findOne(BankAccount, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!bankAccount) {
      throw new WCoreError(WCORE_ERRORS.BANK_DETAILS_NOT_FOUND);
    }
    if (bankAccount.status === STATUS.ACTIVE) {
      throw new WCoreError(WCORE_ERRORS.BANK_ACCOUNT_ALREADY_ACTIVE);
    }
    bankAccount.status = STATUS.ACTIVE;
    const saveUpdatedDetails = await entityManager.save(bankAccount);
    return saveUpdatedDetails;
  }

  /**
   * changePrimaryBankAccount
   * if a organization wants to change their primary bank account
   */
  public async changePrimaryBankAccount(
    entityManager: EntityManager,
    input: IBankAccountPrimaryAccountChange
  ): Promise<BankAccount | any> {
    const { bankAccountId, organizationId, user } = input;

    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId
      }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const bankAccount = await entityManager.findOne(BankAccount, {
      where: {
        id: bankAccountId,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!bankAccount) {
      throw new WCoreError(WCORE_ERRORS.BANK_DETAILS_NOT_FOUND);
    }
    if (bankAccount.accountType === ACCOUNT_TYPE.PRIMARY) {
      throw new WCoreError(WCORE_ERRORS.BANK_ACCOUNT_ALREADY_PRIMARY_ACCOUNT);
    }
    if (bankAccount.verified === false) {
      throw new WCoreError(WCORE_ERRORS.PLEASE_VERIFY_BANK_ACCOUNT);
    }
    const findExistingPrimaryAccount = await entityManager.findOne(
      BankAccount,
      {
        where: {
          organization: {
            id: organizationId
          },
          accountType: ACCOUNT_TYPE.PRIMARY
        },
        relations: ["organization"]
      }
    );
    if (findExistingPrimaryAccount) {
      findExistingPrimaryAccount["accountType"] = ACCOUNT_TYPE.SECONDARY;
      await entityManager.save(findExistingPrimaryAccount);
    }
    let email = bankAccount.email;
    if (!bankAccount.email) {
      email = organizationId + "@" + process.env.EMAIL_SUFFIX;
    }
    bankAccount["accountType"] = ACCOUNT_TYPE.PRIMARY;
    const updatedBankAccount = await entityManager.save(bankAccount);
    return updatedBankAccount;
  }

  /**
   *
   * @param entityManager
   * @param input
   * @param organizationId
   * This API will be used for verifying a bank account manually for now. later will be called internally after automated bank  *   verification passes successfully
   */

  public async verifyBankAccount(
    entityManager: EntityManager,
    input: IBankAccountStatusChange,
    organizationId: string
  ): Promise<BankAccount> {
    const { id } = input;
    const bankAccount = await entityManager.findOne(BankAccount, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!bankAccount) {
      throw new WCoreError(WCORE_ERRORS.BANK_DETAILS_NOT_FOUND);
    }
    if (bankAccount.verified === true) {
      throw new WCoreError(WCORE_ERRORS.BANK_ACCOUNT_ALREADY_VERIFIED);
    }
    bankAccount.verified = true;
    const saveUpdatedDetails = await entityManager.save(bankAccount);
    return saveUpdatedDetails;
  }
}
