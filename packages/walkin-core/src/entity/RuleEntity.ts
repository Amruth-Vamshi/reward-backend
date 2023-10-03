import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { STATUS } from "../modules/common/constants";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { RuleAttribute } from "./RuleAttribute";

@Entity()
export class RuleEntity extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "entity_name"
  })
  public entityName: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "entity_code"
  })
  public entityCode: string;

  @Column({
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @OneToMany(() => RuleAttribute, ruleAttribute => ruleAttribute.ruleEntity, {
    eager: true
  })
  public ruleAttributes: RuleAttribute[];

  constructor() {
    super();
  }
}
