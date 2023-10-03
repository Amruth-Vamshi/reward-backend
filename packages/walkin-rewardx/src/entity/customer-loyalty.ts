import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  RelationId,
  BeforeInsert
} from "typeorm";
import {
  WalkInBaseEntity,
  Customer,
  LoyaltyTotals
} from "@walkinserver/walkin-core/src/entity";
import { LoyaltyCard } from "./loyalty-card";
import { STATUS } from "../../../walkin-core/src/modules/common/constants";

@Entity({ name: "customer_loyalty" })
export class CustomerLoyalty extends WalkInBaseEntity {
  @Column({
    type: "float",
    default: 0
  })
  public points;

  @Column({
    type: "int",
    default: 0,
    name: "points_blocked"
  })
  public pointsBlocked;

  @Column({
    type: "int",
    default: 0,
    name: "redeemed_transactions"
  })
  public redeemedTransactions;

  @Column({
    type: "int",
    default: 0,
    name: "issued_transactions"
  })
  public issuedTransactions;

  @ManyToOne(type => Customer)
  @JoinColumn({
    name: "customer_id",
    referencedColumnName: "id"
  })
  public customer;

  @RelationId((customerLoyalty: CustomerLoyalty) => customerLoyalty.customer)
  public customerId;

  @ManyToOne(type => LoyaltyCard)
  @JoinColumn({
    name: "loyalty_card_id",
    referencedColumnName: "id"
  })
  public loyaltyCard;

  @RelationId((customerLoyalty: CustomerLoyalty) => customerLoyalty.loyaltyCard)
  public loyaltyCardId;

  @BeforeInsert()
  public setDefaultPOints() {
    if (this.points !== 0) {
      this.points = 0;
    }
  }

  @Column({
    name: "negative_points",
    nullable: true,
    type: "int"
  })
  public negativePoints;

  @Column({
    name: "start_date",
    type: "datetime",
    nullable: false
  })
  public startDate;

  @Column({
    name: "end_date",
    type: "datetime",
    nullable: true
  })
  public endDate;

  @Column({
    nullable: true,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;

  @OneToOne(type => LoyaltyTotals)
  @JoinColumn({
    name: "loyalty_totals",
    referencedColumnName: "id"
  })
  public loyaltyTotals: LoyaltyTotals;
}
