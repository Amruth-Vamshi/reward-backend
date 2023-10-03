import { Resolvers, ModuleContext } from "@graphql-modules/core";
import { getManager } from "typeorm";
import {
  MutationCreateEventTypeArgs,
  MutationUpdateEventTypeArgs,
  MutationDeleteEventTypeArgs,
  EventType,
  QueryEventTypeByIdArgs,
  QueryEventTypeByCodeArgs,
  QueryEventTypesForApplicationArgs
} from "../../../graphql/generated-models";
import { EventTypeService } from "./eventType.service";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { setOrganizationToInput } from "../../common/utils/utils";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { EventTypeRepository } from "./eventType.repository";
import Container from "typedi";

export const resolvers = {
  Query: {
    eventTypeById: (
      { user, application },
      input: QueryEventTypeByIdArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transacationManager => {
        if (!application) {
          throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
        }
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(EventTypeService)
          .eventTypeById(transacationManager, input.id, input.organizationId);
      }),
    eventTypeByCode: (
      { user, application },
      input,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(async (transacationManager) => {
        if (!application) {
          throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
        }
        input = setOrganizationToInput(input, user, application);
        const relations = ["application"];
        const eventType = await Container.get(EventTypeRepository).getEventTypeByCode(
          transacationManager,
          input.code,
          input.organizationId,
          relations
        );
        return eventType;
      }
      ),
    eventTypesForApplication: (
      _,
      { appId }: QueryEventTypesForApplicationArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transacationManager =>
        injector
          .get(EventTypeService)
          .eventTypesForApplication(transacationManager, appId)
      )
  },
  Mutation: {
    createEventType: (
      { user, application }: IAuthResolverArgs,
      input,
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(transacationManager => {
        input = setOrganizationToInput(input, user, application);
        input["application"] = application;
        return injector
          .get(EventTypeService)
          .createEventType(transacationManager, input);
      });
    },
    updateEventType: (
      { user, application }: IAuthResolverArgs,
      input: MutationUpdateEventTypeArgs,
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(transactionManager => {
        input = setOrganizationToInput(input, user, application);
        const { code, description, status, id, organizationId } = input;
        return injector.get(EventTypeService).updateEventType(transactionManager, {
          id,
          code,
          description,
          status,
          organizationId,
          application
        })
      })
    },
    deleteEventType: (
      { user }: IAuthResolverArgs,
      { id }: MutationDeleteEventTypeArgs,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(transactionManager =>
        injector.get(EventTypeService).deleteEventType(transactionManager, id)
      )
  }
};
