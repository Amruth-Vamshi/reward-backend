import { Event, EventType, Application } from "../../../entity";
import { EntityManager, getManager } from "typeorm";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { QueueProvider } from "../../queueProcessor/queue.provider";
import { Inject, Injector } from "@graphql-modules/di";
import { WALKIN_QUEUES } from "../../common/constants";
import { Container } from "typedi";
import { EventTypeRepository } from "../eventType/eventType.repository";
import { CampaignProvider } from "../../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { EventTypeService } from "../eventType/eventType.service";
import { EventRepository } from "./eventRouter.repository";
import { isValidString, updateEntity } from "../../common/utils/utils";
export class EventRouterService {
  constructor(@Inject(QueueProvider) private queueProvider: QueueProvider) { }
  public async eventById(entityManager: EntityManager, input): Promise<Event> {
    const { id, organizationId } = input;
    const event = entityManager.findOne(Event, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      }
    });
    if (!event) {
      throw new WCoreError(WCORE_ERRORS.EVENT_NOT_FOUND);
    }
    return event;
  }

  public async eventBySourceEventId(
    entityManager: EntityManager,
    {
      sourceEventId,
      eventTypeId
    }: { sourceEventId: string; eventTypeId?: string }
  ): Promise<Event> {
    const where: {
      eventType?: EventType;
      sourceEventId?: string;
    } = {
      sourceEventId
    };
    if (eventTypeId) {
      const eventType = await entityManager.findOne(EventType, eventTypeId);
      if (!eventType) {
        throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_NOT_FOUND);
      }
      where.eventType = eventType;
    }
    return entityManager.findOne(Event, {
      where
    });
  }

  /**
   * eventsByFilters
   */
  public async eventsByFilters(
    entityManager: EntityManager,
    input: any
  ): Promise<Event[]> {
    const { eventTypeCode, sourceName, organizationId } = input;
    const where: {
      eventType?: EventType;
      sourceName?: string;
      organization: any;
    } = {
      organization: {
        id: organizationId
      }
    };
    if (sourceName) {
      where.sourceName = sourceName;
    }
    if (eventTypeCode) {
      const eventType = await entityManager.findOne(EventType, {
        where: {
          code: eventTypeCode
        }
      });
      if (!eventType) {
        throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_NOT_FOUND);
      }
      where.eventType = eventType;
    }
    return entityManager.find(Event, {
      where
    });
  }

  public async pushEvent(
    entityManager: EntityManager,
    application: Application,
    {
      sourceEventId,
      sourceEventTime,
      sourceName,
      data,
      metadata,
      eventTypeCode
    }: IPushEvent,
    jwt?: string
  ): Promise<Event> {
    const eventType = await entityManager.findOne(EventType, {
      where: {
        code: eventTypeCode,
        application
      },
      cache: true
    });
    if (!eventType) {
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_NOT_FOUND);
    }
    let event = new Event();
    event.sourceEventId = sourceEventId;
    event.sourceEventTime = sourceEventTime;
    event.sourceName = sourceName;
    event.data = data;
    event.metadata = metadata;
    event.eventType = eventType;
    event = await entityManager.save(event);
    return event;
  }

  public async updateEvent(entityManager: EntityManager, input) {
    const { id, application, organizationId, data } = input;
    if (!application) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }

    if (data) {
      if (typeof data !== "object") {
        throw new WCoreError(WCORE_ERRORS.INVALID_DATA);
      }
    }

    const relations = [];
    let event = await Container.get(EventRepository).getEventById(entityManager, id, organizationId, relations);
    if (!event) {
      throw new WCoreError(WCORE_ERRORS.EVENT_NOT_FOUND);
    }

    event = updateEntity(event, input);
    return entityManager.save(event);
  }

  public async createEvent(entityManager: EntityManager, args, eventData) {
    // createEvent considers eventTypeId
    const { application } = args;
    const { data, eventTypeId, organizationId } = eventData;
    if (!application) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }

    if (typeof data !== "object") {
      throw new WCoreError(WCORE_ERRORS.INVALID_DATA);
    }

    // Validate event type
    const relations = [];
    const eventType = await Container.get(EventTypeRepository).getEventTypeById(
      entityManager,
      eventTypeId,
      organizationId,
      relations
    );
    if (!eventType) {
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_NOT_FOUND);
    }

    eventData["organization"] = organizationId;
    const eventSchema = await entityManager.create(Event, eventData);
    const savedEvent = await entityManager.save(eventSchema);
    return savedEvent;
  }

  public async recordEvent(
    injector: Injector,
    entityManager: EntityManager,
    args,
    eventData
  ) {
    const { application } = args;
    if (!application) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }

    const { data, eventTypeCode, organizationId, description } = eventData;
    if (typeof data !== "object") {
      throw new WCoreError(WCORE_ERRORS.INVALID_DATA);
    }

    const validEventTypeCode = isValidString(eventTypeCode);
    if (!validEventTypeCode) {
      throw new WCoreError(WCORE_ERRORS.INVALID_EVENT_TYPE_CODE);
    }
    const eventType = await injector
      .get(EventTypeService)
      .createOrFetchEventType(entityManager, {
        code: eventTypeCode,
        applicationId: application.id,
        description,
        organizationId
      });

    const evaluateCampaignsForEventInput = {
      data,
      organizationId,
      eventTypeId: eventType.id
    };
    const {evaluatedCampaigns,errors} = await injector
      .get(CampaignProvider)
      .evaluateCampaignsForEvent(
        entityManager,
        injector,
        evaluateCampaignsForEventInput
      );
    return {
      eventType,
      campaigns: evaluatedCampaigns,
      errors
    };
  }

  public async processEventById(
    entityManager: EntityManager,
    {
      application,
      id,
      jwt
    }: { application: Application; id: string; jwt?: string }
  ) {
    let event = await entityManager.findOne(Event, {
      where: {
        id
      },
      relations: ["eventType", "campaignEventTriggers"],
      cache: false
    });
    if (!event) {
      throw new WCoreError(WCORE_ERRORS.EVENT_NOT_FOUND);
    }
    const eventType = await entityManager.findOne(EventType, {
      where: {
        application,
        id: event.eventType.id
      },
      cache: true,
      relations: ["eventSubscriptions"]
    });
    const processedJobsObject = {};
    for (const eventSubscription of eventType.eventSubscriptions) {
      const queue: WALKIN_QUEUES =
        WALKIN_QUEUES[eventSubscription.triggerAction];
      try {
        await this.queueProvider.addToQueue(queue, {
          event,
          jwt
        });
        processedJobsObject[queue] = "Added to queue";
      } catch (err) {
        console.log(err);
        processedJobsObject[queue] = "Error Adding to Queue";
      }
    }
    event.processedStatus = processedJobsObject;
    event = await entityManager.save(event);
    return event.processedStatus;
  }
}
export interface IPushEvent {
  sourceEventId: string;
  sourceEventTime: Date;
  sourceName: string;
  data: any;
  metadata: any;
  eventTypeCode: string;
}
