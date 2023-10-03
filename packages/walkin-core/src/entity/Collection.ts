import {
  JoinColumn,
  Column,
  Entity,
  ManyToOne,
  Unique,
  ManyToMany,
  JoinTable
} from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Organization } from "./Organization";

@Entity({
  name: "collection"
})
@Unique(["name", "organization"])
export class Collection extends WalkInBaseEntityUUID {
  @Column({
    name: "name",
    nullable: false,
    type: "varchar"
  })
  public name: string;

  @Column({
    name: "active",
    nullable: false,
    type: "boolean",
    default: true
  })
  public active: boolean;

  @Column({
    name: "code",
    nullable: false,
    type: "varchar"
  })
  public code: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
