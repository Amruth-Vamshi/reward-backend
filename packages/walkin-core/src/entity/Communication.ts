import {
  Entity,
  Tree,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany
} from "typeorm";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Organization } from "./Organization";
import { Application } from "./Application";
import { MessageTemplate } from "./MessageTemplate";
import { Rule } from "./Rule";
import { Campaign } from "../../../walkin-rewardx/src/entity/Campaign";

@Entity({ name: "communication" })
export class Communication extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    nullable: false,
    name: "entity_id"
  })
  public entityId: string;

  @Column({
    type: "varchar",
    nullable: false,
    name: "entity_type"
  })
  public entityType: string;

  @ManyToOne(type => MessageTemplate)
  @JoinColumn({
    name: "message_template_id",
    referencedColumnName: "id"
  })
  public messageTemplate: MessageTemplate;

  @Column({
    nullable: false,
    type: "boolean",
    default: false
  })
  public isScheduled: boolean;

  @Column({
    nullable: true,
    type: "datetime"
  })
  public firstScheduleDateTime: Date;

  @Column({
    nullable: false,
    type: "boolean",
    default: false
  })
  public isRepeatable: boolean;

  @Column({
    nullable: true,
    type: "datetime"
  })
  public lastProcessedDateTime: Date;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public status: string;

  @Column({
    nullable: true,
    type: "simple-json"
  })
  public repeatRuleConfiguration: any;

  @Column({
    type: "varchar",
    length: 1000,
    nullable: false
  })
  public commsChannelName: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @ManyToOne(type => Application)
  @JoinColumn({
    name: "application_id",
    referencedColumnName: "id"
  })
  public application: Application;

  @ManyToOne(type => Campaign)
  @JoinColumn({
    name: "campaign_id",
    referencedColumnName: "id"
  })
  public campaign;
}
