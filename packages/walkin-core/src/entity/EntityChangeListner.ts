import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent
} from "typeorm";
import { logger } from "../modules/common/utils/loggerUtil";
import { WCORE_ERRORS } from "../modules/common/constants/errors";
import { WCoreError } from "../modules/common/exceptions";

@EventSubscriber()
export class EntityChnageSubscriber implements EntitySubscriberInterface {
  /**
   * Called after entity insertion.
   */
  public afterInsert(event: InsertEvent<any>) {
    this.logToFile("INSERTED", event.metadata.tableName, event.entity);
  }

  /**
   * Called after entity update.
   */
  public afterUpdate(event: UpdateEvent<any>) {
    this.logToFile("UPDATED", event.metadata.tableName, event.entity);
  }

  /**
   * Called after entity removal.
   */
  public afterRemove(event: RemoveEvent<any>) {
    this.logToFile("REMOVED", event.metadata.tableName, event.entity);
  }

  public logToFile(action, entityName, dataToBeLogged) {
    try {
      const auditableEntities = process.env.AUDITABLE_ENTITIES;
      if (auditableEntities === undefined) {
        throw new WCoreError(WCORE_ERRORS.AUDITABLE_ENTITIES_NOT_DEFINED);
      } else if (
        auditableEntities &&
        auditableEntities.indexOf(entityName) !== -1
      ) {
        logger.log(
          "audit",
          JSON.stringify({ action, entityName, data: dataToBeLogged })
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
}
