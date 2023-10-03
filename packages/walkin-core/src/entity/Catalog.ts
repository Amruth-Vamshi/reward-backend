import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
  OneToMany
} from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Category } from "./Category";
import { STATUS } from "../modules/common/constants";

@Entity()
@Unique(["catalogCode", "organization"])
export class Catalog extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public name: string;

  @Column({
    type: "varchar",
    length: 1000
  })
  public description: string;

  @Column({
    name: "catalog_code",
    type: "varchar",
    length: 255
  })
  public catalogCode: string;

  @Column({
    nullable: true,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: string;

  @Column({
    nullable: false,
    type: "boolean",
    default: true
  })
  public listable: boolean;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @OneToMany(() => Category, category => category.catalog, {
    eager: true
  })
  public categories: Category[];

  @Column({
    name: "external_catalog_id",
    nullable: true,
    type: "varchar"
  })
  public externalCatalogId: string;

  constructor() {
    super();
  }
}
