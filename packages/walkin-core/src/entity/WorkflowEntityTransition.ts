import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId
} from "typeorm";

import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { WorkflowEntity } from "./WorkflowEntity";
import { WorkflowProcessTransition } from "./WorkflowProcessTransition";

@Entity({ name: "workflow_entity_transition" })
export class WorkflowEntityTransition extends WalkInBaseEntity {
  @ManyToOne(type => WorkflowEntity)
  @JoinColumn({
    name: "workflow_entity_id",
    referencedColumnName: "id"
  })
  public workflowEntity: WorkflowEntity;

  @ManyToOne(type => WorkflowProcessTransition)
  @JoinColumn({
    name: "workflow_process_transition_id",
    referencedColumnName: "id"
  })
  public workflowProcessTransition: WorkflowProcessTransition;

  @RelationId(
    (workflowEntityTransitionHistory: WorkflowEntityTransition) =>
      workflowEntityTransitionHistory.workflowProcessTransition
  )
  public workflowProcessTransitionId: string;

  @RelationId(
    (workflowEntityTransitionHistory: WorkflowEntityTransition) =>
      workflowEntityTransitionHistory.workflowEntity
  )
  public workflowEntityId: string;
}
