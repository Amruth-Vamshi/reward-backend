import { ModuleContext, Resolvers } from "@graphql-modules/core";
import { getManager } from "typeorm";
import { CollectionsProvider } from "./collections.provider";
import { setOrganizationToInput } from "../../../../walkin-core/src/modules/common/utils/utils";

export const resolvers: Resolvers = {
  Query: {
    fetchCollectionsWithFilters: (
      { application, user },
      { input={} },
      { injector }: ModuleContext
    ) => {   
      input = setOrganizationToInput(input, user, application);
      
      return getManager().transaction(async entityManager => {
        return injector
          .get(CollectionsProvider)
          .getCollectionsWithFilters(entityManager, injector, input ,input.pageOptions);
      });
    },
    getCollectionsByCampaignId: (
      { application, user },
      { campaignId },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(async entityManager => {
        return injector
          .get(CollectionsProvider)
          .getCollectionsByCampaignId(
            entityManager,
            injector,
            user.organization.id,
            campaignId
          );
      });
    },
    getCollectionByCollectionId: (
      { application, user },
      { collectionId },
      { injector }: ModuleContext
    ) => {
      let organizationId = user.organization.id;
      return getManager().transaction(async entityManager => {
        return injector
          .get(CollectionsProvider)
          .getCollectionsById(entityManager, collectionId, organizationId);
      });
    },

    getCollectionsByListOfCollectionIds: (
      { application, user },
      { collectionIdsList },
      { injector }: ModuleContext
    ) => {
      let input = { collectionIdsList };
      input = setOrganizationToInput(input, application, user);
    
      return getManager().transaction(async entityManager => {
        return injector
          .get(CollectionsProvider)
          .getCollectionsByIdsList(entityManager, input);
      });
    }
  },
  Mutation: {
    deleteCollections: (
      { application, user },
      { collectionId },
      { injector }: ModuleContext
    ) => {
      let input = { collectionId };
      input = setOrganizationToInput(input, user, application);
      return getManager().transaction(async entityManager => {
        return injector
          .get(CollectionsProvider)
          .deleteCollection(entityManager, injector, input);
      });
    },
    disableCollections: (
      { application, user },
      { collectionId },
      { injector }: ModuleContext
    ) => {
      let input = { collectionId };
      input = setOrganizationToInput(input, user, application);
      return getManager().transaction(async entityManager => {
        return injector
          .get(CollectionsProvider)
          .disableCollection(entityManager, injector, input);
      });
    },
    createCollections: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      input = setOrganizationToInput(input, user, application);
      
      return getManager().transaction(async transactionManager => {
        return injector
          .get(CollectionsProvider)
          .createCollections(transactionManager, injector, input );
      });
    },
    updateCollections: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      input = setOrganizationToInput(input, user, application);
      
      return getManager().transaction(async transactionManager => {
        return injector
          .get(CollectionsProvider)
          .updateCollections(transactionManager, injector, input );
      });
    }
  }
};
