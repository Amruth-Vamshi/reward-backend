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

import { CurrencyProvider } from "@walkinserver/walkin-rewardx/src/modules/currency/currency.provider";
import { from } from "zen-observable";
import { RewardXModule } from "@walkinserver/walkin-rewardx/src/index";
import { REWARDX_ERRORS } from "@walkinserver/walkin-rewardx/src/modules/common/constants/errors";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";

var chance = new Chance();
let user: CoreEntities.User;
let application: CoreEntities.Application;

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
let currencyService: CurrencyProvider = RewardXModule.injector.get(
  CurrencyProvider
);

beforeAll(async () => {
  await createUnitTestConnection({ ...CoreEntities, ...RewardxEntities });
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();

  application = await applicationService.createApplication(
    manager,
    user.organization.id,
    { name: chance.string({ length: 5 }) }
  );
});
let currencyInput = {
  code: chance.string({ length: 5 }), //   code: "RUPEE",
  conversionRatio: 1,
  name: chance.string({ length: 20 }) //   name: "Indian Rupee"
};

let currencyInput2 = {
  code: chance.string({ length: 5 }), //   code: "RUPEE",
  conversionRatio: 10,
  name: chance.string({ length: 20 }) //   name: "Indian Rupee"
};

describe("Create currency", () => {
  test("Create currency", async () => {
    const manager = getManager();
    let currencyResponse = await currencyService.createCurrency(
      manager,
      currencyInput
    );
    expect(currencyResponse.conversionRatio).toBe(1);
  });
  test("create currency without code mandatory field", async () => {
    const manager = getManager();
    try {
      let currencyResponse = await currencyService.createCurrency(manager, {
        conversionRatio: 1,
        name: chance.string({ length: 5 })
      });
    } catch (e) {
      expect(e).toEqual(new WCoreError(REWARDX_ERRORS.CURRENCY_CODE_NOT_FOUND));
    }
  });
  test("create currency without name mandatory field", async () => {
    const manager = getManager();
    try {
      let currencyResponse = await currencyService.createCurrency(manager, {
        conversionRatio: 1,
        code: chance.string({ length: 5 })
      });
    } catch (e) {
      expect(e).toEqual(new WCoreError(REWARDX_ERRORS.CURRENCY_NAME_NOT_FOUND));
    }
  });
});
describe("Update Currency", () => {
  test("Update currency with non exist currency id", async () => {
    const manager = getManager();
    let currency = {
      id: 11,
      code: chance.string({ length: 5 }),
      name: chance.string({ length: 5 })
    };
    try {
      let updateCurrency = await currencyService.updateCurrency(
        manager,
        currency
      );
    } catch (e) {
      expect(e).toEqual(new WCoreError(REWARDX_ERRORS.CURRENCY_NOT_FOUND));
    }
  });
  test("Create, Update currency", async () => {
    const manager = getManager();
    let createCurrency2 = await currencyService.createCurrency(
      manager,
      currencyInput2
    );
    console.log("createCurrency2", createCurrency2);
    let currency = {
      id: createCurrency2.id,
      code: createCurrency2.code,
      name: chance.string({ length: 5 })
    };
    let updateCurrency = await currencyService.updateCurrency(
      manager,
      currency
    );
    expect(updateCurrency.conversionRatio).toBe(10);
  });
  test("Create, trying to update currency with out passing code mandatory field or code is emptry string", async () => {
    const manager = getManager();
    let currencyResponse = await currencyService.createCurrency(
      manager,
      currencyInput2
    );
    console.log("createCurrency2", currencyResponse);
    let currency = {
      id: currencyResponse.id,
      // code: chance.string({ length: 5 }),
      code: "",
      name: currencyResponse.name
    };
    try {
      let updateCurrency = await currencyService.updateCurrency(
        manager,
        currency
      ); //createCurrency2.id
      console.log("update curr2", updateCurrency);
    } catch (e) {
      expect(e).toEqual(new WCoreError(REWARDX_ERRORS.CURRENCY_CODE_NOT_FOUND));
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
