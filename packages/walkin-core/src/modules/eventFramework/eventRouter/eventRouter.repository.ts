import { Service } from "typedi";
import { EntityManager } from "typeorm";
import { Event } from "../../../entity";

@Service()
export class EventRepository {
    public async getEventById(
        transactionEntityManager: EntityManager,
        eventId: string,
        organizationId: string,
        relations: string[]
    ): Promise<Event> {
        const eventType = await transactionEntityManager.findOne(Event, {
            where: {
                id: eventId,
                organization: {
                    id: organizationId
                }
            },
            relations
        });
        return eventType;
    }
}