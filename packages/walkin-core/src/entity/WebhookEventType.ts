import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Organization } from "./Organization";

@Entity({ name: "webhook_event_type" })
@Unique(["event", "organization"])
export class WebhookEventType extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar"
  })
  public event: string = "";

  @Column({
    type: "varchar"
  })
  public description: string = "";

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status: string = "";

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
