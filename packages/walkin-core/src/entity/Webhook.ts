import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { WEBHOOK_TYPE } from "../modules/common/constants";
import { Application } from "./Application";
import { EventType } from "./EventType";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "webhook" })
export class Webhook extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar"
  })
  public event: string = "";

  @Column({
    nullable: false,
    type: "varchar"
  })
  public name: string = "";

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public method: string = "";

  @Column({
    nullable: false,
    type: "varchar"
  })
  public url: string = "";

  @Column({
    nullable: false,
    type: "simple-json"
  })
  public headers: any = "";

  @Column({
    nullable: false,
    type: "boolean"
  })
  public enabled: boolean = true;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status: string = "";

  @Column({
    nullable: false,
    name: "webhook_type",
    type: "varchar",
    enum: WEBHOOK_TYPE
  })
  public webhookType;
}
