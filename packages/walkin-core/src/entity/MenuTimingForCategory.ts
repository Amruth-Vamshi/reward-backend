import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Category } from "./Category";

@Entity({
  name: "menu_timing_for_category"
})
export class MenuTimingForCategory extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public code: string;

  @OneToOne(() => Category, category => category.menuTimingsForCategory)
  @JoinColumn({
    name: "category_id",
    referencedColumnName: "id"
  })
  public category: Category;
}
