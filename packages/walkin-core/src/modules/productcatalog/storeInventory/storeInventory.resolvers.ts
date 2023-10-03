import { getConnection } from "typeorm";
import { StoreInventoryProvider } from "./storeInventory.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import {
  isValidTaxType,
  isValidStoreFormat
} from "../../common/validations/Validations";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { Injector } from "@graphql-modules/di";

const resolvers = {
  Query: {
    storeInventory: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        await isValidStoreFormat(transactionManager, input);

        return injector
          .get(StoreInventoryProvider)
          .storeInventory(transactionManager, input);
      });
    }
  },
  Mutation: {
    storeProductAvailablity: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        await isValidStoreFormat(transactionManager, input);

        return injector
          .get(StoreInventoryProvider)
          .storeProductAvailablity(transactionManager, input);
      });
    },
    storeProductsAvailablity: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        const input = args.input;
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );

        return injector
          .get(StoreInventoryProvider)
          .storeProductsAvailability(transactionManager, input, organizationId);
      });
    },
    addStoreInventoryForAllProducts: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        await isValidStoreFormat(transactionManager, input);

        return injector
          .get(StoreInventoryProvider)
          .addStoreInventoryForAllProducts(transactionManager, input);
      });
    }
  }
};

export default resolvers;
