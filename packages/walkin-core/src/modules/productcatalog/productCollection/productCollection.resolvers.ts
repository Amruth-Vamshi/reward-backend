import { getConnection } from "typeorm";
import { Injector } from "@graphql-modules/di";
import { ProductCollectionProvider } from "./productCollection.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
export const resolvers = {
  Mutation: {
    addProductsToCollection: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const savedProductCollection = await getConnection().transaction(
        async transactionManager => {
          const { input } = args;

          const { organizationId } = setOrganizationToInput(
            {},
            user,
            application
          );
          return injector
            .get(ProductCollectionProvider)
            .addProductsToCollection(transactionManager, input, organizationId);
        }
      );
      const productCollectionIds = savedProductCollection.identifiers.map(
        productCollection => productCollection.id
      );
      const getSavedProductCollection = await getConnection().transaction(
        async transactionEntityManager => {
          const { organizationId } = setOrganizationToInput(
            {},
            user,
            application
          );
          return injector.get(ProductCollectionProvider).getProductCollection(
            transactionEntityManager,
            {
              productCollectionId: productCollectionIds
            },
            organizationId
          );
        }
      );

      return getSavedProductCollection;
    },
    removeProductsFromCollection: async (
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
          .get(ProductCollectionProvider)
          .removeProductsFromCollection(
            transactionManager,
            input,
            organizationId
          );
      });
    }
  }
};
