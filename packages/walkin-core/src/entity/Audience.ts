import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Tree
} from "typeorm";
import { ActionDefinition } from "./ActionDefinition";
import { Application } from "./Application";
import { Campaign } from "../../../walkin-rewardx/src/entity/Campaign";
import { Organization } from "./Organization";
import { Rule } from "./Rule";
import { Segment } from "./Segment";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "audience" })
export class Audience extends WalkInBaseEntity {
  @ManyToOne(type => Campaign)
  @JoinColumn({
    name: "campaign_id",
    referencedColumnName: "id"
  })
  public campaign: Campaign;

  @ManyToOne(type => Segment)
  @JoinColumn({
    name: "segment_id",
    referencedColumnName: "id"
  })
  public segment: Segment;

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

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status = "";
}
