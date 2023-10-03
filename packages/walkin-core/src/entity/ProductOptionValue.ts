import { Entity, JoinColumn, ManyToOne, RelationId, Column } from "typeorm";
import { CategoryProductOption, OptionValue } from ".";
import { Option } from "./Option";
import { Product } from "./Product";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({
  name: "product_option_value"
})
export class ProductOptionValue extends WalkInBaseEntity {

  @ManyToOne(type => OptionValue)
  @JoinColumn({
    name: "option_value_id",
    referencedColumnName: "id"
  })
  public optionValue: OptionValue;

  @ManyToOne(type => CategoryProductOption)
  @JoinColumn({
    name: "product_option_id",
    referencedColumnName: "id"
  })
  public productOption: CategoryProductOption;

  @RelationId((productOptionValue: ProductOptionValue) => productOptionValue.optionValue)
  public optionValueId: string;

  @RelationId((productOptionValue: ProductOptionValue) => productOptionValue.productOption)
  public productOptionId: string;
}
