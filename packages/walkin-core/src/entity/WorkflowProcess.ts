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

@Entity({ name: "workflow_process" })
@Unique(["name", "workflow"])
export class WorkflowProcess extends WalkInBaseEntity {
  @Column({
    type: "varchar"
  })
  public name: string;

  @Column({
    type: "varchar"
  })
  public description: string;

  @ManyToOne(type => Workflow)
  @JoinColumn({
    name: "workflow_id",
    referencedColumnName: "id"
  })
  public workflow: Workflow;

  @RelationId((workflowProcess: WorkflowProcess) => workflowProcess.workflow)
  public workflowId: string;
}
