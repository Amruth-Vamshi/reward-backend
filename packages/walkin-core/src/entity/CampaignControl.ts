import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { STATUS } from "../modules/common/constants";
import { Campaign } from "../../../walkin-rewardx/src/entity/Campaign";
import { Customer } from "./Customer";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "campaign_control" })
export class CampaignControl extends WalkInBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id = undefined;

  @ManyToOne(type => Customer)
  @JoinColumn({
    name: "customer_id",
    referencedColumnName: "id"
  })
  public customer: Customer;

  @ManyToOne(type => Campaign)
  @JoinColumn({
    name: "campaign_id",
    referencedColumnName: "id"
  })
  public campaign: Campaign;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

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

  @Column({
    nullable: false,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status = "";
}
