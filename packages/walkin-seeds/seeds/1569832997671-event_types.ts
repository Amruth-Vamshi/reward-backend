import { MigrationInterface, QueryRunner, In } from "typeorm";
import { EventTypeSeed } from "./data/event_type_seed";
import { EventType } from "@walkinserver/walkin-core/src/entity";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";

export class EventTypes1569832997671 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (const eventTypeSeed of EventTypeSeed) {
      let eventType = new EventType();
      eventType = updateEntity(eventType, eventTypeSeed);
      eventType = await eventType.save();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const eventTypes = EventTypeSeed.map(eventType => eventType.code);
    const savedEventTypes = await EventType.find({
      where: {
        type: In(eventTypes)
      }
    });
    for (const eventType of savedEventTypes) {
      await eventType.remove();
    }
  }
}
