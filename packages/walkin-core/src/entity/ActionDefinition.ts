import { Column, Entity, JoinColumn, RelationId, ManyToOne } from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity()
export class ActionDefinition extends WalkInBaseEntity {
  @Column({
    nullable: true,
    type: "varchar",
    unique: true
  })
  public name: string;

  @Column({
    nullable: true,
    type: "varchar",
    name: "type"
  })
  public type: string = "";

  @Column({
    nullable: true,
    type: "simple-json",
    name: "configuration"
  })
  public configuration: any;

  @Column({
    nullable: true,
    type: "text",
    name: "code"
  })
  public code: string;

  @Column({
    nullable: true,
    type: "simple-json",
    name: "input_schema"
  })
  public inputSchema: any;

  @Column({
    nullable: true,
    type: "simple-json",
    name: "output_schema"
  })
  public outputSchema: any;

  @Column({
    nullable: true,
    type: "varchar"
    // enum: Object.values(STATUS),
    // default: STATUS.ACTIVE
  })
  public status: string;

  @ManyToOne(() => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @RelationId(
    (actionDefinition: ActionDefinition) => actionDefinition.organization
  )
  // tslint:disable-next-line: variable-name
  public organization_id: string;
}
