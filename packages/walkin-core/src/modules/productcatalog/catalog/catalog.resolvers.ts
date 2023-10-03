import { getConnection } from "typeorm";
import { CatalogProvider } from "./catalog.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
  callLoadStoreSearch
} from "../../common/utils/utils";
import { isValidCatalog } from "../../common/validations/Validations";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { Organizations } from "../../account/organization/organization.providers";
import { Injector } from "@graphql-modules/di";

export const resolvers = {
  Query: {
    catalog: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(CatalogProvider)
          .findCatalogById(transactionManager, input.id, input.organizationId);
      });
    },
    catalogs: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(CatalogProvider)
          .getCatalogs(transactionManager, input);
      });
    }
  },
  Mutation: {
    createCatalog: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        await isValidCatalog(transactionManager, input);

        return injector
          .get(CatalogProvider)
          .createCatalog(transactionManager, input);
      });
    },
    updateCatalog: async ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const updatedCatalog = await injector
          .get(CatalogProvider)
          .updateCatalog(transactionManager, input);

        const stores = await injector
          .get(Organizations)
          .getOrganizationStores(transactionManager, input.organizationId);
        for (const store of stores) {
          callLoadStoreSearch(store.id);
        }

        return updatedCatalog;
      });
    },

    deleteCatalog: (
      { application, user }: IAuthResolverArgs,
      { id, organizationId },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          organizationId
        );
        const deletedCatalog = await injector
          .get(CatalogProvider)
          .deleteCatalog(transactionManager, { id, organizationId });

        return deletedCatalog;
      });
    }
  },
  Catalog: {
    usage: (catalog, _, context) => {
      catalog["organizationId"] = context.organizationId;
      return context.catalogUsageLoader.load(catalog);
    }
  },
  Categories: {
    products: (category, args, context) => {
      category["organizationId"] = context.organizationId;
      return context.categoryproductsLoader.load(category);
    },
    menuTimings: async (category, args, context) => {
      // set organizationId as part of category as it is needed to fetch menu timings in data loader
      category["organizationId"] = context.organizationId;

      // injector is needed to access the menutimings provider functions
      category["injector"] = context.injector;
      return context.categoryMenuTimingLoader.load(category);
    }
  },
  CategoryProduct: {
    menuTimings: async (product, _, context) => {
      // set organizationId as part of category as it is needed to fetch menu timings in data loader
      product["organizationId"] = context.organizationId;

      // injector is needed to access the menutimings provider functions
      product["injector"] = context.injector;
      return context.productMenuTimingLoader.load(product);
    }
  }
};

export default resolvers;
