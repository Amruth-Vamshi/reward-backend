import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId
} from "typeorm";
import { Product } from "./Product";
import { Collection } from "./Collection";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";

@Entity({
  name: "product_collection"
})
export class ProductCollection extends WalkInBaseEntityUUID {
  @ManyToOne(type => Product)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id"
  })
  public product: Product;

  @ManyToOne(type => Collection)
  @JoinColumn({
    name: "collection_id",
    referencedColumnName: "id"
  })
  public collection: Collection;
}
