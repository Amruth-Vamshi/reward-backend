import { ModuleContext, Resolvers } from "@graphql-modules/core";
import { Customer } from "@walkinserver/walkin-core/src/entity";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { getManager, TransactionManager } from "typeorm";
import { setOrganizationToInput } from "../../../../walkin-core/src/modules/common/utils/utils";
import { CollectionsItemsProvider } from "./collection-items.provider";
export const resolvers: Resolvers = {
  Query: {
    collectionItem: (
      { user, application },
      input,
      { injector }: ModuleContext,
      info
    ) => {
      return getManager().transaction(transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(CollectionsItemsProvider)
          .getCollectionItemsById(
            transactionManager,
            input.collectionItemId,
            input.organizationId
          );
      });
    },
    collectionItems: (
      { user, application },
      { filter },
      { injector }: ModuleContext,
      info
    ) => {
      return getManager().transaction(transactionManager => {
        filter = setOrganizationToInput(filter, user, application);
        return injector
          .get(CollectionsItemsProvider)
          .getCollectionItems(transactionManager, injector, filter);
      });
    }
  },
  Mutation: {
    createCollectionItems: async (
      { user, application },
      { input },
      { injector }: ModuleContext,
      info
    ) => {
      let collectionItem = await getManager().transaction(
        transactionManager => {
          input = setOrganizationToInput(input, user, application);
          return injector
            .get(CollectionsItemsProvider)
            .createCollectionItems(transactionManager, injector, input);
        }
      );
      let createdCustomerLoyaltyAndCustomerLoyaltyPrograms;
      if (collectionItem.collections.entity === "CUSTOMER") {
        let customer;
        if (input.itemId) {
          customer = await Customer.findOne({
            where: {
              externalCustomerId: input.itemId
            }
          });
        } else {
          let where = {externalCustomerId: input.itemDetails.externalCustomerId}
          if(input.itemDetails.phoneNumber)
            where['phoneNumber']=input.itemDetails.phoneNumber
          if(input.itemDetails.customerIdentifier)
            where['customerIdentifier']=input.itemDetails.customerIdentifier
          customer = await Customer.findOne({
            where: where
          });
        }
        if (!customer) {
          throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
        }
        let input2 = {
          organizationId: input.organizationId,
          collectionsId: input.collectionsId,
          externalCustomerId: customer.externalCustomerId
        };
        if(customer.phoneNumber)
          input2['phoneNumber']=customer.phoneNumber
        if(customer.customerIdentifier)
          input2['customerIdentifier']=customer.customerIdentifier
        if (customer) {
          createdCustomerLoyaltyAndCustomerLoyaltyPrograms = await getManager().transaction(
            transactionManager => {
              return injector
                .get(CollectionsItemsProvider)
                .createCustomerLoyaltyAndCustomerLoyaltyProgram(
                  transactionManager,
                  injector,
                  input2
                );
            }
          );
        } else {
          createdCustomerLoyaltyAndCustomerLoyaltyPrograms = null;
        }
      }
      return {
        collectionItem,
        createdCustomerLoyaltyAndCustomerLoyaltyPrograms
      };
    },
    removeCollectionItems: (
      { user, application },
      { input },
      { injector }: ModuleContext,
      info
    ) => {
      return getManager().transaction(transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(CollectionsItemsProvider)
          .removeCollectionItems(transactionManager, injector, input);
      });
    }
  }
};
