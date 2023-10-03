import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Audience } from "./Audience";
import { Customer } from "./Customer";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "audience_member" })
export class AudienceMember extends WalkInBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id = undefined;

  @ManyToOne(type => Audience)
  @JoinColumn({
    name: "audience_id",
    referencedColumnName: "id"
  })
  public audience: Audience;

  @ManyToOne(type => Customer)
  @JoinColumn({
    name: "customer_id",
    referencedColumnName: "id"
  })
  public customer: Customer;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status = "";
}
