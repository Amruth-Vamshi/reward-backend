import { getManager } from "typeorm";
import { ProductPriceValueProvider } from "./productPriceValue.providers";
import {
  isUserOrAppAuthorizedToWorkOnOrganization,
  setOrganizationToInput
} from "../../common/utils/utils";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { Injector } from "@graphql-modules/di";
import { StoreInventoryProvider } from "../storeInventory/storeInventory.providers";

const resolvers = {
  Query: {
    productPriceValue: async (
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
          .get(ProductPriceValueProvider)
          .getproductPriceValue(
            transactionEntityManager,
            args.filter,
            organizationId
          );
      });
    },

    productPriceValues: async (
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
          .get(ProductPriceValueProvider)
          .getproductPriceValues(
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
    createPriceValueForProduct: async (
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
        const productPriceValue = await injector
          .get(ProductPriceValueProvider)
          .createPriceValueForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
        await injector.get(StoreInventoryProvider).addStoreInventory(
          transactionEntityManager,
          {
            channel: [productPriceValue.channel.id],
            productId: productPriceValue.product.id,
            storeFormat: [productPriceValue.storeFormat.id]
          },
          organizationId
        );
        return productPriceValue;
      });
    },
    createPriceValueForProducts: async (
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
        const productPriceValues = await injector
          .get(ProductPriceValueProvider)
          .createPriceValueForProducts(
            transactionEntityManager,
            args.input,
            organizationId
          );
        for (let priceValue of productPriceValues) {
          await injector.get(StoreInventoryProvider).addStoreInventory(
            transactionEntityManager,
            {
              productId: priceValue.product.id,
              channel: [priceValue.channel.id],
              storeFormat: [priceValue.storeFormat.id]
            },
            organizationId
          );
        }
        return productPriceValues;
      });
    },
    updatePriceValueForProduct: async (
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
          .get(ProductPriceValueProvider)
          .updatePriceValueForProduct(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updatePriceValueForProducts: async (
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
          .get(ProductPriceValueProvider)
          .updatePriceValueForProducts(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    removeProductPriceValues: async (
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
          .get(ProductPriceValueProvider)
          .removeProductPriceValues(
            transactionEntityManager,
            args,
            organizationId
          );
      });
    },
    removeProductPriceValuesByFilter: async (
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
          .get(ProductPriceValueProvider)
          .removeProductPriceValuesByFilter(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    }
  }
};

export { resolvers };
