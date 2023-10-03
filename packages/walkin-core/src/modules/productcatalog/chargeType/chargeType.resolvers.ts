import { Injector } from "@graphql-modules/di";
import { getConnection, EntityManager } from "typeorm";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
} from "../../common/utils/utils";
import { ChargeTypeProvider } from "./chargeType.providers";
import { isValidChargeType } from "../../common/validations/Validations";
export const resolvers = {
  Query: {
    chargeTypes: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactionEntityManager: EntityManager) => {
          const input = args.input || {};
          return injector
            .get(ChargeTypeProvider)
            .getChargeTypeForOrganization(
              transactionEntityManager,
              input,
              organizationId
            );
        }
      );
    },
    chargeType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactionEntityManager: EntityManager) => {
          return injector
            .get(ChargeTypeProvider)
            .getChargeType(
              transactionEntityManager,
              args.input,
              organizationId
            );
        }
      );
    },
  },
  Mutation: {
    createChargeType: (
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

          await isValidChargeType(transactionEntityManager, input);

          return injector
            .get(ChargeTypeProvider)
            .createChargeType(
              transactionEntityManager,
              input,
              input.organizationId
            );
        }
      );
    },
    updateChargeType: (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactionEntityManager: EntityManager) => {
          return injector
            .get(ChargeTypeProvider)
            .updateChargeType(
              transactionEntityManager,
              args.input,
              organizationId
            );
        }
      );
    },
    deleteChargeType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactionEntityManager: EntityManager) => {
          return injector
            .get(ChargeTypeProvider)
            .deleteChargeType(
              transactionEntityManager,
              args.id,
              organizationId
            );
        }
      );
    },
  },
};
