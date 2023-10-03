import { Injector } from "@graphql-modules/di";
import { getConnection, EntityManager } from "typeorm";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import { DiscountTypeProvider } from "./discountType.providers";
import { isValidDiscountType } from "../../common/validations/Validations";
export const resolvers = {
  Query: {
    discountTypes: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactionEntityManager: EntityManager) => {
          const input = args.input || {};
          return injector
            .get(DiscountTypeProvider)
            .getDiscountTypeForOrganization(
              transactionEntityManager,
              input,
              organizationId
            );
        }
      );
    },
    discountType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactionEntityManager: EntityManager) => {
          return injector
            .get(DiscountTypeProvider)
            .getDiscountType(
              transactionEntityManager,
              args.input,
              organizationId
            );
        }
      );
    }
  },
  Mutation: {
    createDiscountType: (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(
        async (transactionEntityManager: EntityManager) => {
          let input = args.input;
          input = setOrganizationToInput(input, user, application);
          await isUserOrAppAuthorizedToWorkOnOrganization(
            user,
            application,
            input.organizationId
          );

          await isValidDiscountType(transactionEntityManager, input);

          return injector
            .get(DiscountTypeProvider)
            .createDiscountType(
              transactionEntityManager,
              input,
              input.organizationId
            );
        }
      );
    },
    updateDiscountType: (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactionEntityManager: EntityManager) => {
          return injector
            .get(DiscountTypeProvider)
            .updateDiscountType(
              transactionEntityManager,
              args.input,
              organizationId
            );
        }
      );
    },
    deleteDiscountType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactionEntityManager: EntityManager) => {
          return injector
            .get(DiscountTypeProvider)
            .deleteDiscountType(
              transactionEntityManager,
              args.id,
              organizationId
            );
        }
      );
    },
    disableDiscountType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactionEntityManager: EntityManager) => {
          return injector
            .get(DiscountTypeProvider)
            .disableDiscountType(
              transactionEntityManager,
              args.id,
              organizationId
            );
        }
      );
    }
  }
};
