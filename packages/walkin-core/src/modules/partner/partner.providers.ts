import { Injectable } from "@graphql-modules/di";
import { EntityManager, getConnection, getManager, In } from "typeorm";
import { Partner, Organization } from "../../entity";
import { WCoreError } from "../common/exceptions";
import { WCORE_ERRORS } from "../common/constants/errors";
import { updateEntity } from "../common/utils/utils";

@Injectable()
export class PartnerProvider {
  public async getPartner(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<Partner> {
    const { id, name, code } = input;
    const filter = {};
    if (id) {
      filter["id"] = id;
    }
    if (name) {
      filter["name"] = name;
    }
    if (code) {
      filter["code"] = code;
    }
    const foundPartner = await entityManager.findOne(Partner, {
      where: {
        ...filter,
        organization: organizationId
      }
    });
    if (!foundPartner) {
      throw new WCoreError(WCORE_ERRORS.PARTNER_NOT_FOUND);
    }
    return foundPartner;
  }
  public async getPartners(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<Partner[]> {
    const { name, partnerType } = input;
    const filter = {};
    if (partnerType) {
      filter["partnerType"] = partnerType;
    }
    if (name) {
      filter["name"] = name;
    }
    const foundPartner = await entityManager.find(Partner, {
      where: {
        ...filter,
        organization: organizationId
      }
    });
    if (foundPartner.length === 0) {
      throw new WCoreError(WCORE_ERRORS.PARTNER_NOT_FOUND);
    }
    return foundPartner;
  }
  public async addPartner(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<Partner> {
    const { name, partnerType, code, status } = input;
    const findDuplicate = await entityManager.findOne(Partner, {
      where: {
        code,
        organization: organizationId
      }
    });
    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId
      }
    });
    if (findDuplicate) {
      throw new WCoreError(WCORE_ERRORS.PARTNER_TYPE_ALREADY_EXISTS);
    }
    const partnerSchema = {
      name,
      partnerType,
      code,
      status,
      organization
    };
    const createPartnerSchema = await entityManager.create(
      Partner,
      partnerSchema
    );
    const savedPartnerSchema = await entityManager.save(createPartnerSchema);
    return savedPartnerSchema;
  }

  public async removePartner(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<Partner> {
    const { id } = input;
    const filter = {};
    if (id) {
      filter["id"] = id;
    }
    const foundPartner = await entityManager.findOne(Partner, {
      where: {
        ...filter
      }
    });
    if (!foundPartner) {
      throw new WCoreError(WCORE_ERRORS.PARTNER_NOT_FOUND);
    }
    try {
      const removedPartner = await entityManager.remove(foundPartner);
      return removedPartner;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
  public async updatePartner(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<Partner> {
    const { id, name, partnerType, code, status } = input;
    const filter = {};
    if (id) {
      filter["id"] = id;
    }
    const foundPartner = await entityManager.findOne(Partner, {
      where: {
        ...filter
      }
    });
    if (!foundPartner) {
      throw new WCoreError(WCORE_ERRORS.PARTNER_NOT_FOUND);
    }
    const findDuplicate = await entityManager.findOne(Partner, {
      where: {
        code
      }
    });
    if (findDuplicate && findDuplicate.id !== foundPartner.id) {
      throw new WCoreError(WCORE_ERRORS.PARTNER_TYPE_ALREADY_EXISTS);
    }
    const updatedSchema = updateEntity(foundPartner, input);
    const saveUpdatedEntity = await entityManager.save(updatedSchema);
    return saveUpdatedEntity;
  }
}
