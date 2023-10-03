import { Column, Entity } from "typeorm";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "business_rule" })
export class BusinessRule extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar",
    name: "rule_level"
  })
  public ruleLevel: string;

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
  public ruleDefaultValue: string;
}
