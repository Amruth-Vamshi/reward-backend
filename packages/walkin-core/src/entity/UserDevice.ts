import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";

import { User } from "./User";

import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";

@Entity()
export class UserDevice extends WalkInEntityExtendBase {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public fcmToken: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public deviceId: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public os: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public osVersion: string;

  @ManyToOne(type => User)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id"
  })
  public user: User;

  @Column({
    nullable: true,
    type: "boolean"
  })
  public status: boolean;
}
