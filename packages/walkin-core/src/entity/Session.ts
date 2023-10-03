import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { EnumStatus } from "../modules/common/constants";
import { Customer } from "./Customer";
import { EntityExtend } from "./EntityExtend";
import { Organization } from "./Organization";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";

@Entity()
export class Session extends WalkInEntityExtendBase {
  // TODO: Do we need extended parameters? if yes then
  // add them in the APIs

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public status: EnumStatus;

  @ManyToOne(type => Customer)
  @JoinColumn({
    name: "customer_id",
    referencedColumnName: "id"
  })
  public customer: Customer;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
