import { Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import UrlSafeString from "url-safe-string";
import { Collection, Organization } from "../../../entity";
import { updateEntity, addPaginateInfo } from "../../common/utils/utils";
import { STATUS } from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";

@Injectable()
export class CollectionProvider {
  public async getCollection(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Collection | any> {
    const { id, code } = input;
    const filter = {
      organization: organizationId
    };
    if (id) {
      filter["id"] = id;
    }
    if (code) {
      filter["code"] = code;
    }
    const foundCollection = await entityManager.findOne(Collection, {
      where: {
        ...filter
      }
    });
    if (!foundCollection) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_NOT_FOUND);
    }
    return foundCollection;
  }

  @addPaginateInfo
  public async getCollections(
    entityManager: EntityManager,
    pageOptions,
    sortOptions,
    input
  ): Promise<[Collection[], number]> {
    const { code } = input;
    const options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = pageOptions.page - 1;
    options.take = pageOptions.pageSize;
    const filter = { organization: input.organizationId };
    options.relations = ['organization']

    // Currently there is no way we can give code as array. Is this required?

    // if (typeof code === 'Array') {
    //   if (code.length > 0) {
    //     filter["code"] = In(code);
    //   }
    // }
    options.where = filter
    console.log(options);
    const foundCollections = await entityManager.findAndCount(Collection, options)
    // where: {
    //   ...filter
    // },
    // ...options
    // });
    // console.log(foundCollections);

    return foundCollections;
  }

  public async createCollection(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Collection> {
    const { name } = input;
    const filter = {
      name,
      organization: organizationId
    };
    const existingCollection = await entityManager.findOne(Collection, {
      where: {
        ...filter
      }
    });
    if (existingCollection) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_EXISTS);
    }
    const organization = await entityManager.findOne(Organization, {
      where: { id: organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const tagGenerator = new UrlSafeString();
    const code = tagGenerator.generate(name, organizationId);
    const collectionSchema = {
      name,
      code,
      organization
    };
    console.log(collectionSchema);
    const createCollection = await entityManager.create(
      Collection,
      collectionSchema
    );
    console.log(createCollection)
    const savedCollection = await entityManager.save(createCollection);
    return savedCollection;
  }

  public async updateCollection(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Collection> {
    const { id, name } = input;
    const organization = await entityManager.findOne(Organization, {
      where: { id: organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const foundCollection = await entityManager.findOne(Collection, {
      where: {
        id,
        organization: organizationId
      }
    });
    if (!foundCollection) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_NOT_FOUND);
    }
    const filter = {
      name,
      organization: organizationId
    };
    const existingCollection = await entityManager.findOne(Collection, {
      where: {
        ...filter
      }
    });
    if (existingCollection && existingCollection.id !== id) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_EXISTS);
    }

    if (existingCollection && existingCollection.id === id) {
      return existingCollection;
    }
    const updateSchema = { name };
    const updatedEntity = updateEntity(foundCollection, updateSchema);
    const saveUpdatedEntity = await entityManager.save(updatedEntity);
    return saveUpdatedEntity;
  }

  public async deactivateCollection(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Collection | any> {
    const { id } = input;
    const organization = await entityManager.findOne(Organization, {
      where: { id: organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const foundCollection = await entityManager.findOne(Collection, {
      where: {
        id,
        organization: organizationId
      }
    });
    if (!foundCollection) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_NOT_FOUND);
    }
    if (foundCollection.active === false) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_DEACTIVATED);
    }
    const updateSchema = { active: false };
    const updatedEntity = updateEntity(foundCollection, updateSchema);
    const saveUpdatedEntity = await entityManager.save(updatedEntity);
    return saveUpdatedEntity;
  }

  public async activateCollection(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Collection | any> {
    const { id } = input;
    const organization = await entityManager.findOne(Organization, {
      where: { id: organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const foundCollection = await entityManager.findOne(Collection, {
      where: {
        id,
        organization: organizationId
      }
    });
    if (!foundCollection) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_NOT_FOUND);
    }
    if (foundCollection.active === true) {
      throw new WCoreError(WCORE_ERRORS.COLLECTION_ALREADY_ACTIVE);
    }
    const updateSchema = { active: true };
    const updatedEntity = updateEntity(foundCollection, updateSchema);
    const saveUpdatedEntity = await entityManager.save(updatedEntity);
    return saveUpdatedEntity;
  }
}
