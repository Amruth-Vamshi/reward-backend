import { Resolvers, ModuleContext } from "@graphql-modules/core";
import {
  QueryEventSubscriptionsForEventTypeArgs,
  QueryEventSubscriptionByIdArgs,
  MutationCreateEventSubscriptionArgs,
  MutationDeleteEventSubscriptionArgs
} from "../../../graphql/generated-models";
import { getManager } from "typeorm";
import { EventSubscriptionService } from "./eventSubscription.service";

export const resolvers = {
  Query: {
    eventSubscriptionById: (
      _,
      { id }: QueryEventSubscriptionByIdArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transactionManager =>
        injector
          .get(EventSubscriptionService)
          .eventSubscriptionById(transactionManager, id)
      ),
    eventSubscriptionsForEventType: (
      _,
      { eventTypeId }: QueryEventSubscriptionsForEventTypeArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transactionEntityManager =>
        injector
          .get(EventSubscriptionService)
          .eventSubscriptionsForEventType(transactionEntityManager, eventTypeId)
      )
  },
  Mutation: {
    createEventSubscription: (
      _,
      {
        eventTypeId,
        triggerAction,
        customActionId
      }: MutationCreateEventSubscriptionArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transactionEntityManager =>
        injector
          .get(EventSubscriptionService)
          .createEventSubscription(transactionEntityManager, {
            eventTypeId,
            triggerAction,
            customActionId
          })
      ),
    deleteEventSubscription: (
      _,
      { id }: MutationDeleteEventSubscriptionArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transactionEntityManager =>
        injector
          .get(EventSubscriptionService)
          .deleteEventSubscription(transactionEntityManager, id)
      )
  }
};
