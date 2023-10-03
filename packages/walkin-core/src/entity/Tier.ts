import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "tier" })
@Unique(["code", "organization"])
export class Tier extends WalkInBaseEntity {
  @Column({
    name: "code",
    type: "varchar",
    length: 255,
    nullable: false
  })
  public code: string;

  @Column({
    name: "description",
    type: "varchar",
    length: 255,
    nullable: true
  })
  public description: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
