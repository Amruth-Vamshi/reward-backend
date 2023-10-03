import { Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import UrlSafeString from "url-safe-string";

import { Organization, Tag } from "../../../entity";
import { STATUS } from "../../common/constants";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { addPaginateInfo, updateEntity } from "../../common/utils/utils";

@Injectable()
export class TagProvider {
  public async getTag(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Tag> {
    const { id, code } = input;
    const filter = { organization: organizationId };
    if (id) {
      filter["id"] = id;
    }
    if (code) {
      filter["code"] = code;
    }
    const foundTag = await entityManager.findOne(Tag, { where: { ...filter } });
    return foundTag;
  }

  @addPaginateInfo
  public async getTags(
    entityManager: EntityManager,
    input,
    organizationId: string,
    pageOptions,
    sortOptions?: any
  ): Promise<[Tag[], number]> {
    const { code } = input;
    const options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = pageOptions.page - 1;
    options.take = pageOptions.pageSize;
    const filter = { organization: organizationId };
    if (code && code.length > 0) {
      filter["code"] = In(code);
    }
    const foundTags = await entityManager.findAndCount(Tag, {
      where: { ...filter },
      ...options
    });
    return foundTags;
  }

  public async createTag(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Tag> {
    const { name } = input;
    const organization = await entityManager.findOne(Organization, {
      where: { id: organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const foundTag = await entityManager.findOne(Tag, {
      where: { tagName: name, organization }
    });
    if (foundTag) {
      throw new WCoreError(WCORE_ERRORS.TAG_NAME_ALREADY_EXISTS);
    }
    const tagGenerator = new UrlSafeString();
    const code = tagGenerator.generate(name, organizationId);
    const tagSchema = { tagName: name, code, organization };
    const createdTag = await entityManager.create(Tag, tagSchema);
    const savedTag = await entityManager.save(createdTag);
    return savedTag;
  }

  public async updateTagName(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Tag> {
    const { id, name } = input;

    const organization = await entityManager.findOne(Organization, {
      where: { id: organizationId }
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const foundDuplicateTag = await entityManager.findOne(Tag, {
      where: { tagName: name, organization: organizationId }
    });
    if (foundDuplicateTag && foundDuplicateTag.id !== id) {
      throw new WCoreError(WCORE_ERRORS.TAG_NAME_ALREADY_EXISTS);
    }
    if (foundDuplicateTag && foundDuplicateTag.id === id) {
      return foundDuplicateTag;
    }

    const foundTag = await entityManager.findOne(Tag, {
      where: { id, organization: organizationId }
    });
    if (!foundTag) {
      throw new WCoreError(WCORE_ERRORS.TAG_NOT_FOUND);
    }
    const tagGenerator = new UrlSafeString();
    const code = tagGenerator.generate(name, organizationId);
    const updateSchema = { tagName: name, code };
    const updatedEntity = updateEntity(foundTag, updateSchema);
    const savedUpdatedTag = await entityManager.save(updatedEntity);
    return savedUpdatedTag;
  }

  public async deactivateTag(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Tag> {
    const { id } = input;
    const foundTag = await entityManager.findOne(Tag, {
      where: { id, organization: organizationId }
    });
    if (!foundTag) {
      throw new WCoreError(WCORE_ERRORS.TAG_NOT_FOUND);
    }
    if (foundTag.active !== true) {
      throw new WCoreError(WCORE_ERRORS.TAG_ALREADY_DEACTIVATED);
    }
    const updateSchema = {
      active: false
    };
    const updatedEntity = updateEntity(foundTag, updateSchema);
    const saveUpdatedEntity = await entityManager.save(updatedEntity);
    return saveUpdatedEntity;
  }

  public async reActivateTag(
    entityManager: EntityManager,
    input,
    organizationId: string
  ): Promise<Tag> {
    const { id } = input;
    const foundTag = await entityManager.findOne(Tag, {
      where: { id, organization: organizationId }
    });
    if (!foundTag) {
      throw new WCoreError(WCORE_ERRORS.TAG_NOT_FOUND);
    }
    if (foundTag.active === true) {
      throw new WCoreError(WCORE_ERRORS.TAG_ALREADY_ACTIVE);
    }
    const updateSchema = {
      active: true
    };
    const updatedEntity = updateEntity(foundTag, updateSchema);
    const saveUpdatedEntity = await entityManager.save(updatedEntity);
    return saveUpdatedEntity;
  }
}
