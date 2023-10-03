import { Injectable } from "@graphql-modules/di";
import { EntityManager, getConnection, getManager } from "typeorm";
import {
  WalkinPlatformError,
  WalkinRecordNotFoundError
} from "../../../src/modules/common/exceptions/walkin-platform-error";
import { Customer, Session } from "../../entity";
import { STATUS } from "../common/constants/constants";
import { validateAndReturnEntityExtendedData } from "../entityExtend/utils/EntityExtension";
import { updateEntity } from "../common/utils/utils";

@Injectable()
export class SessionProvider {
  public async getSession(
    transactionalEntityManager: EntityManager,
    id: string
  ): Promise<Session> {
    const entityManager = transactionalEntityManager;
    const e = await entityManager.findOne(Session, id);
    return e;
  }

  public async getActiveSessionForCustomer(
    transactionalEntityManager: EntityManager,
    customer_id: Customer,
    organization_id: string
  ): Promise<Session> {
    const entityManager = transactionalEntityManager;
    const status = STATUS.ACTIVE;
    const e = await entityManager.findOne(Session, {
      where: {
        customer_id,
        organization_id,
        status
      }
    });
    return e;
  }

  public async createSession(
    transactionalEntityManager: EntityManager,
    customer_id: Customer,
    organization_id: string,
    status: string,
    extend: any
  ): Promise<Session> {
    const entityManager = transactionalEntityManager;
    const sessionSchema: any = {
      customer_id,
      organization_id,
      status
    };
    const e = entityManager.create(Session, sessionSchema);
    // Handle Entity Extensions
    if (extend !== undefined) {
      try {
        const extendData = await validateAndReturnEntityExtendedData(
          transactionalEntityManager,
          extend,
          organization_id,
          "session"
        );
        exports.extend = extendData;
      } catch (e) {
        throw new WalkinPlatformError(
          "cust005",
          "entity extended data is invalid",
          e,
          400,
          ""
        );
      }
    }
    // Handle Entity Extensions
    return entityManager.save(e);
  }

  public async updateSession(
    transactionalEntityManager: EntityManager,
    id: string,
    status: string
  ): Promise<Session> {
    const entityManager = transactionalEntityManager;
    let e = await entityManager.findOne(Session, id);
    if (!e) {
      throw new WalkinRecordNotFoundError("No session found for the give id");
    }
    e = updateEntity(e, { status });
    return entityManager.save(e);
  }
}
