import {
  BeforeInsert,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { EntityExtend } from "./EntityExtend";
import { WalkInBase } from "./WalkInBase";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

export class WalkInEntityExtendBase extends WalkInBase {
  @PrimaryGeneratedColumn("uuid")
  public id: string = undefined;

  @Column({
    nullable: true,
    type: "simple-json"
  })
  public extend: any;
}
