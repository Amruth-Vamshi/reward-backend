import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Index,
  Unique
} from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity()
@Unique(["name", "organization"])
export class Workflow extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    unique: true
  })
  public name: string;

  @Column({
    type: "varchar"
  })
  public description: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @RelationId((workflow: Workflow) => workflow.organization)
  public organizationId: string;
}
