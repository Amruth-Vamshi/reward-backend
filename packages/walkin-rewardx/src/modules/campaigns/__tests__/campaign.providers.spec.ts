import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../../walkin-core/__tests__/utils/unit";;
import * as WCoreEntities from "../../../../../walkin-core/src/entity";
import { CampaignModule } from "../campaign.module";
import { ApplicationModule } from "../../../../../walkin-core/src/modules/account/application/application.module";
import { getManager, getConnection, EntityManager } from "typeorm";
import { CampaignProvider } from "../campaign.providers";
import { Chance } from "chance";
import {
  CAMPAIGN_TYPE,
  STATUS,
  CAMPAIGN_TRIGGER_TYPE,
  RULE_TYPE,
  CAMPAIGN_STATUS
} from "../../../../../walkin-core/src/modules/common/constants";
import { ApplicationProvider } from "../../../../../walkin-core/src/modules/account/application/application.providers";
import { RuleProvider } from "../../../../../walkin-core/src/modules/rule/providers";
import { WalkinError } from "../../../../../walkin-core/src/modules/common/exceptions/walkin-platform-error";
import { WCoreError } from "../../../../../walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "../../../../../walkin-core/src/modules/common/constants/errors";

const campaignProvider: CampaignProvider = CampaignModule.injector.get(
  CampaignProvider
);
const ruleProvider: RuleProvider = CampaignModule.injector.get(RuleProvider);
const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
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

xdescribe("Campaign Provider Test cases ", () => {
  test("Create Campaign Provider", async () => {
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
    expect(campaign).toBeDefined();
    expect(campaign.id).toBeDefined();
    expect(campaign.application).toBeDefined();
    expect(campaign.application.id).toEqual(application.id);
  });

  test("Campaing Already exist- Provider", async () => {
    const manager = getManager();

    const campaigns = await campaignProvider.getCampaigns(manager, {});
    for (const campaign of campaigns) {
      let gotCaught = false;
      try {
        const duplicateCampaign = await campaignProvider.createCampaign(
          manager,
          campaign,
          user,
          CampaignModule.injector
        );
        expect(duplicateCampaign).toBeUndefined();
      } catch (e) {
        gotCaught = true;
        expect(e).toEqual(new WalkinError("campaign name already exists"));
      }
      expect(gotCaught).toBeTruthy();

      // reset to false to check update campaign
      gotCaught = false;
      try {
        const duplicateCampaign = await campaignProvider.updateCampaign(
          manager,
          campaign.id,
          campaign,
          CampaignModule.injector
        );
        expect(duplicateCampaign).toBeUndefined();
      } catch (e) {
        gotCaught = true;
        expect(e).toEqual(new WalkinError("Campaign name already exists"));
      }
      expect(gotCaught).toBeTruthy();
    }
  });

  test("Update campaign provider test case", async () => {
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
    expect(campaign).toBeDefined();
    expect(campaign.id).toBeDefined();

    const newName = chance.string({ length: 10 });
    campaign.name = newName;
    const updatedCampaign = await campaignProvider.updateCampaign(
      manager,
      campaign.id,
      campaign,
      CampaignModule.injector
    );
    expect(updatedCampaign).toBeDefined();
    expect(updatedCampaign.name).toEqual(newName);
  });

  test("Update campaign status using updateCampaignStatus API", async () => {
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
    expect(campaign).toBeDefined();
    expect(campaign.id).toBeDefined();

    const apiInput = {
      campaignStatus: CAMPAIGN_STATUS.PAUSED,
      organizationId: user.organization.id
    }

    const updatedCampaign = await campaignProvider.updateCampaignStatus(
      manager,
      campaign.id,
      apiInput,
      CampaignModule.injector
    );
    expect(updatedCampaign).toBeDefined();
    expect(updatedCampaign.id).toBe(campaign.id);
    expect(updatedCampaign.campaignStatus).toBe(CAMPAIGN_STATUS.PAUSED);
  });

  test("FAIL to update campaign status using updateCampaign API", async () => {
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
    expect(campaign).toBeDefined();
    expect(campaign.id).toBeDefined();

    const apiInput = {
      campaignStatus: CAMPAIGN_STATUS.DRAFT,
      organizationId: user.organization.id
    }

    try {
      await campaignProvider.updateCampaign(
        manager,
        campaign.id,
        apiInput,
        CampaignModule.injector
      );
    }
    catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_IN_DRAFT_STATE)
      );
    }
  });

  test("Unlink application test case", async () => {
    const manager = getManager();
    const campaigns = await campaignProvider.getCampaigns(manager, {});

    for (const campaign of campaigns) {
      const unlinkedCampaign = await campaignProvider.unlinkCampaignFromApplication(
        manager,
        { campaignId: campaign.id, applicationId: campaign.application.id }
      );

      expect(unlinkedCampaign).toBeDefined();
      const foundCampaign: any = campaignProvider.getCampaign(
        manager,
        unlinkedCampaign.id
      );
      expect(foundCampaign).toBeDefined();
      expect(foundCampaign.application).toBeUndefined();
    }
  });

  test("Link application test case", async () => {
    const manager = getManager();
    const campaigns = await campaignProvider.getCampaigns(manager, {});

    const application = await createApplication(manager);
    for (const campaign of campaigns) {
      const unlinkedCampaign = await campaignProvider.linkCampaignToApplication(
        manager,
        { campaignId: campaign.id, applicationId: application.id }
      );

      expect(unlinkedCampaign).toBeDefined();
      const foundCampaign: any = await campaignProvider.getCampaign(
        manager,
        unlinkedCampaign.id
      );
      expect(foundCampaign).toBeDefined();
      expect(foundCampaign.application).toBeDefined();
      expect(foundCampaign.application.id).toEqual(application.id);
    }
  });

  test("Unlink application test case: No Such applcation linked error", async () => {
    const manager = getManager();
    const campaigns = await campaignProvider.getCampaigns(manager, {});

    for (const campaign of campaigns) {
      const application = await createApplication(manager);
      const linkedCampaign = await campaignProvider.linkCampaignToApplication(
        manager,
        { campaignId: campaign.id, applicationId: application.id }
      );
      const unlinkedCampaign = await campaignProvider.unlinkCampaignFromApplication(
        manager,
        { campaignId: campaign.id, applicationId: application.id }
      );
      expect(unlinkedCampaign).toBeDefined();
      const foundCampaign: any = campaignProvider.getCampaign(
        manager,
        unlinkedCampaign.id
      );
      expect(foundCampaign).toBeDefined();
      expect(foundCampaign.application).toBeUndefined();

      const unlinkedCampaign2 = campaignProvider.unlinkCampaignFromApplication(
        manager,
        { campaignId: campaign.id, applicationId: application.id }
      );
      // trying to once again unlink application
      await expect(unlinkedCampaign2).rejects.toThrowError(
        new WCoreError(WCORE_ERRORS.NO_SUCH_APPLICATION_CONNECTED_TO_CAMPAIGN)
      );
    }
  });

  test("GetEnded but not closed campaigns", async () => {
    const manager = getManager();
    const campaigns = await campaignProvider.getEndedButNotClosedCampaigns(
      manager
    );
    expect(campaigns).toBeDefined();
    expect(campaigns).toHaveLength(2);
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
