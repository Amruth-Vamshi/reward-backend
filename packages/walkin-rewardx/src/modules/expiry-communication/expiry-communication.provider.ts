import { Injectable, Inject } from "@graphql-modules/di";
import { EntityManager, MoreThan, LessThanOrEqual, Equal } from "typeorm";
import {
  ExpiryCommunication,
  LoyaltyCard,
  LoyaltyLedger,
  LoyaltyProgram
} from "../../entity";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { REWARDX_ERRORS } from "../common/constants/errors";
import { Organization } from "@walkinserver/walkin-core/src/entity";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { communicationModule } from "@walkinserver/walkin-core/src/modules/communication//communication.module";
import { resolvers as communicationResolvers } from "@walkinserver/walkin-core/src/modules/communication/communication.resolvers";
import { addPaginateInfo } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import {
  EXPIRY_COMMUNICATION_EVENT_TYPE,
  RULE_TYPE,
  TIME_FORMAT,
  SCHEDULE_TIME_SLOT
} from "../common/constants/constant";
import moment = require("moment");
import { CommunicationProvider } from "@walkinserver/walkin-core/src/modules/communication/communication.providers";
import { getyBusinessRuleDataByKey } from "../common/utils/CommonUtils";
import { LoyaltyProgramProvider } from "../loyalty-program/loyalty-program.provider";

@Injectable()
export class ExpiryCommunicationProvider {
  constructor(
    @Inject(CommunicationProvider)
    private communicationService: CommunicationProvider
  ) {}
  public async createExpiryCommunication(
    entityManager: EntityManager,
    injector,
    expiryCommunicationInput,
    user,
    application,
    info
  ): Promise<Object> {
    console.log("infotest", info.schema);
    let organizationId = expiryCommunicationInput.organizationId;
    let loyaltyCardCode = expiryCommunicationInput.loyaltyCardCode;
    let campaignData = expiryCommunicationInput.campaign;
    let messageTemplateData = expiryCommunicationInput.messageTemplate;
    let communicationData = expiryCommunicationInput.communication;
    let eventType = expiryCommunicationInput.eventType;
    let numberOfDays = expiryCommunicationInput.numberOfDays;
    let loyaltyProgramCode = expiryCommunicationInput.loyaltyProgramCode;
    //To verify organization
    let organization = await entityManager.findOne(Organization, {
      id: organizationId
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    let loyaltyCard = await injector
      .get(LoyaltyCardProvider)
      .getLoyaltyCardByCode(entityManager, loyaltyCardCode, organizationId);
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }

    let loyaltyInput = {
      loyaltyCode: loyaltyProgramCode,
      organizationId: organizationId,
      loyaltyCardCode: loyaltyCardCode
    };
    let loyaltyProgram = await injector
      .get(LoyaltyProgramProvider)
      .getLoyaltyProgramsByCode(entityManager, injector, loyaltyInput);
    if (!loyaltyProgram) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_PROGRAM_NOT_FOUND);
    }

    let communication = await communicationResolvers.Mutation.createCommunicationWithMessageTempate(
      { user, application },
      {
        messageTemplateInput: messageTemplateData,
        communicationInput: communicationData
      },
      { injector: communicationModule.injector },
      info
    );
    console.log("communication ", communication);
    let expiryCommunicationData = await entityManager.create(
      ExpiryCommunication,
      {
        communication,
        loyaltyCard,
        loyaltyProgram,
        eventType,
        numberOfDays
      }
    );
    console.log("expiryCommunicationData ", expiryCommunicationData);
    let expiryCommunication = await entityManager.save(expiryCommunicationData);
    return expiryCommunication;
  }

  @addPaginateInfo
  public async getPageWiseExpiryCommunications(
    entityManager: EntityManager,
    pageOptions,
    sortOptions,
    injector,
    organizationId,
    loyaltyCardCode,
    loyaltyProgramCode
  ) {
    let options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    options.relations = [
      "communication",
      "communication.messageTemplate",
      "loyaltyCard",
      "loyaltyProgram",
      "loyaltyCard.currency"
    ];
    options.where = {
      organization: organizationId
    };
    let loyaltyCard: LoyaltyCard, loyaltyProgram: LoyaltyProgram;
    if (loyaltyCardCode) {
      // console.log("customer loyalty card is:-", loyaltyCardCode);
      loyaltyCard = await entityManager.findOne(LoyaltyCard, {
        where: { code: loyaltyCardCode }
      });
      if (!loyaltyCard) {
        throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
      }
      options.where["loyaltyCard"] = loyaltyCard;
    }
    if (loyaltyProgramCode) {
      // console.log("customer loyalty program is:-", loyaltyProgramCode);
      loyaltyProgram = await entityManager.findOne(LoyaltyProgram, {
        where: { code: loyaltyProgramCode, loyaltyCard: loyaltyCard.id }
      });
      if (!loyaltyProgram) {
        throw new WCoreError(REWARDX_ERRORS.ERROR_FOR_EXPIRY_COMMUNICATION);
      }
      options.where["loyaltyProgram"] = loyaltyProgram;
    }
    let expiryCommunications = await entityManager.findAndCount(
      ExpiryCommunication,
      options
    );
    // console.log("expiryCommunications ", expiryCommunications);
    return expiryCommunications;
  }

  public async updateExpiryCommunication(
    entityManager: EntityManager,
    injector,
    expiryCommunicationInput,
    user,
    application,
    info
  ): Promise<Object> {
    console.log("expiryCommunication", expiryCommunicationInput);
    let organizationId = expiryCommunicationInput.organizationId;
    let loyaltyCardCode = expiryCommunicationInput.loyaltyCardCode;
    let campaignData = expiryCommunicationInput.campaign;
    let messageTemplateData = expiryCommunicationInput.messageTemplate;
    let communicationData = expiryCommunicationInput.communication;
    let eventType = expiryCommunicationInput.eventType;
    let expiryCommunicationId = expiryCommunicationInput.id;
    let numberOfDays = expiryCommunicationInput.numberOfDays;
    let loyaltyProgramCode = expiryCommunicationInput.loyaltyProgramCode;
    //To verify organization
    let organization = await entityManager.findOne(Organization, {
      id: organizationId
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    let loyaltyCard = await injector
      .get(LoyaltyCardProvider)
      .getLoyaltyCardByCode(entityManager, loyaltyCardCode, organizationId);
    if (!loyaltyCard) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
    }

    let loyaltyInput = {
      loyaltyCode: loyaltyProgramCode,
      organizationId: organizationId,
      loyaltyCardCode: loyaltyCardCode
    };
    let loyaltyProgram = await injector
      .get(LoyaltyProgramProvider)
      .getLoyaltyProgramsByCode(entityManager, injector, loyaltyInput);
    if (!loyaltyProgram) {
      throw new WCoreError(REWARDX_ERRORS.LOYALTY_PROGRAM_NOT_FOUND);
    }

    let existedExpiryCommunication = await entityManager.findOne(
      ExpiryCommunication,
      {
        where: {
          id: expiryCommunicationId
        },
        relations: [
          "loyaltyCard",
          "loyaltyProgram",
          "communication",
          "communication.campaign",
          "communication.messageTemplate",
          "loyaltyCard.currency"
        ]
      }
    );
    console.log("existedExpiryCommunication ", existedExpiryCommunication);
    if (!existedExpiryCommunication) {
      throw new WCoreError(REWARDX_ERRORS.EXPIRY_COMMUNICATION_NOT_FOUND);
    }
    let existedCommunication = existedExpiryCommunication.communication;
    // Create the communication and message template
    let communication = await communicationResolvers.Mutation.updateCommunicationWithMessageTempate(
      { user, application },
      {
        messageTemplateInput: messageTemplateData,
        communicationInput: communicationData
      },
      { injector: communicationModule.injector },
      info
    );
    console.log("communication ", communication);
    existedExpiryCommunication.communication = communication;
    existedExpiryCommunication.eventType = eventType
      ? eventType
      : existedExpiryCommunication.eventType;
    existedExpiryCommunication.numberOfDays = numberOfDays
      ? numberOfDays
      : existedExpiryCommunication.numberOfDays;
    let expiryCommunication = await entityManager.save(
      existedExpiryCommunication
    );
    return expiryCommunication;
  }

  public async expiryReminderCommunication(
    entityManager: EntityManager,
    injector,
    organizationId
  ) {
    // To retrieve business rule by key
    let businessResult = await getyBusinessRuleDataByKey(
      entityManager,
      injector,
      RULE_TYPE.LOYALTY_SCHEDULED_DATE_TIME,
      organizationId
    );
    console.log("businessResult ", businessResult);
    let scheduledDateTime = null;
    // To consider scheduled time based on business rules
    if (businessResult) {
      let scheduledHourTime = businessResult;
      let scheduledHour = scheduledHourTime.split(":")[0];
      let scheduledTime = scheduledHourTime.split(":")[1];
      scheduledDateTime = moment().set({
        h: scheduledHour,
        m: scheduledTime
      });
    }
    console.log("scheduledDateTime ", scheduledDateTime);
    // To retrieve all loyalty cards
    let loyaltyCards = await injector
      .get(LoyaltyCardProvider)
      .getLoyaltyCardsForOrganization(entityManager, organizationId);
    if (loyaltyCards && loyaltyCards.length > 0) {
      for (var index in loyaltyCards) {
        let loyaltyCard = loyaltyCards[index];
        // To retrieve all expiry communciation based on loyaltyCardCode and eventType
        let expiryCommunications: any = await this.getExpiryCommunicationByLoyaltyCardCodeAndEventType(
          entityManager,
          injector,
          organizationId,
          loyaltyCard.code,
          null,
          EXPIRY_COMMUNICATION_EVENT_TYPE.EXPIRY_REMINDER
        );
        if (expiryCommunications && expiryCommunications.length > 0) {
          console.log("Loyalty Card ", loyaltyCards[index]);
          for (var expIndex in expiryCommunications) {
            let expiryCommunication = expiryCommunications[expIndex];
            console.log("expiryCommunication data  ", expiryCommunication);
            let numberOfdays = expiryCommunication.numberOfDays;
            let communication = expiryCommunication.communication;
            let expiryDate = moment()
              .utcOffset(330)
              .add(parseInt(numberOfdays), "days")
              .format("YYYY-MM-DD");
            console.log("expiryDate", expiryDate);
            // To retrieve Loyalty Ledgers based on expiryDate
            const loyaltyLedgers = await entityManager
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
              .innerJoinAndSelect(
                "customerLoyaltyProgram.customerLoyalty",
                "customerLoyalty"
              )
              .innerJoinAndSelect("customerLoyalty.customer", "customer")
              .where(
                "loyaltyLedger.pointsRemaining >0 and date(loyaltyLedger.expiryDate) = :expiryDate",
                { expiryDate }
              )
              .getMany();
            if (loyaltyLedgers && loyaltyLedgers.length > 0) {
              for (var loyIndex in loyaltyLedgers) {
                let loyaltyLedger = loyaltyLedgers[loyIndex];
                let loyaltyTransaction = loyaltyLedger.loyaltyTransaction;
                //@ts-ignore
                let customerLoyaltyProgram =
                  loyaltyTransaction.customerLoyaltyProgram;
                let customerLoyalty = customerLoyaltyProgram.customerLoyalty;
                let customer = customerLoyalty.customer;
                let replacableData = {
                  points: loyaltyLedger.pointsRemaining,
                  phoneNumber: customer.phoneNumber
                };
                console.log("customer ", customer);
                let messageBody: string;
                for (var key in replacableData) {
                  messageBody = communication.messageTemplate.templateBodyText.replace(
                    `{{${key}}}`,
                    replacableData[key]
                  );
                }
                //Sending sms to customer
                this.communicationService.sendSMS(
                  customer.phoneNumber,
                  messageBody,
                  customer.id,
                  communication.commsChannelName,
                  process.env.COMMS_LOYALTY_CONSUMER_NAME,
                  scheduledDateTime,
                  communication.messageTemplate.externalTemplateId
                );
              }
            }
          }
        }
      }
    }
    return { status: true };
  }

  public async getExpiryCommunicationByLoyaltyCardCodeAndEventType(
    entityManager: EntityManager,
    injector,
    organizationId,
    loyaltyCardCode,
    loyaltyProgramCode,
    eventType
  ): Promise<ExpiryCommunication[]> {
    let expiryCommunications = [];
    let loyaltyCard = await injector
      .get(LoyaltyCardProvider)
      .getLoyaltyCardByCode(entityManager, loyaltyCardCode, organizationId);
    if (loyaltyProgramCode) {
      // console.log("customer loyalty program is:-", loyaltyProgramCode);
      let loyaltyProgram = await entityManager.findOne(LoyaltyProgram, {
        where: { code: loyaltyProgramCode, loyaltyCard: loyaltyCard.id }
      });
      if (!loyaltyProgram) {
        throw new WCoreError(REWARDX_ERRORS.ERROR_FOR_EXPIRY_COMMUNICATION);
      }
    }
    if (loyaltyCard) {
      expiryCommunications = await entityManager.find(ExpiryCommunication, {
        where: {
          loyaltyCard: loyaltyCard,
          eventType: eventType
        },
        relations: [
          "communication",
          "loyaltyCard",
          "loyaltyCard.currency",
          "loyaltyProgram",
          "communication.messageTemplate",
          "communication.campaign"
        ]
      });
    }
    return expiryCommunications;
  }
}
