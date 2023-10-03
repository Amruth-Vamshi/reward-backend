import Chance from "chance";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "@walkinserver/walkin-core/__tests__/utils/unit";
import * as CoreEntities from "@walkinserver/walkin-core/src/entity";
import * as RewardxEntities from "../../../entity";
import { getManager, getConnection, EntityManager } from "typeorm";
import { ApplicationProvider } from "@walkinserver/walkin-core/src/modules/account/application/application.providers";
import { ApplicationModule } from "@walkinserver/walkin-core/src/modules/account/application/application.module";
import { CurrencyProvider } from "../../currency/currency.provider";
import { RewardXModule } from "../../rewardx.module";
import { LoyaltyCardProvider } from "../loyalty-card.provider";
import { REWARDX_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";

var chance = new Chance();
let application: CoreEntities.Application;
let user: CoreEntities.User;
let currency: RewardxEntities.Currency;

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
let currencyService: CurrencyProvider = RewardXModule.injector.get(
  CurrencyProvider
);
let loyaltyCardService: LoyaltyCardProvider = RewardXModule.injector.get(
  LoyaltyCardProvider
);

let externalCustomerId = "9999999999"; //`+91${chance.phone({ formatted: false })}`;
let loyaltyCardCode = "RED001";
let loyaltyCode = "PAYMENT";

beforeAll(async () => {
  await createUnitTestConnection({ ...CoreEntities, ...RewardxEntities });
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();

  application = await applicationService.createApplication(
    manager,
    user.organization.id,
    {
      name: chance.string({ length: 5 })
    }
  );

  let currencyInput = {
    code: chance.string({ length: 5 }),
    conversionRatio: 1,
    name: chance.string({ length: 20 })
  };
  currency = await currencyService.createCurrency(manager, currencyInput);
});

describe("loyalty card", () => {
  test("Create", async () => {
    const manager = getManager();
    let loyaltyCardInput = {
      code: loyaltyCardCode,
      currencyCode: currency.code,
      description: chance.string({ length: 50 }),
      name: chance.string({ length: 20 }),
      organizationId: user.organization.id
    };
    let loyaltyCard = await loyaltyCardService.createLoyaltyCard(
      manager,
      loyaltyCardInput
    );
    expect(loyaltyCard.code).toBe(loyaltyCardInput.code);
    expect(loyaltyCard.name).toBe(loyaltyCardInput.name);
    expect(loyaltyCard.description).toBe(loyaltyCardInput.description);
    expect(loyaltyCard.name).toBe(loyaltyCardInput.name);
    expect(loyaltyCard.currency.code).toBe(loyaltyCardInput.currencyCode);
  });

  test("Create loaytly card expect error currency not found:-", async () => {
    const manager = getManager();
    let loyaltyCardInput = {
      code: loyaltyCardCode,
      currencyCode: currency.code,
      description: chance.string({ length: 50 }),
      name: chance.string({ length: 20 }),
      organizationId: user.organization.id
    };
    let loyaltyCardWithException = loyaltyCardService.createLoyaltyCard(
      manager,
      {
        ...loyaltyCardInput,
        currencyCode: chance.string({ length: 5 })
      }
    );
    // console.log("loyalty card is:-", loyaltyCardWithException);
    await expect(loyaltyCardWithException).rejects.toThrowError(
      REWARDX_ERRORS.CURRENCY_NOT_FOUND.MESSAGE
    );
  });

  test("Create loaytly card expect error organization not found:-", async () => {
    const manager = getManager();
    let loyaltyCardInput = {
      code: loyaltyCardCode,
      currencyCode: currency.code,
      description: chance.string({ length: 50 }),
      name: chance.string({ length: 20 }),
      organizationId: user.organization.id
    };
    let loyaltyCardWithOrgException = loyaltyCardService.createLoyaltyCard(
      manager,
      {
        ...loyaltyCardInput,
        organizationId: chance.integer()
      }
    );
    // console.log("loyalty card is:-", loyaltyCardWithOrgException);
    await expect(loyaltyCardWithOrgException).rejects.toThrowError(
      WCORE_ERRORS.ORGANIZATION_NOT_FOUND.MESSAGE
    );
  });
});

describe("update loyalty card", () => {
  test("Creating loyalty card", async () => {
    const manager = getManager();
    let loyaltyCardInput = {
      code: loyaltyCardCode,
      currencyCode: currency.code,
      description: chance.string({ length: 50 }),
      name: chance.string({ length: 20 }),
      organizationId: user.organization.id
    };

    let loyaltyCard = await loyaltyCardService.createLoyaltyCard(
      manager,
      loyaltyCardInput
    );
    expect(loyaltyCard.code).toBe(loyaltyCardInput.code);
    expect(loyaltyCard.name).toBe(loyaltyCardInput.name);
    expect(loyaltyCard.description).toBe(loyaltyCardInput.description);
    expect(loyaltyCard.name).toBe(loyaltyCardInput.name);
    expect(loyaltyCard.currency.code).toBe(loyaltyCardInput.currencyCode);

    let updateLoyaltyCardInput = {
      ...loyaltyCard,
      currencyCode: currency.code,
      description: chance.string({ length: 50 }),
      name: chance.string({ length: 20 })
    };

    let updateLoyaltyCard = await loyaltyCardService.updateLoyaltyCard(
      manager,
      updateLoyaltyCardInput
    );

    expect(updateLoyaltyCard.code).toBe(updateLoyaltyCardInput.code);
    expect(updateLoyaltyCard.name).toBe(updateLoyaltyCardInput.name);
    expect(updateLoyaltyCard.description).toBe(
      updateLoyaltyCardInput.description
    );
    expect(updateLoyaltyCard.name).toBe(updateLoyaltyCardInput.name);
    expect(updateLoyaltyCard.currency.code).toBe(
      updateLoyaltyCardInput.currencyCode
    );
  });

  test("update loaytly card expect error card not found:-", async () => {
    const manager = getManager();
    let loyaltyCardInput = {
      code: loyaltyCardCode,
      currencyCode: currency.code,
      description: chance.string({ length: 50 }),
      name: chance.string({ length: 20 }),
      organizationId: user.organization.id
    };

    let loyaltyCard = await loyaltyCardService.createLoyaltyCard(
      manager,
      loyaltyCardInput
    );

    let updateLoyaltyCardInput = {
      ...loyaltyCard,
      id: chance.string({ length: 10 })
    };

    let updateLoyaltyCard = loyaltyCardService.updateLoyaltyCard(
      manager,
      updateLoyaltyCardInput
    );
    await expect(updateLoyaltyCard).rejects.toThrowError(
      REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND.MESSAGE
    );
  });

  test("update loaytly card expect error currency not found:-", async () => {
    const manager = getManager();
    let loyaltyCardInput = {
      code: loyaltyCardCode,
      currencyCode: currency.code,
      description: chance.string({ length: 50 }),
      name: chance.string({ length: 20 }),
      organizationId: user.organization.id
    };

    let loyaltyCard = await loyaltyCardService.createLoyaltyCard(
      manager,
      loyaltyCardInput
    );

    let updateLoyaltyCardInput = {
      ...loyaltyCard,
      currencyCode: chance.string({ length: 10 })
    };

    let updateLoyaltyCard = loyaltyCardService.updateLoyaltyCard(
      manager,
      updateLoyaltyCardInput
    );
    await expect(updateLoyaltyCard).rejects.toThrowError(
      REWARDX_ERRORS.CURRENCY_NOT_FOUND.MESSAGE
    );
  });

  test("update loaytly card expect error organization not found:-", async () => {
    const manager = getManager();
    let loyaltyCardInput = {
      code: loyaltyCardCode,
      currencyCode: currency.code,
      description: chance.string({ length: 50 }),
      name: chance.string({ length: 20 }),
      organizationId: user.organization.id
    };

    let loyaltyCard = await loyaltyCardService.createLoyaltyCard(
      manager,
      loyaltyCardInput
    );

    let updateLoyaltyCardInput = {
      ...loyaltyCard,
      organizationId: chance.string({ length: 10 })
    };

    let updateLoyaltyCard = loyaltyCardService.updateLoyaltyCard(
      manager,
      updateLoyaltyCardInput
    );

    expect(updateLoyaltyCard).rejects.toThrowError(
      WCORE_ERRORS.ORGANIZATION_NOT_FOUND.MESSAGE
    );
  });
});

describe("fetch loyalty card", () => {
  test("feching loyalty card by code", async () => {
    const manager = getManager();
    let loyaltyCardInput = {
      code: loyaltyCardCode,
      organizationId: user.organization.id
    };

    let loyaltyCard = await loyaltyCardService.getLoyaltyCardByCode(
      manager,
      loyaltyCardInput.code,
      loyaltyCardInput.organizationId
    );
    expect(loyaltyCard.code).toBe(loyaltyCardInput.code);
    expect(loyaltyCard.organizationId).toBe(user.organization.id);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
