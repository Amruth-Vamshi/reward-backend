import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Customer } from "./Customer";
import { ADDRESS_TYPE, STATUS, StatusEnum } from "../modules/common/constants";

@Entity({
  name: "address"
})
export class Address extends WalkInBaseEntityUUID {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public addressLine1: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public addressLine2: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public city: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public state: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public country: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public zip: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public contactNumber: string;

  @Column({
    nullable: true,
    type: "varchar",
    unique: true
  })
  public addressTitle: string;
  @Column({
    nullable: true,
    enum: ADDRESS_TYPE,
    type: "varchar"
  })
  public addressType: string;

  @Column({
    nullable: true,
    default: STATUS.ACTIVE,
    type: "varchar"
  })
  public status: string;

  // ref - https://github.com/typeorm/typeorm/blob/master/docs/entities.md#spatial-columns
  // ref why column is string type - https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry
  @Column({
    name: "geo_location",
    nullable: true,
    type: "text"
  })
  public geoLocation: string;

  @OneToOne(type => Customer, customer => customer.address)
  public customer: Customer;
}
