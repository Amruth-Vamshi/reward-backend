import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
  Index
} from "typeorm";
import { STATUS } from "../modules/common/constants";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Application } from "./Application";
import { Organization } from "./Organization";
import { EventSubscription } from "./EventSubscription";
import { Event } from "./Event";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { CampaignEventTrigger } from "./CampaignEventTrigger";

@Entity()
export class EventType extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar"
  })
  public code;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public description: string;

  @Column({
    nullable: false,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;

  @ManyToOne(() => Application, application => application.eventTypes)
  @JoinColumn({
    name: "application_id",
    referencedColumnName: "id"
  })
  public application: Application;

  @OneToMany(
    () => EventSubscription,
    eventSubscription => eventSubscription.eventType
  )
  public eventSubscriptions: EventSubscription[];

  @OneToMany(() => Event, event => event.eventType)
  public events: Event[];

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @OneToMany(
    () => CampaignEventTrigger,
    campaignEventTrigger => campaignEventTrigger.eventType
  )
  public campaignEventTriggers: CampaignEventTrigger[];
}
