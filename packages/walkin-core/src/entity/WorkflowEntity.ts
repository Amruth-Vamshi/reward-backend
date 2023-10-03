import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId
} from "typeorm";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Workflow } from "./Workflow";

@Entity({ name: "workflow_entity" })
export class WorkflowEntity extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    nullable: false,
    name: "entity_id"
  })
  public entityId: string;

  @Column({
    type: "varchar",
    nullable: false,
    name: "entity_type"
  })
  public entityType: string;

  @ManyToOne(type => Workflow)
  @JoinColumn({
    name: "workflow_id",
    referencedColumnName: "id"
  })
  public workflow: Workflow;

  @RelationId((workflowEntity: WorkflowEntity) => workflowEntity.workflow)
  public workflowId: string;
}
