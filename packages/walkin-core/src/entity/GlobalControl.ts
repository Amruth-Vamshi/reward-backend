import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany
} from "typeorm";
import { STATUS } from "../modules/common/constants";
import { Customer } from "./Customer";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "global_control" })
export class GlobalControl extends WalkInBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id = undefined;

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

  @Column({
    nullable: true,
    type: "datetime"
  })
  public startTime: Date;

  @Column({
    nullable: true,
    type: "datetime"
  })
  public endTime: Date;

  @Column({
    nullable: false,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;
}
