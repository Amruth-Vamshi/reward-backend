import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique
} from "typeorm";
import { Metric } from "./Metric";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Organization } from "../entity";

@Entity({ name: "metric_filter" })
@Unique(["key", "organization"])
@Unique(["name", "organization"])
export class MetricFilter extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public key: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public type: string;

  @ManyToMany(() => Metric, metric => metric.filters)
  public metrics: Metric[];

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
