import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import passport from "passport";
import { promisify } from "util";
import {
  POLICY_PERMISSION_ENTITY,
  POLICY_EFFECT
} from "../../common/permissions";
import {
  fetchApiRequiredPermissions,
  REST_API_REQUIRED_PERMISSIONS
} from "../../common/constants/rest-permissions";

function authenticateJWTCallback(req, res, cb) {
  passport.authenticate("jwt", (err, loginData, errInfo) => {
    if (err) {
      cb(err);
    } else if (!loginData) {
      cb(errInfo);
    } else {
      cb(null, loginData);
    }
  })(req, res);
}

const authenticateJWT = promisify(authenticateJWTCallback);

async function processAuthPermission(req, res, requiredPermissions) {
  // Get the required Role from the field first, falling back
  // to the objectType if no Role is required by the field:
  try {
    const { user, apiKey } = (await authenticateJWT(req, res)) as any;
    const jwt = req.headers.authorization.split(" ")[1];
    req.user = user ? user : null;
    req.application = apiKey ? apiKey.application : null;
    req.jwt = jwt;

    if (!requiredPermissions || requiredPermissions.length < 1) {
      return true;
    }
    if (user) {
      const permitted = await checkPermissions(user, requiredPermissions);
      if (permitted) {
        return true;
      } else {
        return false;
      }
    } else if (apiKey) {
      const permitted = await checkPermissions(apiKey, requiredPermissions);
      if (permitted) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    throw new WCoreError(WCORE_ERRORS.UNAUTHORIZED);
  }
}

function checkPermissions(user, requiredPermissions) {
  // TODO: Save the maps in a redis Cache
  const userPermissions = fetchUserPermissionForResources(user);
  requiredPermissions.forEach(requiredPermission => {
    if (
      !userPermissions[requiredPermission.resource].includes(
        requiredPermission.permission
      )
    ) {
      throw new WCoreError(WCORE_ERRORS.UNAUTHORIZED);
    }
  });
  return true;
}

function fetchUserPermissionForResources(user) {
  // Example userPermissionMap object
  //  {
  //  RESOURCE_NAME:["WRITE","READ"]
  //
  // }
  const userPermissionMap = {};
  user.roles.forEach(role => {
    role.policies.forEach(policy => {
      if (policy.effect === POLICY_EFFECT.ALLOW) {
        if (userPermissionMap[policy.resource]) {
          userPermissionMap[policy.resource].push(policy.permission);
        } else {
          userPermissionMap[policy.resource] = [policy.permission];
        }
      }
    });
  });
  return userPermissionMap;
}

function mapUserPermission(user) {
  // Example userPermissionMap object
  //  {
  //  RESOURCE_NAME:["WRITE","READ"]
  //
  // }
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

      filteredMap[entityType] = permittedActionsArray.includes(
        POLICY_PERMISSION_ENTITY.CREATE
      )
        ? POLICY_PERMISSION_ENTITY.CREATE
        : POLICY_PERMISSION_ENTITY.READ;
    }
  }

  return filteredMap;
}

function mapUserPermissions(permissions, policy) {
  // TODO : Handle conflicts better
  permissions[policy.permission] = permissions[policy.permission]
    ? permissions[policy.permission]
    : POLICY_EFFECT.ALLOW;
  permissions[policy.permission] =
    permissions[policy.permission] === POLICY_EFFECT.DENY
      ? POLICY_EFFECT.DENY
      : policy.effect;
  return permissions;
}

const authMiddleware = async (req, res, next) => {
  try {
    let requires = REST_API_REQUIRED_PERMISSIONS[req.url];
    if (!requires) {
      requires = await fetchApiRequiredPermissions(req.url);
    }
    const permittedArgs = await processAuthPermission(req, res, requires);
    if (permittedArgs) {
      next();
    } else {
      throw new WCoreError(WCORE_ERRORS.UNAUTHORIZED);
    }
  } catch (e) {
    next(e);
  }
};

export default authMiddleware;
