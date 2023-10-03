import { Inject, Injectable } from "@graphql-modules/di";
import { CACHING_KEYS } from "@walkinserver/walkin-core/src/modules/common/constants";
import { clearKeysByPattern } from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
import { indexOf, isEmpty } from "lodash";
import { Stores } from "../../../../walkin-core/src/modules/account/store/store.providers";
import { WCORE_ERRORS } from "../../../../walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "../../../../walkin-core/src/modules/common/exceptions";
import { CustomerProvider } from "../../../../walkin-core/src/modules/customer/customer.providers";
import { ProductProvider } from "../../../../walkin-core/src/modules/productcatalog/product/product.providers";
import { LoyaltyCard } from "../../entity";
import { CollectionsItems } from "../../entity/collections-items";
import { CollectionsProvider } from "../collections/collections.provider";
import {
  COLLECTIONS_ENTITY_TYPE,
  ENTITY_NAME_MAPPING,
  ENTITY_QUERY_FIELD_MAPPING
} from "../common/constants/constant";
import { CustomerLoyaltyProgramProvider } from "../customer-loyalty-program/customer-loyalty-program.provider";
import { CustomerLoyaltyProvider } from "../customer-loyalty/customer-loyalty.provider";
@Injectable()
export class CollectionsItemsProvider {
  constructor(
    @Inject(CustomerProvider)
    private customerProvider: CustomerProvider,
    @Inject(ProductProvider)
    private productProvider: ProductProvider,
    @Inject(Stores)
    private storeProvider: Stores
  ) {}

  public async getCollectionItems(transactionManager, injector, input) {
    const { itemId, collectionsId, organizationId } = input;
    let whereClause = "organization.id =:organizationId";
    let whereClauseVariables = {
      organizationId
    };

    if (itemId) {
      whereClause += " AND collectionsItems.itemId =:itemId";
      whereClauseVariables["itemId"] = itemId;
    }

    if (collectionsId) {
      whereClause += " AND collections.id =:collectionsId";
      whereClauseVariables["collectionsId"] = collectionsId;
    }

    const collectionItems = await transactionManager
      .getRepository(CollectionsItems)
      .createQueryBuilder("collectionsItems")
      .leftJoinAndSelect("collectionsItems.collections", "collections")
      .leftJoinAndSelect("collections.organization", "organization")
      .where(whereClause, whereClauseVariables)
      .getMany();
    return collectionItems;
  }

  public async getCollectionItemsById(
    transactionManager,
    collectionItemsId,
    organizationId
  ) {
    const collectionItems = await transactionManager
      .getRepository(CollectionsItems)
      .createQueryBuilder("collectionsItems")
      .leftJoinAndSelect("collectionsItems.collections", "collections")
      .leftJoinAndSelect("collections.organization", "organization")
      .where(
        "collectionsItems.id =:collectionItemsId AND organization.id =:organizationId",
        {
          collectionItemsId,
          organizationId
        }
      )
      .getOne();
    return collectionItems;
  }

  public async createCollectionItems(transactionManager, injector, input) {
    const { organizationId, collectionsId, itemDetails = {} } = input;
    let { itemId } = input;
    let createItemInput = { ...itemDetails };
    const collections = await injector
      .get(CollectionsProvider)
      .getCollectionsById(transactionManager, collectionsId, organizationId);
    if (!collections) {
      throw new WCoreError(WCORE_ERRORS.COLLECTIONS_NOT_FOUND);
    }

    if (collections.ruleSet != null || collections.ruleSet != undefined) {
      throw new WCoreError(
        WCORE_ERRORS.CAN_NOT_CREATE_COLLECTION_ITEM_FOR_DYNAMIC_COLLECTION
      );
    }

    const entityType = collections.entity;
    const entity = ENTITY_NAME_MAPPING[entityType];
    let item;
    if (itemId) {
      const fieldName = ENTITY_QUERY_FIELD_MAPPING[entityType];
      const whereCondition = {
        [fieldName]: itemId,
        organization: {
          id: organizationId
        }
      };
      item = await transactionManager.findOne(entity, {
        where: whereCondition
      });
    } else {
      item = await transactionManager.findOne(entity, {
        where: createItemInput
      });
    }

    if (item) {
      const existingCollectionsItems = await transactionManager.findOne(
        CollectionsItems,
        {
          where: {
            itemId: item.id,
            collections: {
              id: collectionsId
            }
          }
        }
      );
      if (existingCollectionsItems) {
        throw new WCoreError(WCORE_ERRORS.COLLECTION_ITEM_ALREADY_EXISTS);
      } else {
        itemId = item.id;
      }
    } else {
      // Create item if item not present
      if (isEmpty(itemDetails)) {
        throw new WCoreError(WCORE_ERRORS.ITEM_DETAILS_CANNOT_BE_EMPTY);
      }

      createItemInput["organization"] = organizationId;
      createItemInput["organizationId"] = organizationId;
      if (entityType == COLLECTIONS_ENTITY_TYPE.CUSTOMER) {
        const customer = await this.customerProvider.createOrUpdateCustomer(
          transactionManager,
          createItemInput
        );
        itemId = customer.id;
      } else if (entityType == COLLECTIONS_ENTITY_TYPE.PRODUCT) {
        const product = await this.productProvider.createProduct(
          transactionManager,
          createItemInput
        );
        itemId = product.id;
      } else if (entityType == COLLECTIONS_ENTITY_TYPE.STORE) {
        const store = await this.storeProvider.createStore(
          transactionManager,
          createItemInput
        );
        itemId = store.id;
      }
    }

    const collectionItemInput = {
      itemId,
      collections: collectionsId
    };

    const collectionItemsSchema = await transactionManager.create(
      CollectionsItems,
      collectionItemInput
    );
    const savedCollectionItem = await transactionManager.save(
      collectionItemsSchema
    );
    return transactionManager.findOne(CollectionsItems, {
      where: {
        id: savedCollectionItem.id
      },
      relations: ["collections"]
    });
  }

  public async removeCollectionItems(transactionManager, injector, input) {
    const { collectionItemsId, organizationId } = input;
    const collectionItem = await this.getCollectionItemsById(
      transactionManager,
      collectionItemsId,
      organizationId
    );
    if (!collectionItem) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_ITEM_NOT_FOUND);
    }
    clearKeysByPattern(`${CACHING_KEYS.COLLECTIONS_ITEMS}_*`);
    return transactionManager.remove(collectionItem);
  }

  public async createCustomerLoyaltyAndCustomerLoyaltyProgram(
    transactionManager,
    injector,
    input
  ) {
    let {
      collectionsId,
      organizationId,
      externalCustomerId,
      phoneNumber,
      customerIdentifier
    } = input;
    let createdCustomerLoyalty: any,
      createdCustomerLoyaltyPrograms = [];

    const queryRunner = await transactionManager.connection.createQueryRunner();
    let loyaltyProgramDetails = await queryRunner.manager.query(
      `SELECT id, experiment_code AS experimentCode, loyalty_program_config_id AS configId FROM loyalty_program_detail WHERE organization_id = '${organizationId}' AND JSON_CONTAINS(collection_ids, '"${collectionsId}"', '$')`
    );
    if (loyaltyProgramDetails.length > 0) {
      for (let index = 0; index < loyaltyProgramDetails.length; index++) {
        let loyaltyProgramConfigs = await queryRunner.manager.query(
          `SELECT code AS configCode, loyalty_card_id AS loyaltyCardId FROM loyalty_program_config WHERE id = '${loyaltyProgramDetails[index].configId}' and organization_id= '${organizationId}' `
        );
        for (let index2 = 0; index2 < loyaltyProgramConfigs.length; index2++) {
          let loyaltyCard = await queryRunner.manager.query(
            `Select code FROM loyalty_card WHERE id='${loyaltyProgramConfigs[index2].loyaltyCardId}'`
          );
          let customerLoyalty = await queryRunner.manager.query(
            `SELECT * FROM customer_loyalty where customer_id = (SELECT id FROM customer WHERE externalCustomerId = '${externalCustomerId}')`
          );
          let input3;
          if (customerLoyalty.length < 1) {
            createdCustomerLoyalty = await injector
              .get(CustomerLoyaltyProvider)
              .createCustomerLoyalty(transactionManager, injector, {
                loyaltyCardCode: loyaltyCard.code,
                externalCustomerId,
                organizationId,
                phoneNumber,
                customerIdentifier
              });
            input3 = {
              customerLoyaltyId: createdCustomerLoyalty.id,
              loyaltyExperimentCode:
                loyaltyProgramDetails[index].experimentCode,
              loyaltyProgramCode: loyaltyProgramConfigs[index2].configCode,
              status: "ACTIVE"
            };
          } else {
            input3 = {
              customerLoyaltyId: customerLoyalty[0].id,
              loyaltyExperimentCode:
                loyaltyProgramDetails[index].experimentCode,
              loyaltyProgramCode: loyaltyProgramConfigs[index2].configCode,
              status: "ACTIVE"
            };
          }
          let customerLoyaltyProgram = await injector
            .get(CustomerLoyaltyProgramProvider)
            .createCustomerLoyaltyProgram(transactionManager, input3);
          createdCustomerLoyaltyPrograms.push(customerLoyaltyProgram);
        }
      }
    }
    await queryRunner.release();
    return {
      createdCustomerLoyalty,
      createdCustomerLoyaltyPrograms
    };
  }
}
