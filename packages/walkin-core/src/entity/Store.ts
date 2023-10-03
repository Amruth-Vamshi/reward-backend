import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { STATUS, StatusEnum } from "../modules/common/constants";
import { LoyaltyTotals } from "./LoyaltyTotals";
import { Organization } from "./Organization";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";
@Entity()
export class Store extends WalkInEntityExtendBase {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public code: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public addressLine1: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public addressLine2: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public city: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public state: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public pinCode: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public country: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public externalStoreId: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @Column({
    nullable: true,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public STATUS: StatusEnum;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public email: string;

  @Column({
    name: "geo_location",
    type: "text",
    nullable: true
  })
  public geoLocation: string;

  @OneToOne(type => LoyaltyTotals)
  @JoinColumn({
    name: "loyalty_totals",
    referencedColumnName: "id"
  })
  public loyaltyTotals: LoyaltyTotals;
}
