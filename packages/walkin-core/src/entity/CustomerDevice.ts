import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Customer } from "./Customer";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";

/**
 *
 */
@Entity()
export class CustomerDevice extends WalkInEntityExtendBase {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public fcmToken: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public deviceId: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public osVersion: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public modelNumber: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public status: string;

  @ManyToOne(type => Customer)
  @JoinColumn({
    name: "customerId",
    referencedColumnName: "id"
  })
  public customer: Customer;
}
