import {
  Column,
  Entity,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent
} from "typeorm";
import { STATUS, StatusEnum } from "../modules/common/constants";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Store } from "./Store";

@Entity()
@Tree("closure-table")
export class StoreAdminLevel extends WalkInBaseEntityUUID {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public code: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public name: string;

  @TreeChildren()
  public children: StoreAdminLevel[];

  @TreeParent()
  public parent: StoreAdminLevel;
}
