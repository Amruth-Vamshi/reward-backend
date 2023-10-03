import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { STATUS } from "../modules/common/constants";
import { Organization } from "./Organization";
import { RuleEntity } from "./RuleEntity";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity()
export class RuleAttribute extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "attribute_name"
  })
  public attributeName: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "attribute_value_type"
  })
  public attributeValueType: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 1000
  })
  public description: string;

  @Column({
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;

  @ManyToOne(type => RuleEntity)
  @JoinColumn({
    name: "rule_entity_id",
    referencedColumnName: "id"
  })
  public ruleEntity: RuleEntity;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
  constructor() {
    super();
  }
}
