import { Injectable } from "@graphql-modules/di";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { EntityManager, IsNull, In } from "typeorm";
import { Collections } from "../../entity/collections";
import {
  CACHING_KEYS,
  STATUS,
  ENTITY_NAME,
  COMPARISON_TYPE
} from "../../../../walkin-core/src/modules/common/constants";
import {
  isValidString,
  updateEntity,
  validateCollectionsEntity,
  validateStatus,
  hasSqlInjectionCharacters,
  validateCollectionType,
  retrievePaginationValues,
  addMultipleEntitiesToRespectiveCollection,
  getPaginationInfoOnly
} from "../../../../walkin-core/src/modules/common/utils/utils";
import { validationDecorator } from "../../../../walkin-core/src/modules/common/validations/Validations";
import { Campaign } from "../../entity";
import { Organization, RuleSet } from "../../../../walkin-core/src/entity";
import { clearKeysByPattern } from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";

@Injectable()
export class CollectionsProvider {

  public async getCollectionsWithFilters(
    entityManager: EntityManager,
    injector,
    input,
    pageOptions?
  ): Promise<Object> {
    pageOptions = pageOptions || {};

    try {
      const { campaignId, status, entity ,name ,type} = input;

      const {skip, take} = retrievePaginationValues(pageOptions);

      let whereConditionCollection = ` where co.organization_id = "${input.organizationId}" `

      if (type){

        if(!validateCollectionType(type)){
          throw new WCoreError(WCORE_ERRORS.INVALID_COLLECTIONS_TYPE);
        }
        
        if (type === "STATIC") {
          whereConditionCollection += ` and co.rule_set_id IS NULL `;
        } else if (type === "DYNAMIC") {
          whereConditionCollection += ` and co.rule_set_id IS NOT NULL `;
        }        
        
      }
      
      if (name){
        
        if(!isValidString(name) || hasSqlInjectionCharacters(ENTITY_NAME.COLLECTION, COMPARISON_TYPE.LIKE, name))
        {
          throw new WCoreError(WCORE_ERRORS.INVALID_COLLECTIONS_NAME);
        }
        
        let collectionName = name.trim();
        whereConditionCollection += ` and co.name LIKE "${collectionName}%" `;
      }

      if (status) {
        const validStatus = await validateStatus(status);
        if (!validStatus) {
          throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
        }
        whereConditionCollection +=` and co.status="${status}" `;
      }
      
      if (input.organizationId) {
        const organization = await entityManager.findOne(Organization, {
          id: input.organizationId
        });
        if (!organization) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }
      } else {
        throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
      }

      if (campaignId) {
        const campaign = await entityManager.findOne(Campaign, {
          id: campaignId
        });
        
        if (!campaign) {
          throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
        }
        whereConditionCollection += ` and co.campaign_id = "${campaignId}" `;
      }
      
      if (entity) {
        const validEntity = validateCollectionsEntity(entity);
        if (!validEntity) {
          throw new WCoreError(WCORE_ERRORS.INVALID_ENTITY_TYPE);
        }
        whereConditionCollection += ` and co.entity = "${entity}" `;
      }

      const totalCountRetrievalQuery = `SELECT COUNT(*) as totalCount FROM collections co ${whereConditionCollection}`;

      const resultTotalCount = await entityManager.query(totalCountRetrievalQuery);

      const totalCount = Number(resultTotalCount[0].totalCount);
      
      const collectionsRetrievalQuery = `
      SELECT
      co.id,
      co.name,
      co.description,
      co.entity,
      co.status,
      co.rule_set_id,
      IF(rs.id IS NOT NULL,JSON_OBJECT(
          'id', rs.id,
          'name', rs.name,
          'description', rs.description
      ),NULL) AS rule_set,
      IF(s.id IS NOT NULL, JSON_OBJECT(
          'id', s.id,
          'name', s.name,
          'code', s.code,
          'country', s.country,
          'status', s.status
      ),NULL) AS STORE_ENTITY_INFORMATION,
      IF(cu.id IS NOT NULL,JSON_OBJECT(
          'id', cu.id,
          'firstName', cu.firstName,
          'lastName', cu.lastName,
          'gender', cu.gender,
          'email', cu.email,
          'phoneNumber', cu.phoneNumber
      ),NULL) AS CUSTOMER_ENTITY_INFORMATION,
      IF(p.id IS NOT NULL,JSON_OBJECT(
          'id', p.id,
          'name', p.name,
          'code', p.code,
          'description', p.description,
          'status', p.status
      ),NULL) AS PRODUCT_ENTITY_INFORMATION,
      IF(ca.id IS NOT NULL, JSON_OBJECT(
          'id', ca.id,
          'name', ca.name,
          'description', ca.description,
          'campaignType', ca.campaignType,
          'campaignTriggerType', ca.campaignTriggerType,
          'loyalty_program_detail_id', ca.loyalty_program_detail_id
      ) ,NULL) AS campaign
      FROM (
        SELECT
          id,
          name,
          description,
          entity,
          status,
          rule_set_id,
          organization_id,
          campaign_id

        FROM
          collections co
         
          ${whereConditionCollection}
          
          LIMIT
          ${take}
          
          OFFSET
          ${skip}
      ) AS co
      LEFT JOIN campaign AS ca ON co.campaign_id = ca.id
      LEFT JOIN rule_set AS rs ON co.rule_set_id = rs.id
      LEFT JOIN collections_items AS ci ON co.id = ci.collections_id
      LEFT JOIN store AS s ON co.rule_set_id IS NULL AND co.entity = 'STORE' AND ci.item_id = s.id
      LEFT JOIN customer AS cu ON  co.rule_set_id IS NULL AND co.entity = 'CUSTOMER' AND ci.item_id = cu.id
      LEFT JOIN product AS p ON co.rule_set_id IS NULL AND co.entity = 'PRODUCT'  AND ci.item_id = p.id
     `;
                  
      const collections = await entityManager.query(collectionsRetrievalQuery);
      
      const { results } = addMultipleEntitiesToRespectiveCollection(collections);
      
      const paginationInfo = getPaginationInfoOnly(pageOptions, totalCount);
      
      return {
        data:results,
        count:results.length,
        paginationInfo,
      }

    } catch (error) {
      throw error;
    }
  }

  public async getCollectionsByCampaignId(
    entityManager: EntityManager,
    injector,
    organizationId,
    campaignId
  ): Promise<Object> {
    try {
      let collections: any;
      if (campaignId) {
        let campaign = await entityManager.findOne(Campaign, {
          id: campaignId
        });
        if (!campaign) {
          throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
        }
        collections = await entityManager.find(Collections, {
          where: {
            organization: organizationId,
            campaignId: campaignId
          },
          relations: ["organization", "campaign"]
        });
      }
      if (collections.length == 0) {
        throw new WCoreError(WCORE_ERRORS.COLLECTIONS_NOT_FOUND);
      }
      return {
        data: collections,
        count: collections.length
      };
    } catch (error) {
      throw error;
    }
  }

  public async deleteCollection(entityManager: EntityManager, injector, input) {
    try {
      let { organizationId, collectionId } = input;
      const toBeDeleted = await injector
        .get(CollectionsProvider)
        .getCollectionsById(entityManager, collectionId, organizationId);

      if (toBeDeleted != undefined && toBeDeleted != null) {
        let queryRunner = await entityManager.connection.createQueryRunner();
        await queryRunner.manager.query(
          `DELETE FROM collections_items WHERE collections_id='${collectionId}'`
        );
        let deleted = await entityManager.remove(toBeDeleted);
        deleted.id = collectionId;
        clearKeysByPattern(`${CACHING_KEYS.COLLECTIONS}_*`);
        return deleted;
      } else {
        throw new WCoreError(WCORE_ERRORS.COLLECTIONS_NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }

  public async disableCollection(
    entityManager: EntityManager,
    injector,
    input
  ) {
    try {
      let { organizationId, collectionId } = input;
      let queryRunner = await entityManager.connection.createQueryRunner();
      let collection = await queryRunner.manager.query(
        `SELECT * FROM collections WHERE organization_id='${organizationId}' AND id='${collectionId}'`
      );
      if (collection.length != 1) {
        throw new WCoreError(WCORE_ERRORS.COLLECTIONS_NOT_FOUND);
      }
      await queryRunner.manager.query(
        `UPDATE collections SET status='INACTIVE' WHERE organization_id='${organizationId}' AND id='${collectionId}'`
      );
      clearKeysByPattern(`${CACHING_KEYS.COLLECTIONS}_*`);
      await queryRunner.release();
      return injector
        .get(CollectionsProvider)
        .getCollectionsById(entityManager, collectionId, organizationId);
    } catch (error) {
      throw error;
    }
  }

  public async getCollectionsById(
    transactionManager,
    collectionsId,
    organizationId
  ) {
    const existingCollections = await transactionManager.findOne(Collections, {
      where: [
        { id: collectionsId, organization: organizationId },
        { id: collectionsId, organization: organizationId, ruleSet: IsNull() }
      ],
      relations: ["organization", "campaign", "ruleSet"]
    });
    return existingCollections;
  }

  public async getCollectionsByIdsList(
    transactionManager,
    input
  ) {
    
    const existingCollections = await transactionManager.find(Collections, {
      where: [
        { id: In(input.collectionIdsList) ,organization: input.organizationId},
      ],
      relations: ["ruleSet"]
    });
    
    return existingCollections;
  }

  public async createCollections(transactionManager, injector, input) {
    const {
      organizationId,
      campaignId,
      status = STATUS.ACTIVE,
      name,
      entity,
      description,
      ruleSetId
    } = input;
    
    const validationPromises = [];
    validationPromises.push(
      Organization.availableById(transactionManager, organizationId)
    );

    if (campaignId) {
      validationPromises.push(
        Campaign.availableByIdForOrganization(
          transactionManager,
          campaignId,
          organizationId
        )
      );
    }

    if (ruleSetId) {
      validationPromises.push(
        RuleSet.availableByIdForOrganization(transactionManager, ruleSetId,organizationId)
      );
    }

    const createCollectionsPromise = async () => {
      const validEntity = validateCollectionsEntity(entity);
      if (!validEntity) {
        throw new WCoreError(WCORE_ERRORS.INVALID_ENTITY_TYPE);
      }

      
      const isNameInvalid = !isValidString(name);
      const hasSqlInjection = !isNameInvalid && hasSqlInjectionCharacters(ENTITY_NAME.COLLECTION, COMPARISON_TYPE.LIKE, name);

      if (isNameInvalid || hasSqlInjection) {
        throw new WCoreError(WCORE_ERRORS.INVALID_COLLECTIONS_NAME);
      }

      const validStatus = await validateStatus(status);
      if (!validStatus) {
        throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
      }

      let collectionsInput = {
        name,
        description,
        organization: organizationId,
        entity,
        status
      };

      if (campaignId) {
        collectionsInput["campaign"] = campaignId;
      }

      if (ruleSetId) {
        collectionsInput["ruleSet"] = ruleSetId;
      }

      const collectionsSchema = await transactionManager.create(
        Collections,
        collectionsInput
      );
      const savedCollections = await transactionManager.save(collectionsSchema);
      return transactionManager.findOne(Collections, {
        where: {
          id: savedCollections.id
        },
        relations: ["campaign", "organization", "ruleSet"]
      });
    };

    return validationDecorator(createCollectionsPromise, validationPromises);
  }

  public async updateCollections(transactionManager, injector, input) {
    const {
      organizationId,
      status,
      name,
      description,
      collectionsId,
      campaignId
    } = input;
    const validationPromises = [];
    validationPromises.push(
      Collections.availableByIdForOrganization(
        transactionManager,
        collectionsId,
        organizationId
      )
    );

    const updateCollectionsPromise = async () => {
      const existingCollections = await this.getCollectionsById(
        transactionManager,
        collectionsId,
        organizationId
      );
      if (!existingCollections) {
        throw new WCoreError(WCORE_ERRORS.COLLECTIONS_NOT_FOUND);
      }

      let campaign;
      if (campaignId) {
        campaign = await transactionManager.findOne(Campaign, {
          where: { id: campaignId, organization: organizationId }
        });
        if (!campaign) {
          throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
        }
      }

      let updateCollectionsSchema = {};

      const isNameInvalid = !isValidString(name);
      const hasSqlInjection = !isNameInvalid && hasSqlInjectionCharacters(ENTITY_NAME.COLLECTION, COMPARISON_TYPE.LIKE, name);

      if ( name && ( isNameInvalid || hasSqlInjection ) ) {
        throw new WCoreError(WCORE_ERRORS.INVALID_COLLECTIONS_NAME);
      }
      else if(name){
        // if name is not undefined and not equal to "" ,then its valid then we update the name
        updateCollectionsSchema["name"] = name;
      }
      

      if (description) {
        updateCollectionsSchema["description"] = description;
      }

      if (campaign) {
        updateCollectionsSchema["campaign"] = campaign;
      }

      if (status) {
        const validStatus = await validateStatus(status);
        if (!validStatus) {
          throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
        }
        updateCollectionsSchema["status"] = status;
      }

      updateEntity(existingCollections, updateCollectionsSchema);
      return transactionManager.save(existingCollections);
    };

    return validationDecorator(updateCollectionsPromise, validationPromises);
  }
}
