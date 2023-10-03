import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Organization } from "./Organization";
import { Communication } from "./Communication";

@Entity({ name: "communication_log" })
export class CommunicationLog extends WalkInBaseEntity {
  @ManyToOne(type => Communication)
  @JoinColumn({
    name: "communication_id",
    referencedColumnName: "id"
  })
  public communication: Communication;

  @Column({
    nullable: true,
    type: "datetime"
  })
  public startTime: Date;

  @Column({
    nullable: true,
    type: "datetime"
  })
  public endTime: Date;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public communicationStatus: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false
  })
  public runType: string;

  @Column({
    nullable: true,
    type: "simple-json"
  })
  public log: any;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public status: string;
}
