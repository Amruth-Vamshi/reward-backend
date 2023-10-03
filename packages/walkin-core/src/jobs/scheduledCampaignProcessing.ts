import moment from "moment";
import Container from "typedi";
import { getManager } from "typeorm";
import { Campaign, CampaignSchedule } from "../../../walkin-rewardx/src/entity";
import {
  CAMPAIGN_SCHEDULE_NAME,
  CAMPAIGN_STATUS,
  STATUS,
  WALKIN_QUEUES
} from "../modules/common/constants";
import { updateEntity } from "../modules/common/utils/utils";
import { BirthdayCampaignProcessor } from "./processor/BirthdayCampaignProcessor";
import { createBullConsumer } from "./utils";
import { QueueProvider as Queue } from "../modules/queueProcessor/queue.provider";
import { queueProcessorModule } from "../modules/queueProcessor/queueProcessor.module";
import { CampaignRepository } from "../../../walkin-rewardx/src/modules/campaigns/campaign.repository";
const QueueProvider = queueProcessorModule.injector.get(Queue);

export const SCHEDULED_CAMPAIGN_PROCESSING = {
  name: "SCHEDULED_CAMPAIGN",
  hostId: "Walkin",
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  }
};

const scheduledCampaignProcessingQueue = createBullConsumer(
  SCHEDULED_CAMPAIGN_PROCESSING.name
);

scheduledCampaignProcessingQueue.process(async (job, done) => {
  const data = job.data;
  const transactionManager = getManager();

  const { campaignId, jobId, organizationId } = data;
  const { campaignScheduleId } = data;
  const campaignSchedule = await transactionManager.findOne(CampaignSchedule, {
    where: {
      id: campaignScheduleId
    }
  });

  console.log("Processing campaignScheduleId:", campaignScheduleId);
  if (campaignSchedule) {
    if (campaignSchedule.status === STATUS.ACTIVE) {
      const campaign = await transactionManager.findOne(Campaign, {
        where: {
          id: campaignId
        }
      });
      console.log("Processing campaignId:", campaignId);
      if (campaign) {
        const {
          campaignStatus,
          startTime,
          endTime,
          loyaltyProgramDetailId
        } = campaign;
        if (campaignStatus === CAMPAIGN_STATUS.ACTIVE) {
          const isValidStartTime = moment(startTime, "YYYY-MM-DD").isBefore(
            moment().format("YYYY-MM-DD")
          );

          const isValidEndTime = moment(endTime, "YYYY-MM-DD HH:mm").isAfter(
            moment().format("YYYY-MM-DD HH:mm")
          );

          if (isValidStartTime && isValidEndTime) {
            const campaignScheduleName = campaignSchedule.name;
            if (
              campaignScheduleName === CAMPAIGN_SCHEDULE_NAME.BIRTHDAY_CAMPAIGN
            ) {
              const customersCelebratingBirthday = await Container.get(
                BirthdayCampaignProcessor
              ).getItems(transactionManager, organizationId);
              const input = {
                customersCelebratingBirthday,
                loyaltyProgramDetailId,
                organizationId
              };

              await Container.get(BirthdayCampaignProcessor).processItems(
                transactionManager,
                input
              );

              // UPDATE JOB's LAST EXECUTION TIME
              const jobDetails = await Container.get(
                CampaignRepository
              ).getJobByJobId(transactionManager, jobId);
              if (jobDetails) {
                const input = {
                  lastExecutedTime: new Date().toISOString()
                };
                updateEntity(jobDetails, input);
                transactionManager.save(jobDetails);
              }
            }
            console.log("Job executed");
            done(null);
          } else {
            console.log(`Invalid start and end time:`, campaignId);
            const isExpired = moment(endTime, "YYYY-MM-DD HH:mm:SS").isBefore(
              moment().format("YYYY-MM-DD HH:mm:SS")
            );

            const campaignData = {
              campaignStatus: CAMPAIGN_STATUS.ENDED
            };
            if (isExpired) {
              console.log(`Campaign expired`, campaignId);
              updateEntity(campaign, campaignData);
              await transactionManager.save(campaign);
            }
            done(null);
          }
        } else if (campaignStatus === CAMPAIGN_STATUS.ENDED) {
          // Remove the scheduled Job
          console.log("Campaign ENDED", campaign.id);
          try {
            QueueProvider.removeScheduledJobFromQueue(
              WALKIN_QUEUES.SCHEDULED_CAMPAIGN,
              jobId
            );
            done(null);
          } catch (error) {
            done(error);
          }
        } else {
          console.log(`Campaign: ${campaign.id} not Active`);
          done(null);
        }
      } else {
        const errorMessage = `Campaign: ${campaign.id} not valid`;
        const error = new Error(errorMessage);
        console.log(`Arena Error:`, errorMessage);
        done(error);
      }
    } else {
      console.log(`Campaign Schedule: ${campaignScheduleId} not ACTIVE`);
      done(null);
    }
  } else {
    const errorMessage = `Campaign Schedule: ${campaignScheduleId} not valid`;
    const error = new Error(errorMessage);
    console.log(`Arena Error:`, errorMessage);
    done(error);
  }
});

console.log(SCHEDULED_CAMPAIGN_PROCESSING.name + " initialised");
