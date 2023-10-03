import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Organization, WalkInBaseEntity } from "../../../walkin-core/src/entity";

@Entity()
export class Job extends WalkInBaseEntity {
  @Column({
    name: "job_id",
    nullable: false,
    type: "varchar",
    length: 255
  })
  public jobId: string;

  @Column({
    name: "job_type",
    nullable: false,
    type: "varchar",
    default: "GENERAL"
  })
  public jobType: string;

  @Column({
    name: "last_executed_time",
    nullable: false,
    type: "datetime"
  })
  public lastExecutedTime: Date;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}