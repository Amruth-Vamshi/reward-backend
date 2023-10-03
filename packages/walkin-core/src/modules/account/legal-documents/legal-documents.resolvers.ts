import { Injector } from "@graphql-modules/di";
import { getManager, getConnection } from "typeorm";
import { LegalDocumentsProvider } from "./legal-documents.providers";
import { Organizations } from "../organization/organization.providers";
import { EntityExtendProvider } from "../../entityExtend/entityExtend.providers";

import { WCoreError } from "../../common/exceptions/index";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  SLUGTYPE,
  EXTEND_ENTITIES,
  CORE_WEBHOOK_EVENTS,
  STATUS,
  ENTITY_SEARCH_SYNC_TYPE,
} from "../../common/constants/constants";
import { StoreFormatProvider } from "../../productcatalog/storeformat/storeFormat.providers";
import { CatalogProvider } from "../../productcatalog/catalog/catalog.providers";
import { ChannelProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/channel/channel.providers";
import { IAuthResolverArgs } from "../auth-guard/auth-guard.interface";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
  callExternalServices,
  callLoadStoreSearch,
} from "../../common/utils/utils";
import { SortOptions } from "@walkinserver/walkin-platform-server/src/graphql/generated-models";
import { startStoreSyncJob } from "../../common/utils/digdagJobsUtil";
import { Users } from "../user/user.providers";

const resolvers = {
  Query: {
    getLegalOrganizationDocument: (
      { application, user }: IAuthResolverArgs,
      { id, organizationId },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          organizationId
        );
        return injector
          .get(LegalDocumentsProvider)
          .getLegalOrganizationDocument(transactionManager, {
            id,
            organizationId,
          });
      }),
    getLegalOrganizationDocuments: (
      { application, user }: IAuthResolverArgs,
      { organizationId },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          organizationId
        );
        return injector
          .get(LegalDocumentsProvider)
          .getLegalOrganizationDocuments(transactionManager, {
            organizationId,
          });
      }),
  },
  Mutation: {
    addLegalOrganizationDocument: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        const storeServiceArea = await injector
          .get(LegalDocumentsProvider)
          .addLegalOrganizationDocument(transactionManager, input);
        return storeServiceArea;
      });
    },
    updateLegalOrganizationDocument: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionManager) => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const storeServiceArea = await injector
          .get(LegalDocumentsProvider)
          .updateLegalOrganizationDocument(transactionManager, input);

        return storeServiceArea;
      });
    },
  },
};

export default resolvers;
