import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
  Tree,
  TreeChildren,
  TreeParent,
  Unique,
  OneToOne
} from "typeorm";
import { STATUS } from "../modules/common/constants";
import { Catalog } from "./Catalog";
import { ProductCategory } from "./ProductCategory";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";
import { PRODUCT_TYPE } from "../modules/common/constants/constants";
import { MenuTimingForCategory } from "./MenuTimingForCategory";
@Entity()
@Tree("closure-table")
export class Category extends WalkInEntityExtendBase {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public name: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 1000
  })
  public description: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public code: string;

  @Column({
    nullable: true,
    type: "int",
    name: "sortSeq",
    default: 0
  })
  public sortSeq: number;

  @Column({
    nullable: true,
    type: "varchar",
    // enum: Object.values(STATUS),
    default: STATUS.ACTIVE
  })
  public status: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255
  })
  public imageUrl: string;

  @Column({
    nullable: false,
    type: "boolean",
    default: true
  })
  public listable: boolean;

  @OneToMany(
    type => ProductCategory,
    productCategory => productCategory.product,
    {
      eager: true
    }
  )
  public productCategories: ProductCategory;

  @Column({
    name: "product_type",
    nullable: false,
    type: "varchar",
    length: 255,
    default: PRODUCT_TYPE.PRODUCT
  })
  public productType: string;

  @ManyToOne(type => Catalog)
  @JoinColumn({
    name: "catalog_id",
    referencedColumnName: "id"
  })
  public catalog: Catalog;

  @OneToOne(
    () => MenuTimingForCategory,
    menuTimingForCategory => menuTimingForCategory.category
  )
  public menuTimingsForCategory: MenuTimingForCategory;

  @TreeParent()
  public parent: Category;

  @TreeChildren()
  public children: Category[];

  @RelationId((category: Category) => category.parent)
  public parentId: string;

  @RelationId((category: Category) => category.catalog)
  public catalogId: string;
  constructor() {
    super();
  }
}
