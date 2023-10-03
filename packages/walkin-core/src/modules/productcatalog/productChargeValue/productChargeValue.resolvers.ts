import { getConnection, getManager } from "typeorm";
import { ProductChargeValueProvider } from "./productChargeValue.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { Injector } from "@graphql-modules/di";

const resolvers = {
  Query: {
    productChargeValue: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .getproductChargeValue(
            transactionEntityManager,
            args.filter,
            organizationId
          );
      });
    },

    productChargeValues: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .getproductChargeValues(
            transactionEntityManager,
            args.filter,
            args.pageOptions,
            organizationId,
            args.sortOptions
          );
      });
    }
  },

  Mutation: {
    createChargeValueForProduct: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .createChargeValueForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    createChargeValueForProducts: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .createChargeValueForProducts(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updateChargeValueForProduct: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .updateChargeValueForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    removeProductChargeValue: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .removeProductChargeValue(
            transactionEntityManager,
            args,
            organizationId
          );
      });
    },
    createProductChargeValueForCatalog: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .createProductChargeValueForCatalog(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updateProductChargeForCatalog: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .updateProductChargeForCatalog(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    linkChargeValuesForProduct: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .addProductChargeValuesForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    removeProductChargeValues: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
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
          .get(ProductChargeValueProvider)
          .removeProductChargeValues(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updateChargeValueForProducts: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductChargeValueProvider)
          .updateChargeValueForProducts(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    }
  },
  ProductValue: {
    product: async (productValue, _, { chargeValueLoader }) => {
      return chargeValueLoader.load(productValue);
    }
  }
};

export { resolvers };
