import { getManager, getConnection, EntityManager } from "typeorm";
import { PartnerProvider } from "../partner.providers";
import { PartnerModule } from "../partner.module";
import Chance from "chance";
import * as WCoreEntities from "../../../entity";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { STATUS, PARTNER_TYPE } from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
let user: WCoreEntities.User;
const chance = new Chance();

const partnerProvider: PartnerProvider = PartnerModule.injector.get(
  PartnerProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Should Create a Partner", () => {
  test("should Create a partner with valid input", async () => {
    const manager = getManager();
    const partner = {
      name: chance.string(),
      partnerType: PARTNER_TYPE.DELIVERY,
      status: "ACTIVE",
      code: chance.string()
    };
    const createPartner = await partnerProvider.addPartner(
      manager,
      partner,
      user.organization.id
    );
    expect(createPartner).toBeDefined();
    expect(createPartner.name).toBe(partner.name);
    expect(createPartner.partnerType).toBe(partner.partnerType);
  });

  test("should Fail to create with duplicate partner type", async () => {
    const manager = getManager();
    const partner = {
      name: chance.string(),
      partnerType: PARTNER_TYPE.DELIVERY,
      status: "ACTIVE",
      code: chance.string()
    };
    const createPartner = await partnerProvider.addPartner(
      manager,
      partner,
      user.organization.id
    );
    try {
      const createPartner1 = await partnerProvider.addPartner(
        manager,
        partner,
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PARTNER_TYPE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should update a partner type", () => {
  test("should update with vaid input", async () => {
    const manager = getManager();
    const partner = {
      name: chance.string(),
      partnerType: PARTNER_TYPE.DELIVERY,
      status: "ACTIVE",
      code: chance.string()
    };
    const createPartner = await partnerProvider.addPartner(
      manager,
      partner,
      user.organization.id
    );

    const updatedSchema = {
      id: createPartner.id,
      name: chance.string()
    };
    const updateSchema = await partnerProvider.updatePartner(
      manager,
      updatedSchema,
      user.organization.id
    );
    expect(updateSchema).toBeDefined();
    expect(updateSchema.id).toBe(updatedSchema.id);
    expect(updateSchema.name).toBe(updatedSchema.name);
  });

  test("should fail to update with duplicate partner type", async () => {
    const manager = getManager();
    const partner = {
      name: chance.string(),
      partnerType: PARTNER_TYPE.DELIVERY,
      status: "ACTIVE",
      code: chance.string()
    };
    const createPartner = await partnerProvider.addPartner(
      manager,
      partner,
      user.organization.id
    );
    const partner2 = {
      name: chance.string(),
      partnerType: PARTNER_TYPE.DELIVERY,
      status: "ACTIVE",
      code: chance.string()
    };
    const createPartner2 = await partnerProvider.addPartner(
      manager,
      partner2,
      user.organization.id
    );

    const updatedSchema = {
      id: createPartner.id,
      code: partner2.code
    };
    try {
      const updateSchema = await partnerProvider.updatePartner(
        manager,
        updatedSchema,
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.PARTNER_TYPE_ALREADY_EXISTS)
      );
    }
  });
});

describe("Should remove a partner", () => {
  test("should remove a partner with valid input", async () => {
    const manager = getManager();
    const partner = {
      name: chance.string(),
      partnerType: PARTNER_TYPE.DELIVERY,
      status: "ACTIVE",
      code: chance.string()
    };
    const createPartner = await partnerProvider.addPartner(
      manager,
      partner,
      user.organization.id
    );
    const removedPartner = await partnerProvider.removePartner(
      manager,
      {
        id: createPartner.id
      },
      user.organization.id
    );
    expect(removedPartner).toBeDefined();
    expect(removedPartner.name).toBe(createPartner.name);
  });

  test("should fail to remove partner with invalid input", async () => {
    const manager = getManager();
    try {
      await partnerProvider.removePartner(
        manager,
        {
          id: chance.guid()
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.PARTNER_NOT_FOUND));
    }
  });
});

describe("Should fetch a partner", () => {
  test("should fetch a partner for valid input", async () => {
    const manager = getManager();
    const partner = {
      name: chance.string(),
      partnerType: PARTNER_TYPE.DELIVERY,
      status: "ACTIVE",
      code: chance.string()
    };
    const createPartner = await partnerProvider.addPartner(
      manager,
      partner,
      user.organization.id
    );
    const fetchPartner = await partnerProvider.getPartner(
      manager,
      {
        id: createPartner.id
      },
      user.organization.id
    );
    expect(fetchPartner).toBeDefined();
    expect(fetchPartner.id).toBe(createPartner.id);
    expect(fetchPartner.partnerType).toBe(createPartner.partnerType);
  });
  test("should fail to fetch a invalid partner", async () => {
    const manager = getManager();
    try {
      const fetchPartner = await partnerProvider.getPartner(
        manager,
        {
          id: chance.guid()
        },
        user.organization.id
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.PARTNER_NOT_FOUND));
    }
  });
});
