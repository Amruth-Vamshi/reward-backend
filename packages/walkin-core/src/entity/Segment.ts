import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Tree
} from "typeorm";
import { Application } from "./Application";
import { Organization } from "./Organization";
import { Rule } from "./Rule";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "segment" })
export class Segment extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    unique: true
  })
  public name: string;

  @Column({
    type: "varchar",
    length: 1000,
    nullable: true
  })
  public description: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public segmentType: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status: string;

  @ManyToOne(type => Rule)
  @JoinColumn({
    name: "rule_id",
    referencedColumnName: "id"
  })
  public rule: Rule;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @ManyToOne(type => Application)
  @JoinColumn({
    name: "application_id",
    referencedColumnName: "id"
  })
  public application: Application;
}
