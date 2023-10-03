import { getManager } from "typeorm";
import { ProductDiscountValueProvider } from "./productDiscountValue.providers";
import { setOrganizationToInput } from "../../common/utils/utils";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { Injector } from "@graphql-modules/di";
import { StoreInventoryProvider } from "../storeInventory/storeInventory.providers";

const resolvers = {
  Query: {
    productDiscountValue: async (
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
          .get(ProductDiscountValueProvider)
          .getproductDiscountValue(
            transactionEntityManager,
            args.filter,
            organizationId
          );
      });
    },

    productDiscountValues: async (
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
          .get(ProductDiscountValueProvider)
          .getproductDiscountValues(
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
    createDiscountValueForProduct: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(async transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        const productDiscountValue = await injector
          .get(ProductDiscountValueProvider)
          .createDiscountValueForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
        return productDiscountValue;
      });
    },
    createDiscountValueForProducts: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(async transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        const productDiscountValue = await injector
          .get(ProductDiscountValueProvider)
          .addDiscountValueForProducts(
            transactionEntityManager,
            args.input,
            organizationId
          );
        return productDiscountValue;
      });
    },
    updateDiscountValueForProduct: async (
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
          .get(ProductDiscountValueProvider)
          .updateDiscountValueForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updateDiscountValueForProducts: async (
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
          .get(ProductDiscountValueProvider)
          .updateDiscountValueForProducts(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    removeDiscountValueForProduct: async (
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
          .get(ProductDiscountValueProvider)
          .removeDiscountValueForProduct(
            transactionEntityManager,
            args,
            organizationId
          );
      });
    }
  }
};

export { resolvers };
