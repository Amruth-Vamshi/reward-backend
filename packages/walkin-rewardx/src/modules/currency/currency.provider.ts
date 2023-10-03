import { EntityManager } from "typeorm";
import { Injectable } from "@graphql-modules/di";
import { CustomerLoyalty, Currency } from "../../entity";
import { includes } from "lodash";
import { Organization } from "@walkinserver/walkin-core/src/entity/Organization";
import { REWARDX_ERRORS } from "../common/constants/errors";
import { isValidPhone } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";
import { Customer } from "@walkinserver/walkin-core/src/entity/Customer";
import { validationDecorator } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import {
  updateEntity,
  addPaginateInfo
} from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { WalkinRecordNotFoundError } from "@walkinserver/walkin-core/src/modules/common/exceptions/walkin-platform-error";
@Injectable()
export class CurrencyProvider {
  public async createCurrency(
    entityManager: EntityManager,
    currency
  ): Promise<Currency> {
    let code = currency.code;
    let name = currency.name;
    if (!code) {
      throw new WCoreError(REWARDX_ERRORS.CURRENCY_CODE_NOT_FOUND);
    }
    if (!name) {
      throw new WCoreError(REWARDX_ERRORS.CURRENCY_NAME_NOT_FOUND);
    }
    let newCurrency = new Currency();
    newCurrency = updateEntity(newCurrency, currency);
    return entityManager.save(newCurrency);
  }

  // public async updateCurrency(entityManager: EntityManager, currency):
  //     Promise<Currency> {
  //     let existedCurrency = await entityManager.findOne(Currency, currency.id);
  //     if (!existedCurrency) {
  //         throw new WalkinRecordNotFoundError("Loyalty card not found");
  //     }
  //     existedCurrency = updateEntity(existedCurrency, currency);
  //     return entityManager.save(existedCurrency);
  // }

  public async updateCurrency(
    entityManager: EntityManager,
    currency
  ): Promise<Currency> {
    let currencyCode = currency.code;
    if (!currencyCode) {
      throw new WCoreError(REWARDX_ERRORS.CURRENCY_CODE_NOT_FOUND);
    }
    let updateCurrency = await this.getCurrencyByCode(
      entityManager,
      currencyCode
    );
    // let existedCurrency = await entityManager.findOne(Currency, currency.id);
    if (!updateCurrency) {
      throw new WCoreError(REWARDX_ERRORS.CURRENCY_NOT_FOUND);
    }
    updateCurrency = updateEntity(updateCurrency, currency);
    return entityManager.save(updateCurrency);
  }

  public async getCurrencyByCode(
    entityManager: EntityManager,
    currencyCode
  ): Promise<Currency> {
    let currency = await entityManager.findOne(Currency, {
      where: {
        code: currencyCode
      }
    });
    return currency;
  }

  @addPaginateInfo
  public async getPageWiseCurrencies(
    entityManager: EntityManager,
    pageOptions,
    sortOptions,
    injector
  ) {
    let options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    // options.relations = ["campaign", "loyaltyCard", "organization"];
    // options.where = {
    //   organization: organizationId,
    //   loyaltyCard: loyaltyCard
    // };
    let currencyList = await entityManager.findAndCount(Currency, options);
    console.log("currencyList ", currencyList);
    return currencyList;
  }
}
