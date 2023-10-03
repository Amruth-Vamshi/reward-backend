import { Entity, JoinColumn, ManyToOne, RelationId, Column } from "typeorm";
import { Category } from "./Category";
import { Product } from "./Product";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({
  name: "product_category",
})
export class ProductCategory extends WalkInBaseEntity {
  @ManyToOne((type) => Product)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  public product: Product;

  @ManyToOne((type) => Category)
  @JoinColumn({
    name: "category_id",
    referencedColumnName: "id",
  })
  public category: Category;

  @Column({
    nullable: true,
    type: "int",
    name: "sortSeq",
    default: 0,
  })
  public sortSeq: number;

  @RelationId((productCategory: ProductCategory) => productCategory.product)
  public productId: string;

  @RelationId((productCategory: ProductCategory) => productCategory.category)
  public categoryId: string;
  constructor() {
    super();
  }
}
