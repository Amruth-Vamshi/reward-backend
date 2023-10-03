import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Application } from "./Application";
import { EventType } from "./EventType";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Webhook } from "./Webhook";

@Entity({ name: "webhook_data" })
export class WebhookEventData extends WalkInBaseEntity {
  @ManyToOne(type => Webhook)
  @JoinColumn({
    name: "webhook_id",
    referencedColumnName: "id"
  })
  public webhook: Webhook;

  @Column({
    name: "data",
    nullable: false,
    type: "simple-json"
  })
  public data: any = "";

  @Column({
    name: "response",
    nullable: true,
    type: "text"
  })
  public webhookResponse: any = "";

  @Column({
    name: "http_status",
    nullable: false,
    type: "varchar"
  })
  public httpStatus: string = "";
}
