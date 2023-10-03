import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import * as WCoreEntities from "../../../entity";
import { CampaignModule } from "../../../../../walkin-rewardx/src/modules/campaigns/campaign.module";
import { ApplicationModule } from "../../account/application/application.module";
import { getManager, getConnection, EntityManager } from "typeorm";
import { CampaignProvider } from "../../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { Chance } from "chance";
import {
  CAMPAIGN_TYPE,
  STATUS,
  CAMPAIGN_TRIGGER_TYPE,
  RULE_TYPE
} from "../../common/constants";
import { ApplicationProvider } from "../../account/application/application.providers";
import { RuleProvider } from "../../rule/providers";
import { WalkinError } from "../../common/exceptions/walkin-platform-error";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { SegmentProvider } from "../../segment/segment.providers";
import { segmentModule } from "../../segment/segment.module";
import { AudienceProvider } from "../audience.providers";
import { audienceModule } from "../audience.module";

const campaignProvider: CampaignProvider = CampaignModule.injector.get(
  CampaignProvider
);
const ruleProvider: RuleProvider = CampaignModule.injector.get(RuleProvider);
const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);

const segmentProvider: SegmentProvider = segmentModule.injector.get(
  SegmentProvider
);
const audienceProvider: AudienceProvider = audienceModule.injector.get(
  AudienceProvider
);

let user: WCoreEntities.User;
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();
});

const createApplication = (manager: EntityManager) =>
  applicationService.createApplication(manager, user.organization.id, {
    name: chance.string({ length: 5 })
  });

const createRule = manager => {
  const ruleDetails = {
    name: chance.string({ length: 5 }),
    description: chance.string({ length: 10 }),
    organizationId: user.organization.id,
    type: RULE_TYPE.SIMPLE,
    ruleConfiguration: {},
    ruleExpression: {}
  };
  return ruleProvider.createRule(manager, CampaignModule.injector, ruleDetails);
};

const getCampaignData = (rule, application) => {
  const campaignData = {
    name: chance.string({ length: 5 }),
    description: chance.string({ length: 10 }),
    campaignType: CAMPAIGN_TYPE.LOYALTY,
    campaignStatus: STATUS.ACTIVE,
    campaignTriggerType: CAMPAIGN_TRIGGER_TYPE.EVENT,
    triggerRule: {},
    startTime: new Date(),
    endTime: new Date(),
    audienceFilterRule: rule,
    organization: user.organization,
    application,
    status: STATUS.ACTIVE
  };
  return campaignData;
};

xdescribe("Audience Provider Test cases ", () => {
  test("Create Audience - Without Application ID", async () => {
    const manager = getManager();

    const rule = createRule(manager);
    const application = await createApplication(manager);
    const campaignData = getCampaignData(rule, application);

    const campaign = await campaignProvider.createCampaign(
      manager,
      campaignData,
      user,
      CampaignModule.injector
    );
    const segments = await segmentProvider.getSegments(
      manager,
      user.organization.id,
      //@ts-ignore
      null,
      null,
      null,
      STATUS.ACTIVE
    );

    const segment = segments[0];

    const audience = await audienceProvider.createAudience(
      manager,
      user.organization,
      //@ts-ignore
      null,
      campaign,
      [segment],
      STATUS.ACTIVE
    );
    expect(audience).toBeDefined();
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
