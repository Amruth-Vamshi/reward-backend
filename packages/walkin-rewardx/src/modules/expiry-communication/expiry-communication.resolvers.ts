import Mustache from "mustache";
import {
  Resolvers,
  ModuleContext,
  ModuleSessionInfo
} from "@graphql-modules/core";
import { getManager } from "typeorm";
import { ExpiryCommunicationProvider } from "./expiry-communication.provider";

export const expiryCommunicationResolvers: Resolvers = {
  Query: {
    expiryCommunications: (
      { application, user },
      {
        organizationId,
        pageOptions,
        sortOptions,
        loyaltyCardCode,
        loyaltyProgramCode
      },
      { injector }: ModuleContext
    ) => {
      let organization = null;
      if (
        !organizationId ||
        organizationId === null ||
        organizationId == undefined
      ) {
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        organization = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(ExpiryCommunicationProvider)
          .getPageWiseExpiryCommunications(
            manager,
            pageOptions,
            sortOptions,
            injector,
            organizationId,
            loyaltyCardCode,
            loyaltyProgramCode
          );
      });
    },
    expiryCommunicationByLoyaltyCardCodeAndEventType: (
      { application, user },
      { organizationId, eventType, loyaltyCardCode, loyaltyProgramCode },
      { injector }: ModuleContext
    ) => {
      let organization = null;
      if (
        !organizationId ||
        organizationId === null ||
        organizationId == undefined
      ) {
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        organization = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(ExpiryCommunicationProvider)
          .getExpiryCommunicationByLoyaltyCardCodeAndEventType(
            manager,
            injector,
            organizationId,
            loyaltyCardCode,
            loyaltyProgramCode,
            eventType
          );
      });
    }
  },
  Mutation: {
    createExpiryCommunication: (
      { user, application },
      { input },
      { injector }: ModuleContext,
      info
    ) => {
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(ExpiryCommunicationProvider)
          .createExpiryCommunication(
            manager,
            injector,
            input,
            user,
            application,
            info
          );
      });
    },
    updateExpiryCommunication: (
      { user, application },
      { input },
      { injector }: ModuleContext,
      info
    ) => {
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(ExpiryCommunicationProvider)
          .updateExpiryCommunication(
            manager,
            injector,
            input,
            user,
            application,
            info
          );
      });
    },
    expiryReminderCommunication: (
      { user, application },
      args,
      { injector }: ModuleContext,
      info
    ) => {
      let organizationId = null;
      if (application) {
        organizationId = application.organization.id;
      } else if (user) {
        organizationId = user.organization.id;
      }
      return getManager().transaction(manager => {
        return injector
          .get(ExpiryCommunicationProvider)
          .expiryReminderCommunication(manager, injector, organizationId);
      });
    }
  }
};
export default expiryCommunicationResolvers;
