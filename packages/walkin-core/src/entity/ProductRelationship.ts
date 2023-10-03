import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Product } from "./Product";
import {
  PRODUCT_TYPE,
  PRODUCT_RELATIONSHIP,
} from "../modules/common/constants/constants";
@Entity({
  name: "product_relationship",
})
export class ProductRelationship extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    name: "parent_type",
    type: "varchar",
    enum: PRODUCT_TYPE,
  })
  public parentType: string;

  @Column({
    nullable: false,
    name: "child_type",
    type: "varchar",
    enum: PRODUCT_TYPE,
  })
  public childType: string;

  @Column({
    nullable: false,
    type: "varchar",
    enum: PRODUCT_RELATIONSHIP,
  })
  public relationship: string;

  @Column({
    nullable: false,
    name: "parent_id",
    type: "varchar",
  })
  public parentId: string;

  @Column({
    nullable: false,
    name: "child_id",
    type: "varchar",
  })
  public childId: string;

  @Column({
    name: "config",
    nullable: true,
    type: "simple-json",
  })
  public config: object;
}
