import { Injector } from "@graphql-modules/di";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
} from "../../common/utils/utils";
import { BankAccountProvider } from "./bank-account.providers";
import { getConnection, EntityManager } from "typeorm";
export const resolvers = {
  Query: {
    getBankAccount: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(BankAccountProvider)
            .getBankAccount(
              transactinEntityManager,
              args.filter,
              organizationId
            );
        }
      );
    },
    getBankAccounts: (
      { user, application }: IAuthResolverArgs,
      { filter },
      { injector }: { injector: Injector }
    ) => {
      isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        filter.organizationId
      );
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(BankAccountProvider)
            .getBankAccounts(transactinEntityManager, filter);
        }
      );
    },
  },
  Mutation: {
    addBankAccountDetails: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(
        async (transactionEntityManager: EntityManager) => {
          input = setOrganizationToInput(input, user, application);
          input.user = user;
          return injector
            .get(BankAccountProvider)
            .addBankAccountDetails(
              transactionEntityManager,
              input,
              input.organizationId
            );
        }
      );
    },
    updateBankAccountDetails: (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(BankAccountProvider)
            .updateBankAccountDetails(
              transactinEntityManager,
              input,
              organizationId
            );
        }
      );
    },
    deactivateBankAccount: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(BankAccountProvider)
            .deactivateBankAccount(
              transactinEntityManager,
              input,
              organizationId
            );
        }
      );
    },
    activateBankAccount: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(BankAccountProvider)
            .activateBankAccount(
              transactinEntityManager,
              input,
              organizationId
            );
        }
      );
    },
    verifyBankAccount: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(BankAccountProvider)
            .verifyBankAccount(transactinEntityManager, input, organizationId);
        }
      );
    },

    changePrimaryBankAccount: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        input.organizationId
      );
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          input.user = user;
          return injector
            .get(BankAccountProvider)
            .changePrimaryBankAccount(transactinEntityManager, input);
        }
      );
    },
  },
};
