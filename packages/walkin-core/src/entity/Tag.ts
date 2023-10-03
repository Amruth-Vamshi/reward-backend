import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
  ManyToMany
} from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";

@Entity()
@Unique(["tagName", "organization"])
export class Tag extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "tag_name"
  })
  public tagName: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public code: string;
  @Column({
    nullable: false,
    type: "boolean",
    default: true
  })
  public active: boolean;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
