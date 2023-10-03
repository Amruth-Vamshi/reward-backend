import {
  WalkInBaseEntity,
  Customer,
  Store,
  Organization
} from "@walkinserver/walkin-core/src/entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CustomerLoyalty } from "./customer-loyalty";
import { CustomerLoyaltyProgram } from "./customer-loyalty-program";
import { LoyaltyProgram } from "./loyalty-program";
import { Status } from "./status";

@Entity({ name: "loyalty_transaction" })
export class LoyaltyTransaction extends WalkInBaseEntity {
  @ManyToOne(type => Status)
  @JoinColumn({
    name: "status_code",
    referencedColumnName: "statusId"
  })
  statusCode: Status;

  @Column({
    type: "float",
    default: 0,
    name: "points_blocked"
  })
  pointsBlocked;

  @Column({
    type: "float",
    default: 0,
    name: "points_issued"
  })
  pointsIssued;

  @Column({
    type: "float",
    default: 0,
    name: "points_redeemed"
  })
  pointsRedeemed;

  @Column({
    type: "text",
    name: "loyalty_reference_id"
  })
  public loyaltyReferenceId: string;

  @Column({
    type: "text"
  })
  public type: string;

  @Column({
    type: "varchar",
    nullable: false
  })
  public name: string;

  @ManyToOne(type => CustomerLoyaltyProgram)
  @JoinColumn({
    name: "customer_loyalty_program_id",
    referencedColumnName: "id"
  })
  public customerLoyaltyProgram: CustomerLoyaltyProgram;

  @ManyToOne(type => Store)
  @JoinColumn({
    name: "store_id",
    referencedColumnName: "id"
  })
  public store: Store;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
