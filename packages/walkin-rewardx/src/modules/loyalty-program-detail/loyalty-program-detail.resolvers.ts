import { ModuleContext, Resolvers } from "@graphql-modules/core";
import { Injector } from "@graphql-modules/di";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { setOrganizationToInput } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import Container from "typedi";
import { getManager } from "typeorm";
import { LoyaltyProgramDetailProvider } from "./loyalty-program-detail.provider";
import { LoyaltyProgramDetailRepository } from "./loyalty-program-detail.repository";

export const resolvers: Resolvers = {
  Query: {
    getLoyaltyProgramDetails: (
      { user, application },
      { organizationId },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        let input = {};
        input = setOrganizationToInput(input, application, user);
        // @ts-ignore
        if (organizationId != input.organizationId) {
          throw new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH);
        }
        return injector
          .get(LoyaltyProgramDetailProvider)
          .getLoyaltyProgramDetails(manager, injector, organizationId);
      });
    },
    getLoyaltyProgramDetailById: (
      { user, application },
      { detailId },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        let input = { detailId };
        input = setOrganizationToInput(input, application, user);
        return Container.get(
          LoyaltyProgramDetailRepository
        ).getLoyaltyProgramDetailById(manager, injector, input);
      });
    },
    getLoyaltyProgramDetailByCode: (
      { user, application },
      { detailCode },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        let input = { detailCode };
        input = setOrganizationToInput(input, application, user);
        return injector
          .get(LoyaltyProgramDetailProvider)
          .getLoyaltyProgramDetailByCode(manager, injector, input);
      });
    },

    getLoyaltyProgramDetailByConfigId: async (
      { user, application },
      args,
      { injector }: ModuleContext
    ) => {
      await setOrganizationToInput(args, application, user);
      return getManager().transaction(manager => {
        return injector.get(
          LoyaltyProgramDetailProvider
        ).getLoyaltyProgramDetailByConfigId(manager, args, args.pageOptions);
      });
    },
  },
  Mutation: {
    createLoyaltyProgramDetail: (
      { user, application },
      { input },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        input = setOrganizationToInput(input, application, user);
        return injector
          .get(LoyaltyProgramDetailProvider)
          .createLoyaltyProgramDetail(manager, injector, input);
      });
    },
    updateLoyaltyProgramDetail: (
      { user, application },
      { input },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        input = setOrganizationToInput(input, application, user);
        return injector
          .get(LoyaltyProgramDetailProvider)
          .updateLoyaltyProgramDetail(manager, injector, input);
      });
    },
    deleteLoyaltyProgramDetail: (
      { user, application },
      { detailCode },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        let input = { detailCode };
        input = setOrganizationToInput(input, application, user);
        return injector
          .get(LoyaltyProgramDetailProvider)
          .deleteLoyaltyProgramDetail(manager, injector, input);
      });
    }
  }
};
