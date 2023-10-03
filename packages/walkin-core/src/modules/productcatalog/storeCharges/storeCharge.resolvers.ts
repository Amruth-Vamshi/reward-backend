import { getConnection } from "typeorm";
import { StoreChargeProvider } from "./storeCharge.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
} from "../../common/utils/utils";
import {
  isValidTaxType,
  isValidStoreFormat,
} from "../../common/validations/Validations";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { Injector } from "@graphql-modules/di";

const resolvers = {
  Query: {
    getStoreCharges: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionalEntityManager) => {
        let input = args;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(StoreChargeProvider)
          .getStoreCharges(transactionalEntityManager, input);
      });
    },
  },

  Mutation: {
    createStoreCharges: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(StoreChargeProvider)
          .createStoreCharges(transactionManager, input);
      });
    },
    updateStoreCharges: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        let input = args.input;
        input.id = args.id;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(StoreChargeProvider)
          .updateStoreCharges(transactionManager, input);
      });
    },
  },
};

export default resolvers;
