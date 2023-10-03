import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique
} from "typeorm";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Workflow } from "./Workflow";

@Entity({ name: "workflow_state" })
@Unique(["name", "workflow"])
export class WorkflowState extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    nullable: false
  })
  public name: string;

  @Column({
    type: "int",
    nullable: false,
  })
  public code: number;

  @Column({
    type: "varchar",
    nullable: false
  })
  public description: string;

  @ManyToOne(type => Workflow)
  @JoinColumn({
    name: "workflow_id",
    referencedColumnName: "id"
  })
  public workflow: Workflow;

  @RelationId((workflowState: WorkflowState) => workflowState.workflow)
  public workflowId: string;
}
