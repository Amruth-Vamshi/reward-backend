import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../../__tests__/utils/unit";
import { WCoreEntities } from "../../../../index";
import { getConnection, getManager } from "typeorm";
import { User, Policy, Role } from "../../../../entity";
import { AccessControlModule } from "../access-control.module";
import { AccessControls } from "../access-control.providers";
import { Chance } from "chance";
import {
  POLICY_TYPE,
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_CONSOLE,
  POLICY_ACCESS_LEVEL,
  POLICY_EFFECT,
  POLICY_PERMISSION_CONSOLE
} from "../../../common/permissions";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { UserModule } from "../../user/user.module";
import { Users } from "../../user/user.providers";
import { access } from "fs";
import { CACHING_KEYS } from "../../../common/constants";
import { getValueFromCache } from "../../../common/utils/redisUtils";
let user: User;
const accessControlProvider = AccessControlModule.injector.get(AccessControls);
const userProvider = UserModule.injector.get(Users);

const chance = new Chance();
beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("addPolicyToRole", () => {
  test("should add a single policy to role", async () => {
    const manager = getManager();
    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);
    let policy: any = {};
    policy.type = POLICY_TYPE.ENTITY;
    policy.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy
    );

    const savedRole = await accessControlProvider.getRole(manager, role.id);
    expect(savedRole.policies[0].id).toBe(policy.id);
  });
  test("should add multiple policies to role", async () => {
    const manager = getManager();
    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);
    let policy1: any = {};
    policy1.type = POLICY_TYPE.ENTITY;
    policy1.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy1.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy1 = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy1
    );
    let policy2: any = {};
    policy2.type = POLICY_TYPE.ENTITY;
    policy2.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy2.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy2 = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy2
    );
    let policy3: any = {};
    policy3.type = POLICY_TYPE.ENTITY;
    policy3.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy3.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy3 = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy3
    );
    const savedRole = await accessControlProvider.getRole(manager, role.id);

    expect(savedRole.policies[0].id).toBe(policy1.id);
    expect(savedRole.policies[1].id).toBe(policy2.id);
    expect(savedRole.policies[2].id).toBe(policy3.id);
  });
  test.skip("should throw an error while add a duplicate policy to role", async () => {
    const manager = getManager();
    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);
    let policy: any = {};
    policy.type = POLICY_TYPE.ENTITY;
    policy.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    const savedPolicy1 = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy
    );
    const savedPolicy2 = accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy
    );

    expect(savedPolicy2).toThrow(
      new WCoreError(WCORE_ERRORS.POLICY_ALREADY_PRESENT)
    );
  });
});
describe("addRole", () => {
  test("should add a role", async () => {
    const manager = getManager();
    const role: any = {};
    role.name = chance.string({
      length: 5
    });
    role.description = chance.string({
      length: 5
    });
    const savedRole = await accessControlProvider.addRole(manager, role);
    expect(savedRole.name).toBe(role.name);
    expect(savedRole.id).toBeDefined();
  });
  test("should add a tags with role", async () => {
    const manager = getManager();
    const role: any = {};
    role.name = chance.string({
      length: 5
    });
    const tags = [
      chance.string({
        length: 5
      }),
      chance.string({
        length: 5
      }),
      chance.string({
        length: 5
      })
    ];
    role.tags = tags;
    const savedRole = await accessControlProvider.addRole(manager, role);
    expect(savedRole.name).toBe(role.name);
    expect(savedRole.tags).toHaveLength(3);
    expect(savedRole.tags[0]).toBe(tags[0]);
    expect(savedRole.tags[1]).toBe(tags[1]);
    expect(savedRole.tags[2]).toBe(tags[2]);
  });
  test("should add a role", async () => {
    const manager = getManager();
    const role: any = {};
    role.name = chance.string({
      length: 5
    });
    role.description = chance.string({
      length: 5
    });
    const savedRole = await accessControlProvider.addRole(manager, role);
    expect(savedRole.name).toBe(role.name);
    expect(savedRole.id).toBeDefined();
  });
});
describe("deleteRole", () => {
  test("should delete a role", async () => {
    const manager = getManager();
    const role: any = {};
    role.name = chance.string({
      length: 5
    });
    role.description = chance.string({
      length: 5
    });
    const savedRole = await accessControlProvider.addRole(manager, role);

    const deletedRole = await accessControlProvider.deleteRole(
      manager,
      savedRole.id
    );
    expect(deletedRole.name).toBe(role.name);
    expect(deletedRole.id).toBeUndefined();
  });
  test("should not find a deleted role", async () => {
    const manager = getManager();
    const role: any = {};
    role.name = chance.string({
      length: 5
    });
    role.description = chance.string({
      length: 5
    });
    const savedRole = await accessControlProvider.addRole(manager, role);

    const deletedRole = await accessControlProvider.deleteRole(
      manager,
      savedRole.id
    );
    const roleFound = accessControlProvider.getRole(manager, savedRole.id);
    expect(roleFound).rejects.toThrow(
      new WCoreError(WCORE_ERRORS.ROLE_NOT_FOUND)
    );
  });
  test("should not delete a deleted role", async () => {
    const manager = getManager();
    const role: any = {};
    role.name = chance.string({
      length: 5
    });
    role.description = chance.string({
      length: 5
    });
    const savedRole = await accessControlProvider.addRole(manager, role);

    const deletedRole = await accessControlProvider.deleteRole(
      manager,
      savedRole.id
    );
    const roleFound = accessControlProvider.getRole(manager, savedRole.id);
    expect(roleFound).rejects.toThrow(
      new WCoreError(WCORE_ERRORS.ROLE_NOT_FOUND)
    );
  });
});
describe("editPolicy", () => {
  test("should edit a policy", async () => {
    const manager = getManager();
    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);
    const policy: any = {};
    policy.accessLevel = POLICY_ACCESS_LEVEL.OWN;
    policy.effect = POLICY_EFFECT.ALLOW;
    policy.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy.type = POLICY_TYPE.ENTITY;
    const createdPolicy = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy
    );
    expect(createdPolicy.id).toBeDefined();
    expect(createdPolicy.accessLevel).toBe(policy.accessLevel);
    expect(createdPolicy.effect).toBe(policy.effect);
    expect(createdPolicy.permission).toBe(policy.permission);
    expect(createdPolicy.resource).toBe(policy.resource);
    expect(createdPolicy.type).toBe(policy.type);
    const modifyPolicy = createdPolicy;
    modifyPolicy.effect = POLICY_EFFECT.DENY;
    modifyPolicy.accessLevel = POLICY_ACCESS_LEVEL.OWN;
    modifyPolicy.permission = POLICY_PERMISSION_CONSOLE.MODIFY;
    modifyPolicy.resource = POLICY_RESOURCES_CONSOLE.DOWNLOAD_CUSTOMERS;
    modifyPolicy.type = POLICY_TYPE.UI;
    const modifiedPolicy = await accessControlProvider.editPolicy(
      manager,
      modifyPolicy
    );
    expect(modifiedPolicy.id).toBe(createdPolicy.id);
    expect(modifiedPolicy.accessLevel).toBe(modifyPolicy.accessLevel);
    expect(modifiedPolicy.effect).toBe(modifyPolicy.effect);
    expect(modifiedPolicy.permission).toBe(modifyPolicy.permission);
    expect(modifiedPolicy.resource).toBe(modifyPolicy.resource);
    expect(modifiedPolicy.type).toBe(modifyPolicy.type);
  });
});
describe("getAllRole", () => {
  test("should get all role", async () => {
    const manager = getManager();
    const roles: Role[] = [];
    for (let i = 0; i < 5; i++) {
      let role: any = {};
      role.name = chance.string({
        length: 5
      });
      role = await accessControlProvider.addRole(manager, role);
      const policy: any = {};
      policy.accessLevel = POLICY_ACCESS_LEVEL.OWN;
      policy.effect = POLICY_EFFECT.ALLOW;
      policy.permission = POLICY_PERMISSION_ENTITY.CREATE;
      policy.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
      policy.type = POLICY_TYPE.ENTITY;
      const createdPolicy = await accessControlProvider.addPolicyToRole(
        manager,
        role.id,
        policy
      );
      roles.push(role);
    }
    const allRoles = await accessControlProvider.getAllRoles(manager);
    roles.forEach(role => {
      expect(allRoles).toEqual(
        expect.arrayContaining([expect.objectContaining(role)])
      );
    });
  });
});
describe("getPermissionMap", () => {
  test("should get PermissionMap", async () => {
    const manager = getManager();

    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);
    const policy: any = {};
    policy.accessLevel = POLICY_ACCESS_LEVEL.OWN;
    policy.effect = POLICY_EFFECT.ALLOW;
    policy.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy.type = POLICY_TYPE.ENTITY;
    const createdPolicy = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy
    );

    const newUser = await userProvider.createUser(manager, {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });
    const linkedUser = await accessControlProvider.linkUserToRole(
      manager,
      newUser.id,
      role.id
    );
    const permissionMap = await accessControlProvider.getPermissionMap(
      manager,
      newUser.id,
      [POLICY_TYPE.ENTITY]
    );
    expect(permissionMap[POLICY_TYPE.ENTITY]).toHaveProperty(
      POLICY_RESOURCES_ENTITY.APPLICATION
    );
    expect(
      permissionMap[POLICY_TYPE.ENTITY][POLICY_RESOURCES_ENTITY.APPLICATION]
    ).toBe(true);
  });
});
describe("getRole", () => {
  test("should get Role", async () => {
    const manager = getManager();

    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);
    const policy: any = {};
    policy.accessLevel = POLICY_ACCESS_LEVEL.OWN;
    policy.effect = POLICY_EFFECT.ALLOW;
    policy.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy.type = POLICY_TYPE.ENTITY;
    const fetchedRole = await accessControlProvider.getRole(manager, role.id);
    expect(fetchedRole.id).toBeDefined();
    expect(fetchedRole.name).toBe(role.name);
  });
  test("should not get Role", async () => {
    const manager = getManager();

    const fetchedRole = accessControlProvider.getRole(
      manager,
      chance.string({ length: 7 })
    );
    await expect(fetchedRole).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.ROLE_NOT_FOUND)
    );
  });
});
describe("linkUserToRole", () => {
  test("should link User To Role", async () => {
    const manager = getManager();

    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);
    const policy: any = {};
    policy.accessLevel = POLICY_ACCESS_LEVEL.OWN;
    policy.effect = POLICY_EFFECT.ALLOW;
    policy.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy.type = POLICY_TYPE.ENTITY;
    const createdPolicy = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy
    );

    const newUser = await userProvider.createUser(manager, {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });
    const linkedUser = await accessControlProvider.linkUserToRole(
      manager,
      newUser.id,
      role.id
    );

    const key = `${CACHING_KEYS.USER}_${linkedUser.id}`;
    const cacheValue = await getValueFromCache(key);

    expect(cacheValue).toBeNull();

    const fetchedUser = await userProvider.getUserById(manager, newUser.id);
    fetchedUser.roles.forEach(fetchedRole => {
      expect(fetchedUser.roles).toEqual(
        expect.arrayContaining([expect.objectContaining(fetchedRole)])
      );
    });
  });

  test("should link Users To Role", async () => {
    const manager = getManager();

    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);

    const newUser = await userProvider.createUser(manager, {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });

    const newUser2 = await userProvider.createUser(manager, {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });

    const newUser3 = await userProvider.createUser(manager, {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });

    const newUser4 = await userProvider.createUser(manager, {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });

    const key = `${CACHING_KEYS.USER}_${newUser4.id}`;
    const cacheValue = await getValueFromCache(key);

    expect(cacheValue).toBeNull();

    const linkedUser = await accessControlProvider.linkUsersToRole(
      manager,
      [newUser.id, newUser2.id, newUser3.id, newUser4.id],
      role.id
    );
    const fetchedUser = await userProvider.getUserById(manager, newUser.id);
    fetchedUser.roles.forEach(fetchedRole => {
      expect(fetchedUser.roles).toEqual(
        expect.arrayContaining([expect.objectContaining(fetchedRole)])
      );
    });

    const fetchedUser2 = await userProvider.getUserById(manager, newUser2.id);
    fetchedUser2.roles.forEach(fetchedRole => {
      expect(fetchedUser.roles).toEqual(
        expect.arrayContaining([expect.objectContaining(fetchedRole)])
      );
    });
    const fetchedUser3 = await userProvider.getUserById(manager, newUser3.id);
    fetchedUser3.roles.forEach(fetchedRole => {
      expect(fetchedUser.roles).toEqual(
        expect.arrayContaining([expect.objectContaining(fetchedRole)])
      );
    });

    const fetchedUser4 = await userProvider.getUserById(manager, newUser4.id);
    fetchedUser4.roles.forEach(fetchedRole => {
      expect(fetchedUser.roles).toEqual(
        expect.arrayContaining([expect.objectContaining(fetchedRole)])
      );
    });
  });

  test("should link Roles To User", async () => {
    const manager = getManager();

    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);

    let role1: any = {};
    role1.name = chance.string({
      length: 5
    });
    role1 = await accessControlProvider.addRole(manager, role1);

    let role2: any = {};
    role2.name = chance.string({
      length: 5
    });
    role2 = await accessControlProvider.addRole(manager, role2);

    const newUser = await userProvider.createUser(manager, {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });
    const linkedUser = await accessControlProvider.linkRolesToUser(
      manager,
      newUser.id,
      [role.id, role1.id, role2.id]
    );
    expect(linkedUser).toBeDefined();
    expect(linkedUser.roles).toBeDefined();
    expect(linkedUser.roles).toHaveLength(3);

    const fetchedUser = await userProvider.getUserById(manager, newUser.id);
    fetchedUser.roles.forEach(fetchedRole => {
      expect(fetchedUser.roles).toEqual(
        expect.arrayContaining([expect.objectContaining(fetchedRole)])
      );
    });
  });
  test("should unlink User To Role", async () => {
    const manager = getManager();

    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);
    const policy: any = {};
    policy.accessLevel = POLICY_ACCESS_LEVEL.OWN;
    policy.effect = POLICY_EFFECT.ALLOW;
    policy.permission = POLICY_PERMISSION_ENTITY.CREATE;
    policy.resource = POLICY_RESOURCES_ENTITY.APPLICATION;
    policy.type = POLICY_TYPE.ENTITY;
    const createdPolicy = await accessControlProvider.addPolicyToRole(
      manager,
      role.id,
      policy
    );

    const newUser = await userProvider.createUser(manager, {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });
    const linkedUser = await accessControlProvider.linkUserToRole(
      manager,
      newUser.id,
      role.id
    );

    const unlinkUserToRole = await accessControlProvider.unlinkUserToRole(
      manager,
      newUser.id,
      role.id
    );

    const key = `${CACHING_KEYS.USER}_${newUser.id}`;
    const cacheValue = await getValueFromCache(key);

    expect(cacheValue).toBeNull();

    expect(linkedUser).toBeDefined();
    expect(linkedUser.roles).toBeDefined();
    expect(unlinkUserToRole).toBeDefined();
  });

  test("should unlink Roles from User", async () => {
    const manager = getManager();

    let role: any = {};
    role.name = chance.string({
      length: 5
    });
    role = await accessControlProvider.addRole(manager, role);

    let role1: any = {};
    role1.name = chance.string({
      length: 5
    });
    role1 = await accessControlProvider.addRole(manager, role1);

    let role2: any = {};
    role2.name = chance.string({
      length: 5
    });
    role2 = await accessControlProvider.addRole(manager, role2);

    const newUser = await userProvider.createUser(manager, {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: chance.email({ length: 5 }),
      password: chance.string({ length: 5 })
    });
    const linkedUser = await accessControlProvider.linkRolesToUser(
      manager,
      newUser.id,
      [role.id, role1.id, role2.id]
    );

    const unlinkRolesFromUser = await accessControlProvider.unlinkRolesFromUser(
      manager,
      newUser.id,
      [role.id, role1.id]
    );

    const key = `${CACHING_KEYS.USER}_${newUser.id}`;
    const cacheValue = await getValueFromCache(key);

    expect(cacheValue).toBeNull();

    expect(linkedUser).toBeDefined();

    expect(linkedUser.roles).toBeDefined();

    expect(unlinkRolesFromUser.roles).toBeDefined();
    const fetchedUser = await userProvider.getUserById(manager, newUser.id);
    fetchedUser.roles.forEach(fetchedRole => {
      expect(fetchedUser.roles).toEqual(
        expect.arrayContaining([expect.objectContaining(fetchedRole)])
      );
    });
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
