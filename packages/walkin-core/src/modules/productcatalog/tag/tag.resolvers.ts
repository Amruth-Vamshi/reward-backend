import { getConnection } from "typeorm";
import { Injector } from "@graphql-modules/di";
import { TagProvider } from "./tag.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
export const resolvers = {
  Query: {
    getTag: async (
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
          .get(TagProvider)
          .getTag(transactionalEntityManager, filter, organizationId);
      });
    },

    getTags: async (
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
        return injector
          .get(TagProvider)
          .getTags(
            transactionalEntityManager,
            filter,
            organizationId,
            pageOptions,
            sortOptions
          );
      });
    }
  },

  Mutation: {
    createTag: async (
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
          .get(TagProvider)
          .createTag(transactionManager, input, organizationId);
      });
    },
    deactivateTag: async (
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
          .get(TagProvider)
          .deactivateTag(transactionManager, input, organizationId);
      });
    },
    activateTag: async (
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
          .get(TagProvider)
          .reActivateTag(transactionManager, input, organizationId);
      });
    },
    updateTagName: async (
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
          .get(TagProvider)
          .updateTagName(transactionManager, input, organizationId);
      });
    }
  }
};
