import { EntityManager, In } from "typeorm";
import { Injectable } from "@graphql-modules/di";
import moment from "moment";
import { LoyaltyLedger, LoyaltyTransaction } from "../../entity";
import { validateCustomerLoyalty } from "../common/utils/CustomerLoyaltyUtils";
import { SORTING_DIRECTIONS } from "@walkinserver/walkin-core/src/modules/common/constants/constants";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../common/constants/errors";
import { LoyaltyCardRepository } from "../loyalty-card/loyalty-card.repository";
import { CustomerRepository } from "@walkinserver/walkin-core/src/modules/customer/customer.repository";
import { getPaginationInfo } from "../../../../walkin-core/src/modules/common/utils/utils";

@Injectable()
export class LoyaltyLedgerProvider {
  async getLoayltyLedgersByLoyaltyTransactionId(
    entityManager: EntityManager,
    loyaltyTransactionId
  ) {
    let loayltyLedgers = await entityManager.find(LoyaltyLedger, {
      where: {
        loyaltyTransaction: loyaltyTransactionId
      }
    });
    return loayltyLedgers;
  }

  async getLoyaltyLedgerHistory(
    entityManager: EntityManager,
    injector,
    externalCustomerId: string,
    cardCode: string,
    organizaitonId: string
  ) {
    let customerLoyalty = await validateCustomerLoyalty(
      entityManager,
      injector,
      externalCustomerId,
      cardCode,
      organizaitonId
    );
    // console.log("customer loyalty is:-", customerLoyalty);
    let loayltyTransactions = await entityManager.find(LoyaltyTransaction, {
      where: {
        customerLoyaltyId: customerLoyalty.id
      },
      relations: [
        "customerLoyaltyProgram",
        "customerLoyaltyProgram.customerLoyalty"
      ]
    });
    // console.log("customer loyalty are:-", loayltyTransaction);
    let loyaltyTransactionId = [];
    for (var i = 0; i < loayltyTransactions.length; i++) {
      loyaltyTransactionId.push(loayltyTransactions[i].id);
    }
    // console.log("customer loyalty are:-", loyaltyTransactionId);
    let loyaltyLedgers = await entityManager.find(LoyaltyLedger, {
      where: {
        loyaltyTransaction: In(loyaltyTransactionId)
      }
    });

    console.log("Ledgers are:-", loyaltyLedgers);
    return loyaltyLedgers;
  }

  async getLoyaltyLedgerByExternalCustomerId(
    entityManager,
    injector,
    externalCustomerId,
    dateStart,
    dateEnd,
    page,
    itemsPerPage,
    orderBy,
    loyaltyCardCode,
    organization
  ) {
    if (!externalCustomerId) {
      throw new WCoreError(REWARDX_ERRORS.PLEASE_PROVIDE_CUSTOMER_ID);
    } else {
      let customer = await injector
        .get(CustomerRepository)
        .getCustomer_rawQuery(entityManager, {
          externalCustomerId: externalCustomerId,
          organization_id: organization.id
        });
      if (customer.length == 0) {
        throw new WCoreError({
          HTTP_CODE: 400,
          MESSAGE: `Customer with externalCustomerId: '${externalCustomerId}' does not exist.`,
          CODE: "CDNE"
        });
      }
    }

    let loyaltyCard;
    if (!loyaltyCardCode) {
      loyaltyCard = await injector
        .get(LoyaltyCardRepository)
        .getLoyaltyCard_rawQuery(entityManager, {
          organization_id: organization.id
        });
    } else {
      loyaltyCard = await injector
        .get(LoyaltyCardRepository)
        .getLoyaltyCard_rawQuery(entityManager, {
          code: loyaltyCardCode,
          organization_id: organization.id
        });
    }
    if (loyaltyCard.length == 0) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }
    loyaltyCard = loyaltyCard[0];
    loyaltyCardCode = loyaltyCard.code;

    const validDateFormat = [
      "YYYY-MM-DDTHH:mm",
      "YYYY-MM-DD",
      "DD-MM-YYYY",
      "YYYY-MM-DDTHH:mm:ss",
      "DD-MM-YYYYTHH:mm:ss"
    ];
    const startDate = moment(dateStart, validDateFormat, true);
    const endDate = moment(dateEnd, validDateFormat, true);
    if (itemsPerPage < 0 || page < 0) {
      throw new WCoreError(REWARDX_ERRORS.PLEASE_ENTER_VALID_PAGINATION_DATA);
    }
    if (dateStart && !startDate.isValid()) {
      throw new WCoreError(REWARDX_ERRORS.PLEASE_ENTER_VALID_START_DATE);
    }
    if (dateEnd && !endDate.isValid()) {
      throw new WCoreError(REWARDX_ERRORS.PLEASE_ENTER_VALID_END_DATE);
    }

    itemsPerPage = Math.abs(itemsPerPage) || 10;
    page = Math.abs(page) || 1;
    const rangeStart = (page - 1) * itemsPerPage;
    const sortOption = orderBy == SORTING_DIRECTIONS.ASCENDING ? "ASC" : "DESC";
    let ledger = await entityManager
      .getRepository(LoyaltyLedger)
      .createQueryBuilder("loyaltyLedger")
      .innerJoinAndSelect(
        "loyaltyLedger.loyaltyTransaction",
        "loyaltyTransaction"
      )
      .innerJoinAndSelect(
        "loyaltyTransaction.customerLoyaltyProgram",
        "customerLoyaltyProgram"
      )
      .innerJoinAndSelect("loyaltyTransaction.statusCode", "statusCode")
      .innerJoinAndSelect(
        "customerLoyaltyProgram.customerLoyalty",
        "customerLoyalty"
      )
      .innerJoinAndSelect("customerLoyalty.loyaltyCard", "loyaltyCard")
      .innerJoinAndSelect("customerLoyalty.customer", "customer")
      .orderBy("loyaltyLedger.createdTime", sortOption)
      .where(
        "customer.externalCustomerId=:externalCustomerId and loyaltyCard.code=:loyaltyCardCode and loyaltyLedger.points >0 ",
        {
          externalCustomerId,
          loyaltyCardCode
        }
      )
      .andWhere(
        "customer.organization=:orgId and loyaltyCard.organization=:orgID",
        {
          orgId: organization.id,
          orgID: organization.id
        }
      );
    if (dateStart && dateEnd) {
      ledger.andWhere("loyaltyLedger.created_time>=:dateStart", { dateStart });
      ledger.andWhere("loyaltyLedger.created_time<=:dateEnd", { dateEnd });
    }
    if (dateStart && !dateEnd) {
      ledger.andWhere("loyaltyLedger.created_time>=:dateStart", { dateStart });
    }
    if (!dateStart && dateEnd) {
      ledger.andWhere("loyaltyLedger.created_time<=:dateEnd", { dateEnd });
    }

    let ledgerCount = ledger;
    ledgerCount = await ledgerCount.getRawMany();
    ledgerCount = ledgerCount ? ledgerCount.length : 0;

    ledger.skip(rangeStart).take(itemsPerPage);
    const ledgerData = await ledger.getMany();
    if (!ledgerData) {
      throw new WCoreError(REWARDX_ERRORS.TRANSACTION_NOT_FOUND);
    }
    ledgerData.map(data => {
      data.loyaltyLedger = data;
      let customerLoyaltyTransaction = data.loyaltyTransaction;
      let statusCode = customerLoyaltyTransaction.statusCode
        ? customerLoyaltyTransaction.statusCode.statusCode
        : "";
      customerLoyaltyTransaction["status"] = statusCode;
      customerLoyaltyTransaction["loyaltyType"] =
        customerLoyaltyTransaction.type;
      data.loyaltyTransaction = customerLoyaltyTransaction;
    });

    const paginationInfo = getPaginationInfo(ledgerCount, itemsPerPage, page);
    return {
      data: ledgerData,
      ledgerCount,
      externalCustomerId,
      dateStart,
      dateEnd,
      page,
      itemsPerPage,
      orderBy,
      paginationInfo
    };
  }
}
