import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { Policy, Role, User } from "../../../entity";
import {
  POLICY_EFFECT,
  POLICY_RESOURCES_CONSOLE,
  POLICY_RESOURCES_ENTITY,
  POLICY_TYPE,
  ROLE_NAME
} from "../../common/permissions";
import { updateEntity } from "../../common/utils/utils";
import { MutationEditRoleArgs } from "../../../graphql/generated-models";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { TYPEORM_CACHE_TTL } from "../../common/constants";

import {
  CACHE_TTL,
  ORGANIZATION_TYPES,
  StatusEnum,
  CACHING_KEYS,
  EXPIRY_MODE
} from "../../common/constants";

import {
  clearEntityCache,
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

import { UserModule } from "../user/user.module";
import { Users } from "../user/user.providers";
import Container from "typedi";
import { AccessControlRepository } from "./access-control.repository";
const userProvider = UserModule.injector.get(Users);

@Injectable()
export class AccessControls {
  public async getAllRoles(entityManager: EntityManager): Promise<Role[]> {
    return entityManager.find(Role, {
      relations: ["policies"],
      cache: TYPEORM_CACHE_TTL
    });
  }
  public async getRole(
    entityManager: EntityManager,
    id: string
  ): Promise<Role> {
    try {
      const role = await entityManager.findOneOrFail(Role, id, {
        relations: ["policies"],
        cache: TYPEORM_CACHE_TTL
      });
      return role;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.ROLE_NOT_FOUND);
    }
  }

  public async addRole(
    entityManager: EntityManager,
    input
  ): Promise<Role> {
    const { name } = input;
    const allowedRoleNames = Object.values(ROLE_NAME);
    if (!name || !allowedRoleNames.includes(name)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_ROLE_NAME);
    }
    let role = new Role();
    role = updateEntity(role, input);
    role = await entityManager.save(role);
    return role;
  }

  public async editRole(
    entityManager: EntityManager,
    { input }
  ): Promise<Role> {
    const { name = "" } = input;
    const allowedRoleNames = Object.values(ROLE_NAME);
    if (name && !allowedRoleNames.includes(name)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_ROLE_NAME);
    }

    const role = await entityManager.findOne(Role, {
      where: {
        id: input.id
      }
    });
    if (!role) {
      throw new WCoreError(WCORE_ERRORS.ROLE_NOT_FOUND);
    }

    updateEntity(role, input);
    return entityManager.save(role);
  }
  public async deleteRole(entityManager: EntityManager, id: string) {
    const role = await entityManager.findOneOrFail(Role, {
      where: {
        id
      }
    });
    return entityManager.remove(role);
  }

  public async addPolicyToRole(
    entityManager: EntityManager,
    roleId,
    input: Partial<Policy>
  ) {
    const role = await entityManager.findOneOrFail(Role, {
      where: {
        id: roleId
      },
      relations: ["policies"]
    });
    let policy = new Policy();
    policy = updateEntity(policy, input);
    policy = await entityManager.save(policy);
    policy.roles = [role];
    await clearEntityCache("user", () => {
      console.log("User Cache removed");
    });
    return entityManager.save(policy);
  }

  public async addPoliciesToRole(
    entityManager: EntityManager,
    roleId,
    inputs: Partial<Policy[]>
  ) {
    if (!roleId) {
      throw new WCoreError(WCORE_ERRORS.ROLE_ID_MANDATORY);
    }

    if (!inputs || inputs.length === 0) {
      throw new WCoreError(WCORE_ERRORS.POLICIES_MANDATORY);
    }

    const role = await entityManager.findOne(Role, {
      where: {
        id: roleId
      },
      relations: ["policies"]
    });
    if (!role) {
      throw new WCoreError(WCORE_ERRORS.ROLE_NOT_FOUND);
    }

    let policies = [];
    for (let input of inputs) {
      let policy = new Policy();
      policy = updateEntity(policy, input);
      policy.roles = [role];
      policies.push(policy);
    }
    await entityManager.save(policies);
    let updatedRole = await entityManager.findOneOrFail(Role, {
      where: {
        id: roleId
      },
      relations: ["policies"]
    });

    await clearEntityCache("user", () => {
      console.log("User Cache removed");
    });

    return updatedRole;
  }

  public async removePolicyFromRole(
    entityManager: EntityManager,
    roleId,
    policyId
  ) {
    const role = await entityManager.findOneOrFail(Role, {
      where: {
        id: roleId
      },
      relations: ["policies"]
    });

    let filteredPolicies = role.policies.filter((value, index, arr) => {
      return value.id != policyId;
    });
    role.policies = filteredPolicies;
    await clearEntityCache("user", () => {
      console.log("User Cache removed");
    });
    return await entityManager.save(role);
  }

  public async removePoliciesFromRole(
    entityManager: EntityManager,
    roleId,
    policyIds
  ) {
    if (!roleId) {
      throw new WCoreError(WCORE_ERRORS.ROLE_ID_MANDATORY);
    }

    if (!policyIds || policyIds.length === 0) {
      throw new WCoreError(WCORE_ERRORS.POLICY_IDS_MANDATORY);
    }
    const role = await entityManager.findOne(Role, {
      where: {
        id: roleId
      },
      relations: ["policies"]
    });
    if (!role) {
      throw new WCoreError(WCORE_ERRORS.ROLE_NOT_FOUND);
    }

    for (let policyId of policyIds) {
      // updating role.policies after filter
      role.policies = role.policies.filter((value, index, arr) => {
        return value.id != policyId;
      });
    }
    await clearEntityCache("user", () => {
      console.log("User Cache removed");
    });
    return await entityManager.save(role);
  }

  public async editPolicy(entitymanager, input: Partial<Policy>) {
    const policy = await entitymanager.findOneOrFail(Policy, {
      where: {
        id: input.id
      }
    });
    updateEntity(policy, input);
    await clearEntityCache("user", () => {
      console.log("User Cache removed");
    });
    return entitymanager.save(policy);
  }

  public async linkUserToRole(
    entityManager: EntityManager,
    userId: string,
    roleId: string
  ) {
    const user = await Container.get(AccessControlRepository).linkUserToRole(entityManager, userId, roleId);
    return user;
  }

  public async unlinkUserToRole(
    entityManager: EntityManager,
    userId: string,
    roleId: string
  ) {
    const user = await Container.get(AccessControlRepository).unlinkUserToRole(entityManager, userId, roleId);
    return user;
  }

  public async unlinkUsersFromRole(
    entityManager: EntityManager,
    userIds: string[],
    roleId: string
  ) {
    const users = await entityManager.findByIds(User, userIds);
    const role = await entityManager.findOne(Role, {
      where: {
        id: roleId
      },
      relations: ["users"]
    });
    for (let user of users) {
      if (role.users) {
        const keys = [`${CACHING_KEYS.USER}_${user.id}`];
        removeValueFromCache(keys);

        role.users = role.users.filter(item => {
          return item.id != user.id;
        });
      }
    }
    await entityManager.save(role);
    return users;
  }

  public async unlinkRolesFromUser(
    entityManager: EntityManager,
    userId: string,
    roleIds: string[]
  ) {
    const user = await entityManager.findOne(User, userId, {
      relations: ["roles"]
    });
    const roles = await entityManager.findByIds(Role, roleIds);

    for (let role of roles) {
      if (user.roles) {
        user.roles = user.roles.filter(item => {
          return item.id != role.id;
        });
      }
    }
    await entityManager.save(user);

    const keys = [`${CACHING_KEYS.USER}_${user.id}`];
    removeValueFromCache(keys);

    const updatedUser = await entityManager.findOne(User, userId, {
      relations: ["roles"]
    });

    return updatedUser;
  }

  public async linkUsersToRole(
    entityManager: EntityManager,
    userIds: string[],
    roleId: string
  ) {
    const users = await entityManager.findByIds(User, userIds, {
      relations: ["roles"]
    });
    const role = await entityManager.findOneOrFail(Role, {
      where: {
        id: roleId
      }
    });
    for (let user of users) {
      user.roles.push(role);
      const keys = [`${CACHING_KEYS.USER}_${user.id}`];
      removeValueFromCache(keys);
    }

    return entityManager.save(users);
  }

  public async linkRolesToUser(
    entityManager: EntityManager,
    userId: string,
    roleIds: string[]
  ) {
    const user = await entityManager.findOneOrFail(User, {
      where: {
        id: userId
      },
      relations: ["roles"]
    });
    const roles = await entityManager.findByIds(Role, roleIds, {
      relations: ["users"]
    });
    for (let role of roles) {
      role.users.push(user);
    }

    await entityManager.save(roles);

    const keys = [`${CACHING_KEYS.USER}_${user.id}`];
    removeValueFromCache(keys);

    const updatedUser = await entityManager.findOneOrFail(User, {
      where: {
        id: userId
      },
      relations: ["roles"]
    });
    return updatedUser;
  }

  public async getPermissionMap(
    entityManager: EntityManager,
    userId: string,
    resourceTypes: POLICY_TYPE[]
  ) {
    const user = await entityManager.findOneOrFail(User, userId, {
      relations: ["roles", "roles.policies"],
      cache: TYPEORM_CACHE_TTL
    });
    const permissionMap = {};
    resourceTypes.forEach(type => {
      permissionMap[type] = {};
    });
    user.roles.forEach(role => {
      role.policies.forEach(policy => {
        if (
          permissionMap[policy.type] &&
          !permissionMap[policy.type][policy.resource] &&
          policy.effect === POLICY_EFFECT.ALLOW
        ) {
          permissionMap[policy.type][policy.resource] = true;
        }
      });
    });
    return permissionMap;
  }

  public async getUserForRoles(entityManager: EntityManager, roleId: string) {
    return entityManager.query(
      "SELECT user.* FROM user_roles_role urr  INNER JOIN `user` user ON urr.userId=user.id Where urr.roleId=?",
      [roleId]
    );
  }
}
