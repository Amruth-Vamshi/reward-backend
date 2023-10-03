import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { MetricFilter } from "./MetricFilter";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "metric" })
@Unique(["name", "organization"])
export class Metric extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public description: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public query: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public type: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public source: string;

  @ManyToMany(() => MetricFilter, filter => filter.metrics)
  @JoinTable()
  public filters;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status: string;
}
