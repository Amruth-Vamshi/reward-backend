import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Product } from "./Product";
import {
  PRODUCT_TYPE,
  PRODUCT_RELATIONSHIP
} from "../modules/common/constants/constants";
@Entity({
  name: "product_combo"
})
export class ProductCombo extends WalkInBaseEntityUUID {
  @ManyToOne(type => Product)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id"
  })
  public productId: Product;

  @Column({
    nullable: false,
    type: "simple-json"
  })
  public config: string;
}
