import {
  WalkInBaseEntity,
  Customer,
  Rule,
  Organization
} from "@walkinserver/walkin-core/src/entity";
import { Campaign } from "./Campaign";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { LoyaltyCard } from "./loyalty-card";

@Entity({ name: "loyalty_program" })
export class LoyaltyProgram extends WalkInBaseEntity {
  @Column({
    type: "text",
    nullable: true
  })
  public name: string;

  @Column({
    type: "text"
  })
  public code: string;

  @Column({
    type: "text",
    nullable: true
  })
  public description: string;

  @Column({
    type: "int",
    name: "expiry_value"
  })
  expiryValue;

  @Column({
    type: "text",
    name: "expiry_unit"
  })
  expiryUnit;

  @ManyToOne(type => LoyaltyCard)
  @JoinColumn({
    name: "loyalty_card_id",
    referencedColumnName: "id"
  })
  loyaltyCard: LoyaltyCard;

  @ManyToOne(type => Rule)
  @JoinColumn({
    name: "loyalty_earn_rule_id",
    referencedColumnName: "id"
  })
  loyaltyEarnRule: Rule;

  @ManyToOne(type => Rule)
  @JoinColumn({
    name: "loyalty_burn_rule_id",
    referencedColumnName: "id"
  })
  loyaltyBurnRule: Rule;

  @ManyToOne(type => Rule)
  @JoinColumn({
    name: "loyalty_expiry_rule_id",
    referencedColumnName: "id"
  })
  loyaltyExpiryRule: Rule;

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
  organization;

  @RelationId((loyaltyProgram: LoyaltyProgram) => loyaltyProgram.organization)
  organizationId;

  @Column({
    nullable: true,
    type: "simple-json",
    name: "earn_rule_data"
  })
  public earnRuleData: any;

  @Column({
    nullable: true,
    type: "simple-json",
    name: "earn_rule_validation"
  })
  public earnRuleValidation: any;

  @Column({
    nullable: true,
    type: "simple-json",
    name: "burn_rule_validation"
  })
  public burnRuleValidation: any;

  @Column({
    nullable: true,
    type: "simple-json",
    name: "burn_rule_data"
  })
  public burnRuleData: any;

  @Column({
    nullable: false,
    type: "simple-json",
    name: "cancel_transaction_rules"
  })
  public cancelTransactionRules: any;
}
