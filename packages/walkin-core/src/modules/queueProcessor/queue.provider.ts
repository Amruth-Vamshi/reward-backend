import { Injectable } from "@graphql-modules/di";
import { Job, Queue, JobOptions } from "bull";
import {
  ADDITIONAL_JOBS,
  DEFAULT_JOB_FAIL_REASON,
  WALKIN_QUEUES
} from "../common/constants";
import { WCoreError } from "../common/exceptions";
import { WCORE_ERRORS } from "../common/constants/errors";
import "reflect-metadata";
import {
  createBullProducer,
  isValidString,
  updateEntity,
  validateCronExpression
} from "../common/utils/utils";
import Container from "typedi";
import { CampaignRepository } from "../../../../walkin-rewardx/src/modules/campaigns/campaign.repository";
import { EntityManager } from "typeorm";
import { Job as SavedJob } from "../../../../walkin-rewardx/src/entity";

@Injectable()
export class QueueProvider {
  private queueMap: Map<string, Queue>;
  constructor() {
    // TODO : initialise all event subscription queues here
    const queues = [
      ...Object.keys(WALKIN_QUEUES),
      ...Object.values(ADDITIONAL_JOBS)
    ];
    this.queueMap = new Map();
    queues.forEach(queueName => {
      const queue = createBullProducer(queueName);
      this.queueMap[queueName] = queue;
    });
  }

  public async addToQueue(
    queueName: WALKIN_QUEUES,
    data: any,
    opts?: JobOptions
  ): Promise<Job<any>> {
    const bullQueue: Queue = this.queueMap[queueName];
    if (bullQueue) {
      try {
        const jobStatus = await bullQueue.add(data, opts);
        return jobStatus;
      } catch (error) {
        console.log("Error adding to queue", error);
        throw new WCoreError(WCORE_ERRORS.UNABLE_TO_ADD_TO_QUEUE);
      }
    } else {
      throw new WCoreError(WCORE_ERRORS.QUEUE_NOT_INITIALIZED);
    }
  }

  public async getJobById(queueName: WALKIN_QUEUES, id) {
    const bullQueue: Queue = this.queueMap[queueName];
    let job = {};
    if (bullQueue) {
      job = await bullQueue.getJob(id);
      if (!job) {
        throw new WCoreError(WCORE_ERRORS.JOB_NOT_FOUND);
      }
    } else {
      throw new WCoreError(WCORE_ERRORS.QUEUE_NOT_INITIALIZED);
    }
    return job;
  }

  public async removeJob(queueName: WALKIN_QUEUES, jobId) {
    const bullQueue: Queue = this.queueMap[queueName];
    if (bullQueue) {
      const job = await bullQueue.getJob(jobId);
      if (!job) {
        throw new WCoreError(WCORE_ERRORS.JOB_NOT_FOUND);
      }
      await job.remove();
      return {
        success: true,
        message: "Job removed"
      };
    } else {
      throw new WCoreError(WCORE_ERRORS.QUEUE_NOT_INITIALIZED);
    }
  }

  public async failJob(queueName: WALKIN_QUEUES, jobId, reason) {
    const bullQueue: Queue = this.queueMap[queueName];
    if (bullQueue) {
      const job = await bullQueue.getJob(jobId);
      if (!job) {
        throw new WCoreError(WCORE_ERRORS.JOB_NOT_FOUND);
      }
      if (!isValidString(reason)) {
        reason = DEFAULT_JOB_FAIL_REASON;
      }
      await job.moveToFailed({ message: reason }, true);
      return {
        success: true,
        message: "Job failed"
      };
    } else {
      throw new WCoreError(WCORE_ERRORS.QUEUE_NOT_INITIALIZED);
    }
  }

  public async removeScheduledJobFromQueue(
    queueName: WALKIN_QUEUES,
    repeatableJobId: any
  ): Promise<void> {
    const bullQueue: Queue = this.queueMap[queueName];
    if (bullQueue) {
      const repeatableJobs = await bullQueue.getRepeatableJobs();
      let key;
      for (const job of repeatableJobs) {
        if (job.id === repeatableJobId) {
          key = job.key;
          break;
        }
      }
      if (key) {
        try {
          await bullQueue.removeRepeatableByKey(key);
          return;
        } catch (error) {
          console.log("Failed to remove scheduled job: " + error);
          throw new WCoreError(WCORE_ERRORS.FAILED_TO_REMOVE_SCHEDULED_JOB);
        }
      }
    }
  }

  public async createJob(transactionManager, injector, input) {
    const { queueName, cronExpression, organizationId } = input;

    const allowedQueueNames = Object.values(ADDITIONAL_JOBS);
    if (!allowedQueueNames.includes(queueName)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_QUEUE_NAME);
    }

    if (!isValidString(cronExpression)) {
      throw new WCoreError(WCORE_ERRORS.CRON_EXPRESSION_NOT_PROVIDED);
    }
    const { cronResult } = await validateCronExpression(cronExpression);

    const queueData = {
      organizationId,
      queueName
    };

    const jobOptions = {
      removeOnComplete: true,
      removeOnFail: false,
      repeat: {
        cron: cronExpression,
        tz: "Asia/Kolkata"
      }
    };

    const job = await this.addToQueue(queueName, queueData, jobOptions);
    let savedJob;
    if (job) {
      const jobInput = {
        jobId: job.id,
        jobType: queueName,
        organization: organizationId
      };
      savedJob = await Container.get(CampaignRepository).storeJobDetails(
        transactionManager,
        jobInput
      );
      if (savedJob) {
        await job.update({
          organizationId,
          savedJobId: savedJob.id,
          jobData: JSON.stringify(job)
        });
      }
    }
    return savedJob;
  }

  public async getSavedJobById(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ) {
    const jobDetails = await entityManager.findOne(SavedJob, {
      where: {
        id,
        organization: organizationId
      }
    });
    return jobDetails;
  }
}
