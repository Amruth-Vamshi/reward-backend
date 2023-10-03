import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { OptionValue } from "./OptionValue";
import { ProductVariant } from "./ProductVariant";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({
  name: "product_variant_value"
})
export class ProductVariantValue extends WalkInBaseEntity {
  @ManyToOne(type => ProductVariant)
  @JoinColumn({
    name: "product_variant_id",
    referencedColumnName: "id"
  })
  public productVariant: ProductVariant;

  @ManyToOne(type => OptionValue)
  @JoinColumn({
    name: "option_value_id",
    referencedColumnName: "id"
  })
  public optionValue: OptionValue;

  @RelationId(
    (productVariantValue: ProductVariantValue) =>
      productVariantValue.productVariant
  )
  public productVariantId: string;

  @RelationId(
    (productVariantValue: ProductVariantValue) =>
      productVariantValue.optionValue
  )
  public optionValueId: string;
  constructor() {
    super();
  }
}
