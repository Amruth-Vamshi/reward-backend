import { Injectable } from "@graphql-modules/di";
import { EntityManager, getConnection, getManager, In } from "typeorm";
import { PaymentType, Organization } from "../../entity";
import { WCoreError } from "../common/exceptions";
import { WCORE_ERRORS } from "../common/constants/errors";
import { updateEntity } from "../common/utils/utils";

@Injectable()
export class PaymentTypeProvider {
  public async getPaymentType(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<PaymentType> {
    const { id, code } = input;
    const filter = {};
    if (id) {
      filter["id"] = id;
    }
    if (code) {
      filter["code"] = code;
    }
    const foundPaymentType = await entityManager.findOne(PaymentType, {
      where: {
        ...filter,
        organization: organizationId
      }
    });
    if (!foundPaymentType) {
      throw new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_NOT_FOUND);
    }
    return foundPaymentType;
  }
  public async getPaymentTypes(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<PaymentType[]> {
    const { id, code } = input;
    const filter = {};
    if (code) {
      filter["code"] = In(code);
    }
    if (id) {
      filter["id"] = In(id);
    }
    const foundPaymentType = await entityManager.find(PaymentType, {
      where: {
        ...filter,
        organization: organizationId
      }
    });
    if (foundPaymentType.length === 0) {
      throw new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_NOT_FOUND);
    }
    return foundPaymentType;
  }
  public async addPaymentType(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<PaymentType> {
    const { name, code } = input;
    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId
      }
    });
    const findDuplicate = await entityManager.findOne(PaymentType, {
      where: {
        code,
        organization: organizationId
      }
    });
    if (findDuplicate) {
      throw new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_ALREADY_EXISTS);
    }
    const PaymentTypeSchema = {
      name,
      code,
      organization
    };
    const createPaymentTypeSchema = await entityManager.create(
      PaymentType,
      PaymentTypeSchema
    );
    const savedPaymentTypeSchema = await entityManager.save(
      createPaymentTypeSchema
    );
    return savedPaymentTypeSchema;
  }

  public async removePaymentType(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<PaymentType> {
    const { id } = input;
    const filter = {};
    if (id) {
      filter["id"] = id;
    }
    const foundPaymentType = await entityManager.findOne(PaymentType, {
      where: {
        ...filter,
        organization: organizationId
      }
    });
    if (!foundPaymentType) {
      throw new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_NOT_FOUND);
    }
    try {
      const removedPaymentType = await entityManager.remove(foundPaymentType);
      return removedPaymentType;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
  public async updatePaymentType(
    entityManager: EntityManager,
    input: any,
    organizationId
  ): Promise<PaymentType> {
    const { id, name, code } = input;
    const filter = {};
    if (id) {
      filter["id"] = id;
    }
    const foundPaymentType = await entityManager.findOne(PaymentType, {
      where: {
        ...filter
      }
    });
    if (!foundPaymentType) {
      throw new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_NOT_FOUND);
    }
    const findDuplicate = await entityManager.findOne(PaymentType, {
      where: {
        code
      }
    });
    if (findDuplicate && findDuplicate.id !== foundPaymentType.id) {
      throw new WCoreError(WCORE_ERRORS.PAYMENT_TYPE_ALREADY_EXISTS);
    }
    const updatedSchema = updateEntity(foundPaymentType, input);
    const saveUpdatedEntity = await entityManager.save(updatedSchema);
    return saveUpdatedEntity;
  }
}
