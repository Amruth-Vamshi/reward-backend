import {
  JoinColumn,
  Column,
  Entity,
  ManyToOne,
  Unique,
  ManyToMany,
  JoinTable
} from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Organization } from "./Organization";
import { ChargeType } from "./ChargeType";
import { Store } from "./Store";
@Entity({
  name: "channel"
})
@Unique(["name", "organization", "channelCode"])
class Channel extends WalkInBaseEntityUUID {
  @Column({
    name: "name",
    nullable: false,
    type: "varchar"
  })
  public name: string;

  @Column({
    name: "channelCode",
    nullable: false,
    type: "varchar"
  })
  public channelCode: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @ManyToMany(type => ChargeType, chargeType => chargeType.channels)
  @JoinTable({
    name: "channel_charge_type"
  })
  public chargeTypes: ChargeType[];
}

export { Channel };
