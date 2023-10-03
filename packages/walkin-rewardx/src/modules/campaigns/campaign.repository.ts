import { Service } from "typedi";
import { EntityManager, In } from "typeorm";
import { Campaign, CampaignSchedule, Job } from "../../entity";
import {
  CACHING_KEYS,
  CAMPAIGN_STATUS,
  CAMPAIGN_TYPE,
  EXPIRY_MODE,
  SHORT_CACHE_TTL,
  STATUS,
  StatusEnum
} from "../../../../walkin-core/src/modules/common/constants";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../../../walkin-core/src/modules/common/utils/redisUtils";
import {
  CampaignEventTrigger,
  EventType
} from "../../../../walkin-core/src/entity";
import { WCoreError } from "../../../../walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "../../../../walkin-core/src/modules/common/constants/errors";

@Service()
export class CampaignRepository {
  public async getCampaignsForOrganization(
    entityManager: EntityManager,
    organizationId: string
  ) {
    const queryRunner = await entityManager.connection.createQueryRunner();
    const campaigns = await queryRunner.manager
      .query(`Select * from campaign where organization_id = '${organizationId}' 
        AND campaignStatus = '${CAMPAIGN_STATUS.ACTIVE}'`);
    await queryRunner.release();
    return campaigns;
  }

  public async getEligibleCampaignsForEvaluation(
    entityManager: EntityManager,
    organizationId: string,
    eventTypeId: string
  ) {
    const whereCondition = `campaignEventTrigger.status=:campaignEventTriggerStatus 
    AND campaign.organization_id=:organizationId 
    AND campaign.campaignStatus=:campaignStatus 
    AND campaign.campaignType=:campaignType 
    AND campaignEventTrigger.eventTypeId=:eventTypeId
    AND CURRENT_TIMESTAMP() Between campaign.startTime AND campaign.endTime`;
    
    const campaignEventTrigger = await entityManager
      .getRepository(CampaignEventTrigger)
      .createQueryBuilder("campaignEventTrigger")
      .innerJoinAndSelect("campaignEventTrigger.campaign", "campaign")
      .where(
        whereCondition,
        {
          campaignEventTriggerStatus: STATUS.ACTIVE,
          organizationId,
          campaignStatus: CAMPAIGN_STATUS.ACTIVE,
          campaignType: CAMPAIGN_TYPE.LOYALTY,
          eventTypeId
        }
      )
      .getMany();

    const campaigns = campaignEventTrigger.map(trigger => trigger.campaign);
    return campaigns;
  }

  public async getCampaignByName(
    entityManager: EntityManager,
    campaignName: string,
    organizationId: string
  ) {
    const key = `${CACHING_KEYS.CAMPAIGN}_${campaignName}_${organizationId}`;
    let campaign: any = await getValueFromCache(key);
    if (!campaign) {
      campaign = await entityManager.findOne(Campaign, {
        where: {
          name: campaignName,
          organization: {
            id: organizationId
          }
        }
      });
      if (campaign) {
        await setValueToCache(
          key,
          campaign,
          EXPIRY_MODE.EXPIRE,
          SHORT_CACHE_TTL
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    if (campaign) {
      await setValueToCache(key, campaign, EXPIRY_MODE.EXPIRE, SHORT_CACHE_TTL);
      console.log("Updated Cache with key :", key);
    }
    return campaign;
  }

  public async getCampaignById(
    entityManager: EntityManager,
    id: string,
    organizationId: string,
    relations
  ) {
    const key = `${CACHING_KEYS.CAMPAIGN}_${id}_${organizationId}`;
    let campaign: any = await getValueFromCache(key);
    if (!campaign) {
      campaign = await entityManager.findOne(Campaign, {
        where: {
          id,
          organization: {
            id: organizationId
          }
        },
        relations
      });
      if (campaign) {
        await setValueToCache(
          key,
          campaign,
          EXPIRY_MODE.EXPIRE,
          SHORT_CACHE_TTL
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return campaign;
  }

  public async clearCampaignCache(campaignId, campaignName, organizationId) {
    const keys = [
      `${CACHING_KEYS.CAMPAIGN}_${campaignId}_${organizationId}`,
      `${CACHING_KEYS.CAMPAIGN}_${campaignName}_${organizationId}`
    ];
    await removeValueFromCache(keys);
    return;
  }

  public async fetchCampaignStatusDetails(existingCampaignStatus) {
    let possibleStatusChange = [];
    let actionsToBePerformed;
    switch (existingCampaignStatus) {
      case "DRAFT":
        possibleStatusChange = ["SCHEDULED", "ACTIVE"];
        actionsToBePerformed = () => {
          console.log("Perform actions defined for Draft state IF ANY");
          return;
        };
        break;
      case "SCHEDULED":
        possibleStatusChange = ["ACTIVE"];
        break;
      case "ACTIVE":
        possibleStatusChange = ["DRAFT", "PAUSED", "ENDED"];
        break;
      case "PAUSED":
        possibleStatusChange = ["DRAFT", "ACTIVE"];
        break;
      default:
        // Status cannot be changed from ENDED State
        possibleStatusChange = [];
        break;
    }
    return {
      possibleStatusChange,
      actionsToBePerformed
    };
  }

  public async storeCampaignEventTrigger(
    entityManager: EntityManager,
    campaignData: any,
    campaign: Campaign,
    eventType: EventType
  ) {
    const input = {
      status: STATUS.ACTIVE,
      metaData: campaignData.metaData,
      campaign,
      eventType
    };
    const campaignEventTriggerSchema = entityManager.create(
      CampaignEventTrigger,
      input
    );
    return entityManager.save(campaignEventTriggerSchema);
  }

  public async storeCampaignSchedule(entityManager: EntityManager, input) {
    try {
      const campaignScheduleSchema = await entityManager.create(
        CampaignSchedule,
        input
      );
      const storedCampaignSchedule = await entityManager.save(
        campaignScheduleSchema
      );
      return storedCampaignSchedule;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.FAILED_TO_CREATE_CAMPAIGN_SCHEDULE);
    }
  }

  public async getCampaignSchedule(
    entityManager: EntityManager,
    campaignId: string,
    relations = []
  ) {
    const campaignSchedule = await entityManager.findOne(CampaignSchedule, {
      where: {
        campaign: {
          id: campaignId
        }
      },
      relations
    });
    return campaignSchedule;
  }

  public async getCampaignScheduleForCampaigns(entityManager: EntityManager, campaignIds = [], relations = []) {
    const campaignSchedule = await entityManager.find(CampaignSchedule, {
      where: {
        campaign: {
          id: In(campaignIds)
        }
      },
      relations
    })
    return campaignSchedule;
  }

  public async getCampaignEventTrigger(entityManager: EntityManager, campaignId: string, relations = []) {
    const campaignEventTrigger = await entityManager.findOne(CampaignEventTrigger, {
      where: {
        campaign: {
          id: campaignId
        }
      },
      relations
    })
    return campaignEventTrigger;
  }

  public async getCampaignEventTriggerForCampaigns(entityManager: EntityManager, campaignIds = [], relations = []) {
    const campaignEventTrigger = await entityManager.find(CampaignEventTrigger, {
      where: {
        campaign: {
          id: In(campaignIds)
        }
      },
      relations
    })
    return campaignEventTrigger;
  }

  public async storeJobDetails(entityManager: EntityManager, input) {
    try {
      const jobSchema = await entityManager.create(Job, input);
      const job = await entityManager.save(jobSchema);
      return job;
    } catch (error) {
      console.log("Error while creating Job details", error);
      throw new WCoreError(WCORE_ERRORS.FAILED_TO_CREATE_JOB_DETAILS);
    }
  }

  public async getJobByJobId(entityManager: EntityManager, jobId) {
    const jobDetails = await entityManager.findOne(Job, {
      where: {
        jobId
      }
    });
    return jobDetails;
  }
}
