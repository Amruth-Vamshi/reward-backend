import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany
} from "typeorm";
import { EnumStatus, STATUS } from "../modules/common/constants";
import { APIKey } from "./APIKey";
import { Campaign } from "../../../walkin-rewardx/src/entity/Campaign";
import { Member } from "./Member";
import { Organization } from "./Organization";
import { Role } from "./Role";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";
import { Store } from "./Store";

@Entity()
export class User extends WalkInEntityExtendBase {
  @Column("varchar", {
    nullable: true,
    name: "email"
  })
  public email: string;

  @Column("varchar", {
    nullable: true,
    name: "userName"
  })
  public userName: string;

  @Column("varchar", {
    nullable: true
  })
  public firstName: string;

  @Column("varchar", {
    nullable: true
  })
  public lastName: string;

  @Column("varchar", {
    nullable: false,
    length: 1000,
    name: "password"
  })
  public password: string;

  @Column("varchar", {
    nullable: true,
    length: 100,
    default: STATUS.ACTIVE,
    name: "status"
  })
  public status: string;

  @Column({
    name: "email_confirmed",
    nullable: true,
    type: "boolean",
    default: false
  })
  public emailConfirmed: boolean;

  @Column({
    name: "default_password_reset",
    nullable: true,
    type: "boolean",
    default: false
  })
  public defaultPasswordReset: boolean;

  @Column("varchar", {
    name: "reset_code",
    nullable: true,
    default: null
  })
  public resetCode: string;

  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  public roles: Role[];

  @ManyToOne(() => Organization, organization => organization.users)
  public organization: Organization;

  @OneToMany(() => APIKey, apiKey => apiKey.generatedBy)
  public apiKeysGenerated: APIKey[];

  @OneToMany(() => Campaign, campaign => campaign.owner)
  public createdCampaigns: Campaign[];
}
