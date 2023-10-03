import { Entity, JoinColumn, ManyToOne, RelationId, Column } from "typeorm";
import { Option } from "./Option";
import { Product } from "./Product";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({
  name: "product_option"
})
export class CategoryProductOption extends WalkInBaseEntity {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public productOptionLevel: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public productOptionLevelId: string;

  @ManyToOne(type => Product)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id"
  })
  public product: Product;

  @ManyToOne(type => Option)
  @JoinColumn({
    name: "option_id",
    referencedColumnName: "id"
  })
  public option: Option;

  @RelationId((productOption: CategoryProductOption) => productOption.product)
  public productId: string;

  @RelationId((productOption: CategoryProductOption) => productOption.option)
  public optionId: string;
  constructor() {
    super();
  }
}
