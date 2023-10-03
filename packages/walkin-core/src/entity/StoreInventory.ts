import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
  ManyToMany,
} from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Store } from "./Store";
import { Product } from "./Product";

@Entity({
  name: "store_inventory",
})
export class StoreInventory extends WalkInBaseEntityUUID {
  @ManyToOne((type) => Product)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  public product: Product;
  @Column({
    nullable: false,
    type: "boolean",
    default: true,
  })
  public inventoryAvailable: boolean;

  @ManyToOne((type) => Store)
  @JoinColumn({
    name: "store_id",
    referencedColumnName: "id",
  })
  public store: Store;
}
