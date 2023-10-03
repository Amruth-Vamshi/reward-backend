import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Unique
} from "typeorm";
import { Organization } from "./Organization";
import { Customer } from "./Customer";
import { STATUS } from "../modules/common/constants";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "customer_tag" })
@Unique(["name", "organization"])
export class CustomerTag extends WalkInBaseEntity {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
