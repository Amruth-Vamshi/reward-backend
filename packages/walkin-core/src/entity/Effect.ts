import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Unique
} from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Rule } from "./Rule";
import { RuleEntity } from "./RuleEntity";
import { RuleAttribute } from "./RuleAttribute";

@Entity({ name: "rule_effect" })
@Unique(["name", "organization"])
export class RuleEffect extends WalkInBaseEntity {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public description: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public type: string;

  @Column({
    nullable: false,
    type: "longtext"
  })
  public value: string;

  @Column({
    name: "transforms",
    nullable: true,
    type: "json"
  })
  public transforms: JSON;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @ManyToOne(type => RuleEntity)
  @JoinColumn({
    name: "rule_entity_id",
    referencedColumnName: "id"
  })
  public ruleEntity: RuleEntity;

  @ManyToOne(type => RuleAttribute)
  @JoinColumn({
    name: "rule_attribute_id",
    referencedColumnName: "id"
  })
  public ruleAttribute: RuleAttribute;

  @ManyToMany(() => Rule, rule => rule.effects)
  @JoinTable({
    name: "rule_effect_rule",
    joinColumn: {
      name: "rule_effect_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "rule_id",
      referencedColumnName: "id"
    }
  })
  public rules: Rule[];
  constructor() {
    super();
  }
}
