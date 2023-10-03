import { Injectable } from "@graphql-modules/di";
import { EntityManager, getConnection, getManager, In } from "typeorm";
import { DeliveryType, Organization } from "../../entity";
import { WCoreError } from "../common/exceptions";
import { WCORE_ERRORS } from "../common/constants/errors";
import { updateEntity } from "../common/utils/utils";

@Injectable()
export class DeliveryTypeProvider {
  public async getDeliveryType(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<DeliveryType> {
    const { id, code } = input;
    const filter = {};
    if (id) {
      filter["id"] = id;
    }
    if (code) {
      filter["code"] = code;
    }
    const foundDeliveryType = await entityManager.findOne(DeliveryType, {
      where: {
        ...filter,
        organization: organizationId
      }
    });
    if (!foundDeliveryType) {
      throw new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_NOT_FOUND);
    }
    return foundDeliveryType;
  }
  public async getDeliveryTypes(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<DeliveryType[]> {
    const { id, code } = input;
    const filter = {};
    if (code) {
      filter["code"] = In(code);
    }
    if (id) {
      filter["id"] = In(id);
    }
    const foundDeliveryType = await entityManager.find(DeliveryType, {
      where: {
        ...filter,
        organization: organizationId
      }
    });
    if (foundDeliveryType.length === 0) {
      throw new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_NOT_FOUND);
    }
    return foundDeliveryType;
  }
  public async addDeliveryType(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<DeliveryType> {
    const { name, code } = input;
    const findDuplicate = await entityManager.findOne(DeliveryType, {
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
      throw new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_ALREADY_EXISTS);
    }
    const DeliveryTypeSchema = {
      name,
      code,
      organization
    };
    const createDeliveryTypeSchema = await entityManager.create(
      DeliveryType,
      DeliveryTypeSchema
    );
    const savedDeliveryTypeSchema = await entityManager.save(
      createDeliveryTypeSchema
    );
    return savedDeliveryTypeSchema;
  }

  public async removeDeliveryType(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<DeliveryType> {
    const { id } = input;
    const filter = {};
    if (id) {
      filter["id"] = id;
    }
    const foundDeliveryType = await entityManager.findOne(DeliveryType, {
      where: {
        ...filter,
        organization: organizationId
      }
    });
    if (!foundDeliveryType) {
      throw new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_NOT_FOUND);
    }
    try {
      const removedDeliveryType = await entityManager.remove(foundDeliveryType);
      return removedDeliveryType;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
  public async updateDeliveryType(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<DeliveryType> {
    const { id, name, code } = input;
    const filter = {};
    if (id) {
      filter["id"] = id;
    }
    const foundDeliveryType = await entityManager.findOne(DeliveryType, {
      where: {
        ...filter
      }
    });
    if (!foundDeliveryType) {
      throw new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_NOT_FOUND);
    }
    const findDuplicate = await entityManager.findOne(DeliveryType, {
      where: {
        code
      }
    });
    if (findDuplicate && findDuplicate.id !== foundDeliveryType.id) {
      throw new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_ALREADY_EXISTS);
    }
    const updatedSchema = updateEntity(foundDeliveryType, input);
    const saveUpdatedEntity = await entityManager.save(updatedSchema);
    return saveUpdatedEntity;
  }
}
