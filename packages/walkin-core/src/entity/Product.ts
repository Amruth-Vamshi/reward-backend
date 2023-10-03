import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { STATUS } from "../modules/common/constants";
import { PRODUCT_TYPE } from "../modules/common/constants/constants";
import { Organization } from "./Organization";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";

@Entity()
export class Product extends WalkInEntityExtendBase {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public code: string;

  @Column({
    nullable: true,
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
    name: "product_type",
    nullable: true,
    type: "varchar",
    length: 255,
    default: PRODUCT_TYPE.PRODUCT
  })
  public productType: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    default: PRODUCT_TYPE.REGULAR
  })
  public sku: string;

  @Column({
    nullable: false,
    type: "varchar",
    // enum: Object.values(STATUS),
    default: STATUS.ACTIVE
  })
  public status: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @Column({
    name: "external_product_id",
    nullable: false,
    type: "varchar"
  })
  public externalProductId: string;

  @Column({
    name: "isProductUnique",
    default: true,
    nullable: false,
    type: "boolean"
  })
  public isProductUnique: boolean;

  @Column({
    name: "categoryCode",
    nullable: true,
    type: "simple-json"
  })
  public categoryCode: JSON;

  @Column({
    name: "extend",
    nullable: true,
    type: "simple-json"
  })
  public extend: JSON;
}
