import { EventType, Application } from "../../../entity";
import { EntityManager, QueryFailedError } from "typeorm";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { isValidString, updateEntity, validateStatus } from "../../common/utils/utils";
import { Container } from "typedi";
import { EventTypeRepository } from "./eventType.repository";
export class EventTypeService {
  public async createOrFetchEventType(
    entityManager: EntityManager,
    {
      code,
      applicationId,
      description,
      organizationId
    }: {
      code: string;
      description?: string;
      applicationId: string;
      organizationId;
    }
  ): Promise<EventType> {
    const application = await entityManager.findOne(Application, applicationId);
    if (!application) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }

    // Code is unique within an organization
    const relations = [];
    let eventType = await Container.get(EventTypeRepository).getEventTypeByCode(
      entityManager,
      code,
      organizationId,
      relations
    );
    if (!eventType) {
      eventType = new EventType();
      eventType.code = code;
      eventType.description = description;
      eventType.application = application;
      eventType["organization"] = organizationId;
      try {
        eventType = await entityManager.save(eventType);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          throw new WCoreError(
            WCORE_ERRORS.EVENT_TYPE_ALREADY_PRESENT_FOR_APPLICATION
          );
        }
        // else case should throw error.
        throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_CREATE_FAILED);
      }
    }
    return eventType;
  }

  public async createEventType(
    entityManager: EntityManager,
    { code, application, description, organizationId }
  ): Promise<EventType> {
    if (!application) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }

    const validCode = isValidString(code);
    if (!validCode) {
      throw new WCoreError(WCORE_ERRORS.INVALID_EVENT_TYPE_CODE);
    }
    
    // Code is unique within an organization
    const relations = [];
    let eventType = await Container.get(EventTypeRepository).getEventTypeByCode(
      entityManager,
      code,
      organizationId,
      relations
    );
    if (eventType) {
      throw new WCoreError(
        WCORE_ERRORS.EVENT_TYPE_CODE_ALREADY_PRESENT_FOR_ORGANIZATION
      );
    }
    eventType = new EventType();
    eventType.code = code;
    eventType.description = description;
    eventType.application = application;
    eventType["organization"] = organizationId;
    try {
      eventType = await entityManager.save(eventType);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new WCoreError(
          WCORE_ERRORS.EVENT_TYPE_ALREADY_PRESENT_FOR_APPLICATION
        );
      }
      // else case should throw error.
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_CREATE_FAILED);
    }
    return eventType;
  }
  /**
   * updateEventtype
   */
  public async updateEventType(
    entityManager: EntityManager,
    {
      id,
      code,
      description,
      status,
      organizationId,
      application
    }: {
      id: string;
      code: string;
      description: string;
      status: string;
      organizationId: string;
      application: Application;
    }
  ): Promise<EventType> {
    const updateInput = {};
    if (!application) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }

    if (code) {
      const validCode = isValidString(code);
      if (!validCode) {
        throw new WCoreError(WCORE_ERRORS.INVALID_EVENT_TYPE_CODE);
      }

      const queryRunner = await entityManager.connection.createQueryRunner();
      let eventType = await queryRunner.manager.query(
        `Select * from event_type where code = '${code}' AND id <> '${id}'`
      );
      queryRunner.release();

      if (eventType.length > 0) {
        throw new WCoreError(
          WCORE_ERRORS.EVENT_TYPE_CODE_ALREADY_PRESENT_FOR_ORGANIZATION
        );
      }

      updateInput["code"] = code;
    }

    if (status) {
      const isValidStatus = validateStatus(status);
      if (!isValidStatus) {
        throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
      }
      updateInput["status"] = status;
    }

    if (description) {
      updateInput["description"] = description;
    }

    let eventType = await entityManager.findOne(EventType, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      }
    });
    if (!eventType) {
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_INVALID);
    }
    eventType = updateEntity(eventType, updateInput);
    return entityManager.save(eventType);
  }

  /**
   * deleteEventType
   */
  public async deleteEventType(
    entityManager: EntityManager,
    id: string
  ): Promise<EventType> {
    const eventType = await entityManager.findOne(EventType, {
      where: {
        id
      }
    });
    if (!eventType) {
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_INVALID);
    }
    const deletedEvenType = await entityManager.remove(eventType);
    return deletedEvenType;
  }

  /**
   * eventTypeById
   */
  public async eventTypeById(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<EventType> {
    const eventType = await entityManager.findOne(EventType, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["eventSubscriptions", "application"]
    });
    if (!eventType) {
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_INVALID);
    }
    return eventType;
  }

  /**
   * name
   */
  public async eventTypeByCode(
    entityManager: EntityManager,
    code: string
  ): Promise<EventType> {
    const eventType = await entityManager.findOne(EventType, {
      where: {
        code
      },
      relations: ["eventSubscriptions", "application"],
      cache: true
    });
    if (!eventType) {
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_NOT_FOUND);
    }
    return eventType;
  }

  /**
   * eventTypesForApplication
   */
  public async eventTypesForApplication(
    entityManager: EntityManager,
    appId: string
  ): Promise<EventType[]> {
    const application = await entityManager.findOne(Application, appId, {
      cache: true,
      relations: ["eventTypes"]
    });
    if (!application) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }
    return application.eventTypes;
  }
}
