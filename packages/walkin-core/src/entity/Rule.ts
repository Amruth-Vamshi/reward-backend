import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  TreeParent,
  Unique
} from "typeorm";
import {
  RULE_TYPE,
  STATUS,
  StatusEnum,
  RULE_TYPEEnum
} from "../modules/common/constants";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Campaign } from "../../../walkin-rewardx/src/entity/Campaign";
import { RuleEffect } from "./Effect";
import { RuleCondition } from "./Condition";

@Entity()
@Unique(["name", "organization"])
export class Rule extends WalkInBaseEntity {
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

  @Column({
    type: "varchar",
    // enum: Object.values(STATUS),
    default: STATUS.ACTIVE
  })
  public status: StatusEnum;

  @Column({
    type: "varchar",
    // enum: Object.values(STATUS),
    default: RULE_TYPE.SIMPLE
  })
  public type: RULE_TYPEEnum;

  @Column({
    nullable: false,
    type: "simple-json",
    name: "rule_configuration"
  })
  public ruleConfiguration: any;

  @Column({
    nullable: false,
    type: "simple-json",
    name: "rule_expression"
  })
  public ruleExpression: any;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  // @OneToMany(() => Campaign, campaign => campaign.triggerRule)
  // public triggerRule: Rule[];

  // @OneToMany(() => Campaign, campaign => campaign.audienceFilterRule)
  // public audienceFilterRule: Rule[];

  @ManyToMany(() => RuleEffect, effect => effect.rules)
  @JoinTable({
    name: "rule_effect_rule",
    joinColumn: {
      name: "rule_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "rule_effect_id",
      referencedColumnName: "id"
    }
  })
  public effects: RuleEffect[];

  @ManyToMany(() => RuleCondition, condition => condition.rules)
  @JoinTable({
    name: "rule_condition_rule",
    joinColumn: {
      name: "rule_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "rule_condition_id",
      referencedColumnName: "id"
    }
  })
  public conditions: RuleCondition[];

  constructor() {
    super();
  }
}
