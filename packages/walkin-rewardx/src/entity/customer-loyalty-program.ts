import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import {
  LoyaltyTotals,
  WalkInBaseEntityUUID
} from "../../../walkin-core/src/entity";
import { CustomerLoyalty } from "./customer-loyalty";

@Entity({ name: "customer_loyalty_program" })
export class CustomerLoyaltyProgram extends WalkInBaseEntityUUID {
  @Column({
    name: "loyalty_program_code",
    type: "varchar",
    length: 255,
    nullable: false
  })
  public loyaltyProgramCode: string;

  @Column({
    name: "loyalty_experiment_code",
    type: "varchar",
    length: 255,
    nullable: false
  })
  public loyaltyExperimentCode: string;

  @Column({
    name: "redeemed_transactions",
    type: "varchar",
    length: 255,
    nullable: false,
    default: 0
  })
  public redeemedTransactions: string;

  @Column({
    name: "issued_transactions",
    type: "varchar",
    length: 255,
    nullable: false,
    default: 0
  })
  public issuedTransactions: string;

  @ManyToOne(type => CustomerLoyalty)
  @JoinColumn({
    name: "customer_loyalty_id",
    referencedColumnName: "id"
  })
  public customerLoyalty: CustomerLoyalty;

  @Column({
    name: "status",
    type: "varchar",
    length: 255,
    nullable: false,
    default: "ACTIVE"
  })
  public status: string;

  @OneToOne(type => LoyaltyTotals)
  @JoinColumn({
    name: "loyalty_totals",
    referencedColumnName: "id"
  })
  public loyaltyTotals: LoyaltyTotals;
}
