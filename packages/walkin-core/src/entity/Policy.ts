import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import {
  POLICY_TYPE,
  POLICY_EFFECT,
  POLICY_ACCESS_LEVEL,
  POLICY_RESOURCES_CONSOLE,
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY,
  POLICY_PERMISSION_CONSOLE
} from "../modules/common/permissions";
import { Role } from "./Role";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity()
export class Policy extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    default: POLICY_EFFECT.ALLOW
  })
  public effect: POLICY_EFFECT;

  /*
   * resource is an ENUM of the resources mentioned in /common/permissions
   */
  @Column({
    type: "varchar"
  })
  public type: POLICY_TYPE;

  /*
   * resource is an ENUM of the resources mentioned in /common/permissions
   */
  @Column({
    type: "varchar",
    default: POLICY_ACCESS_LEVEL.OWN
  })
  public accessLevel: POLICY_ACCESS_LEVEL;

  /*
   * resource is an ENUM of the resources mentioned in /common/permissions
   */
  @Column({
    type: "varchar"
  })
  public resource: POLICY_RESOURCES_CONSOLE | POLICY_RESOURCES_ENTITY;

  /*
   * resource is an ENUM of the resources mentioned in /common/permissions
   */
  @Column({
    type: "varchar"
  })
  public permission: POLICY_PERMISSION_CONSOLE | POLICY_PERMISSION_ENTITY;

  @ManyToMany(() => Role, role => role.policies)
  public roles: Role[];
}
