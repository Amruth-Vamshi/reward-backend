import { getConnection } from "typeorm";
import { Injector } from "@graphql-modules/di";
import { ProductTagProvider } from "./productTag.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
} from "../../common/utils/utils";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
export const resolvers = {
  Query: {
    getProductTags: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const getProductTags = await getConnection().transaction(
        async (transactionManager) => {
          const { organizationId } = setOrganizationToInput(
            {},
            user,
            application
          );
          return injector
            .get(ProductTagProvider)
            .getProductTags(transactionManager, args.input, organizationId);
        }
      );
      return getProductTags;
    },
  },
  Mutation: {
    addTagsToProduct: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const savedProductTags = await getConnection().transaction(
        async (transactionManager) => {
          const { input } = args;

          const { organizationId } = setOrganizationToInput(
            {},
            user,
            application
          );
          await isUserOrAppAuthorizedToWorkOnOrganization(
            user,
            application,
            organizationId
          );
          return injector
            .get(ProductTagProvider)
            .addTagsToProduct(transactionManager, input, organizationId);
        }
      );
      const productTagIds = savedProductTags.identifiers.map(
        (productTag) => productTag.id
      );
      const getProductTags = await getConnection().transaction(
        async (transactionManager) => {
          const { organizationId } = setOrganizationToInput(
            {},
            user,
            application
          );
          return injector.get(ProductTagProvider).getProductTags(
            transactionManager,
            {
              productTagId: productTagIds,
            },
            organizationId
          );
        }
      );
      return getProductTags;
    },
    removeTagsFromProduct: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        const { input } = args;

        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductTagProvider)
          .removeTagsFromProduct(transactionManager, input, organizationId);
      });
    },
  },
};
