import { type } from "os";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { Application } from "./Application";
import { Organization } from "./Organization";
import { Role } from "./Role";
import { User } from "./User";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity()
export class Member extends WalkInBaseEntity {
  @Column("varchar")
  public applicationId: string;

  @ManyToOne(() => Application, application => application.members)
  @JoinColumn({ name: "applicationId" })
  public application: Application;

  @Column({
    type: "varchar"
  })
  public Role: string;
}
