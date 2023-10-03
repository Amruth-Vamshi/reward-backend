import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Product } from "./Product";
import { StoreFormat } from "./StoreFormat";
import { Channel } from "./Channel";
@Entity({
  name: "product_price_value",
})
export class ProductPriceValue extends WalkInBaseEntityUUID {
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

  @Column({
    name: "price_value",
    type: "float",
    nullable: false,
  })
  public priceValue: number;
}
