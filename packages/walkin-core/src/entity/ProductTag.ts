import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
  Unique
} from "typeorm";
import { Product } from "./Product";
import { Tag } from "./Tag";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";

@Entity({
  name: "product_tag"
})
@Unique(["product", "tag"])
export class ProductTag extends WalkInBaseEntityUUID {
  @ManyToOne(type => Product)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id"
  })
  public product: Product;

  @ManyToOne(type => Tag)
  @JoinColumn({
    name: "tag_id",
    referencedColumnName: "id"
  })
  public tag: Tag;
}
