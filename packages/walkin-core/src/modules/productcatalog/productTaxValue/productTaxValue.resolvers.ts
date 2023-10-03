import { getConnection, getManager } from "typeorm";
import { ProductTaxValueProvider } from "./productTaxValue.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
} from "../../common/utils/utils";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { Injector } from "@graphql-modules/di";

const resolvers = {
  Query: {
    productTaxTypeValue: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction((transactionEntityManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductTaxValueProvider)
          .getproductTaxTypeValue(
            transactionEntityManager,
            args.filter,
            organizationId
          );
      });
    },

    productTaxTypeValues: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction((transactionEntityManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );

        return injector
          .get(ProductTaxValueProvider)
          .getproductTaxTypeValues(
            transactionEntityManager,
            args.filter,
            args.pageOptions,
            organizationId,
            args.sortOptions
          );
      });
    },
  },

  Mutation: {
    createTaxValueForProduct: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(async (transactionEntityManager) => {
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
          .get(ProductTaxValueProvider)
          .createTaxValueForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updateTaxValueForProduct: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction((transactionEntityManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductTaxValueProvider)
          .updateTaxValueForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    removeProductTaxValue: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction((transactionEntityManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductTaxValueProvider)
          .removeProductTaxValue(
            transactionEntityManager,
            args,
            organizationId
          );
      });
    },

    createProductTaxValueForCatalog: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction((transactionEntityManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductTaxValueProvider)
          .createProductTaxValueForCatalog(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updateProductTaxValueForCatalog: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction((transactionEntityManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductTaxValueProvider)
          .updateProductTaxValueForCatalog(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    linkTaxValuesForProduct: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction((transactionEntityManager) => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductTaxValueProvider)
          .addProductTaxValuesForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    removeProductTaxValues: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction((transactionEntityManager) => {
        const input = args.input;
        const { organizationId } = setOrganizationToInput(
          input,
          user,
          application
        );
        isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        return injector
          .get(ProductTaxValueProvider)
          .removeProductTaxValues(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
  },
};

export { resolvers };
