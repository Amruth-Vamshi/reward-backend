import { getConnection, getManager } from "typeorm";
import { AccessControls } from "./access-control.providers";
import { MutationEditRoleArgs } from "../../../graphql/generated-models";
import { ModuleContext, Resolvers } from "@graphql-modules/core";

const resolvers: Resolvers = {
  Role: {
    users: (role, _, { injector }: ModuleContext) =>
      getConnection().transaction(entityManager =>
        injector.get(AccessControls).getUserForRoles(entityManager, role.id)
      )
  },
  Query: {
    roles: (_, __, { injector }) =>
      getConnection().transaction(entityManager =>
        injector.get(AccessControls).getAllRoles(entityManager)
      ),

    role: (_, { id }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector.get(AccessControls).getRole(entityManager, id)
      )
  },
  Mutation: {
    addRole: (_, { input }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector.get(AccessControls).addRole(entityManager, input)
      ),
    editRole: (_, { input }: MutationEditRoleArgs, { injector }) =>
      getConnection().transaction(entityManager =>
        injector.get(AccessControls).editRole(entityManager, input)
      ),
    deleteRole: (_, { id }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector.get(AccessControls).deleteRole(entityManager, id)
      ),
    addPolicyToRole: (_, { roleId, input }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .addPolicyToRole(entityManager, roleId, input)
      ),
    addPoliciesToRole: (_, { roleId, inputs }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .addPoliciesToRole(entityManager, roleId, inputs)
      ),
    removePolicyFromRole: (_, { roleId, policyId }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .removePolicyFromRole(entityManager, roleId, policyId)
      ),
    removePoliciesFromRole: (_, { roleId, policyIds }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .removePoliciesFromRole(entityManager, roleId, policyIds)
      ),
    editPolicy: (_, { input }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector.get(AccessControls).editPolicy(entityManager, input)
      ),
    linkUserToRole: (_, { userId, roleId }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .linkUserToRole(entityManager, userId, roleId)
      ),
    linkUsersToRole: (_, { roleId, userIds }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .linkUsersToRole(entityManager, userIds, roleId)
      ),
    linkRolesToUser: (_, { roleIds, userId }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .linkRolesToUser(entityManager, userId, roleIds)
      ),
    unlinkUserToRole: (_, { userId, roleId }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .unlinkUserToRole(entityManager, userId, roleId)
      ),
    unlinkUsersFromRole: (_, { roleId, userIds }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .unlinkUsersFromRole(entityManager, userIds, roleId)
      ),
    unlinkRolesFromUser: (_, { roleIds, userId }, { injector }) =>
      getConnection().transaction(entityManager =>
        injector
          .get(AccessControls)
          .unlinkRolesFromUser(entityManager, userId, roleIds)
      )
  },
  User: {
    permissionMap: (user, { types }, { injector }: ModuleContext) =>
      getManager().transaction(transactionManager =>
        injector
          .get(AccessControls)
          .getPermissionMap(transactionManager, user.id, types)
      )
  }
};

export default resolvers;
