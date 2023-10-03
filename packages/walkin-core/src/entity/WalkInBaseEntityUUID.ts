import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { WalkInBase } from "./WalkInBase";

export class WalkInBaseEntityUUID extends WalkInBase {
  @PrimaryGeneratedColumn("uuid")
  public id: string;
}
