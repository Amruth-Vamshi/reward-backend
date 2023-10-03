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
@Entity({ name: "charge_type" })
@Unique(["name", "organization"])
class ChargeType extends WalkInBaseEntityUUID {
  @Column({
    name: "name",
    nullable: false,
    type: "varchar"
  })
  public name: string;
  @Column({
    name: "chargeTypeCode",
    nullable: false,
    type: "varchar"
  })
  public chargeTypeCode: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @ManyToMany(type => Channel, channel => channel.chargeTypes)
  public channels: Channel[];
}

export { ChargeType };
