import { getConnection } from "typeorm";
import { Injector } from "@graphql-modules/di";
import { CollectionProvider } from "./collection.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
export const resolvers = {
  Query: {
    getCollection: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionalEntityManager => {
        const { filter } = args;

        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(CollectionProvider)
          .getCollection(transactionalEntityManager, filter, organizationId);
      });
    },

    getCollections: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionalEntityManager => {
        const { filter, pageOptions, sortOptions } = args;

        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        filter.organizationId = organizationId;
        return injector
          .get(CollectionProvider)
          .getCollections(
            transactionalEntityManager,
            pageOptions,
            sortOptions,
            filter
          );
      });
    }
  },

  Mutation: {
    createCollection: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        const { input } = args;

        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(CollectionProvider)
          .createCollection(transactionManager, input, organizationId);
      });
    },
    deactivateCollection: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        const { input } = args;

        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(CollectionProvider)
          .deactivateCollection(transactionManager, input, organizationId);
      });
    },
    activateCollection: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        const { input } = args;

        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(CollectionProvider)
          .activateCollection(transactionManager, input, organizationId);
      });
    },
    updateCollection: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        const { input } = args;

        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(CollectionProvider)
          .updateCollection(transactionManager, input, organizationId);
      });
    }
  }
};
