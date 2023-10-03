import { getConnection, getManager } from "typeorm";
import { setOrganizationToInput } from "../../common/utils/utils";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { Injector } from "@graphql-modules/di";
import { ProductRelationshipProvider } from "./productRelationship.providers";
import { ProductProvider } from "../product/product.providers";
import { ProductRelationshipModule } from "./productRelationship.module";

const resolvers = {
  Query: {
    productRelationship: async (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(transactionEntityManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(ProductRelationshipProvider)
          .getProductRelationship(transactionEntityManager, input);
      });
    }
  },
  Mutation: {
    createProductRelationship: async (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(async transactionEntityManager => {
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(ProductRelationshipProvider)
          .creatProductRelationship(transactionEntityManager, input);
      });
    },
    createProductRelationships: async (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(async transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductRelationshipProvider)
          .creatProductRelationships(
            transactionEntityManager,
            input,
            organizationId
          );
      });
    },
    removeProductRelationShip: async (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(async transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductRelationshipProvider)
          .removeProductRelationships(
            transactionEntityManager,
            input,
            organizationId
          );
      });
    },
    updateProductRelationShips: async (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(async transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductRelationshipProvider)
          .updateProductRelationships(
            transactionEntityManager,
            input,
            organizationId
          );
      });
    },
    updateProductRelationShip: async (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      const manager = getManager();
      return manager.transaction(async transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(ProductRelationshipProvider)
          .updateProductRelationship(transactionEntityManager, input);
      });
    }
  },
  ProductRelationship: {
    child: async (parent, args, context) => {
      if (parent) {
        if (parent.product) {
          const injector = ProductRelationshipModule.injector;
          const manager = getManager();
          const organizationId = parent.product?.organization?.id;

          const childProduct = await injector
            .get(ProductProvider)
            .getProductById(manager, parent.childId, organizationId);

          if (childProduct && parent.product.store) {
            childProduct.store = parent.product.store;
          }
          return childProduct;
        }

        if (parent.childId) {
          return context.productLoader.load(parent.childId);
        }
      }
    },
    parent: async (parent, args, context) => {
      if (parent) {
        if (parent.product) {
          const injector = ProductRelationshipModule.injector;
          const manager = getManager();
          const organizationId = parent.product?.organization?.id;

          const parentProduct = await injector
            .get(ProductProvider)
            .getProductById(manager, parent.parentId, organizationId);
          if (parentProduct && parent.product.store) {
            parentProduct.store = parent.product.store;
          }
          return parentProduct;
        }

        if (parent.parentId) {
          return context.productLoader.load(parent.parentId);
        }
      }
    }
  }
};

export { resolvers };
