import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  Unique
} from "typeorm";
import { Organization } from "./Organization";
import { Rule } from "./Rule";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Workflow } from "./Workflow";

@Entity()
export class WorkflowRoute extends WalkInBaseEntity {
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

  @RelationId((workflowRoute: WorkflowRoute) => workflowRoute.workflow)
  public workflowId: string;

  @ManyToOne(type => Rule)
  @JoinColumn({
    name: "rule_id",
    referencedColumnName: "id"
  })
  public rule: Rule;

  @RelationId((workflowRoute: WorkflowRoute) => workflowRoute.rule)
  public ruleId: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @RelationId((workflowRoute: WorkflowRoute) => workflowRoute.organization)
  public organizationId: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status: string = "";

  @Column({
    nullable: true,
    type: "int"
  })
  public priority: number;

}
