import { EntityManager } from "typeorm";
import { Injectable } from "@graphql-modules/di";
import { LoyaltyCard, Currency } from "../../entity";
import {
  updateEntity,
  addPaginateInfo
} from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { WalkinRecordNotFoundError } from "@walkinserver/walkin-core/src/modules/common/exceptions/walkin-platform-error";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../common/constants/errors";
import { Organization } from "@walkinserver/walkin-core/src/entity";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
@Injectable()
export class LoyaltyCardProvider {
  public async getLoyaltyCards(
    entityManager: EntityManager
  ): Promise<LoyaltyCard[]> {
    const loyaltyCards = await entityManager.find(LoyaltyCard, {
      relations: ["currency"]
    });
    return loyaltyCards;
  }

  public async getLoyaltyCard(
    entityManager: EntityManager,
    organizationId,
    id
  ): Promise<LoyaltyCard> {

    if(!id)
    {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_CARD_ID_NOT_PROVIDED);
    }

    const loyaltyCard = await entityManager.findOne(LoyaltyCard, {
      where:{ organization :{id: organizationId },id},
      relations: ["currency"]
    });
    
    return loyaltyCard;
  }


  public async getLoyaltyCardsForOrganization(
    entityManager: EntityManager,
    organizationId
  ): Promise<LoyaltyCard[]> {
    const loyaltyCards = await entityManager.find(LoyaltyCard, {
      where: { organization: organizationId.id },
      relations: ["currency"]
    });
    return loyaltyCards;
  }

  public async createLoyaltyCard(
    entityManager: EntityManager,
    loyaltyCard
  ): Promise<LoyaltyCard> {
    let currency = await entityManager.findOne(Currency, {
      where: { code: loyaltyCard.currencyCode }
    });
    if (!currency) {
      throw new WCoreError(REWARDX_ERRORS.CURRENCY_NOT_FOUND);
    }
    let organization = await entityManager.findOne(Organization, {
      where: { id: loyaltyCard.organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    let existingLoyaltyCard = await entityManager.findOne(LoyaltyCard, {
      where: {
        code: loyaltyCard.code,
        organization: organization.id
      }
    });
    if (existingLoyaltyCard) {
      throw new WCoreError({
        HTTP_CODE: 400,
        MESSAGE: `LoyaltyCard with code: '${loyaltyCard.code}' already exist.`,
        CODE: "LCAE"
      });
    }
    let newLoyaltyCard = new LoyaltyCard();
    newLoyaltyCard = updateEntity(newLoyaltyCard, loyaltyCard);
    newLoyaltyCard["currency"] = currency;
    newLoyaltyCard["organization"] = organization;
    return entityManager.save(newLoyaltyCard);
  }

  public async updateLoyaltyCard(
    entityManager: EntityManager,
    loyaltyCard
  ): Promise<LoyaltyCard> {
    let currency = await entityManager.findOne(Currency, {
      where: { code: loyaltyCard.currencyCode }
    });
    if (!currency) {
      throw new WCoreError(REWARDX_ERRORS.CURRENCY_NOT_FOUND);
    }
    let organization = await entityManager.findOne(Organization, {
      where: { id: loyaltyCard.organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    let existedLoyaltyCard = await entityManager.findOne(
      LoyaltyCard,
      loyaltyCard.id
    );
    if (!existedLoyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }
    existedLoyaltyCard = updateEntity(existedLoyaltyCard, loyaltyCard);
    existedLoyaltyCard["currency"] = currency;
    existedLoyaltyCard["organization"] = organization;
    return entityManager.save(existedLoyaltyCard);
  }

  public async getLoyaltyCardByCode(
    entityManager: EntityManager,
    loyaltyCardCode,
    organizaitonId
  ): Promise<LoyaltyCard> {
    let loyaltyCard = await entityManager.findOne(LoyaltyCard, {
      where: {
        code: loyaltyCardCode,
        organization: organizaitonId
      },
      relations: ["currency"]
    });
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }
    return loyaltyCard;
  }

  public async getDefaultLoyaltycard(entityManager: EntityManager) {
    let loyaltyCard;
    let loyaltyCards = await this.getLoyaltyCards(entityManager);
    if (loyaltyCards && loyaltyCards.length >= 1) {
      loyaltyCard = loyaltyCards[0];
    }
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }
    return loyaltyCard;
  }

  public async getDefaultLoyaltycardForOrganization(
    entityManager: EntityManager,
    organizationId
  ) {
    let loyaltyCard;
    let loyaltyCards = await this.getLoyaltyCardsForOrganization(
      entityManager,
      organizationId
    );
    if (loyaltyCards && loyaltyCards.length >= 1) {
      loyaltyCard = loyaltyCards[0];
    }
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }
    return loyaltyCard;
  }

  @addPaginateInfo
  public async getPageWiseLoyaltyCards(
    entityManager: EntityManager,
    pageOptions,
    sortOptions,
    injector,
    organizationId
  ) {
    //console.log("customer loyalty is:-", customerLoyalty);
    let options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    options.relations = ["currency", "organization"];
    options.where = {
      organization: organizationId
    };
    let loyaltyCards = await entityManager.findAndCount(LoyaltyCard, options);
    console.log("loyaltyCards ", loyaltyCards);
    return loyaltyCards;
  }
}
