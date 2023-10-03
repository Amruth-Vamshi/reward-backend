import { Injector } from "@graphql-modules/di";
import { getConnection } from "typeorm";

import { DeliveryTypeProvider } from "./deliveryType.providers";
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
    getDeliveryType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(DeliveryTypeProvider)
          .getDeliveryType(
            transactionEntityManager,
            args.filter,
            organizationId
          );
      });
    },
    getDeliveryTypes: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(DeliveryTypeProvider)
          .getDeliveryTypes(
            transactionEntityManager,
            args.filter,
            organizationId
          );
      });
    }
  },

  Mutation: {
    addDeliveryType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(DeliveryTypeProvider)
          .addDeliveryType(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    removeDeliveryType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(DeliveryTypeProvider)
          .removeDeliveryType(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updateDeliveryType: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(DeliveryTypeProvider)
          .updateDeliveryType(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    }
  }
};
export { resolvers };
