import { getConnection } from "typeorm";
import { CatalogProvider } from "../catalog/catalog.providers";
import { CategoryProvider } from "./category.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import { Injector } from "@graphql-modules/di";

export const resolvers = {
  Query: {
    category: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(CategoryProvider)
          .findById(transactionManager, args.id);
      });
    },
    categoryByCode: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organiationId
        );

        return injector
          .get(CategoryProvider)
          .findByCode(transactionManager, input.catalogId, input.categoryCode);
      });
    },

    categoriesWithChildren: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organiationId
        );

        return injector
          .get(CategoryProvider)
          .findDescendentsTree(
            transactionManager,
            input.catalogId,
            input.categoryCode
          );
      });
    },
    categories: ({ user, application }, input, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organiationId
        );

        return injector
          .get(CategoryProvider)
          .getCategories(transactionManager, input);
      });
    }
  },
  Mutation: {
    createCategory: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organiationId
        );

        return injector
          .get(CategoryProvider)
          .createCategory(transactionManager, input);
      });
    },
    updateCategory: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organiationId
        );

        return injector
          .get(CategoryProvider)
          .updateCategory(transactionManager, input);
      });
    },
    updateCategorySortSeq: (
      { user, application },
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organiationId
        );
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(CategoryProvider)
          .updateCategorySortSeq(transactionManager, input);
      });
    },
    disableCategory: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organiationId
        );

        return injector
          .get(CategoryProvider)
          .disableCategory(transactionManager, input.id);
      });
    }
  },
  Category: {
    parent: (category, _, { categoryDetailsLoader }) => {
      if (category.parent) {
        return category.parent;
      }
      if (category.parentId) {
        return categoryDetailsLoader.load(category.parentId);
      }
    },
    catalog: (category, _, context) => {
      category["organizationId"] = context.organizationId;
      return context.categoryCatalogLoader.load(category);
    },
    products: async (category, _, context) => {
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
  }
};
