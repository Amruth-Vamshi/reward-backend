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
import { WorkflowProcess } from "./WorkflowProcess";
import { WorkflowState } from "./WorkflowState";

@Entity({ name: "workflow_process_transition" })
@Unique(["name", "workflowProcess"])
export class WorkflowProcessTransition extends WalkInBaseEntity {
  @Column({
    type: "varchar"
  })
  public name: string;

  @Column({
    type: "varchar",
    name: "rule_config"
  })
  public ruleConfig: string;

  @ManyToOne(type => WorkflowState)
  @JoinColumn({
    name: "pickup_state_id",
    referencedColumnName: "id"
  })
  public pickupState: WorkflowState;

  @ManyToOne(type => WorkflowState)
  @JoinColumn({
    name: "drop_state_id",
    referencedColumnName: "id"
  })
  public dropState: WorkflowState;

  @ManyToOne(type => WorkflowProcess)
  @JoinColumn({
    name: "workflow_process_id",
    referencedColumnName: "id"
  })
  public workflowProcess: WorkflowProcess;

  @RelationId(
    (workflowProcessTransition: WorkflowProcessTransition) =>
      workflowProcessTransition.workflowProcess
  )
  public workflowProcessId: string;

  @RelationId(
    (workflowProcessTransition: WorkflowProcessTransition) =>
      workflowProcessTransition.pickupState
  )
  public pickupStateId: string;

  @RelationId(
    (workflowProcessTransition: WorkflowProcessTransition) =>
      workflowProcessTransition.dropState
  )
  public dropStateId: string;
}
