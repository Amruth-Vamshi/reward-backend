import {
  WalkInBaseEntity,
  Customer
} from "@walkinserver/walkin-core/src/entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToMany,
  OneToOne
} from "typeorm";
import { LoyaltyTransaction } from "./loyalty-transaction";

@Entity({ name: "loyalty_ledger" })
export class LoyaltyLedger extends WalkInBaseEntity {
  @Column({
    type: "float",
    name: "points"
  })
  points;

  @Column({
    type: "float",
    name: "balance_snapshot"
  })
  balanceSnapshot;

  @Column({
    type: "float",
    name: "points_remaining",
    default: 0
  })
  pointsRemaining;

  @Column({
    type: "text"
  })
  public type: string;

  @Column({
    type: "varchar"
  })
  remarks: string;

  @Column({
    nullable: true,
    type: "datetime",
    name: "expiry_date"
  })
  public expiryDate: Date;

  @Column({
    nullable: true,
    type: "simple-json",
    name: "details"
  })
  public details: any;

  @ManyToOne(type => LoyaltyTransaction)
  @JoinColumn({
    name: "loyalty_transaction_id",
    referencedColumnName: "id"
  })
  loyaltyTransaction: LoyaltyTransaction;
}
