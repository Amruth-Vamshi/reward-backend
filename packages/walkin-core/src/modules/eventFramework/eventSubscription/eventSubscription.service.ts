import { EntityManager } from "typeorm";
import { EventSubscription, EventType } from "../../../entity";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { TriggerActionEnum } from "../../../graphql/generated-models";
import { STATUS } from "../../common/constants";
export class EventSubscriptionService {
  public async eventSubscriptionById(entityManager: EntityManager, id: string) {
    const eventSubscription = entityManager.findOne(EventSubscription, id, {
      relations: ["eventType"]
    });
    if (!eventSubscription) {
      throw new WCoreError(WCORE_ERRORS.EVENT_SUBSCRIPTION_NOT_FOUND);
    }
    return eventSubscription;
  }
  public async eventSubscriptionsForEventType(
    entityManager: EntityManager,
    eventTypeId: string
  ) {
    const eventType = await entityManager.findOne(EventType, eventTypeId, {
      relations: ["eventSubscriptions"]
    });
    if (!eventType) {
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_NOT_FOUND);
    }
    return eventType.eventSubscriptions;
  }
  public async createEventSubscription(
    entityManager: EntityManager,
    {
      eventTypeId,
      triggerAction,
      customActionId
    }: {
      eventTypeId: string;
      triggerAction: TriggerActionEnum;
      customActionId?: string;
    }
  ) {
    const eventType = await entityManager.findOne(EventType, eventTypeId);
    if (!eventType) {
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_NOT_FOUND);
    }
    if (triggerAction !== TriggerActionEnum.Custom) {
      const subscriptionAlreadyPresent = await entityManager.count(
        EventSubscription,
        {
          where: {
            triggerAction,
            eventType
          }
        }
      );
      if (subscriptionAlreadyPresent > 0) {
        throw new WCoreError(WCORE_ERRORS.EVENT_SUBSCRIPTION_ALREADY_PRESENT);
      }
    }

    let eventSubscription = await new EventSubscription();
    eventSubscription.triggerAction = triggerAction.toString();
    eventSubscription.eventType = eventType;
    eventSubscription.status = STATUS.ACTIVE;
    eventSubscription = await entityManager.save(eventSubscription);
    if (!eventSubscription) {
      throw new WCoreError(WCORE_ERRORS.UNABLE_TO_CREATE_EVENT_SUBSCRIPTION);
    }
    // TODO: Handle customAction
    if (customActionId) {
      throw new WCoreError(WCORE_ERRORS.UNABLE_TO_CREATE_EVENT_SUBSCRIPTION);
    }
    return eventSubscription;
  }
  public async deleteEventSubscription(
    entityManager: EntityManager,
    id: string
  ) {
    const eventSubscription = await entityManager.findOne(
      EventSubscription,
      id
    );
    if (!eventSubscription) {
      throw new WCoreError(WCORE_ERRORS.EVENT_SUBSCRIPTION_NOT_FOUND);
    }
    const deletedEventSubscription = await entityManager.remove(
      eventSubscription
    );
    return deletedEventSubscription;
  }
}
