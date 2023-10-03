import { getConnection } from "typeorm";
import { StoreFormatProvider } from "./storeFormat.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import {
  isValidTaxType,
  isValidStoreFormat
} from "../../common/validations/Validations";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";

const resolvers = {
  Query: {
    storeFormat: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionalEntityManager => {
        let input = args;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(StoreFormatProvider)
          .getStoreFormat(transactionalEntityManager, input);
      });
    },

    storeFormats: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionalEntityManager => {
        let input = args;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(StoreFormatProvider)
          .getStoreFormats(
            transactionalEntityManager,
            input.pageOptions,
            input.sortOptions,
            input
          );
      });
    }
  },

  Mutation: {
    createStoreFormat: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }
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
          .get(StoreFormatProvider)
          .createStoreFormat(transactionManager, input);
      });
    },
    updateStoreFormat: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;
        input.id = args.id;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        await isValidStoreFormat(transactionManager, input);

        return injector
          .get(StoreFormatProvider)
          .updateStoreFormat(transactionManager, input);
      });
    }
  }
};

export default resolvers;
