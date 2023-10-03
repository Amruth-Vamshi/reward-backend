import { getManager, getConnection } from "typeorm";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "@walkinserver/walkin-core/__tests__/utils/unit";
import { communicationModule } from "../../../../../walkin-core/src/modules/communication/communication.module";
import * as CoreEntities from "@walkinserver/walkin-core/src/entity";
import * as RewardxEntities from "../../../entity";
import { ApplicationProvider } from "@walkinserver/walkin-core/src/modules/account/application/application.providers";
import { ApplicationModule } from "@walkinserver/walkin-core/src/modules/account/application/application.module";
import Chance from "chance";
import { LoyaltyCardProvider } from "@walkinserver/walkin-rewardx/src/modules/loyalty-card/loyalty-card.provider";
import { CurrencyProvider } from "@walkinserver/walkin-rewardx/src/modules/currency/currency.provider";
import { RewardXModule } from "@walkinserver/walkin-rewardx/src/index";
import moment = require("moment");
import {
  CAMPAIGN_TYPE,
  CAMPAIGN_TRIGGER_TYPE,
  SEGMENT_TYPE,
  MESSAGE_FORMAT,
  TEMPLATE_STYLE,
  STATUS,
  COMMUNICATION_ENTITY_TYPE,
  METRIC_FILTER_TYPE
} from "@walkinserver/walkin-core/src/modules/common/constants/constants";
import { CurrencyModule } from "../../currency/currency.module";
import { LoyaltyCardModule } from "../../loyalty-card/loyalty-card.module";
import { LoyaltyTransactionProvider } from "../../loyalty-transaction/loyalty-transaction.provider";
import { EXPIRY_COMMUNICATION_EVENT_TYPE } from "../../common/constants/constant";
import { ExpiryCommunicationProvider } from "../expiry-communication.provider";
import { expiryCommunicationResolvers } from "../expiry-communication.resolvers";
import { ExpiryCommunicationModule } from "../expiry-communication.module";

let user: CoreEntities.User;
let application: CoreEntities.Application;

let currency: RewardxEntities.Currency;
let loyaltyCard: RewardxEntities.LoyaltyCard;
var chance = new Chance();

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);

const currencyService: CurrencyProvider = CurrencyModule.injector.get(
  CurrencyProvider
);
const loyaltyCardService: LoyaltyCardProvider = LoyaltyCardModule.injector.get(
  LoyaltyCardProvider
);
let loyaltyTransactionService: LoyaltyTransactionProvider = RewardXModule.injector.get(
  LoyaltyTransactionProvider
);
let expiryCommunicationProvider: ExpiryCommunicationProvider = RewardXModule.injector.get(
  ExpiryCommunicationProvider
);
const injector = RewardXModule.injector;

beforeAll(async () => {
  await createUnitTestConnection({ ...CoreEntities, ...RewardxEntities });
  ({ user } = await getAdminUser(getConnection()));
  let manager = getManager();
  application = await applicationService.createApplication(
    manager,
    user.organization.id,
    {
      name: chance.string({ length: 5 })
    }
  );
  // console.log("segment is:-", segment);

  let currencyInput = {
    code: chance.string({ length: 5 }),
    conversionRatio: 1,
    name: chance.string({ length: 50 })
  };
  currency = await currencyService.createCurrency(manager, currencyInput);
  // console.log("currency is:-", currency);

  let loyaltyCardInput = {
    code: chance.string({ length: 5 }),
    currencyCode: currency.code,
    description: chance.string({ length: 100 }),
    name: chance.string({ length: 10 }),
    organizationId: user.organization.id
  };

  loyaltyCard = await loyaltyCardService.createLoyaltyCard(
    manager,
    loyaltyCardInput
  );
  // console.log("loyalty card is:-", loyaltyCard);
});
describe("Testing the sample expiry communication with campaign", () => {
  test.skip("create a expiry communication", async () => {
    let manager = getManager();
    const messageTemplateInput: any = {
      name: chance.string({ length: 2 }),
      description: chance.string({ length: 6 }),
      messageFormat: MESSAGE_FORMAT.PUSH,
      templateStyle: TEMPLATE_STYLE.MUSTACHE,
      templateBodyText: chance.string({ length: 3 }),
      templateSubjectText: chance.string({ length: 5 }),
      org: user.organization,
      url: "",
      imageUrl: "",
      status: STATUS.ACTIVE,
      organization_id: user.organization.id
    };
    const communicationInput: any = {
      name: chance.string({ length: 2 }),
      key: chance.string({ length: 2 }),
      type: METRIC_FILTER_TYPE.STRING,
      status: STATUS.ACTIVE,
      isScheduled: true,
      firstScheduleDateTime: new Date(),
      entityId: "",
      entityName: COMMUNICATION_ENTITY_TYPE.LOYALTY,
      entityType: COMMUNICATION_ENTITY_TYPE.LOYALTY,
      isRepeatable: true,
      lastProcessedDateTime: new Date().getDate() + 1,
      commsChannelName: chance.string({ length: 3 }),
      organization_id: user.organization.id,
      repeatRuleConfiguration: {
        time: "17:45:00",
        frequency: "WEEKLY",
        endAfter: "2019-12-23:23:23:23",
        noOfOccurances: 1
      }
    };
    let expiryCommunicationInput = {
      messageTemplate: messageTemplateInput,
      communication: communicationInput,
      loyaltyCardCode: loyaltyCard.code,
      eventType: EXPIRY_COMMUNICATION_EVENT_TYPE.EXPIRY_REMINDER,
      numberOfDays: 100,
      organizationId: user.organization.id
    };
    let expiryCommunication: any = await expiryCommunicationProvider.createExpiryCommunication(
      manager,
      injector,
      expiryCommunicationInput,
      user,
      application,
      communicationModule
    );
    // console.log('expiryCommunicationInput ', expiryCommunication)
    // expect(expiryCommunication.eventType).toBe(EXPIRY_COMMUNICATION_EVENT_TYPE.EXPIRY_REMINDER);
    // expect(expiryCommunication.loyaltyCard.code).toBe(loyaltyCard.code);
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
