import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Rule } from "./Rule";

@Entity()
@Unique(["name", "organization"])
export class RuleSet extends WalkInBaseEntity {
  @Column({
    name: "name",
    nullable: false,
    type: "varchar",
    length: 255
  })
  public name: string;

  @Column({
    name: "description",
    nullable: true,
    type: "varchar",
    length: 1000
  })
  public description: string;

  @Column({
    name: "rules",
    type: "json"
  })
  public rules: [Rule];

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  constructor() {
    super();
  }
}
