import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Product } from "./Product";
import { StoreFormat } from "./StoreFormat";
import { Channel } from "./Channel";
import { ChargeType } from "./ChargeType";
import { STATUS } from "../modules/common/constants";
@Entity({
  name: "product_charge_value",
})
export class ProductChargeValue extends WalkInBaseEntityUUID {
  @ManyToOne((type) => Product)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  public product: Product;

  @ManyToOne((type) => StoreFormat)
  @JoinColumn({
    name: "store_format",
    referencedColumnName: "id",
  })
  public storeFormat: StoreFormat;

  @ManyToOne((type) => Channel)
  @JoinColumn({
    name: "channel",
    referencedColumnName: "id",
  })
  public channel: Channel;

  @ManyToOne((type) => ChargeType)
  @JoinColumn({
    name: "charge_type",
    referencedColumnName: "id",
  })
  public chargeType: ChargeType;

  @Column({
    name: "charge_value",
    type: "float",
    nullable: false,
  })
  public chargeValue: number;

  @Column({
    nullable: true,
    type: "varchar",
    default: STATUS.ACTIVE,
  })
  public status: string;
}
