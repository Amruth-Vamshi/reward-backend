import { ModuleContext, Resolvers } from "@graphql-modules/core";
import { setOrganizationToInput } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { getManager } from "typeorm";
import { LoyaltyProgramConfigProvider } from "./loyalty-program-config.provider";

export const resolvers: Resolvers = {
  Query: {
    getLoyaltyProgramConfigs: (
      { user, application },
      { loyaltyCardCode },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        let input = { loyaltyCardCode };
        input = setOrganizationToInput(input, application, user);

        return injector
          .get(LoyaltyProgramConfigProvider)
          .getLoyaltyProgramConfigs(manager, injector, input);
      });
    },
    getLoyaltyProgramConfigById: (
      { user, application },
      { configId },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        let input = { configId };
        input = setOrganizationToInput(input, application, user);
        return injector
          .get(LoyaltyProgramConfigProvider)
          .getLoyaltyProgramConfigsById(manager, injector, input);
      });
    }
  },
  Mutation: {
    createLoyaltyProgramConfig: (
      { user, application },
      { input },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        input = setOrganizationToInput(input, application, user);
        return injector
          .get(LoyaltyProgramConfigProvider)
          .createLoyaltyProgramConfig(manager, injector, input);
      });
    },
    updateLoyaltyProgramConfig: (
      { user, application },
      { input },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        input = setOrganizationToInput(input, application, user);
        return injector
          .get(LoyaltyProgramConfigProvider)
          .updateLoyaltyProgramConfig(manager, injector, input);
      });
    },
    deleteLoyaltyProgramConfig: (
      { user, application },
      { configId },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        let input = { configId };
        input = setOrganizationToInput(input, application, user);
        return injector
          .get(LoyaltyProgramConfigProvider)
          .deleteLoyaltyProgramConfig(manager, injector, input);
      });
    }
  }
};
