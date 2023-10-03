import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "loyalty_totals" })
export class LoyaltyTotals {
  @PrimaryGeneratedColumn()
  public id: string = undefined;

  @Column({
    name: "daily_points",
    nullable: false,
    type: "float",
    default: 0
  })
  public dailyPoints;

  @Column({
    name: "weekly_points",
    nullable: false,
    type: "float",
    default: 0
  })
  public weeklyPoints;

  @Column({
    name: "monthly_points",
    nullable: false,
    type: "float",
    default: 0
  })
  public monthlyPoints;

  @Column({
    name: "yearly_points",
    nullable: false,
    type: "float",
    default: 0
  })
  public yearlyPoints;

  @Column({
    name: "overall_points",
    nullable: false,
    type: "float",
    default: 0
  })
  public overallPoints;

  @Column({
    name: "daily_transactions",
    nullable: false,
    type: "bigint",
    default: 0
  })
  public dailyTransactions: Number;

  @Column({
    name: "weekly_transactions",
    nullable: false,
    type: "bigint",
    default: 0
  })
  public weeklyTransactions: Number;

  @Column({
    name: "monthly_transactions",
    nullable: false,
    type: "bigint",
    default: 0
  })
  public monthlyTransactions: Number;

  @Column({
    name: "yearly_transactions",
    nullable: false,
    type: "bigint",
    default: 0
  })
  public yearlyTransactions: Number;

  @Column({
    name: "overall_transactions",
    nullable: false,
    type: "bigint",
    default: 0
  })
  public overallTransactions: Number;

  @Column({
    name: "last_transaction_date",
    nullable: true,
    type: "datetime"
  })
  public lastTransactionDate;
}
