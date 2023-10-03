import {
  Organization,
  RuleSet,
  WalkInBaseEntity
} from "@walkinserver/walkin-core/src/entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { LoyaltyProgramConfig } from "./loyalty-program-config";

@Entity({ name: "loyalty_program_detail" })
export class LoyaltyProgramDetail extends WalkInBaseEntity {
  @Column({
    name: "experiment_name",
    nullable: false,
    type: "varchar",
    length: 255
  })
  public experimentName: string;

  @Column({
    name: "experiment_code",
    nullable: false,
    type: "varchar",
    length: 255
  })
  public experimentCode: string;

  @Column({
    name: "description",
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

  @ManyToOne(type => LoyaltyProgramConfig)
  @JoinColumn({
    name: "loyalty_program_config_id",
    referencedColumnName: "id"
  })
  public loyaltyProgramConfig: LoyaltyProgramConfig;

  @Column({
    name: "extended",
    nullable: true,
    type: "simple-json"
  })
  public extended: object;

  @ManyToOne(type => RuleSet)
  @JoinColumn({
    name: "loyalty_earn_rule_set_id",
    referencedColumnName: "id"
  })
  public loyaltyEarnRuleSet: RuleSet;

  @Column({
    name: "collection_ids",
    nullable: true,
    type: "simple-json"
  })
  public collectionIds: object;
}
