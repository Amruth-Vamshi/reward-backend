import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import {
  Organization,
  RuleSet,
  WalkInBaseEntity
} from "../../../walkin-core/src/entity";
import { Campaign } from "./Campaign";
import { LoyaltyCard } from "./loyalty-card";
@Entity({ name: "loyalty_program_config" })
export class LoyaltyProgramConfig extends WalkInBaseEntity {
  @Column({
    name: "name",
    type: "varchar",
    length: 255,
    nullable: false
  })
  public name: string;

  @Column({
    name: "code",
    type: "varchar",
    length: 255,
    nullable: false
  })
  public code: string;

  @Column({
    type: "varchar",
    length: 1000,
    nullable: true
  })
  public description: string;

  @Column({
    name: "extended",
    nullable: true,
    type: "simple-json"
  })
  public extended: object;

  @Column({
    type: "int",
    name: "expiry_value",
    nullable: false
  })
  public expiryValue: number;

  @Column({
    type: "varchar",
    length: 255,
    name: "expiry_unit",
    nullable: false
  })
  public expiryUnit: string;

  @ManyToOne(type => LoyaltyCard)
  @JoinColumn({
    name: "loyalty_card_id",
    referencedColumnName: "id"
  })
  loyaltyCard: LoyaltyCard;

  @ManyToOne(type => Campaign)
  @JoinColumn({
    name: "campaign_id",
    referencedColumnName: "id"
  })
  campaign: Campaign;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  organization: Organization;

  @ManyToOne(type => RuleSet)
  @JoinColumn({
    name: "loyalty_burn_rule_set_id",
    referencedColumnName: "id"
  })
  public loyaltyBurnRuleSet: RuleSet;

  @Column({
    name: "cancel_transaction_rules",
    nullable: false,
    type: "simple-json"
  })
  public cancelTransactionRules: any;

  @Column({
    name: "applicable_events",
    nullable: true,
    type: "simple-json"
  })
  public applicableEvents: object;
}
