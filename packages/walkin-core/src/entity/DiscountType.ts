import {
  OneToMany,
  OneToOne,
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  Unique,
  ManyToMany
} from "typeorm";

import { Organization } from "./Organization";
import { Channel } from "./Channel";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { STATUS } from "../modules/common/constants";
@Entity({ name: "discount_type" })
@Unique(["name", "organization"])
class DiscountType extends WalkInBaseEntityUUID {
  @Column({
    name: "name",
    nullable: false,
    type: "varchar"
  })
  public name: string;
  @Column({
    name: "discount_type_Code",
    nullable: false,
    type: "varchar"
  })
  public discountTypeCode: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @Column({
    name: "status",
    nullable: false,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;

  @Column({
    name: "enabled",
    nullable: false,
    type: "boolean",
    default: true
  })
  public enabled: boolean;
}

export { DiscountType };
