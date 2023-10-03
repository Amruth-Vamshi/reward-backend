import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Product } from "./Product";
import { StoreFormat } from "./StoreFormat";
import { Channel } from "./Channel";
import { TaxType } from "./TaxType";
import { STATUS } from "../modules/common/constants";
@Entity({
  name: "product_tax_value",
})
export class ProductTaxValue extends WalkInBaseEntityUUID {
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

  @ManyToOne((type) => TaxType)
  @JoinColumn({
    name: "tax_level",
    referencedColumnName: "id",
  })
  public taxLevel: TaxType;

  @Column({
    name: "tax_value",
    type: "float",
    nullable: false,
  })
  public taxValue: number;

  @Column({
    nullable: true,
    type: "varchar",
    default: STATUS.ACTIVE,
  })
  public status: string;
}
