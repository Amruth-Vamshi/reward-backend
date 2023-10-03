import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
  OneToOne
} from "typeorm";
import { Organization } from "./Organization";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";
import { Address } from "./Address";
import { Tier } from "./Tier";
/**
 *
 */
@Entity()
@Unique(["customerIdentifier", "organization"])
export class Customer extends WalkInEntityExtendBase {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public firstName: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public lastName: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public email: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public phoneNumber: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public gender: string;

  @Column({
    nullable: true,
    type: "date"
  })
  public dateOfBirth: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public externalCustomerId: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public customerIdentifier: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public status: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    default: null
  })
  public externalMembershipId: string;

  @ManyToOne(type => Tier)
  @JoinColumn({
    name: "tier",
    referencedColumnName: "code"
  })
  public tier: Tier;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @OneToOne(type => Address, address => address.customer)
  @JoinColumn({
    name: "address",
    referencedColumnName: "id"
  })
  public address: Address;

  @Column({
    name: "extend",
    nullable: true,
    type: "simple-json"
  })
  public extend: JSON;
}
