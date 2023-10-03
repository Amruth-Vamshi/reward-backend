import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Application } from "../../../walkin-core/src/entity/Application";
import { Audience } from "../../../walkin-core/src/entity/Audience";
import { Organization } from "../../../walkin-core/src/entity/Organization";
import { Communication } from "../../../walkin-core/src/entity/Communication";
import { Rule } from "../../../walkin-core/src/entity/Rule";
import { User } from "../../../walkin-core/src/entity/User";
import { WalkInBaseEntity } from "../../../walkin-core/src/entity/WalkInBaseEntity";
import { Event } from "../../../walkin-core/src/entity/Event";
import { CampaignEventTrigger } from "../../../walkin-core/src/entity/CampaignEventTrigger";
import { APPLICATION_METHOD } from "../modules/common/constants/constant";

@Entity()
@Unique(["name", "organization"])
export class Campaign extends WalkInBaseEntity {
  @Column({
    nullable: true,
    type: "varchar",
    length: 255
  })
  public name: string;

  @Column({
    type: "varchar",
    length: 1000,
    nullable: true
  })
  public description: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public campaignType: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public campaignTriggerType: string;

  // @ManyToOne(type => Rule)
  // @JoinColumn({
  //   name: "trigger_rule_id",
  //   referencedColumnName: "id"
  // })
  // public triggerRule: Rule;

  @Column({
    nullable: false,
    type: "int",
    default: 0
  })
  public priority: number;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public campaignStatus = "";

  @Column({
    nullable: false,
    type: "boolean",
    default: false
  })
  public isCampaignControlEnabled: boolean;

  @Column({
    nullable: false,
    type: "int",
    default: 0
  })
  public campaignControlPercent: number;

  @Column({
    nullable: false,
    type: "int",
    default: true
  })
  public isGlobalControlEnabled: number;

  @Column({
    nullable: true,
    type: "datetime"
  })
  public startTime: Date;

  @Column({
    nullable: true,
    type: "datetime"
  })
  public endTime: Date;

  // @Column({
  //   nullable: true,
  //   type: "varchar"
  // })
  // public status = "";

  @ManyToOne(() => User, user => user.createdCampaigns)
  @JoinColumn()
  public owner: User;

  // @ManyToOne(type => Rule)
  // @JoinColumn({
  //   name: "audience_filter_rule_id",
  //   referencedColumnName: "id"
  // })
  // public audienceFilterRule: Rule;

  @ManyToOne(() => Application, application => application.campaigns)
  @JoinColumn({
    name: "application_id",
    referencedColumnName: "id"
  })
  public application: Application;

  @ManyToOne(() => Organization, organization => organization.campaigns)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @OneToMany(() => Communication, communication => communication.campaign)
  public communications: Communication[];

  @OneToMany(
    () => CampaignEventTrigger,
    campaignEventTrigger => campaignEventTrigger.campaign
  )
  @JoinColumn()
  public campaignEventTriggers!: CampaignEventTrigger[];

  @Column({
    name: "application_method",
    nullable: false,
    type: "varchar",
    enum: APPLICATION_METHOD
  })
  public applicationMethod;

  @Column({
    name: "loyalty_totals",
    type: "json",
    nullable: true
  })
  public loyaltyTotals;

  @Column({
    name: "coupon_totals",
    type: "json",
    nullable: true
  })
  public couponTotals;

  @Column({
    name: "referral_totals",
    type: "json",
    nullable: true
  })
  public referralTotals;

  @Column({
    name: "discount_totals",
    type: "json",
    nullable: true
  })
  public discountTotals;

  @Column({
    name: "group",
    type: "varchar",
    length: 255,
    nullable: true
  })
  public group: string;

  @Column({
    name: "extend",
    type: "json",
    nullable: true
  })
  public extend;

  @Column({
    name: "loyalty_program_detail_id",
    type: "int",
    nullable: true
  })
  public loyaltyProgramDetailId;
}
