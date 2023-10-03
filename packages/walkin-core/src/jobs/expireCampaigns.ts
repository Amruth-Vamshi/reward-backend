import { getManager } from "typeorm";
import { createBullConsumer } from "./utils";
import { CampaignModule } from "../../../walkin-rewardx/src/modules/campaigns/campaign.module";
import { CampaignProvider as Campaign } from "../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { updateSavedJob } from "./utils/commonUtils";
const campaignProvider = CampaignModule.injector.get(Campaign);

export const EXPIRE_CAMPAIGN_PROCESSING = {
  name: "EXPIRE_CAMPAIGN",
  hostId: "Walkin",
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  }
};

const expireCampaignProcessingQueue = createBullConsumer(
  EXPIRE_CAMPAIGN_PROCESSING.name
);

expireCampaignProcessingQueue.process(async (job, done) => {
  const data = job.data;
  const transactionManager = getManager();
  const { organizationId, savedJobId } = data;

  try {
    await campaignProvider.expireCampaigns(transactionManager, organizationId);
    await updateSavedJob(transactionManager, savedJobId, organizationId);
    done(null);
  } catch (error) {
    done(error);
  }
});

console.log(EXPIRE_CAMPAIGN_PROCESSING.name + " initialised");
