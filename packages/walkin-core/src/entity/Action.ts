import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToMany
} from "typeorm";
import { ActionDefinition } from "./ActionDefinition";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { EventSubscription } from "./EventSubscription";

@Entity()
export class Action extends WalkInBaseEntity {
  @ManyToOne(() => ActionDefinition)
  @JoinColumn({
    name: "action_definition_id",
    referencedColumnName: "id"
  })
  public actionDefinition: ActionDefinition;

  @RelationId((actions: Action) => actions.actionDefinition)
  public actionDefinitionId: ActionDefinition;

  @ManyToOne(() => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @RelationId((actions: Action) => actions.organization)
  // tslint:disable-next-line: variable-name
  public organization_id: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public status: string;

  @Column({
    nullable: true,
    type: "varchar",
    name: "request"
  })
  public request: string;

  // Actual event data
  @Column({
    nullable: true,
    type: "simple-json",
    name: "response"
  })
  public response: any;

  @OneToMany(
    () => EventSubscription,
    eventSubscription => eventSubscription.customAction
  )
  public customEventTriggers: EventSubscription[];
}
