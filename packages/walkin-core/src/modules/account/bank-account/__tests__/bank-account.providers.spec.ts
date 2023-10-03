import * as CoreEntities from "../../../../entity";
import {
  closeUnitTestConnection,
  createUnitTestConnection,
  getAdminUser
} from "../../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { Chance } from "chance";
import { StoreModule } from "../../store/store.module";
import { Stores, StoreOpenTimingProvider } from "../../store/store.providers";
import { StoreFormatModule } from "../../../productcatalog/storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../../productcatalog/storeformat/storeFormat.providers";
import { TaxTypeModule } from "../../../productcatalog/taxtype/taxtype.module";
import { TaxTypeProvider } from "../../../productcatalog/taxtype/taxtype.providers";
import { ChannelModule } from "../../../productcatalog/channel/channel.module";
import { ChannelProvider } from "../../../productcatalog/channel/channel.providers";
import { CatalogModule } from "../../../productcatalog/catalog/catalog.module";
import { CatalogProvider } from "../../../productcatalog/catalog/catalog.providers";
import {
  ENUM_DAY,
  STATUS,
  AREA_TYPE,
  ENUM_DELIVERY_LOCATION_TYPE,
  STAFF_ROLE,
  STORE_SERVICE_AREA_TYPE,
  LEGAL_DOCUMENT_TYPE,
  ACCOUNT_TYPE
} from "../../../common/constants/constants";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { WCoreError } from "../../../common/exceptions";
import { BankAccountModule } from "../bank-account.module";
import { BankAccountProvider } from "../bank-account.providers";
const storeFormatProvider = StoreFormatModule.injector.get(StoreFormatProvider);
const taxTypeProvider = TaxTypeModule.injector.get(TaxTypeProvider);
const channelProvider = ChannelModule.injector.get(ChannelProvider);
const catalogProvider = CatalogModule.injector.get(CatalogProvider);
const banAccountProvider = BankAccountModule.injector.get(BankAccountProvider);
let user: CoreEntities.User;
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const storeProvider: Stores = StoreModule.injector.get(Stores);
const storeOpenTimingProvider: StoreOpenTimingProvider = StoreModule.injector.get(
  StoreOpenTimingProvider
);

describe.skip("Should be able to add bank account for valid input", () => {
  test("should add bank account for a valid input", async () => {
    const manager = getManager();
    const bankAccountInput = {
      bank_account_number: chance.integer({ min: 400000000 }).toString(),
      gst_number: chance.integer({ min: 400000000 }).toString(),
      ifsc_code: "HDFC0009107",
      phone: `+91${chance.phone({ formatted: false })}`,
      beneficiaryName: chance.name(),
      name: chance.name(),
      user
    };
    const addBankAccount = await banAccountProvider.addBankAccountDetails(
      manager,
      {
        ...bankAccountInput
      },
      user.organization.id
    );
    expect(addBankAccount).toBeDefined();
    expect(addBankAccount.accountNumber).toBe(
      bankAccountInput.bank_account_number
    );
    expect(addBankAccount.externalAccountId).toBeDefined();
    expect(addBankAccount.email).toBe(user.organization.id + "@" + process.env.EMAIL_SUFFIX);
  });

  test("should fail to add bank account with invalid bank account details", async () => {
    const manager = getManager();
    const bankAccountInput = {
      bank_account_number: chance.integer({ min: 400000000 }).toString(),
      gst_number: chance.integer({ min: 400000000 }).toString(),
      ifsc_code: chance.name(),
      phone: `+91${chance.phone({ formatted: false })}`,
      beneficiaryName: chance.name(),
      name: chance.name(),
      user
    };
    try {
      await banAccountProvider.addBankAccountDetails(
        manager,
        {
          ...bankAccountInput
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR));
    }
  });

  test("should add secondary bank account if primary already exists", async () => {
    const manager = getManager();
    const bankAccountInput = {
      bank_account_number: chance.integer({ min: 400000000 }).toString(),
      gst_number: chance.integer({ min: 400000000 }).toString(),
      ifsc_code: "HDFC0009107",
      phone: `+91${chance.phone({ formatted: false })}`,
      beneficiaryName: chance.name(),
      name: chance.name(),
      user
    };
    const addBankAccount = await banAccountProvider.addBankAccountDetails(
      manager,
      {
        ...bankAccountInput
      },
      user.organization.id
    );

    const bankAccountInput1 = {
      bank_account_number: chance.integer({ min: 400000000 }).toString(),
      gst_number: chance.integer({ min: 400000000 }).toString(),
      ifsc_code: "HDFC0009107",
      phone: `+91${chance.phone({ formatted: false })}`,
      beneficiaryName: chance.name(),
      name: chance.name(),
      email: chance.email(),
      user
    };

    const addBankAccount1 = await banAccountProvider.addBankAccountDetails(
      manager,
      {
        ...bankAccountInput1
      },
      user.organization.id
    );

    expect(addBankAccount).toBeDefined();
    expect(addBankAccount1).toBeDefined();
    expect(addBankAccount1.accountType).toBeDefined();
    expect(addBankAccount1.accountType).toBe(ACCOUNT_TYPE.SECONDARY);
  });

  test("should add bank account on razorpay if we change primary bank account", async () => {
    const manager = getManager();
    const bankAccountInput = {
      bank_account_number: chance.integer({ min: 400000000 }).toString(),
      gst_number: chance.integer({ min: 400000000 }).toString(),
      ifsc_code: "HDFC0009107",
      phone: `+91${chance.phone({ formatted: false })}`,
      beneficiaryName: chance.name(),
      name: chance.name(),
      email: chance.email(),
      user
    };
    const addBankAccount = await banAccountProvider.addBankAccountDetails(
      manager,
      {
        ...bankAccountInput
      },
      user.organization.id
    );

    const changeBankAccount = await banAccountProvider.changePrimaryBankAccount(
      manager,
      {
        bankAccountId: addBankAccount.id,
        organizationId: user.organization.id,
        user
      }
    );

    expect(changeBankAccount).toBeDefined();
    expect(addBankAccount.externalAccountId).toBeNull();
    expect(changeBankAccount.externalAccountId).toBeDefined();
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
