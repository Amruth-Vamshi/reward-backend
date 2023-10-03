import { Inject, Injector } from "@graphql-modules/di";
import { getManager, getConnection } from "typeorm";
import { Stores, StoreOpenTimingProvider } from "./store.providers";
import { Organizations } from "../../account/organization/organization.providers";
import { EntityExtendProvider } from "../../entityExtend/entityExtend.providers";

import { WCoreError } from "../../common/exceptions/index";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  SLUGTYPE,
  EXTEND_ENTITIES,
  CORE_WEBHOOK_EVENTS,
  STATUS,
  ENTITY_SEARCH_SYNC_TYPE,
  STORE_SERVICE_AREA_TYPE,
  DEFAULT_SERVICE_AREA_RADIUS,
  CACHING_KEYS
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
  sortOptionValueBySeq,
  getApolloClient
} from "../../common/utils/utils";
import { SortOptions } from "../../../../../walkin-platform-server/src/graphql/generated-models";
import { startStoreSyncJob } from "../../common/utils/digdagJobsUtil";
import { Users } from "../user/user.providers";
import { StoreServiceAreaProvider } from "../store-service-area/store-service-area.providers";
import { StoreInventory } from "../../../entity/StoreInventory";
import { StoreInventoryProvider } from "../../productcatalog/storeInventory/storeInventory.providers";
import { ProductRelationshipProvider } from "../../productcatalog/productRelationship/productRelationship.providers";
import { ProductTagProvider } from "../../productcatalog/productTag/productTag.providers";

import { OptionProvider } from "../../productcatalog/option/option.providers";
import { CategoryProvider } from "../../productcatalog/category/category.providers";
import { ProductProvider } from "../../productcatalog/product/product.providers";
import { PRODUCT_TYPE } from "../../common/constants";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import gql from "graphql-tag";
// import {
//   CATALOG_REPUBLISH_MESSAGE,
//   STORE_CATALOG_QUERY
// } from "@walkinserver/walkin-orderx/src/common/constants/constants";
const resolvers = {
  Query: {
    store: ({ user, application }, input, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input["organizationId"]
        );
        return injector
          .get(Stores)
          .getStorebyId(transactionManager, input.id, input["organizationId"]);
      });
    },

    storeByCode: ({ user, application }, args, { injector }) =>
      getConnection().transaction(async transactionManager => {
        let { input } = args;
        input = setOrganizationToInput(args, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        return injector
          .get(Stores)
          .getStorebyStoreCode(
            transactionManager,
            input.code,
            input.organizationId
          );
      }),

    stores: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;
        const pageOptions = args.pageOptions;
        const sortOptions = args.sortOptions;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(Stores)
          .getAllStores(transactionManager, pageOptions, sortOptions, input);
      });
    },

    // storeSearch: async (
    //   root,
    //   args,
    //   { injector }: { injector: Injector },
    //   info
    // ) => {
    //   return getManager().transaction(async (transactionalEntityManager) => {
    //     const organization = await injector
    //       .get(Organizations)
    //       .getOrganization(transactionalEntityManager, args.organizationId);

    //     if (
    //       organization === undefined ||
    //       organization.status === STATUS.INACTIVE
    //     ) {
    //       throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    //     }

    //     const inputSearchFields = args.filterValues.rules.map((rule) => {
    //       return rule.attributeName;
    //     });

    //     const orgCode = organization.code;
    //     const storeDefinition = await info.schema.getType("Query").getFields()
    //       .storeDefnition;
    //     const customerDefintionOutput = await storeDefinition.resolve(
    //       root,
    //       { organization_id: args.organization_id },
    //       { injector },
    //       info
    //     );

    //     if (customerDefintionOutput) {
    //       const customerDefintionOutputFields = customerDefintionOutput.columns;

    //       const searchKeys = customerDefintionOutputFields.map((field) => {
    //         return field.column_search_key;
    //       });
    //       inputSearchFields.forEach((fieldName) => {
    //         if (!searchKeys.includes(fieldName)) {
    //           throw new WCoreError(WCORE_ERRORS.INVALID_JSON_SCHEMA);
    //         }
    //       });
    //     }

    //     return injector
    //       .get(Stores)
    //       .storeSearch(orgCode, args.filterValues, args.pageNumber, args.sort);
    //   });
    // },

    storeDefnition: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organization_id);
        const columns = [];
        // FIX: at somepoint we can get these from backend using entity defnition and user Language preference
        columns.push({
          column_slug: "id",
          column_search_key: "id",
          column_label: "ID",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "code",
          column_search_key: "code",
          column_label: "Store Code",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "name",
          column_search_key: "name",
          column_label: "Name",
          column_type: SLUGTYPE.LONG_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "addressLine1",
          column_search_key: "addressLine1",
          column_label: "Address Line 1",
          column_type: SLUGTYPE.LONG_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "addressLine2",
          column_search_key: "addressLine2",
          column_label: "Address Line 2",
          column_type: SLUGTYPE.LONG_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "city",
          column_search_key: "city",
          column_label: "City",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "state",
          column_search_key: "state",
          column_label: "State",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "pinCode",
          column_search_key: "pinCode",
          column_label: "Pincode",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "country",
          column_search_key: "country",
          column_label: "Country",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "externalStoreId",
          column_search_key: "externalStoreId",
          column_label: "External Store ID",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "organization_id",
          column_search_key: "organization_id",
          column_label: "Organization Id",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "createdBy",
          column_search_key: "createdBy",
          column_label: "Created By",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "last_modified_by",
          column_search_key: "last_modified_by",
          column_label: "Last Modified By",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "created_time",
          column_search_key: "created_time",
          column_label: "Create Timestamp",
          column_type: SLUGTYPE.TIMESTAMP,
          searchable: true,
          extended_column: false
        });

        columns.push({
          column_slug: "last_modified_time",
          column_search_key: "last_modified_time",
          column_label: "Last Modified Timestamp",
          column_type: SLUGTYPE.TIMESTAMP,
          searchable: true,
          extended_column: false
        });

        const extendedEntity = await injector
          .get(EntityExtendProvider)
          .getEntityExtendByEntityName(
            transactionalEntityManager,
            org.id,
            EXTEND_ENTITIES.store
          );
        console.log("extendedEntity", extendedEntity);

        if (extendedEntity) {
          if (extendedEntity.fields) {
            extendedEntity.fields.forEach(c => {
              columns.push({
                column_slug: c.slug,
                column_search_key: c.slug,
                column_label: c.label,
                column_type: c.type,
                searchable: true,
                extended_column: true
              });
            });
          }
        }

        const storeDefnition = {};
        storeDefnition["columns"] = columns;
        storeDefnition["entityName"] = "store";
        const searchEntityName = "search_store_" + org["code"];
        storeDefnition["searchEntityName"] = searchEntityName;
        return storeDefnition;
      });
    },
    getStoreCatalog: (
      { user, application }: IAuthResolverArgs,
      { filter },
      { injector }
    ) => {
      return getConnection().transaction(async transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(Stores)
          .getStoreCatalog(transactionEntityManager, filter, organizationId);
      });
    },

    getStoreCatalogWithCategories: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }
    ) => {
      return getConnection().transaction(async transactionEntityManager => {
        let input = args;

        input = setOrganizationToInput(input, user, application);
        return injector
          .get(Stores)
          .getStoreCatalogWithCategories(transactionEntityManager, input);
      });
    },
    getPublishedStoreCatalogWithCategoriesFrom: async (
      { user, application }: IAuthResolverArgs,
      input
    ) => {
      input = setOrganizationToInput(input, user, application);
      await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        input.organizationId
      );
      const data = await getValueFromCache(
        `${CACHING_KEYS.PUBLISHED_CATALOG}_${input.organizationId}_${input.code}`
      );
      if (data) {
        return JSON.parse(data).getStoreCatalogWithCategories;
      } else return null;
    },

    // republishCatalog: async (
    //   { user, application }: IAuthResolverArgs,
    //   input,
    //   context
    // ) => {
    //   return getConnection().transaction(async transactionEntityManager => {
    //     input = setOrganizationToInput(input, user, application);

    //     const { organizationId } = input;
    //     await isUserOrAppAuthorizedToWorkOnOrganization(
    //       user,
    //       application,
    //       organizationId
    //     );
    //     const storeCodes = input.codes;

    //     storeCodes.forEach(async storeCode => {
    //       await removeValueFromCache([
    //         `${CACHING_KEYS.PUBLISHED_CATALOG}_${organizationId}_${storeCode}`
    //       ]);
    //     });
    //     const catalogMap = {};
    //     const storeDetails = await context.injector
    //       .get(Stores)
    //       .getStorebyCodes(
    //         transactionEntityManager,
    //         storeCodes,
    //         organizationId
    //       );
    //     storeDetails.forEach(storeDetail => {
    //       const catalogId = storeDetail.catalog.id;
    //       const storeCode = storeDetail.code;
    //       if (catalogMap.hasOwnProperty(catalogId)) {
    //         catalogMap[catalogId].push(storeCode);
    //       } else {
    //         catalogMap[catalogId] = [storeCode];
    //       }
    //     });

    //     const catalogIds: string[] = Object.keys(catalogMap);
    //     catalogIds.forEach(catalogId => {
    //       new Promise(async () => {
    //         const storeCode = catalogMap[catalogId].pop();
    //         const token = context.token;
    //         const ORDERX_GRAPHQL_URL =
    //           process.env.PEPPO_SERVICE_URL + "/graphql";

    //         const apolloClient = getApolloClient(ORDERX_GRAPHQL_URL);
    //         const data = await apolloClient.query({
    //           query: gql`
    //             ${STORE_CATALOG_QUERY}
    //           `,
    //           variables: {
    //             storeCode: storeCode
    //           },
    //           context: {
    //             headers: {
    //               Authorization: "Bearer " + token
    //             }
    //           }
    //         });

    //         const pendingStoreCodes = catalogMap[catalogId];
    //         pendingStoreCodes.forEach(storeCode => {
    //           const key = `${CACHING_KEYS.PUBLISHED_CATALOG}_${organizationId}_${storeCode}`;
    //           setValueToCache(key, JSON.stringify(data.data));
    //         });
    //       });
    //     });

    //     return CATALOG_REPUBLISH_MESSAGE;
    //   });
    // },
    storeOpenTiming: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(StoreOpenTimingProvider)
          .getStoreOpenTiming(transactionManager, input);
      });
    },

    storeOpenTimings: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(StoreOpenTimingProvider)
          .getStoreOpenTimings(
            transactionManager,
            input,
            args.pageOptions,
            args.sortOptions
          );
      });
    },
    getStaffMembers: (
      { application, user }: IAuthResolverArgs,
      { storeId, pageOptions, sortOptions, staffRole },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(Stores)
          .getStaffMembers(
            transactionManager,
            storeId,
            organizationId,
            pageOptions,
            sortOptions,
            staffRole
          );
      }),
    getStaffMember: (
      { application, user }: IAuthResolverArgs,
      { id },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(Stores)
          .getStaffMember(transactionManager, id, organizationId);
      }),

    getStoreDeliverArea: (
      { application, user }: IAuthResolverArgs,
      { storeId },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(Stores)
          .getStoreDeliverArea(transactionManager, storeId, organizationId);
      }),
    getStoreStaffBusyStatus: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(Stores)
          .getStoreStaffStatus(transactionManager, input);
      })
  },
  Mutation: {
    updateStore: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        input = setOrganizationToInput(input, user, application);
        // if (input.storeFormatCode) {
        //   const storeFormat = await injector
        //     .get(StoreFormatProvider)
        //     .getStoreFormatByCode(transactionManager, {
        //       organizationId: input.organizationId,
        //       storeFormatCode: input.storeFormatCode
        //     });
        //   if (
        //     storeFormat === undefined ||
        //     storeFormat.status === STATUS.INACTIVE
        //   ) {
        //     throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
        //   }
        //   input.storeFormats = [storeFormat];
        // }
        // if (input.channelCodes) {
        //   const channels = [];
        //   for (const channelCode of input.channelCodes) {
        //     const channel = await injector.get(ChannelProvider).getChannel(
        //       transactionManager,
        //       {
        //         channelCode
        //       },
        //       input.organizationId
        //     );
        //     if (channel || channel.status === STATUS.ACTIVE) {
        //       channels.push(channel);
        //     }
        //   }

        //   if (channels.length > 0) {
        //     input.channels = [...channels];
        //   }
        // }

        // if (input.catalogCode) {
        //   const catalog = await injector
        //     .get(CatalogProvider)
        //     .findCatalogByCode(transactionManager, {
        //       organizationId: input.organizationId,
        //       catalogCode: input.catalogCode
        //     });

        //   if (!catalog || catalog.status === STATUS.INACTIVE) {
        //     throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
        //   }
        //   input.catalog = catalog;
        // }
        const updatedStore = await injector
          .get(Stores)
          .updateStore(transactionManager, input);
        // const storeId = updatedStore.id;
        // callLoadStoreSearch(storeId);
        return updatedStore;
      });
    },
    createStore: (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        // const storeFormat = await injector
        //   .get(StoreFormatProvider)
        //   .getStoreFormatByCode(transactionManager, {
        //     organizationId: input.organizationId,
        //     storeFormatCode: input.storeFormatCode
        //   });
        // if (
        //   storeFormat === undefined ||
        //   storeFormat.status === STATUS.INACTIVE
        // ) {
        //   throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
        // }

        // input.storeFormats = [storeFormat];

        // const catalog = await injector
        //   .get(CatalogProvider)
        //   .findCatalogByCode(transactionManager, {
        //     organizationId: input.organizationId,
        //     catalogCode: input.catalogCode
        //   });

        // if (!catalog || catalog.status === STATUS.INACTIVE) {
        //   throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
        // }
        // input.catalog = catalog;
        // const channels = [];
        // for (const channelCode of input.channelCodes) {
        //   const channel = await injector.get(ChannelProvider).getChannel(
        //     transactionManager,
        //     {
        //       channelCode
        //     },
        //     input.organizationId
        //   );
        //   if (channel || channel.status === STATUS.ACTIVE) {
        //     channels.push(channel);
        //   }
        // }

        // if (channels.length > 0) {
        //   input.channels = [...channels];
        // }

        input = setOrganizationToInput(input, user, application);
        const createdStore = await injector
          .get(Stores)
          .createStore(transactionManager, input);
        // if (user) {
        //   const linkStoreToUser = await injector
        //     .get(Users)
        //     .linkUserToStore(transactionManager, {
        //       userId: user.id,
        //       storeId: createdStore.id,
        //       organizationId: input.organizationId
        //     });
        // }
        // const serviceAreaValue = input.serviceAreaValue
        //   ? input.serviceAreaValue
        //   : DEFAULT_SERVICE_AREA_RADIUS;
        // const serviceAreaType = input.serviceAreaType
        //   ? input.serviceAreaType
        //   : STORE_SERVICE_AREA_TYPE.RADIUS;
        // await injector
        //   .get(StoreServiceAreaProvider)
        //   .addStoreServiceArea(transactionManager, {
        //     storeId: createdStore.id,
        //     organizationId: input.organizationId,
        //     serviceAreaValue,
        //     serviceAreaType
        //   });

        // const storeId = createdStore.id;
        // callLoadStoreSearch(storeId);
        injector
          .get(StoreInventoryProvider)
          .addStoreInventoryForAllProductsAsync({
            storeId: createdStore.id,
            organizationId: input.organizationId
          });
        return createdStore;
      });
    },
    createStoreAdminLevel: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        return injector
          .get(Stores)
          .createStoreAdminLevel(transactionManager, input);
      });
    },
    updateStoreAdminLevel: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        return injector
          .get(Stores)
          .updateStoreAdminLevel(transactionManager, input);
      });
    },
    updateStoreByCode: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        // if (input.catalogCode) {
        //   const catalog = await injector
        //     .get(CatalogProvider)
        //     .findCatalogByCode(transactionManager, {
        //       organizationId: input.organizationId,
        //       catalogCode: input.catalogCode
        //     });

        //   if (!catalog || catalog.status === STATUS.INACTIVE) {
        //     throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
        //   }
        //   input.catalog = catalog;
        // }
        const store = injector
          .get(Stores)
          .updateStoreByCode(transactionManager, input);
        // callLoadStoreSearch(store.id);
        return store;
      });
    },
    addStoreOpenTiming: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const storeOpeningTime = await injector
          .get(StoreOpenTimingProvider)
          .addStoreOpenTiming(transactionManager, input);
        const storeId = input.storeId;
        callLoadStoreSearch(storeId);
        return storeOpeningTime;
      });
    },
    addBulkStoreOpenTiming: (
      { user, application },
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const storeOpeningTime = await injector
          .get(StoreOpenTimingProvider)
          .addBulkStoreOpeningTimings(transactionManager, input);
        const storeId = input.storeId;
        callLoadStoreSearch(storeId);
        return storeOpeningTime;
      });
    },
    removeStoreOpenTiming: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const storeOpeningTime = await injector
          .get(StoreOpenTimingProvider)
          .removeStoreOpenTiming(transactionManager, input);
        const storeId = input.storeId;
        callLoadStoreSearch(storeId);
        return storeOpeningTime;
      });
    },
    removeStoreOpenTimings: (
      { user, application },
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const storeOpeningTime = await injector
          .get(StoreOpenTimingProvider)
          .removeStoreOpenTimings(transactionManager, input);
        const storeId = input.storeId;
        callLoadStoreSearch(storeId);
        return storeOpeningTime;
      });
    },
    enableStore: (
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
        const enabledStore = await injector
          .get(Stores)
          .enableStore(transactionManager, input);
        const storeId = enabledStore.id;
        callLoadStoreSearch(storeId);
        return enabledStore;
      });
    },
    disableStore: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        const disabledStore = await injector
          .get(Stores)
          .disableStore(transactionManager, input);
        const storeId = disabledStore.id;
        callLoadStoreSearch(storeId);
        return disabledStore;
      }),
    addStoreDelivery: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        const storeDeliveryArea = await injector
          .get(Stores)
          .addStoreDelivery(transactionManager, input);
        const storeId = input.storeId;
        callLoadStoreSearch(storeId);
        return storeDeliveryArea;
      }),
    updateStoreDelivery: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        const storeDeliveryArea = await injector
          .get(Stores)
          .updateStoreDelivery(transactionManager, input);
        // const storeId = storeDeliveryArea.store.id;
        // callLoadStoreSearch(storeId);
        return storeDeliveryArea;
      }),
    removeStoreDelivery: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        const removedStoreDeliveryArea = await injector
          .get(Stores)
          .removeStoreDelivery(transactionManager, input);
        const storeId = input.storeId;
        callLoadStoreSearch(storeId);
        return removedStoreDeliveryArea;
      }),
    addStaff: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector.get(Stores).addStaff(transactionManager, input);
      }),
    addBulkStaffMembers: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(Stores)
          .addBulkStaffMembers(transactionManager, input, organizationId);
      }),
    editStaff: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector.get(Stores).editStaff(transactionManager, input);
      }),
    removeStaff: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector.get(Stores).removeStaff(transactionManager, input);
      }),

    activeStaffMamber: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector.get(Stores).activeStaff(transactionManager, input);
      }),
    inactiveStaffMember: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector.get(Stores).inactiveStaff(transactionManager, input);
      }),
    addStaffMemberToStore: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(Stores)
          .addStaffMemberToStore(transactionManager, input);
      }),
    addStaffMembersToStore: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        const storeStaffMembers = await injector
          .get(Stores)
          .addStaffMembersToStore(transactionManager, input);
        const { storeId } = input;
        callLoadStoreSearch(storeId);
        return storeStaffMembers;
      }),

    markStaffBusyStatus: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        );
        return injector
          .get(Stores)
          .markStaffBusyStatus(transactionManager, input, organizationId);
      }),
    makeAllStoreStaffBusyStatus: (
      { application, user }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        const { storeId } = input;
        const members = await injector
          .get(Stores)
          .makeAllStaffMemberStatus(transactionManager, input);
        callLoadStoreSearch(storeId);
        return members;
      })
  },
  ProductCustom: {
    productRelationShip: async (
      product,
      args,
      { productRelationshipLoader }
    ) => {
      return productRelationshipLoader.load(product);
    },
    tags: async (product, args, { productTagsLoader }) => {
      return productTagsLoader.load(product);
    },
    options: async (product, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionEntityManager => {
        const { id, productType } = product;
        var options = [];
        if (productType == PRODUCT_TYPE.VARIANT) {
          options = await injector
            .get(OptionProvider)
            .optionValueByProductId(transactionEntityManager, id);
        } else {
          options = await injector
            .get(OptionProvider)
            .getOptionsByProductId(transactionEntityManager, id);
        }

        for (const optionDetails of options) {
          const optionValues = optionDetails.optionValues;
          sortOptionValueBySeq(optionValues);
        }
        return options;
      });
    },
    categories: async (product, args, { productCategoryLoader }) => {
      return productCategoryLoader.load(product);
    },
    productPrices: async (product, args, { productValuesLoader }) => {
      return productValuesLoader.load(product);
    },
    menuTimings: async (product, args, context) => {
      // set organizationId as part of category as it is needed to fetch menu timings in data loader
      product["organizationId"] = context.organizationId;
      product["injector"] = context.injector;
      return context.productMenuTimingLoader.load(product);
    },
    inventoryAvailable: async (
      product,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionEntityManager => {
        const { id, store } = product;
        const storeInventoryData = await injector
          .get(StoreInventoryProvider)
          .getInventoryAvailableDetails(transactionEntityManager, id, store.id);
        if (storeInventoryData) {
          return storeInventoryData.inventoryAvailable;
        }
        return null;
      });
    }
  },
  CategoriesWithChildren: {
    menuTimings: async (category, args, context) => {
      // set organizationId as part of category as it is needed to fetch menu timings in data loader
      category["organizationId"] = context.organizationId;
      // injector is needed to access the menutimings provider functions
      category["injector"] = context.injector;
      return context.categoryMenuTimingLoader.load(category);
    }
  }
};

export default resolvers;
