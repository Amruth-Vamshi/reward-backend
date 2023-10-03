import {
  Resolvers,
  ModuleContext,
  ModuleSessionInfo
} from "@graphql-modules/core";
import { getManager } from "typeorm";
import { LoyaltyProgramProvider } from "./loyalty-program.provider";

export const resolvers: Resolvers = {
  Query: {
    getLoyaltyProgramsByCode: (_, { input }, { injector }: ModuleContext) => {
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyProgramProvider)
          .getLoyaltyProgramsByCode(manager, injector, input);
      });
    },
    loyaltyPrograms: (
      { application, user },
      {
        organizationId,
        loyaltyCardCode,
        pageOptions,
        sortOptions,
        loyaltyCode
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
          .get(LoyaltyProgramProvider)
          .getPageWiseLoyaltyPrograms(
            manager,
            pageOptions,
            sortOptions,
            injector,
            organizationId,
            loyaltyCardCode,
            loyaltyCode
          );
      });
    }
  },
  Mutation: {
    createLoyaltyProgram: (
      { user, application },
      { input },
      { injector }: ModuleContext,
      info
    ) => {
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyProgramProvider)
          .createLoyaltyProgram(
            manager,
            injector,
            input,
            user,
            application,
            info
          );
      });
    },
    updateLoyaltyProgram: (
      { user },
      { input },
      { injector }: ModuleContext
    ) => {
      input.user = user;
      return getManager().transaction(manager => {
        return injector
          .get(LoyaltyProgramProvider)
          .updateLoyaltyProgram(manager, injector, input);
      });
    }
  },
  // LoyaltyProgram: {
  //   campaign: (loyaltyProgram, { input }, { injector }: ModuleContext) => {
  //     console.log("from loyalty proram campaign is:-", loyaltyProgram);
  //     return getManager().transaction(manager => {
  //       return injector
  //         .get(CampaignProvider)
  //         .getCampaign(manager, loyaltyProgram.campaign.id);
  //     });
  //   }
  // }
};
