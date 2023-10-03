import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany
} from "typeorm";
import { Application } from "./Application";
import { EventType } from "./EventType";
import { Organization } from "./Organization";
import { Campaign } from "../../../walkin-rewardx/src/entity/Campaign";
import { CampaignEventTrigger } from "./CampaignEventTrigger";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";

@Entity()
export class Event extends WalkInBaseEntityUUID {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public sourceEventId: string;

  @Column({
    nullable: true,
    type: "datetime"
  })
  public sourceEventTime: Date;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public sourceName: string;

  // Actual event data

  @Column({
    nullable: false,
    type: "simple-json"
  })
  public data: any;

  // Event Metadata
  @Column({
    nullable: true,
    type: "simple-json"
  })
  public metadata: object;

  @ManyToOne(() => EventType, eventType => eventType.events)
  public eventType: EventType;

  @Column({
    nullable: true,
    type: "simple-json"
  })
  public processedStatus?: object;

  @Column({
    nullable: true,
    type: "simple-json"
  })
  public processedData?: object;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
