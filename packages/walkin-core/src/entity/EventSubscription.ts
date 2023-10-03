import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  Index
} from "typeorm";
import { Application } from "./Application";
import { EventType } from "./EventType";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Action } from "./Action";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";

@Entity()
@Index(["triggerAction", "eventType"], { unique: true })
export class EventSubscription extends WalkInBaseEntityUUID {
  /**
   * Trigger Actions are used to map the event to a product action or a custom action
   *
   * @remarks
   * Internal action can be an API map for an internal product
   * If an action is maked custom then linking to a customAction is mandatory
   */
  @Column({
    type: "varchar",
    nullable: false
  })
  public triggerAction: string;

  @ManyToOne(() => Action, action => action.customEventTriggers)
  @JoinColumn()
  public customAction: Action;

  @ManyToOne(() => EventType, eventType => eventType.eventSubscriptions)
  public eventType: EventType;

  @Column({
    type: "boolean",
    default: false
  })
  public sync: boolean;

  @Column({
    type: "varchar",
    default: "INACTIVE"
  })
  public status: string;
}
