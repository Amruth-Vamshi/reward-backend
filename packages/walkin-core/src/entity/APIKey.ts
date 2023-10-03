import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne
} from "typeorm";
import {
  ENVIRONMENT_TYPES,
  STATUS,
  StatusEnum
} from "../modules/common/constants";
import { Application } from "./Application";
import { Role } from "./Role";
import { User } from "./User";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";

@Entity()
export class APIKey extends WalkInEntityExtendBase {
  @Column({
    nullable: false,
    default: ENVIRONMENT_TYPES.DEVELOPMENT,
    type: "varchar"
  })
  public environment: string;

  @Column({
    nullable: false,
    default: STATUS.ACTIVE,
    type: "varchar"
  })
  public status: StatusEnum;

  @ManyToOne(() => Application, application => application.apiKeys)
  @JoinColumn()
  public application: Application;

  @ManyToOne(() => User, user => user.apiKeysGenerated)
  @JoinColumn()
  public generatedBy;

  @ManyToMany(() => Role, role => role.apiKeys)
  @JoinTable()
  public roles: Role[];
}
