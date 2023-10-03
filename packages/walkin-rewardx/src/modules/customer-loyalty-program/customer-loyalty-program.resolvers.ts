import { ModuleContext, Resolvers } from "@graphql-modules/core";
import { setOrganizationToInput } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { getManager } from "typeorm";
import { CustomerLoyaltyProgramModule } from "./customer-loyalty-program.module";
import { CustomerLoyaltyProgramProvider } from "./customer-loyalty-program.provider";
import { CustomerLoyaltyProgramRepository } from "./customer-loyalty-program.repository";

export const resolvers: Resolvers = {
  Query: {
    getCustomerLoyaltyProgramById: (
      { application, user },
      { customerLoyaltyProgramId },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        return injector
          .get(CustomerLoyaltyProgramProvider)
          .getCustomerLoyaltyProgramById(manager, customerLoyaltyProgramId);
      });
    },
    getCustomerLoyaltyProgramsByFilters: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        return injector
          .get(CustomerLoyaltyProgramProvider)
          .getCustomerLoyaltyProgramsByFilters(manager, input);
      });
    }
  },
  Mutation: {
    createCustomerLoyaltyProgram: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      input = setOrganizationToInput(input, user, application);
      return getManager().transaction(manager => {
        return injector
          .get(CustomerLoyaltyProgramProvider)
          .createCustomerLoyaltyProgram(manager, input);
      });
    },
    updateCustomerloyaltyProgramStatus: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      input = setOrganizationToInput(input, user, application);
      return getManager().transaction(manager => {
        return injector
          .get(CustomerLoyaltyProgramRepository)
          .updateCustomerLoyaltyProgramStatus_rawQuery(manager, input);
      });
    }
  }
};
