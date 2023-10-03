import { Injector } from "@graphql-modules/di";
import { getConnection } from "typeorm";

import { PartnerProvider } from "./partner.providers";
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
    getPartner: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PartnerProvider)
          .getPartner(transactionEntityManager, args.filter, organizationId);
      });
    },
    getPartners: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PartnerProvider)
          .getPartners(transactionEntityManager, args.filter, organizationId);
      });
    }
  },

  Mutation: {
    addPartner: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PartnerProvider)
          .addPartner(transactionEntityManager, args.input, organizationId);
      });
    },
    removePartner: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PartnerProvider)
          .removePartner(transactionEntityManager, args.input, organizationId);
      });
    },
    updatePartner: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(PartnerProvider)
          .updatePartner(transactionEntityManager, args.input, organizationId);
      });
    }
  }
};
export { resolvers };
