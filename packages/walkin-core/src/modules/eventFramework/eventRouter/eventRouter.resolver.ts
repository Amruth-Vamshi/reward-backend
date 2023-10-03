import { Resolvers, ModuleContext } from "@graphql-modules/core";
import {
  QueryEventByIdArgs,
  QueryEventBySourceEventIdArgs,
  MutationPushEventsArgs,
  QueryEventsByFiltersArgs,
  MutationProcessEventByIdArgs
} from "../../../graphql/generated-models";
import { getManager } from "typeorm";
import { EventRouterService } from "./eventRouter.service";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { Event } from "../../../entity";
import { QueueProvider } from "../../queueProcessor/queue.provider";
import { WALKIN_QUEUES } from "../../common/constants";
import { setOrganizationToInput } from "../../common/utils/utils";

export const resolvers = {
  Query: {
    eventById: (
      { application }: IAuthResolverArgs,
      input: QueryEventByIdArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transactionManager => {
        input = setOrganizationToInput(input, null, application);
        return injector
          .get(EventRouterService)
          .eventById(transactionManager, input);
      }),
    eventBySourceEventId: (
      { application }: IAuthResolverArgs,
      { sourceEventId, eventTypeId }: QueryEventBySourceEventIdArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transactionManager =>
        injector
          .get(EventRouterService)
          .eventBySourceEventId(transactionManager, {
            sourceEventId,
            eventTypeId
          })
      ),
    eventsByFilters: (
      { application }: IAuthResolverArgs,
      input: QueryEventsByFiltersArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transactionEntityManager => {
        input = setOrganizationToInput(input, null, application);
        return injector
          .get(EventRouterService)
          .eventsByFilters(transactionEntityManager, input);
      })
  },
  Mutation: {
    pushEvents: async (
      { application, jwt }: IAuthResolverArgs,
      { events }: MutationPushEventsArgs,
      { injector }: ModuleContext
    ) => {
      const savedEvents: Event[] = await getManager().transaction(
        transactionManager => {
          if (!application) {
            throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
          }
          const processEvents: Array<Promise<Event>> = [];
          events.forEach(
            ({
              sourceEventId,
              sourceEventTime,
              sourceName,
              data,
              metadata,
              eventTypeCode
            }) => {
              processEvents.push(
                injector.get(EventRouterService).pushEvent(
                  transactionManager,
                  application,
                  {
                    sourceEventId,
                    sourceEventTime,
                    sourceName,
                    data,
                    metadata,
                    eventTypeCode
                  },
                  jwt
                )
              );
            }
          );
          return Promise.all(processEvents);
        }
      );
      for (const savedEvent of savedEvents) {
        await injector
          .get(QueueProvider)
          .addToQueue(WALKIN_QUEUES.EVENT_PROCESSING, {
            eventId: savedEvent.id,
            jwt
          });
      }

      return savedEvents;
    },
    processEventById: (
      { application, jwt }: IAuthResolverArgs,
      { id }: MutationProcessEventByIdArgs,
      { injector }: ModuleContext
    ) => {
      if (!application) {
        throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
      }
      return getManager().transaction(async transactionManager =>
        injector
          .get(EventRouterService)
          .processEventById(transactionManager, { application, jwt, id })
      );
    },
    recordEvent: (
      { application, jwt }: IAuthResolverArgs,
      { input },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(async transactionManager => {
        input = setOrganizationToInput(input, null, application);
        return injector
          .get(EventRouterService)
          .recordEvent(
            injector,
            transactionManager,
            { application, jwt },
            input
          );
      });
    },
    createEvent: (
      { application, jwt }: IAuthResolverArgs,
      { input },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(async transactionManager => {
        input = setOrganizationToInput(input, null, application);
        return injector
          .get(EventRouterService)
          .createEvent(transactionManager, { application, jwt }, input);
      });
    },
    updateEvent: (
      { application, jwt }: IAuthResolverArgs,
      { input },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(async transactionManager => {
        input = setOrganizationToInput(input, null, application);
        input["application"] = application;
        return injector
          .get(EventRouterService)
          .updateEvent(transactionManager, input);
      });
    }
  }
};
