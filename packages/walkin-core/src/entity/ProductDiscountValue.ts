import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Product } from "./Product";
import { StoreFormat } from "./StoreFormat";
import { Channel } from "./Channel";
import { STATUS } from "../modules/common/constants";
import { DiscountType } from "./DiscountType";
@Entity({
  name: "product_discount_value"
})
export class ProductDiscountValue extends WalkInBaseEntityUUID {
  @ManyToOne(type => Product)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id"
  })
  public product: Product;

  @ManyToOne(type => StoreFormat)
  @JoinColumn({
    name: "store_format",
    referencedColumnName: "id"
  })
  public storeFormat: StoreFormat;

  @ManyToOne(type => Channel)
  @JoinColumn({
    name: "channel",
    referencedColumnName: "id"
  })
  public channel: Channel;

  @ManyToOne(type => DiscountType)
  @JoinColumn({
    name: "discount_type",
    referencedColumnName: "id"
  })
  public discountType: DiscountType;

  @Column({
    name: "discount_value",
    type: "float",
    nullable: false
  })
  public discountValue: number;

  @Column({
    nullable: true,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;

  @Column({
    name: "discount_value_type",
    nullable: true,
    type: "varchar"
  })
  public discountValueType: string;
}
