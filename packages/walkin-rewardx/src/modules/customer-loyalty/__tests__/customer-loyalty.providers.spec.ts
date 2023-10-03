import { getManager, getConnection } from "typeorm";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "@walkinserver/walkin-core/__tests__/utils/unit";
import * as CoreEntities from "@walkinserver/walkin-core/src/entity";
import * as RewardxEntities from "../../../entity";
import { ApplicationProvider } from "@walkinserver/walkin-core/src/modules/account/application/application.providers";
import { ApplicationModule } from "@walkinserver/walkin-core/src/modules/account/application/application.module";
import Chance from "chance";
import { concatAST } from "graphql";
import { CustomerLoyaltyModule } from "@walkinserver/walkin-rewardx/src/modules/customer-loyalty/customer-loyalty.module";
import { CustomerLoyaltyProvider } from "@walkinserver/walkin-rewardx/src/modules/customer-loyalty/customer-loyalty.provider";
import { LoyaltyCardProvider } from "@walkinserver/walkin-rewardx/src/modules/loyalty-card/loyalty-card.provider";
import { CurrencyProvider } from "@walkinserver/walkin-rewardx/src/modules/currency/currency.provider";
import { from } from "zen-observable";
import { RewardXModule } from "@walkinserver/walkin-rewardx/src/index";
import { REWARDX_ERRORS } from "@walkinserver/walkin-rewardx/src/modules/common/constants/errors";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";

let user: CoreEntities.User;
let application: CoreEntities.Application;

var chance = new Chance();
const injector = RewardXModule.injector;

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const customerLoyaltyService: CustomerLoyaltyProvider = CustomerLoyaltyModule.injector.get(
  CustomerLoyaltyProvider
);
let loyaltyCardService: LoyaltyCardProvider = RewardXModule.injector.get(
  LoyaltyCardProvider
);
let currencyService: CurrencyProvider = RewardXModule.injector.get(
  CurrencyProvider
);

let loyaltyCardCode = "RED001";
let externalCustomerId;

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

  // console.log("application..", application)

  let currencyInput = {
    code: chance.string({ length: 5 }), //   code: "RUPEE",
    conversionRatio: 1,
    name: chance.string({ length: 20 }) //   name: "Indian Rupee"
  };
  let currency = await currencyService.createCurrency(manager, currencyInput);
  // console.log("currency", currency)

  let loyaltyCardInput = {
    code: loyaltyCardCode, //"RED001",
    currencyCode: currency.code, //   currencyCode: "RUPEE"
    description: chance.string({ length: 50 }), //   description: "Red Wallet "
    name: chance.string({ length: 20 }), //   name: "RED_WALLET
    organizationId: user.organization.id
  };
  let loyaltyCard = await loyaltyCardService.createLoyaltyCard(
    manager,
    loyaltyCardInput
  );
  // console.log("loyaltyCard", loyaltyCard)
});

let customerLoyaltyInput = {
  externalCustomerId: externalCustomerId,
  // organizationId: user.organization.id,
  loyaltyCardCode: loyaltyCardCode //"RED001"
};

describe("Create  customer", () => {
  test("Create customer", async () => {
    const manager = getManager();
    let customerResponse = await customerLoyaltyService.createCustomerLoyalty(
      manager,
      injector,
      {
        ...customerLoyaltyInput,
        externalCustomerId: "9999999999",
        organizationId: user.organization.id
      }
    );
    let getCustomer1: any = await customerLoyaltyService.getCustomerLoyalty(
      manager,
      injector,
      {
        ...customerLoyaltyInput,
        externalCustomerId: "9999999999",
        organizationId: user.organization.id
      }
    );
    expect(getCustomer1.externalCustomerId).toBe("9999999999");
  });
  test("Trying to create customer without organization", async () => {
    const manager = getManager();
    try {
      let customerResponse = await customerLoyaltyService.createCustomerLoyalty(
        manager,
        injector,
        { ...customerLoyaltyInput, externalCustomerId: "8888888888" }
      );
    } catch (e) {
      expect(e).toEqual(new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND));
    }
  });
  test("Trying to create customer with externalCustomer Id empty string", async () => {
    const manager = getManager();
    try {
      let customerResponse = await customerLoyaltyService.createCustomerLoyalty(
        manager,
        injector,
        {
          ...customerLoyaltyInput,
          externalCustomerId: "",
          organizationId: user.organization.id
        }
      );
    } catch (e) {
      expect(e).toEqual(new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMERID));
    }
  });
  test("Trying to create customer with invalid mobile number", async () => {
    const manager = getManager();
    try {
      await customerLoyaltyService.createCustomerLoyalty(manager, injector, {
        ...customerLoyaltyInput,
        organizationId: user.organization.id,
        externalCustomerId: chance.string({ length: 5 })
      });
    } catch (e) {
      expect(e).toEqual(new WCoreError(REWARDX_ERRORS.INVALID_MOBILE_NUMBER));
    }
  });
});

describe("Get customer loyalty", () => {
  test("Get customer loyalty with existing mobile number", async () => {
    const manager = getManager();
    let getCustomer: any = await customerLoyaltyService.getCustomerLoyalty(
      manager,
      injector,
      {
        ...customerLoyaltyInput,
        externalCustomerId: "9999999999",
        organizationId: user.organization.id
      }
    );
    expect(getCustomer.externalCustomerId).toBe("9999999999");
  });
  test("Get customer loyalty with mobile number not exist", async () => {
    const manager = getManager();
    try {
      let getCustomer1 = await customerLoyaltyService.getCustomerLoyalty(
        manager,
        injector,
        {
          ...customerLoyaltyInput,
          externalCustomerId: `+91${chance.phone({ formatted: false })}`,
          organizationId: user.organization.id
        }
      );
    } catch (e) {
      expect(e).toEqual(new WCoreError(REWARDX_ERRORS.CUSTOMER_NOT_FOUND));
    }
  });
  test("Get customer loyalty with invalid loyalty card code", async () => {
    const manager = getManager();
    try {
      let getCustomer: any = await customerLoyaltyService.getCustomerLoyalty(
        manager,
        injector,
        {
          ...customerLoyaltyInput,
          externalCustomerId: "9876543210",
          organizationId: user.organization.id,
          loyaltyCardCode: "RED002"
        }
      );
    } catch (e) {
      expect(e).toEqual(new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND));
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
