import { Injectable } from "@graphql-modules/di";
import {
  EntityManager,
  getManager,
  getConnection,
  TransactionManager
} from "typeorm";
import { WalkinError } from "../../../src/modules/common/exceptions/walkin-platform-error";
import { EntityExtend, EntityExtendFields, Organization } from "../../entity";
import { mapTypesToColumnSlugType } from "../common/utils/utils";
import { CACHING_KEYS, EXTEND_ENTITIES } from "../common/constants/constants";
import { WCoreError } from "../common/exceptions/index";
import { WCORE_ERRORS } from "../common/constants/errors";
import { removeValueFromCache } from "../common/utils/redisUtils";
@Injectable()
export class EntityExtendProvider {
  public async getEntities(transactionManager: EntityManager, organizationId) {
    // TODO: Assumed that all organization will have the basic entities
    return Object.values(EXTEND_ENTITIES);
  }

  // TODO: Find way to make this as common util. Issue: Unable to invoke getConnection() from utils
  public async getBasicFields(transactionManager: EntityManager, entityName) {
    try {
      let columns = await getConnection()
        .getMetadata(entityName)
        .ownColumns.map(column => {
          return {
            label: column.propertyName,
            slug: column.propertyName,
            type: column.type,
            required: column.isNullable,
            defaultValue: column.default,
            description: column.propertyName,
            searchable: true
          };
        });
      columns = mapTypesToColumnSlugType(columns);

      return columns;
    } catch (e) {
      throw new WCoreError(WCORE_ERRORS.ENTITY_NOT_FOUND);
    }
  }

  public async getEntityExtendByName(
    transactionManager: EntityManager,
    entityName: string,
    organizationId: string
  ): Promise<EntityExtend> {
    const entityManager: any = transactionManager
      ? transactionManager
      : getManager();
    return entityManager.findOne(EntityExtend, {
      where: {
        entityName: entityName,
        organization: organizationId
      },
      relations: ["organization", "fields"]
    });
  }
  public getEntityExtend(
    transactionManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<EntityExtend> {
    const entityManager: any = transactionManager
      ? transactionManager
      : getManager();
    return entityManager.findOne(EntityExtend, {
      where: {
        id,
        organization: organizationId
      },
      relations: ["organization"]
    });
  }

  public getEntityExtendByEntityName(
    transactionManager: EntityManager,
    organizationId: string,
    enityName: string
  ): Promise<EntityExtend> {
    const entityManager: any = transactionManager
      ? transactionManager
      : getManager();
    return entityManager.findOne(EntityExtend, {
      where: {
        organization: organizationId,
        entityName: enityName
      },
      relations: ["organization", "fields"]
    });
  }

  public getEntityExtendFieldsByEntityExtendId(
    transactionManager: EntityManager,
    entityExtend
  ): Promise<EntityExtendFields> {
    const entityManager: any = transactionManager
      ? transactionManager
      : getManager();
    return entityManager.find(EntityExtendFields, {
      entityExtend,
      relations: ["entityExtend"]
    });
  }
  public getEntityExtendField(
    transactionManager: EntityManager,
    id: string
  ): Promise<EntityExtendFields> {
    const entityManager: any = transactionManager
      ? transactionManager
      : getManager();
    return entityManager.findOne(EntityExtendFields, id, {
      relations: ["entityExtend"]
    });
  }

  public getEntityExtendFields(
    transactionManager: EntityManager,
    eeID: string
  ): Promise<EntityExtendFields> {
    const entityManager: any = transactionManager
      ? transactionManager
      : getManager();
    return entityManager.find(EntityExtendFields, {
      where: {
        entityExtend: {
          id: eeID
        }
      },
      relations: ["entityExtend"]
    });
  }

  public async getEntityExtendFieldBySlugName(
    transactionManager: EntityManager,
    slug: string,
    entityExtendId: string
  ): Promise<EntityExtendFields> {
    const entityManager: any = transactionManager
      ? transactionManager
      : getManager();
    return entityManager.findOne(EntityExtendFields, {
      where: {
        slug,
        entityExtend: {
          id: entityExtendId
        }
      },
      relations: ["entityExtend"]
    });
  }

  public async createEntityExtend(
    entityManager: EntityManager,
    organizationId: string,
    entityName: string,
    description: string
  ): Promise<EntityExtend> {
    const organization = await entityManager.findOne(
      Organization,
      organizationId
    );
    if (!organization) {
      // TODO: EE Use the validationPromises for throwing the error
      throw new WalkinError(
        `Organization with ${organizationId} does not exist`
      );
    }
    const findExistingEnityExtend = await entityManager.findOne(EntityExtend, {
      where: {
        entityName,
        organization: organizationId
      }
    });
    if (findExistingEnityExtend) {
      throw new WCoreError(WCORE_ERRORS.ENTITY_EXTEND_ALREADY_EXISTS);
    }
    const ee = new EntityExtend();
    ee.entityName = entityName;
    ee.description = description;
    ee.organization = organization;
    const res = await entityManager.save(ee);
    const keys = [
      `${CACHING_KEYS.ENTITY_EXTEND}_${ee.entityName}_${organizationId}`
    ];
    removeValueFromCache(keys);
    return res;
  }

  public async createEntityExtendField(
    entityManager: EntityManager,
    entityExtendId: string,
    slug: string,
    label: string,
    help: string,
    type: string,
    required: boolean,
    choices: string[],
    defaultValue: string,
    validator: string,
    description: string,
    searchable: boolean
  ): Promise<EntityExtendFields> {
    const entityExtend = await entityManager.findOne(EntityExtend, {
      where: { id: entityExtendId },
      relations: ["organization"]
    });
    if (!entityExtend) {
      // TODO: EE Use the validationPromises for throwing the error
      throw new WalkinError(
        `EntityExtend with ${entityExtendId} does not exist`
      );
    }
    // TODO: EE Slugs have to be unique.. Add this validation
    const slugFound = await entityManager.findOne(EntityExtendFields, slug);
    if (slugFound) {
      throw new WalkinError("Enter another slug name");
    }

    const eef = new EntityExtendFields();
    eef.slug = slug;
    eef.label = label;
    eef.help = help;
    eef.type = type;
    eef.required = required;
    eef.choices = choices;
    eef.defaultValue = defaultValue;
    eef.validator = validator;
    eef.entityExtend = entityExtend;
    eef.description = description;
    eef.searchable = searchable;
    const keys = [
      `${CACHING_KEYS.ENTITY_EXTEND}_${entityExtend.entityName}_${entityExtend.organization.id}`
    ];
    console.log("EntityField Removable keys", keys);
    removeValueFromCache(keys);
    return entityManager.save(eef);
  }
}
