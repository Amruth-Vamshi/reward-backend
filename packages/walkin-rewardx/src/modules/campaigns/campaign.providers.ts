import { Injectable, Injector } from "@graphql-modules/di";
import { EntityManager, Not, FindManyOptions, Between, In } from "typeorm";
import {
  WalkinError,
  WalkinRecordNotFoundError
} from "../../../../walkin-core/src/modules/common/exceptions/walkin-platform-error";
import { WCoreError } from "../../../../walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "../../../../walkin-core/src/modules/common/constants/errors";
import moment from "moment";
import {
  validateAndGetCampaignInputs,
  validateAndGetCampaignInputsForUpdate,
  validateCronExpression
} from "./utils/validation";
import Container from "typedi";
import { CampaignRepository } from "./campaign.repository";
import { addPaginateInfo, updateEntity } from "../../../../walkin-core/src/modules/common/utils/utils";
import { Campaign, Job } from "../../entity";
import {
  Application,
  CampaignEventTrigger
} from "../../../../walkin-core/src/entity";
import {
  CAMPAIGN_STATUS,
  CAMPAIGN_TRIGGER_TYPE,
  STATUS,
  StatusEnum,
  WALKIN_QUEUES
} from "../../../../walkin-core/src/modules/common/constants";
import lodash from "lodash";
import { APPLICATION_METHOD } from "../common/constants/constant";
import { EventTypeRepository } from "../../../../walkin-core/src/modules/eventFramework/eventType/eventType.repository";
import { CampaignSchedule } from "../../entity/campaign-schedule";
import { evaluateLoyaltyProgram } from "../common/utils/LoyaltyProgramUtils";
import { QueueProvider } from "../../../../walkin-core/src/modules/queueProcessor/queue.provider";
import { sendToWehbookSubscribers } from "@walkinserver/walkin-core/src/modules/common/utils/webhookUtils";
import { PageOptions } from "@walkinserver/walkin-core/src/graphql/generated-models";
interface ICampaignSchedule {
  campaign: Campaign;
  cronExpression: string;
  status: any;
  name: string;
}

@Injectable()
export class CampaignProvider {
  public async getCampaign(
    entityManager: EntityManager,
    id: string
  ): Promise<Campaign> {
    const campaign = await entityManager.findOne(Campaign, id, {
      relations: ["organization", "application"]
    });
    if (!campaign) {
      throw new WalkinRecordNotFoundError("Campaign not found");
    }
    await this.fetchAndSetScheduleAndEventTriggerToCampaign(entityManager, campaign);
    return campaign;
  }

  public async getCampaignsWithLimit(
    entityManager: EntityManager,
    {
      applicationId,
      campaignType,
      campaignStatus,
      organizationId,
      status
    }: {
      organizationId?: string;
      applicationId?: string;
      campaignStatus: string[];
      campaignType?: string[];
      status?: string;
    },
    limit: number,
    offset: number,
    sort: ISort
  ): Promise<[Campaign[], number]> {
    const query: any = {};
    if (organizationId) {
      query.organization = organizationId;
    }
    if (applicationId) {
      query.application = applicationId;
    }

    if (campaignType) {
      query.campaignType = In(campaignType);
    }
    if (status) {
      query.status = status;
    }
    if (campaignStatus) {
      query.campaignStatus = In(campaignStatus);
    }

    const options: FindManyOptions<Campaign> = {};
    options.where = query;
    options.order = {
      [sort.sortBy]: sort.sortOrder
    };
    options.relations = [
      "organization",
      "application",
      "triggerRule",
      "audienceFilterRule",
      "communications",
      "communications.messageTemplate"
    ];
    options.cache = true;

    options.skip = offset * limit;
    options.take = limit;

    return entityManager.findAndCount(Campaign, options);
  }

  @addPaginateInfo
  public async getCampaigns(
    entityManager: EntityManager,
    {
      applicationId,
      campaignType,
      organizationId,
      campaignStatus,
      campaignTriggerType,
      name
    }: {
      organizationId?: string;
      applicationId?: string;
      campaignType?: any;
      campaignStatus?: string;
      campaignTriggerType?: string;
      name?: string
    },
    pageOptions: PageOptions
  ): Promise<any> {
    const query: any = {
      organization: organizationId
    };
    if (applicationId) {
      query.application = applicationId;
    }

    if (campaignType && campaignType.length > 0) {
      if (typeof campaignType === "string") {
        campaignType = [campaignType];
      }
      query.campaignType = In(campaignType);
    }

    if (campaignStatus) {
      query.campaignStatus = campaignStatus;
    }

    if (campaignTriggerType) {
      query.campaignTriggerType = campaignTriggerType;
    }

    if(name){
      query.name = name
    }

    const options: FindManyOptions<Campaign> = {};
    options.where = query;

    pageOptions = pageOptions || {};

    const page = Math.abs(pageOptions.page) || 1;
    const pageSize = Math.abs(pageOptions.pageSize) || 10;

    options.skip = (page - 1) * pageSize;
    options.take = pageSize;

    
    options.order = {
      id: "DESC"
    };
    options.relations = [
      "organization",
      "application",
      "communications",
      "communications.messageTemplate"
    ];
    options.cache = true;
    const response = await entityManager.findAndCount(Campaign, options);

    if (response[0].length > 0) {
      const relations = ["campaign"];
      const campaignList = response[0]

      if (campaignList?.length > 0) {
        const scheduledCampaignIds = campaignList.filter(campaign => campaign.campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.SCHEDULED).map(data => data.id);
        const campaignScheduleMap = {};

        if (scheduledCampaignIds.length > 0) {
          const campaignSchedule = await Container.get(CampaignRepository)
            .getCampaignScheduleForCampaigns(entityManager, scheduledCampaignIds, relations);

          for (const data of campaignSchedule) {
            const campaignId = data.campaign.id;
            campaignScheduleMap[campaignId] = data;
          }
        }

        const eventTriggeredCampaignIds = campaignList.filter(campaign => campaign.campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.EVENT).map(data => data.id);
        const campaignEventTriggerMap = {};
        if (eventTriggeredCampaignIds.length > 0) {
          const campaignEventTrigger = await Container.get(CampaignRepository)
            .getCampaignEventTriggerForCampaigns(entityManager, eventTriggeredCampaignIds, relations);

          for (const data of campaignEventTrigger) {
            const campaignId = data.campaign.id;
            campaignEventTriggerMap[campaignId] = data;
          }
        }

        for (const campaign of campaignList) {
          const campaignId = campaign.id;
          if (campaign.campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.EVENT) {
            campaign["campaignEventTrigger"] = campaignEventTriggerMap[campaignId];
          } else if (campaign.campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.SCHEDULED) {
            campaign["campaignSchedule"] = campaignScheduleMap[campaignId];
          }
        }
      }
    }
    return response;
  }

  public async fetchAndSetScheduleAndEventTriggerToCampaign(
    entityManager,
    campaign
  ) {
    const campaignTriggerType = campaign.campaignTriggerType;
    const relations = ["campaign"];
    const campaignId = campaign.id;
    if (campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.SCHEDULED) {
      const campaignSchedule = await Container.get(CampaignRepository)
        .getCampaignSchedule(entityManager, campaignId, relations);
      campaign["campaignSchedule"] = campaignSchedule;
    } else if (campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.EVENT) {
      const campaignEventTrigger = await Container.get(CampaignRepository)
        .getCampaignEventTrigger(entityManager, campaignId, relations);
      campaign["campaignEventTrigger"] = campaignEventTrigger;
    }
    return;
  }

  public async setScheduleAndEventTriggerToCampaign(
    campaign,
    campaignSchedule,
    campaignEventTrigger
  ) {
    const campaignTriggerType = campaign.campaignTriggerType;
    if (campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.EVENT && campaignEventTrigger) {
      campaign["campaignEventTrigger"] = campaignEventTrigger;
    }
    else if (campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.SCHEDULED && campaignSchedule) {
      campaign["campaignSchedule"] = campaignSchedule;
    }
    return;
  }

  public async expireCampaigns(
    entityManager: EntityManager,
    organizationId
  ) {
    const expiredCampaigns = await entityManager
      .getRepository(Campaign)
      .createQueryBuilder("campaign")
      .where("campaign.endTime <= CURRENT_TIMESTAMP() AND campaign.organization.id =:organizationId AND campaign.campaignStatus =:status", {
        organizationId,
        status: STATUS.ACTIVE
      })
      .getMany();

    const expiredCampaignIds = expiredCampaigns.map(campaign => campaign.id);
    console.log("expiredCampaignIds", expiredCampaignIds);

    let updateSchema = [];
    for (const campaign of expiredCampaigns) {
      const updateInput = {
        campaignStatus: CAMPAIGN_STATUS.ENDED
      }
      updateEntity(campaign, updateInput);
      updateSchema.push(entityManager.save(campaign));
    }

    if (updateSchema.length > 0) {
      try {
        await Promise.all(updateSchema);
      } catch (error) {
        console.log("Error in expireCampaign", error);
        throw new WCoreError(error);
      }
    }

    return "Updated sucessfully";
  }

  public async createCampaign(
    entityManager: EntityManager,
    campaignData: any,
    user: any,
    injector: Injector
  ): Promise<Campaign> {
    campaignData = await validateAndGetCampaignInputs(
      entityManager,
      injector,
      campaignData
    );

    const {
      campaignTriggerType,
      name,
      eventType,
      cronExpression,
      campaignScheduleName
    } = campaignData;
    const organizationId = campaignData.organization.id;

    const campaignNameFound = await Container.get(
      CampaignRepository
    ).getCampaignByName(entityManager, name, organizationId);
    if (campaignNameFound) {
      throw new WalkinError("campaign name already exists");
    }

    campaignData.owner = user;

    const campaignSchema = entityManager.create(Campaign, campaignData);
    const savedCampaign = await entityManager.save(campaignSchema);

    let campaignSchedule;
    let campaignEventTrigger;
    if (campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.EVENT) {
      campaignEventTrigger = await Container.get(CampaignRepository).storeCampaignEventTrigger(
        entityManager,
        campaignData,
        savedCampaign,
        eventType
      );
    } else if (campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.SCHEDULED) {
      const input: ICampaignSchedule = {
        campaign: savedCampaign,
        cronExpression,
        status: STATUS.ACTIVE,
        name: campaignScheduleName
      };
      campaignSchedule = await Container.get(
        CampaignRepository
      ).storeCampaignSchedule(entityManager, input);
      const campaignScheduleId = campaignSchedule.id;

      const jobId = `CS_${campaignScheduleId}`;
      const queueName = WALKIN_QUEUES.SCHEDULED_CAMPAIGN;
      const queueData = {
        campaignId: savedCampaign.id,
        campaignScheduleId,
        jobId,
        organizationId
      };

      const jobOptions = {
        removeOnComplete: true,
        removeOnFail: false,
        jobId,
        repeat: {
          cron: cronExpression,
          tz: "Asia/Kolkata"
        }
      };

      await injector
        .get(QueueProvider)
        .addToQueue(queueName, queueData, jobOptions);

      const jobInput = {
        jobId,
        jobType: campaignScheduleName,
        organization: organizationId
      };
      await Container.get(CampaignRepository).storeJobDetails(
        entityManager,
        jobInput
      );
    }

    const relations = ["organization", "application", "owner"];
    const campaign = await Container.get(CampaignRepository).getCampaignById(
      entityManager,
      savedCampaign.id,
      organizationId,
      relations
    );

    // Set campaignSchedule and campaignEventTrigger in response
    this.setScheduleAndEventTriggerToCampaign(campaign, campaignSchedule, campaignEventTrigger);
    return campaign;
  }

  public async evaluateCampaignsForEvent(
    entityManager: EntityManager,
    injector: Injector,
    input
  ) {
    let evaluatedCampaigns = [];
    const { data, organizationId, eventTypeId } = input;

    if (typeof data !== "object") {
      throw new WCoreError(WCORE_ERRORS.INVALID_DATA);
    }

    // Fetch campaigns from campaign_event_trigger for specific event
    const campaigns = await Container.get(
      CampaignRepository
    ).getEligibleCampaignsForEvaluation(
      entityManager,
      organizationId,
      eventTypeId
    );
    const evaluatingCampaigns = campaigns.map(campaign => campaign.id);
    console.log("evaluatingCampaigns", evaluatingCampaigns);
    const errors = [];
    const groupedCampaigns = lodash.groupBy(campaigns, "applicationMethod");

    for (const applicationMethod in groupedCampaigns) {
      const campaignByApplicationMethod = groupedCampaigns[applicationMethod];
      campaignByApplicationMethod.sort((a, b) => {
        return a.priority < b.priority ? -1 : 1;
      });
    }

    let executedExclusiveCampaign = false;
    let executedSequentialCampaign = false;
    const exclusiveCampaigns =
      groupedCampaigns[APPLICATION_METHOD.EXCLUSIVE] || [];
    const sequentialCampaigns =
      groupedCampaigns[APPLICATION_METHOD.SEQUENTIAL] || [];
    const alwaysCampaigns = groupedCampaigns[APPLICATION_METHOD.ALWAYS] || [];

    for (const campaign of exclusiveCampaigns) {
      const loyaltyProgramDetailId = campaign.loyaltyProgramDetailId;
      if (loyaltyProgramDetailId) {
        const { status, message, result }: any = await evaluateLoyaltyProgram(
          entityManager,
          injector,
          organizationId,
          loyaltyProgramDetailId,
          data
        );
        console.log(
          "Exclusive Campaign evaluation result:",
          campaign.id,
          status,
          message,
          result
        );
        if (status === true) {
          console.log("Executed Exclusive campaign", campaign.id);
          executedExclusiveCampaign = true;
          evaluatedCampaigns.push(campaign);
          break;
        } else {
          errors.push({campaignId:campaign.id,message});
          // Instead of throwing error, we can continue the loop, or try with different status for error and not eligible values
          // throw new WCoreError(message);
        }
      }
    }

    if (!executedExclusiveCampaign) {
      for (const campaign of sequentialCampaigns) {
        if (!executedSequentialCampaign) {
          const loyaltyProgramDetailId = campaign.loyaltyProgramDetailId;
          if (loyaltyProgramDetailId) {
            const {
              status,
              message,
              result
            }: any = await evaluateLoyaltyProgram(
              entityManager,
              injector,
              organizationId,
              loyaltyProgramDetailId,
              data
            );
            console.log(
              "Sequential Campaign evaluation result:",
              campaign.id,
              status,
              message,
              result
            );
            if (status === true) {
              console.log("Executed Sequential campaign", campaign.id);
              executedSequentialCampaign = true;
              evaluatedCampaigns.push(campaign);
              break;
            } else {
              errors.push({campaignId:campaign.id,message});
              // throw new WCoreError(message);
            }
          }
        }
      }
    }

    for (const campaign of alwaysCampaigns) {
      const loyaltyProgramDetailId = campaign.loyaltyProgramDetailId;
      if (loyaltyProgramDetailId) {
        const { status, message, result }: any = await evaluateLoyaltyProgram(
          entityManager,
          injector,
          organizationId,
          loyaltyProgramDetailId,
          data
        );
        console.log(
          "Always Campaign evaluation result:",
          campaign.id,
          status,
          message,
          result
        );
        if (status === true) {
          console.log("Executed Always campaign", campaign.id);
          evaluatedCampaigns.push(campaign);
        } else {
          errors.push({campaignId:campaign.id,message});
          // throw new WCoreError(message);
        }
      }
    }
    return {evaluatedCampaigns,errors};
  }

  public async updateCampaignSchedule(
    entityManager: EntityManager,
    input: any,
    injector: Injector
  ): Promise<CampaignSchedule> {
    const { id, status, cronExpression, organizationId } = input;
    if (status) {
      const allowedStatus = Object.values(STATUS);
      if (!allowedStatus.includes(status)) {
        throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
      }
    }

    if (cronExpression) {
      const { cronResult } = validateCronExpression(cronExpression);
    }

    const campaignSchedule = await entityManager.findOne(CampaignSchedule, {
      where: {
        id
      },
      relations: ["campaign"]
    });
    if (!campaignSchedule) {
      throw new WCoreError(WCORE_ERRORS.CAMPAIGN_SCHEDULE_NOT_FOUND);
    }

    const campaign = campaignSchedule.campaign;
    if (campaign.campaignStatus === CAMPAIGN_STATUS.ENDED) {
      /**
       * Because updating cron would create a new Job which will be of no use because
       * If a Campaign is marked as ENDED, neither the status can be changed nor the Job will be executed because it will be removed while processing the Job
       */
      throw new WCoreError(WCORE_ERRORS.CAMPAIGN_SCHEDULE_CANNOT_BE_UPDATED);
    }

    if (cronExpression) {
      /**
       * Fetch existing Job
       * Delete the current job
       * Create a new Job with the new cron expression with same Job Id
       */
      let jobId = `CS_${id}`;
      const jobDetails = await Container.get(CampaignRepository).getJobByJobId(
        entityManager,
        jobId
      );
      if (!jobDetails) {
        throw new WCoreError(WCORE_ERRORS.JOB_NOT_FOUND);
      }
      const queueName = WALKIN_QUEUES.SCHEDULED_CAMPAIGN;

      // Remove exisitng Job with the old cron Expression
      await injector
        .get(QueueProvider)
        .removeScheduledJobFromQueue(queueName, jobId);

      // Create a new Job with the updated Cron Expression
      const queueData = {
        campaignId: campaign.id,
        campaignScheduleId: campaignSchedule.id,
        jobId,
        organizationId
      };

      const jobOptions = {
        removeOnComplete: true,
        removeOnFail: false,
        jobId,
        repeat: {
          cron: cronExpression,
          tz: "Asia/Kolkata"
        }
      };

      await injector
        .get(QueueProvider)
        .addToQueue(queueName, queueData, jobOptions);
    }

    updateEntity(campaignSchedule, input);
    await entityManager.save(campaignSchedule);
    return campaignSchedule;
  }

  public async updateCampaignStatus(
    entityManager: EntityManager,
    id: string,
    campaignData: any,
    injector: Injector
  ): Promise<Campaign> {
    const addStatusCheck = false;
    const updatedCampaign = await this.updateCampaign(
      entityManager,
      id,
      campaignData,
      injector,
      addStatusCheck
    );
    return updatedCampaign;
  }

  public async updateCampaign(
    entityManager: EntityManager,
    id: string,
    campaignData: any,
    injector: Injector,
    addStatusCheck: boolean = true
  ): Promise<Campaign> {
    const organizationId = campaignData.organizationId;
    const foundCampaign = await entityManager.findOne(Campaign, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: []
    });

    if (!foundCampaign) {
      throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
    }

    /**
     * Allow campaign update only if the campaign is in DRAFT state.
     * But skip this check only while updating status using updateCampaignStatus API.
     */
    if (
      addStatusCheck &&
      foundCampaign.campaignStatus !== CAMPAIGN_STATUS.DRAFT
    ) {
      throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_IN_DRAFT_STATE);
    }

    campaignData = await validateAndGetCampaignInputsForUpdate(
      entityManager,
      injector,
      campaignData
    );

    if (campaignData.eventTypeId) {
      if (foundCampaign.campaignTriggerType !== CAMPAIGN_TRIGGER_TYPE.EVENT) {
        throw new WCoreError(WCORE_ERRORS.NOT_AN_EVENT_TRIGGERED_CAMPAIGN);
      }

      const existingCampaignEventTrigger = await entityManager.findOne(
        CampaignEventTrigger,
        {
          where: {
            campaign: {
              id: foundCampaign.id
            },
            eventType: {
              id: campaignData.eventTypeId
            },
            status: STATUS.ACTIVE
          }
        }
      );

      if (!existingCampaignEventTrigger) {
        const relations = [];
        const eventType = await Container.get(
          EventTypeRepository
        ).getEventTypeById(
          entityManager,
          campaignData.eventTypeId,
          organizationId,
          relations
        );
        if (!eventType) {
          throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_NOT_FOUND);
        }
        await Container.get(CampaignRepository).storeCampaignEventTrigger(
          entityManager,
          campaignData,
          foundCampaign,
          eventType
        );
      }
    }

    if (campaignData.name) {
      const foundName = await entityManager.findOne(Campaign, {
        where: {
          name: campaignData.name
        }
      });
      if (foundName && String(foundName.id) !== id) {
        throw new WalkinError("Campaign name already exists");
      }
      foundCampaign.name = campaignData.name;
    }

    if (campaignData.campaignStatus) {
      /**
       * Fetch existing status
       * Check if valid status to be updated
       * make necessary actions based on the status change
       */

      const existingCampaignStatus = foundCampaign.campaignStatus;
      const newStatus = campaignData.campaignStatus;

      if (existingCampaignStatus !== newStatus) {
        const {
          possibleStatusChange,
          actionsToBePerformed
        }: any = await Container.get(
          CampaignRepository
        ).fetchCampaignStatusDetails(existingCampaignStatus);

        let allowedToChangeStatus = false;
        allowedToChangeStatus = possibleStatusChange.includes(
          campaignData.campaignStatus
        );
        if (!allowedToChangeStatus) {
          throw new WCoreError(WCORE_ERRORS.CAMPAIGN_STATUS_CANNOT_BE_CHANGED);
        }

        if (actionsToBePerformed) {
          await actionsToBePerformed();
        }
      }
    }
    let prevStatus = foundCampaign.campaignStatus;
    updateEntity(foundCampaign, campaignData);

    const updatedCampaign = await entityManager.save(foundCampaign);
    const campaign = await entityManager.findOne(Campaign, updatedCampaign.id, {
      relations: ["organization", "application"]
    });
    if (campaign.campaignStatus != prevStatus) {
      sendToWehbookSubscribers(
        entityManager,
        "CAMPAIGN_STATUS_CHANGE",
        campaign,
        organizationId,
        injector
      );
    }
    if (campaign) {
      await Container.get(CampaignRepository).clearCampaignCache(
        campaign.id,
        campaign.name,
        organizationId
      );

      await this.fetchAndSetScheduleAndEventTriggerToCampaign(entityManager, campaign);
    }
    return campaign;
  }
  public async linkCampaignToApplication(
    transactionEntityManager: EntityManager,
    input
  ) {
    const { campaignId, applicationId, organizationId } = input;
    const campaign = await transactionEntityManager.findOne(Campaign, {
      where: {
        id: campaignId
      },
      relations: ["application"]
    });
    if (!campaign) {
      throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
    }
    if (campaign.application && campaign.application.id === applicationId) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_ALREADY_CONNECTED);
    }
    const application = await transactionEntityManager.findOne(Application, {
      where: { id: applicationId }
    });
    if (!application) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }
    campaign.application = application;

    await Container.get(CampaignRepository).clearCampaignCache(
      campaign.id,
      campaign.name,
      organizationId
    );

    return transactionEntityManager.save(campaign);
  }

  public async unlinkCampaignFromApplication(
    transactionEntityManager: EntityManager,
    input
  ) {
    const { campaignId, applicationId, organizationId } = input;
    const campaign = await transactionEntityManager.findOne(
      Campaign,
      campaignId,
      {
        relations: ["application"]
      }
    );
    if (!campaign) {
      throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
    }
    if (!campaign.application || campaign.application.id !== applicationId) {
      throw new WCoreError(
        WCORE_ERRORS.NO_SUCH_APPLICATION_CONNECTED_TO_CAMPAIGN
      );
    }
    campaign.application = null;

    await Container.get(CampaignRepository).clearCampaignCache(
      campaign.id,
      campaign.name,
      organizationId
    );

    return transactionEntityManager.save(campaign);
  }

  public async getEndedButNotClosedCampaigns(
    transactionEntityManager: EntityManager
  ) {
    const now = moment();
    const startTime = now.format();
    // Only works on last three days, to reduce the processing
    const endTime = now.subtract(3, "days").format();
    const findOptions = {
      where: {
        endTime: Between(endTime, startTime),
        campaignStatus: Not("COMPLETE")
      }
    };
    const campaigns = await transactionEntityManager.find(Campaign, {
      ...findOptions
    });
    return campaigns;
  }
}

interface ISort {
  sortBy?: string;
  sortOrder?: string;
}
