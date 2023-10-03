import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Product } from "./Product";

@Entity({
  name: "menu_timing_for_product"
})
export class MenuTimingForProduct extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public code: string;
}
