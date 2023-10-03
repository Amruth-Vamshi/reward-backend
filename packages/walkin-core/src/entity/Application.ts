import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn
} from "typeorm";
import { Action } from "./Action";
import { APIKey } from "./APIKey";
import { Campaign } from "../../../walkin-rewardx/src/entity/Campaign";
import { Member } from "./Member";
import { Organization } from "./Organization";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";
import { EventType } from "./EventType";

@Entity()
export class Application extends WalkInEntityExtendBase {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public description: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public auth_key_hooks: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public platform: string;

  @ManyToOne(() => Organization, organization => organization.applications)
  @JoinColumn({
    name: "organizationId",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @OneToMany(() => Member, member => member.application)
  public members: Member[];

  @OneToMany(() => Campaign, campaign => campaign.application)
  public campaigns: Campaign[];

  @OneToMany(() => APIKey, apiKey => apiKey.application)
  public apiKeys: APIKey[];

  @OneToMany(() => EventType, eventType => eventType.application)
  public eventTypes: EventType[];
}
