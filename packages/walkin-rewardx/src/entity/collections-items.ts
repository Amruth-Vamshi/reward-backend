import { WalkInBaseEntityUUID } from "../../../walkin-core/src/entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Collections } from "./collections";

@Entity({ name: "collections_items" })
export class CollectionsItems extends WalkInBaseEntityUUID {
  @Column({
    name: "item_id",
    nullable: false,
    type: "varchar",
    length: 255
  })
  public itemId: string;

  @ManyToOne(type => Collections)
  @JoinColumn({
    name: "collections_id",
    referencedColumnName: "id"
  })
  public collections: Collections;
}
