import { POLICY_EFFECT } from "@walkinserver/walkin-core/src/modules/common/permissions";
import passport = require("passport");

export const getUserPermission = (user, requiredPermissions) => {
  const userPermissions = mapUserPermission(user);
  let permissionCheck = true;
  requiredPermissions.forEach(requiredPermission => {
    if (userPermissions[requiredPermission.resource]) {
      if (
        !userPermissions[requiredPermission.resource].includes(
          requiredPermission.permission
        )
      ) {
        permissionCheck = false;
      }
    } else {
      permissionCheck = false;
    }
  });
  return permissionCheck;
};

export const mapUserPermission = user => {
  const userPermissionMap = {};
  user.roles.forEach(role => {
    role.policies.forEach(policy => {
      if (userPermissionMap[policy.resource]) {
        userPermissionMap[policy.resource] = mapUserPermissions(
          userPermissionMap[policy.resource],
          policy
        );
      } else {
        userPermissionMap[policy.resource] = mapUserPermissions({}, policy);
      }
    });
  });

  const filteredMap = {};

  for (const entityType in userPermissionMap) {
    if (userPermissionMap.hasOwnProperty(entityType)) {
      const permissionObj = userPermissionMap[entityType];
      const permittedActionsArray = [];
      for (const permittedAction in permissionObj) {
        if (permissionObj.hasOwnProperty(permittedAction)) {
          const isPermitted =
            permissionObj[permittedAction] === POLICY_EFFECT.ALLOW;
          if (isPermitted) {
            permittedActionsArray.push(permittedAction);
          }
        }
      }

      filteredMap[entityType] = permittedActionsArray;
    }
  }

  return filteredMap;
};

export const mapUserPermissions = (permissions, policy) => {
  permissions[policy.permission] = permissions[policy.permission]
    ? permissions[policy.permission]
    : POLICY_EFFECT.ALLOW;
  permissions[policy.permission] =
    permissions[policy.permission] === POLICY_EFFECT.DENY
      ? POLICY_EFFECT.DENY
      : policy.effect;
  return permissions;
};

export const getUserDetails = (req, res, cb) => {
  passport.authenticate("jwt", (err, loginData, errInfo) => {
    if (err) {
      cb(err);
    } else if (!loginData) {
      cb(errInfo);
    } else {
      cb(null, loginData);
    }
  })(req, res);
};
