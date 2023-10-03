import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { STATUS } from "../../../walkin-core/src/modules/common/constants";
import { Campaign } from "./Campaign";

@Entity({
  name: "campaign_schedule"
})
export class CampaignSchedule {
  @PrimaryGeneratedColumn("increment")
  public id!: number;

  @ManyToOne(type => Campaign)
  @JoinColumn({
    name: "campaign_id",
    referencedColumnName: "id"
  })
  campaign: Campaign;

  @Column({
    name: "cron_expression",
    type: "varchar",
    length: 255,
    nullable: false
  })
  public cronExpression;

  @Column({
    nullable: false,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;

  @Column({
    name: "name",
    type: "varchar",
    length: 255,
    nullable: false
  })
  public name;
}
