import * as CoreEntities from "../../../../../walkin-core/src/entity";
import {
  closeUnitTestConnection,
  createUnitTestConnection,
  getAdminUser
} from "../../../../../walkin-core/__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { CampaignProvider } from "../campaign.providers";
import { CampaignModule } from "../campaign.module";
import { resolvers } from "../campaign.resolvers";
import { Chance } from "chance";
import { Organizations } from "../../../../../walkin-core/src/modules/account/organization/organization.providers";

import {
  OrganizationTypeEnum,
  Status
} from "../../../../../walkin-core/src/graphql/generated-models";
import {
  CAMPAIGN_TYPE,
  WORKFLOW_STATES,
  CAMPAIGN_TRIGGER_TYPE
} from "../../../../../walkin-core/src/modules/common/constants/constants";
import { ApplicationProvider } from "../../../../../walkin-core/src/modules/account/application/application.providers";
import { ApplicationModule } from "../../../../../walkin-core/src/modules/account/application/application.module";

let user: CoreEntities.User;
let application;
let organizationProvider: Organizations;
let globalOrganization: any;

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  const manager = getManager();
  organizationProvider = new Organizations();

  globalOrganization = await organizationProvider.createOrganization(manager, {
    code: Chance().string(),
    name: "TEST_ORG",
    organizationType: OrganizationTypeEnum.Organization,
    status: Status.Active
  });
  ({ user } = await getAdminUser(getConnection()));
});

const chance = new Chance();

const campaignProvider: CampaignProvider = CampaignModule.injector.get(
  CampaignProvider
);

xdescribe("CampaignResolver Basic Tests", () => {
  test("getCampaigns", async () => {
    const entityManager = getManager();

    const campaignInputs = [];

    const campaignInput1 = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      campaignType: CAMPAIGN_TYPE.LOYALTY,
      campaignStatus: WORKFLOW_STATES.DRAFT,
      campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.SCHEDULED,
      triggerRule: undefined,
      startTime: new Date(),
      endTime: new Date().getTime() + 1,
      audienceFilterRule: undefined,
      organization: user.organization.id,
      application: undefined,
      status: Status.Active
    };

    campaignInputs.push(campaignInput1);

    const campaignInput2 = {
      ...campaignInput1
    };
    campaignInput2.name = chance.string({ length: 5 });
    campaignInput2.campaignType = CAMPAIGN_TYPE.MESSAGING;

    campaignInputs.push(campaignInput2);

    for (const campaignInput of campaignInputs) {
      const createdCampaign = await campaignProvider.createCampaign(
        entityManager,
        campaignInput,
        user,
        CampaignModule.injector
      );
    }

    let application = await applicationService.getApplicationByName(
      entityManager,
      "TEST_APPLICATION",
      user.organization.id
    );
    
    const campaigns = await resolvers.Query.campaigns(
      { user, application },
      {
        organization_id: user.organization.id,
        campaignType: ["OFFER", "MESSAGING"]
      },
      { injector: CampaignModule.injector }
    );

    expect(campaigns.length).toBe(campaignInputs.length);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
