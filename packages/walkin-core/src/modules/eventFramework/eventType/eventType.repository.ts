import { Service } from "typedi";
import { EntityManager } from "typeorm";
import { EventType } from "../../../entity";

@Service()
export class EventTypeRepository {
  public async getEventTypeById(
    transactionEntityManager: EntityManager,
    eventTypeId: string,
    organizationId: string,
    relations: string[]
  ): Promise<EventType> {
    const eventType = await transactionEntityManager.findOne(EventType, {
      where: {
        id: eventTypeId,
        organization: {
          id: organizationId
        }
      },
      relations
    });
    return eventType;
  }

  public async getEventTypeByCode(
    transactionEntityManager: EntityManager,
    eventTypeCode: string,
    organizationId: string,
    relations: string[]
  ): Promise<EventType> {
    const eventType = await transactionEntityManager.findOne(EventType, {
      where: {
        code: eventTypeCode,
        organization: {
          id: organizationId
        }
      },
      relations
    });
    return eventType;
  }

  public async getEventTypeForOrganization(
    transactionEntityManager: EntityManager,
    organizationId: string,
    relations: string[]
  ): Promise<EventType[]> {
    const eventType = await transactionEntityManager.find(EventType, {
      where: {
        organization: {
          id: organizationId
        }
      },
      relations
    });
    return eventType;
  }
}
