import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  Unique,
  OneToOne,
} from "typeorm";
import { STATUS } from "../modules/common/constants";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Store } from "./Store";
@Entity({
  name: "store_service_area",
})
export class StoreServiceArea extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "area_type",
  })
  public areaType: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    name: "status",
    default: STATUS.ACTIVE,
  })
  public status: string;

  @Column({
    nullable: true,
    type: "text",
  })
  public area: string; // WKT or pincode or radius(in meters)
}
