import { Injector } from "@graphql-modules/di";
import { getManager, getConnection } from "typeorm";
import { StoreServiceAreaProvider } from "./store-service-area.providers";
import { Organizations } from "../organization/organization.providers";
import { EntityExtendProvider } from "../../entityExtend/entityExtend.providers";

import { WCoreError } from "../../common/exceptions/index";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  SLUGTYPE,
  EXTEND_ENTITIES,
  CORE_WEBHOOK_EVENTS,
  STATUS,
  ENTITY_SEARCH_SYNC_TYPE
} from "../../common/constants/constants";
import { StoreFormatProvider } from "../../productcatalog/storeformat/storeFormat.providers";
import { CatalogProvider } from "../../productcatalog/catalog/catalog.providers";
import { ChannelProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/channel/channel.providers";
import { IAuthResolverArgs } from "../auth-guard/auth-guard.interface";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
  callExternalServices,
  callLoadStoreSearch
} from "../../common/utils/utils";
import { SortOptions } from "@walkinserver/walkin-platform-server/src/graphql/generated-models";
import { startStoreSyncJob } from "../../common/utils/digdagJobsUtil";
import { Users } from "../user/user.providers";

const resolvers = {
  Query: {
    getStoreServiceArea: (
      { application, user }: IAuthResolverArgs,
      { id, organizationId },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          organizationId
        );
        return injector
          .get(StoreServiceAreaProvider)
          .getStoreServiceArea(transactionManager, { id });
      }),
    getStoreServiceAreas: (
      { application, user }: IAuthResolverArgs,
      { storeId, organizationId },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          organizationId
        );
        return injector
          .get(StoreServiceAreaProvider)
          .getStoreServiceAreas(transactionManager, { storeId });
      })
  },
  Mutation: {
    addStoreServiceArea: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        const storeServiceArea = await injector
          .get(StoreServiceAreaProvider)
          .addStoreServiceArea(transactionManager, input);
        callLoadStoreSearch(input.storeId);
        return storeServiceArea;
      });
    },
    updateStoreServiceArea: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const storeServiceArea = await injector
          .get(StoreServiceAreaProvider)
          .updateStoreServiceArea(transactionManager, input);

        // const storeId = storeServiceArea.store.id;
        // callLoadStoreSearch(storeId);

        return storeServiceArea;
      });
    },
    enableStoreServiceArea: (
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
        const storeServiceArea = await injector
          .get(StoreServiceAreaProvider)
          .enableStoreServiceArea(transactionManager, { id });

        return storeServiceArea;
      });
    },
    disableStoreServiceArea: (
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
        const storeServiceArea = await injector
          .get(StoreServiceAreaProvider)
          .disableStoreServiceArea(transactionManager, { id });

        return storeServiceArea;
      });
    }
  }
};

export default resolvers;
