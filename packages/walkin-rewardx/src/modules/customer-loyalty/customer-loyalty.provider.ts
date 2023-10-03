import { EntityManager } from "typeorm";
import { Injectable } from "@graphql-modules/di";
import { CustomerLoyalty } from "../../entity";
import { Organization } from "@walkinserver/walkin-core/src/entity/Organization";
import { REWARDX_ERRORS } from "../common/constants/errors";
import { isValidPhone } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";
import { Customer } from "@walkinserver/walkin-core/src/entity/Customer";
import { validationDecorator } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import {
  customerLoyaltyByLoyaltyCardCodeAndCustomerId,
  createCustomerAndCustomerLoyalty
} from "../common/utils/CustomerLoyaltyUtils";
import { ActionUtils } from "../common/utils/ActionUtils";
import {
  findCustomerByExternalCustomerId,
  findOrganizationById,
  getStoreCodes
} from "../common/utils/CommonUtils";
import { LoyaltyTransactionProvider } from "../loyalty-transaction/loyalty-transaction.provider";
import { LOYALTY_ACTION_TYPE } from "../common/constants/constant";
import { LoyaltyTotals } from "@walkinserver/walkin-core/src/entity";
import { sendToWehbookSubscribers } from "@walkinserver/walkin-core/src/modules/common/utils/webhookUtils";
import { CustomerProvider } from "@walkinserver/walkin-core/src/modules/customer/customer.providers";
import moment from "moment";
@Injectable()
export class CustomerLoyaltyProvider {
  public async getCustomerLoyalty(
    entityManager: EntityManager,
    injector,
    customerLoyalty
  ): Promise<Object> {
    let externalCustomerId = customerLoyalty.externalCustomerId;
    let organizationId = customerLoyalty.organizationId;
    let loyaltyCardCode = customerLoyalty.loyaltyCardCode;
    let createCustomerIfNotExist = customerLoyalty.createCustomerIfNotExist;
    let storeCode = customerLoyalty.storeId;
    let newCustomerLoyalty = null;
    let existedCustomer = null;
    let organization = await findOrganizationById(
      entityManager,
      organizationId
    );
    // walletCode If there are multiple wallets,
    // then wallet code will tell which wallet to pickup.
    // Otherwise, picks up the default wallet.
    //To pick default loyaty card code if card code doesnt exist
    let loyaltyCard;
    if (loyaltyCardCode) {
      loyaltyCard = await injector
        .get(LoyaltyCardProvider)
        .getLoyaltyCardByCode(entityManager, loyaltyCardCode, organizationId);
    } else {
      loyaltyCard = await injector
        .get(LoyaltyCardProvider)
        .getDefaultLoyaltycardForOrganization(entityManager, organization);
    }
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }
    // Creates customer and customer loyalty if not exists
    if (createCustomerIfNotExist) {
      newCustomerLoyalty = await createCustomerAndCustomerLoyalty(
        entityManager,
        {
          organizationId,
          externalCustomerId,
          loyaltyCard,
          loyaltyCardCode: loyaltyCard.code,
          loyaltyTotals: {
            daily_transactions: 0,
            weekly_transactions: 0,
            monthly_transactions: 0,
            daily_points: 0,
            weekly_points: 0,
            monthly_points: 0,
            last_transaction_date: ""
          }
        }
      );
      existedCustomer = newCustomerLoyalty.customer;
    } else {
      existedCustomer = await findCustomerByExternalCustomerId(
        entityManager,
        externalCustomerId,
        organizationId
      );
      if (!existedCustomer) {
        await entityManager.connection.queryResultCache.remove([
          "customer_" + externalCustomerId
        ]);
        throw new WCoreError(REWARDX_ERRORS.CUSTOMER_NOT_FOUND);
      }
      newCustomerLoyalty = await customerLoyaltyByLoyaltyCardCodeAndCustomerId(
        entityManager,
        externalCustomerId,
        loyaltyCard.code,
        organizationId
      );
      if (!newCustomerLoyalty) {
        throw new WCoreError(REWARDX_ERRORS.CUSTOMER_LOYALTY_NOT_FOUND);
      }
    }
    let customerLoyaltyPrograms = await this.getActiveCustomerLoyaltyProgramByCustomerLoyalty(
      entityManager,
      {
        id: newCustomerLoyalty.id,
        loyaltyCardId: newCustomerLoyalty.loyaltyCard.id
      }
    );
    let transactionData = <any>{};
    let loyaltyEnabledStores = await getStoreCodes(entityManager, storeCode);
    let loyaltyEnabled = false;
    let isLoyaltyEnabledActionDefined = await ActionUtils.findActionByActionName(
      entityManager,
      LOYALTY_ACTION_TYPE.LOYALTY_ENABLE_ACTION,
      organizationId
    );
    if (isLoyaltyEnabledActionDefined) {
      // To check if customer done any loyalty transactions
      let loyaltyObj = await injector
        .get(LoyaltyTransactionProvider)
        .getLoyaltyTransactionCountAndBalanceByCustomerLoyaltyId(
          entityManager,
          customerLoyaltyPrograms.length == 0
            ? null
            : customerLoyaltyPrograms[0].id
        );
      let loyaltyTransactionAmount = loyaltyObj ? loyaltyObj.loyaltyBalance : 0;
      let loyaltyTransactionCount = loyaltyObj
        ? loyaltyObj.loyaltyTransactionCount
        : 0;
      transactionData.loyaltyTransactionAmount = loyaltyTransactionAmount;
      transactionData.loyaltyTransactionCount = loyaltyTransactionCount;
      transactionData.isLNAFSValidationRequired = false;
      // To check if loyalty enabled or not
      loyaltyEnabled = await ActionUtils.executeAction(
        entityManager,
        organizationId,
        LOYALTY_ACTION_TYPE.LOYALTY_ENABLE_ACTION,
        {
          orderExtraData: { order: { externalStoreId: storeCode } },
          store: loyaltyEnabledStores,
          transactionData,
          customer: existedCustomer,
          businessRules: [],
          loyaltyTransaction: null,
          burnFromLoyaltyCard: true,
          storeCode
        }
      );
    }

    let totalEarnedPoints, totalBurnedPoints;
    if (customerLoyaltyPrograms.length > 0) {
      ({ totalEarnedPoints, totalBurnedPoints } = await injector
        .get(LoyaltyTransactionProvider)
        .getTotalEarnedAndBurnedPointsForCustomerLoyalty(
          entityManager,
          loyaltyCard.id,
          externalCustomerId,
          organizationId
        ));

      // newCustomerLoyalty points to have only non-expired points
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
      const result: any = await entityManager.query(`Select SUM(ll.points_remaining) as pointsRemaining
      from loyalty_ledger ll
      left join loyalty_transaction lt on lt.id = ll. loyalty_transaction_id
      left join customer_loyalty_program clp on clp.id = lt.customer_loyalty_program_id
      left join customer_loyalty cl on cl.id = clp.customer_loyalty_id
      where ll.points_remaining > 0 AND ll.expiry_date >= "${currentDate}"
      AND clp.customer_loyalty_id='${newCustomerLoyalty.id}';`);

      // If there are no active points, loyaltyBalance is returned as undefined, hence points needs to be 0
      newCustomerLoyalty.points =
        result && result[0]?.pointsRemaining ? result[0]?.pointsRemaining : 0;
    }

    let customerLoyaltyResponse = {};
    customerLoyaltyResponse["negativePoints"] =
      newCustomerLoyalty.negativePoints;
    customerLoyaltyResponse["blockedPoints"] = parseFloat(
      newCustomerLoyalty.pointsBlocked
    );
    customerLoyaltyResponse["blockedAmount"] = newCustomerLoyalty.pointsBlocked;
    customerLoyaltyResponse["overallPoints"] = parseFloat(
      newCustomerLoyalty.points
    );
    customerLoyaltyResponse["overallAmount"] = newCustomerLoyalty.points;
    customerLoyaltyResponse["burnablePoints"] =
      parseFloat(newCustomerLoyalty.points) -
      parseFloat(newCustomerLoyalty.pointsBlocked);
    customerLoyaltyResponse["burnableAmount"] =
      newCustomerLoyalty.points - newCustomerLoyalty.pointsBlocked;
    customerLoyaltyResponse["totalEarnedPoints"] = totalEarnedPoints;
    customerLoyaltyResponse["totalBurnedPoints"] = totalBurnedPoints;
    customerLoyaltyResponse["externalCustomerId"] = externalCustomerId;
    customerLoyaltyResponse["createdTime"] = newCustomerLoyalty.createdTime;
    customerLoyaltyResponse["loyaltyCardCode"] = newCustomerLoyalty.loyaltyCard
      ? newCustomerLoyalty.loyaltyCard.code
      : "";
    customerLoyaltyResponse["loyaltyEnabled"] = loyaltyEnabled;
    customerLoyaltyResponse["status"] = newCustomerLoyalty.status;
    customerLoyaltyResponse["loyaltyTotals"] = newCustomerLoyalty.loyaltyTotals;
    customerLoyaltyResponse[
      "customerLoyaltyPrograms"
    ] = customerLoyaltyPrograms;
    return customerLoyaltyResponse;
  }

  public async createCustomerLoyalty(
    transactionManager: EntityManager,
    injector,
    customerLoyalty
  ): Promise<Object> {
    let externalCustomerId = customerLoyalty.externalCustomerId;
    let organizationId = customerLoyalty.organizationId;
    let loyaltyCardCode = customerLoyalty.loyaltyCardCode;
    let customerLoyaltyResponse = {};
    let organization = await findOrganizationById(
      transactionManager,
      customerLoyalty.organizationId
    );
    let customer = await injector
      .get(CustomerProvider)
      .getCustomer(transactionManager, {
        externalCustomerId: externalCustomerId,
        organizationId: organization.id
      });
    let phoneNumber = customer.phoneNumber;
    let customerIdentifier = customer.customerIdentifier;
    //To pick default loyaty card code if card code doesnt exist
    if (!loyaltyCardCode) {
      let defaultLoyaltyCard = await injector
        .get(LoyaltyCardProvider)
        .getDefaultLoyaltycardForOrganization(transactionManager, organization);
      //getDefaultLoyaltycard
      loyaltyCardCode = defaultLoyaltyCard.code;
      customerLoyalty.loyaltyCardCode = loyaltyCardCode;
      customerLoyalty.loyaltyCard = defaultLoyaltyCard;
    }

    let newCustomerLoyalty = await this.createCustomerAndCustomerLoyalty(
      transactionManager,
      injector,
      externalCustomerId,
      phoneNumber,
      customerIdentifier,
      organizationId,
      loyaltyCardCode,
      {
        daily_transactions: 0,
        weekly_transactions: 0,
        monthly_transactions: 0,
        daily_points: 0,
        weekly_points: 0,
        monthly_points: 0,
        last_transaction_date: ""
      }
    );
    customerLoyaltyResponse["id"] = newCustomerLoyalty.id;
    customerLoyaltyResponse["externalCustomerId"] = externalCustomerId;
    customerLoyaltyResponse["createdTime"] = newCustomerLoyalty.createdTime;
    customerLoyaltyResponse["loyaltyCardCode"] = newCustomerLoyalty.loyaltyCard
      ? newCustomerLoyalty.loyaltyCard.code
      : "";
    customerLoyaltyResponse["overallPoints"] = 0;
    customerLoyaltyResponse["burnablePoints"] = 0;
    customerLoyaltyResponse["overallAmount"] = 0;
    customerLoyaltyResponse["burnableAmount"] = 0;
    customerLoyaltyResponse["pointsBlocked"] = 0;
    customerLoyaltyResponse["blockedAmount"] = 0;
    return customerLoyaltyResponse;
  }

  async createCustomerAndCustomerLoyalty(
    entityManager,
    injector,
    externalCustomerId,
    phoneNumber,
    customerIdentifier,
    organizationId,
    loyaltyCardCode,
    loyaltyTotals
  ) {
    let organization;
    if (!externalCustomerId) {
      throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMERID);
    } else {
      if (phoneNumber && !isValidPhone(phoneNumber)) {
        throw new WCoreError(REWARDX_ERRORS.INVALID_MOBILE_NUMBER);
      }
    }
    if (!organizationId) {
      throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_ORGANIZATION);
    } else {
      organization = await entityManager.find(Organization, {
        id: organizationId
      });
      if (!organization || organization == "") {
        throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
      }
    }

    let validationPromises = [];
    if (organizationId) {
      validationPromises.push(
        Organization.availableById(entityManager, organizationId)
      );
    }
    // walletCode If there are multiple wallets,
    // then wallet code will tell which wallet to pickup.
    // Otherwise, picks up the default wallet.
    let loyaltyCard;
    if (loyaltyCardCode) {
      loyaltyCard = await injector
        .get(LoyaltyCardProvider)
        .getLoyaltyCardByCode(entityManager, loyaltyCardCode, organizationId);
    } else {
      let loyaltyCards = await injector
        .get(LoyaltyCardProvider)
        .getLoyaltyCardsForOrganization(entityManager, organization);
      if (loyaltyCards && loyaltyCards.length >= 1) {
        loyaltyCard = loyaltyCards[0];
      }
    }
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }

    let createCustomerLoyaltyAction = async () => {
      let organization = entityManager.create(Organization, {
        id: organizationId
      });
      let foundCustomer;
      // create or find customer
      if (externalCustomerId) {
        let foundCustomers = await entityManager.find(Customer, {
          externalCustomerId: externalCustomerId
        });
        if (foundCustomers.length > 0) {
          foundCustomer = foundCustomers[0];
        } else {
          // if (!phoneNumber) {
          //   throw new WCoreError(WCORE_ERRORS.PHONE_NUMBER_REQUIRED);
          // }
          // if (!customerIdentifier) {
          //   throw new WCoreError(
          //     WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMER_IDENTIFIER
          //   );
          // }
          let newCustomer = await entityManager.create(Customer, {
            phoneNumber: phoneNumber,
            externalCustomerId: externalCustomerId,
            organization: organization,
            customerIdentifier: customerIdentifier
          });
          foundCustomer = await entityManager.save(newCustomer);
        }
      }
      let newCustomerLoyalty;
      // Verifying Customer Loyalty exits for wallet code or not
      let existedCustomerLoyalty = await customerLoyaltyByLoyaltyCardCodeAndCustomerId(
        entityManager,
        externalCustomerId,
        loyaltyCard.code,
        organizationId
      );
      if (existedCustomerLoyalty) {
        throw new WCoreError(REWARDX_ERRORS.CUSTOMER_LOYALTY_EXISTS);
      } else {
        loyaltyTotals = await entityManager.create(
          LoyaltyTotals,
          loyaltyTotals
        );
        loyaltyTotals = await entityManager.save(loyaltyTotals);
        let customerLoyalty = await entityManager.create(CustomerLoyalty, {
          customer: foundCustomer,
          loyaltyCard,
          loyaltyTotals
        });
        newCustomerLoyalty = await entityManager.save(customerLoyalty);
        sendToWehbookSubscribers(
          entityManager,
          "NEW_CUSTOMER_LOYALTY",
          newCustomerLoyalty,
          organizationId,
          injector
        );
        return newCustomerLoyalty;
      }
    };
    return validationDecorator(createCustomerLoyaltyAction, validationPromises);
  }

  public async getActiveCustomerLoyaltyProgramByCustomerLoyalty(
    entityManager: EntityManager,
    input
  ) {
    let activeCLPs: number = 0;
    let activeCustomerLoyaltyProgram = [];
    const queryRunner = await entityManager.connection.createQueryRunner();
    const customerLoyaltyPrograms = await queryRunner.manager.query(
      `SELECT customer_loyalty_program.id AS id, customer_loyalty_program.loyalty_program_code AS loyaltyProgramCode, 
              customer_loyalty_program.loyalty_experiment_code AS loyaltyExperimentCode, customer_loyalty_program.redeemed_transactions AS redeemedTransactions,
              customer_loyalty_program.issued_transactions AS issuedTransactions, customer_loyalty_program.customer_loyalty_id AS customerLoyaltyId,
              customer_loyalty_program.loyalty_totals as loyaltyTotals
        FROM customer_loyalty_program 
        LEFT JOIN loyalty_program_config ON customer_loyalty_program.loyalty_program_code = loyalty_program_config.code 
        WHERE customer_loyalty_id = '${input.id}' AND loyalty_program_config.loyalty_card_id = '${input.loyaltyCardId}'`
    );
    for (let index in customerLoyaltyPrograms) {
      if (customerLoyaltyPrograms[index].loyaltyTotals != null) {
        let loyaltyTotals = await queryRunner.manager.query(
          `SELECT id AS id, daily_points AS dailyPoints, weekly_points AS weeklyPoints, monthly_points AS monthlyPoints, yearly_points AS yearlyPoints, 
                            daily_transactions AS dailyTransactions, weekly_transactions AS weeklyTransactions, monthly_transactions AS monthlyTransactions,
                            yearly_transactions AS yearlyTransactions, last_transaction_date AS lastTransactionDate
            FROM loyalty_totals WHERE id = '${customerLoyaltyPrograms[index].loyaltyTotals}'`
        );
        customerLoyaltyPrograms[index].loyaltyTotals = loyaltyTotals[0];
      }
      activeCLPs++;
      activeCustomerLoyaltyProgram.push(customerLoyaltyPrograms[index]);
    }
    // for (let index in customerLoyaltyPrograms) {
    //   if (customerLoyaltyPrograms[index].status === "ACTIVE") {
    //     activeCLPs++;
    //     activeCustomerLoyaltyProgram.push(customerLoyaltyPrograms[index]);
    //   }
    // }
    await queryRunner.release();

    // if (activeCLPs > 1) {
    //   throw new WCoreError({
    //     HTTP_CODE: 404,
    //     MESSAGE:
    //       "More than one Customer Loyalty Program is ACTIVE for this Customer Loyalty.",
    //     CODE: "M_T_O_CLP_A_F_CL"
    //   });
    // } else if (activeCLPs == 0) {
    //   throw new WCoreError({
    //     HTTP_CODE: 404,
    //     MESSAGE: "No Customer Loyalty Program is ACTIVE for this Customer Loyalty.",
    //     CODE: "N_CLP_A_F_CL"
    //   })
    //   return null;
    // }
    return activeCustomerLoyaltyProgram;
  }
}
