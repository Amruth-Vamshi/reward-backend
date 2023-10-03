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

export class WalkInBaseEntity extends WalkInBase {
  @PrimaryGeneratedColumn()
  public id: string = undefined;
}
