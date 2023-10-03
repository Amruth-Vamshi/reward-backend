import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../walkin-core/__tests__/utils/unit/index";
import * as CoreEntities from "../../../../../walkin-core/src/entity";
import * as RewardxEntities from "../../../entity";
import Chance from "chance";
import { getConnection, getManager } from "typeorm";
import { ApplicationProvider } from "../../../../../walkin-core/src/modules/account/application/application.providers";
import { ApplicationModule } from "../../../../../walkin-core/src/modules/account/application/application.module";
import { STATUS } from "../../../../../walkin-core/src/modules/common/constants";
import { COLLECTIONS_ENTITY_TYPE } from "../../common/constants/constant";
import { CollectionsProvider } from "../collections.provider";
import { CollectionsModule } from "../collections.module";
import { CampaignProvider } from "../../../../../walkin-core/src/modules/campaigns/campaign.providers";
import { CampaignModule } from "../../campaigns/campaign.module";
import { WCORE_ERRORS } from "../../../../../walkin-core/src/modules/common/constants/errors";

let user: CoreEntities.User;
let application: CoreEntities.Application;
const chance = new Chance();

const collectionsService: CollectionsProvider = CollectionsModule.injector.get(
  CollectionsProvider
);
const collectionsInjector = CollectionsModule.injector;

let campaign: any;
const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const campaignService: CampaignProvider = CampaignModule.injector.get(
  CampaignProvider
);

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
  let d = new Date();
  let ed = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());

  const createCampaignInput = {
    name: "123",
    campaignType: "LOYALTY",
    startTime: d,
    endTime: ed,
    organization_id: user.organization.id
  };
  campaign = await campaignService.createCampaign(
    manager,
    user,
    createCampaignInput,
    collectionsInjector
  );
});

describe("Create Collections", () => {
  test("Create Collections with valid inputs", async () => {
    const manager = getManager();

    const createCollectionsInput = {
      name: chance.string(),
      description: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      campaignId: campaign.id,
      entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
    };
    const createdCollections = await collectionsService.createCollections(
      manager,
      collectionsInjector,
      createCollectionsInput
    );
    expect(createdCollections).toBeDefined();
    expect(createdCollections.id).toBeDefined();
    expect(createdCollections.organizationId).toBe(user.organization.id);
    console.log("Create Collection Test Success!");
  });
});

describe("Create, Get and Delete Collections", () => {
  test("Fetch Collections with valid inputs", async () => {
    const manager = getManager();

    const createCollectionsInput = {
      name: chance.string(),
      description: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      campaignId: campaign.id,
      entity: COLLECTIONS_ENTITY_TYPE.STORE
    };
    const createCollectionsInput1 = {
      name: chance.string(),
      description: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      campaignId: campaign.id,
      entity: COLLECTIONS_ENTITY_TYPE.CUSTOMER
    };
    const getCollectionsInput = {
      organizationId: user.organization.id
    };

    const createdCollections1 = await collectionsService.createCollections(
      manager,
      collectionsInjector,
      createCollectionsInput
    );
    expect(createdCollections1.organizationId).toBe(user.organization.id);

    const createdCollections2 = await collectionsService.createCollections(
      manager,
      collectionsInjector,
      createCollectionsInput1
    );
    expect(createdCollections2.organizationId).toBe(user.organization.id);

    await collectionsService.deleteCollection(
      manager,
      collectionsInjector,
      createdCollections1.id
    );

    const getCollections: any = await collectionsService.getCollectionsWithFilters(
      manager,
      collectionsInjector,
      getCollectionsInput
    );

    expect(getCollections.data[1].id).toBe(createdCollections2.id);
    expect(getCollections.count).toBe(2);

    console.log("Create ,Get and Delete Test Success!");
  });
});

describe("Update Collections", () => {
  test("Update Collections with valid inputs", async () => {
    const manager = getManager();

    const createCollectionsInput = {
      name: chance.string(),
      description: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      campaignId: "123",
      entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
    };

    const createdCollections = await collectionsService.createCollections(
      manager,
      collectionsInjector,
      createCollectionsInput
    );
    expect(createdCollections).toBeDefined();
    expect(createdCollections.id).toBeDefined();
    expect(createdCollections.organizationId).toBe(
      createCollectionsInput.organizationId
    );

    const updateCollectionsInput = {
      collectionsId: createdCollections.id,
      name: chance.string(),
      status: STATUS.INACTIVE
    };
    const updatedCollections = await collectionsService.updateCollections(
      manager,
      collectionsInjector,
      updateCollectionsInput
    );
    expect(updatedCollections).toBeDefined();
    expect(updatedCollections.id).toBe(updateCollectionsInput.collectionsId);
    expect(updatedCollections.organizationId).toBe(
      createCollectionsInput.organizationId
    );
    expect(updatedCollections.status).toBe(updateCollectionsInput.status);
    expect(updatedCollections.name).toBe(updateCollectionsInput.name);
  });

  test("Should FAIL to update invalid status", async () => {
    const manager = getManager();

    const createCollectionsInput = {
      name: chance.string(),
      description: chance.string(),
      status: STATUS.ACTIVE,
      organizationId: user.organization.id,
      campaignId: "123",
      entity: COLLECTIONS_ENTITY_TYPE.PRODUCT
    };

    const createdCollections = await collectionsService.createCollections(
      manager,
      collectionsInjector,
      createCollectionsInput
    );
    expect(createdCollections).toBeDefined();
    expect(createdCollections.id).toBeDefined();
    expect(createdCollections.organizationId).toBe(
      createCollectionsInput.organizationId
    );

    const updateCollectionsInput = {
      collectionsId: createdCollections.id,
      name: chance.string(),
      status: STATUS.INACTIVE
    };
    try {
      await collectionsService.updateCollections(
        manager,
        collectionsInjector,
        updateCollectionsInput
      );
    } catch (error) {
      expect(error.message).toBe(WCORE_ERRORS.INVALID_STATUS.MESSAGE);
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
