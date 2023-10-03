import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Campaign } from "../../../walkin-rewardx/src/entity/Campaign";
import { Event } from "./Event";
import { EventType } from "./EventType";

@Entity()
export class CampaignEventTrigger {
  @PrimaryGeneratedColumn("increment")
  public id!: number;

  @Column({
    type: "varchar",
    nullable: true
  })
  public status: string;

  @Column({
    type: "simple-json",
    nullable: true
  })
  public metaData: string;

  @ManyToOne(() => Campaign, campaign => campaign.campaignEventTriggers)
  public campaign!: Campaign;

  @ManyToOne(() => EventType, eventType => eventType.campaignEventTriggers)
  public eventType!: EventType;
}
