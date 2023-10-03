import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { STATUS, StatusEnum } from "../modules/common/constants";
import { Organization } from "./Organization";
import { User } from "./User";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity()
export class WalkinProduct extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    unique: true
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
  public latest_version: string;

  @Column({
    nullable: true,
    type: "varchar",
    default: STATUS.ACTIVE
  })
  public status: StatusEnum;

  @ManyToMany(() => Organization, organization => organization.walkinProducts)
  @JoinTable({
    name: "walkin_product_org",
    joinColumn: {
      name: "walkin_product_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "organization_id",
      referencedColumnName: "id"
    }
  })
  public organizations: Organization[];
  constructor() {
    super();
  }
}
