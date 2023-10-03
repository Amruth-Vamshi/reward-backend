import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId
} from "typeorm";
import { Product } from "./Product";
import { CategoryProductOption } from "./CategoryProductOption";
import { ProductVariantValue } from "./ProductVariantValue";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({
  name: "product_variant"
})
export class ProductVariant extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    unique: true
  })
  public sku: string;

  @ManyToOne(type => Product)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id"
  })
  public product: Product;

  @OneToMany(
    type => ProductVariantValue,
    productVariantValues => productVariantValues.productVariant
  )
  public productVariantValues: ProductVariantValue[];

  @RelationId((productOption: CategoryProductOption) => productOption.product)
  public productId: string;
  constructor() {
    super();
  }
}
