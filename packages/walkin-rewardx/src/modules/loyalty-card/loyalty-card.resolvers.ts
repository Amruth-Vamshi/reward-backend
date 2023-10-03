import Mustache from "mustache";
import {
  Resolvers,
  ModuleContext,
  ModuleSessionInfo
} from "@graphql-modules/core";
import { getManager } from "typeorm";
import { LoyaltyCardProvider } from "./loyalty-card.provider";
import { setOrganizationToInput } from "@walkinserver/walkin-core/src/modules/common/utils/utils";

export const resolvers: Resolvers = {
  Query: {
    loyaltyCard: ({ application, user }, { id }, { injector }: ModuleContext) => {
      return getManager().transaction(manager => {

        const {organizationId} = setOrganizationToInput({},user,application);
        
        return injector.get(LoyaltyCardProvider).getLoyaltyCard(manager,organizationId,id);
      });
    },
    loyaltyCardByCode: (
      { application, user },
      { loyaltyCardCode },
      { injector }: ModuleContext
    ) => {
      let organizationId;
      if (application) {
        organizationId = application.organization.id;
      } else if (user) {
        organizationId = user.organization.id;
      }
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyCardProvider)
          .getLoyaltyCardByCode(manager, loyaltyCardCode, organizationId);
      });
    },
    loyaltyCards: (
      { application, user },
      { organizationId, pageOptions, sortOptions },
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
          .get(LoyaltyCardProvider)
          .getPageWiseLoyaltyCards(
            manager,
            pageOptions,
            sortOptions,
            injector,
            organizationId
          );
      });
    }
  },
  Mutation: {
    createLoyaltyCard: (
      { application, user },
      { input },
      { injector }: ModuleContext
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
          .get(LoyaltyCardProvider)
          .createLoyaltyCard(manager, input);
      });
    },
    updateLoyaltyCard: (
      { application, user },
      { input },
      { injector }: ModuleContext
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
          .get(LoyaltyCardProvider)
          .updateLoyaltyCard(manager, input);
      });
    }
  }
};
