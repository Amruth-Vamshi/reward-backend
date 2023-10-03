import { Injector } from "@graphql-modules/di";
import { getConnection } from "typeorm";

import { PaymentTypeProvider } from "./paymentType.providers";
import { WCoreError } from "../common/exceptions";
import { WCORE_ERRORS } from "../common/constants/errors";
import {
  authorizedToWorkOnOrganization,
  resetValues,
  setOrganizationToInput
} from "../common/utils/utils";
import { IAuthResolverArgs } from "../account/auth-guard/auth-guard.interface";

const resolvers = {
  Query: {
    getPaymentType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PaymentTypeProvider)
          .getPaymentType(
            transactionEntityManager,
            args.filter,
            organizationId
          );
      });
    },
    getPaymentTypes: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PaymentTypeProvider)
          .getPaymentTypes(
            transactionEntityManager,
            args.filter,
            organizationId
          );
      });
    }
  },

  Mutation: {
    addPaymentType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PaymentTypeProvider)
          .addPaymentType(transactionEntityManager, args.input, organizationId);
      });
    },
    removePaymentType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PaymentTypeProvider)
          .removePaymentType(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updatePaymentType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PaymentTypeProvider)
          .updatePaymentType(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    }
  }
};
export { resolvers };
