import {
  Organization,
  RuleSet,
  WalkInBaseEntityUUID
} from "../../../walkin-core/src/entity";
import { Campaign } from "./Campaign";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { STATUS } from "../../../walkin-core/src/modules/common/constants";
import { COLLECTIONS_ENTITY_TYPE } from "../modules/common/constants/constant";

@Entity()
export class Collections extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public name: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 1000
  })
  public description: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @ManyToOne(type => Campaign)
  @JoinColumn({
    name: "campaign_id",
    referencedColumnName: "id"
  })
  public campaign: Campaign;

  @Column({
    nullable: false,
    type: "varchar",
    enum: COLLECTIONS_ENTITY_TYPE
  })
  public entity;

  @Column({
    nullable: false,
    type: "varchar",
    default: STATUS.ACTIVE,
    enum: STATUS
  })
  public status;

  @ManyToOne(type => RuleSet)
  @JoinColumn({
    name: "rule_set_id",
    referencedColumnName: "id"
  })
  public ruleSet: RuleSet;
}
