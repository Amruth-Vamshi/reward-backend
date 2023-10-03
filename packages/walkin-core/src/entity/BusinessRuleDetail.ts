import { Column, Entity, ManyToOne, JoinColumn, RelationId } from "typeorm";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Organization } from "./Organization";

@Entity({ name: "business_rule_detail" })
export class BusinessRuleDetail extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar",
    name: "rule_level"
  })
  public ruleLevel: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "rule_level_id"
  })
  public ruleLevelId: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "rule_type"
  })
  public ruleType: string;

  @Column({
    nullable: true,
    type: "varchar",
    name: "rule_value"
  })
  public ruleValue: string;

  @ManyToOne(
    () => Organization,
    organization => organization.businessRuleDetails
  )
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @RelationId((businessRule: BusinessRuleDetail) => businessRule.organization)
  public organizationId: string;
}
