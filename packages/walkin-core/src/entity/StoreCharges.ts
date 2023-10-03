import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Product } from "./Product";
import { StoreFormat } from "./StoreFormat";
import { Channel } from "./Channel";
import { Store } from "./Store";
@Entity({
  name: "store_charge",
})
export class StoreCharge extends WalkInBaseEntityUUID {
  @ManyToOne((type) => Store)
  @JoinColumn({
    name: "store_id",
    referencedColumnName: "id",
  })
  public store: Store;

  @Column({
    name: "charge_value",
    type: "float",
    nullable: false,
  })
  public chargeValue: number;

  @Column({
    name: "charge_value_type",
    type: "varchar",
    nullable: false,
  })
  public chargeValueType: string;

  @Column({
    name: "charge_type",
    type: "varchar",
    nullable: false,
  })
  public chargeType: string;
}
