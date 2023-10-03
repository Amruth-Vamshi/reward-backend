import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLObjectType,
  GraphQLInterfaceType
} from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import passport from "passport";
import { promisify } from "util";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import {
  POLICY_PERMISSION_ENTITY,
  POLICY_EFFECT
} from "../../common/permissions";
export class AuthDirective extends SchemaDirectiveVisitor {
  public authenticateJWT = promisify(this.authenticateJWTCallback);

  public visitFieldDefinition(
    field: GraphQLField<any, any>,
    details: {
      objectType: GraphQLObjectType | GraphQLInterfaceType;
    }
  ): GraphQLField<any, any> | void | null {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args) => {
      const permittedArgs = await this.processAuthPermission(
        args,
        this.args.requires
      );

      if (permittedArgs) {
        return resolve.apply(this, permittedArgs);
      } else {
        throw new WCoreError(WCORE_ERRORS.UNAUTHORIZED);
      }
    };
  }

  public async processAuthPermission(args, requiredPermissions) {
    // Get the required Role from the field first, falling back
    // to the objectType if no Role is required by the field:
    const context = args[2];
    const operation = args[3];
    try {
      let req: any;
      let res: any;
      if (context.session) {
        ({ req, res } = context.session);
      } else if (operation.session) {
        ({ req, res } = operation.session);
      } else {
        throw new WCoreError(WCORE_ERRORS.INVALID_SESSION);
      }
      const { user, apiKey } = (await this.authenticateJWT(req, res)) as any;
      const jwt = req.headers.authorization.split(" ")[1];
      args[0] = {
        user: user ? user : null,
        application: apiKey ? apiKey.application : null,
        apiKey: apiKey ? apiKey : null,
        jwt
      };

      if (!requiredPermissions || requiredPermissions.length < 1) {
        return args;
      }
      if (user) {
        const permitted = await this.checkPermissions(
          user,
          operation,
          requiredPermissions
        );
        if (permitted) {
          return args;
        } else {
          return false;
        }
      } else if (apiKey) {
        const permitted = await this.checkPermissions(
          apiKey,
          operation,
          requiredPermissions
        );
        if (permitted) {
          return args;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error - UNAUTHORIZED", error);
      throw new WCoreError(WCORE_ERRORS.UNAUTHORIZED);
    }
  }

  public checkPermissions(user, operation, requiredPermissions) {
    // TODO: Save the maps in a redis Cache
    // const requiredRoleMapObject = this.mapResources(requiredRoles);
    const userPermissions = this.mapUserPermission(user);
    requiredPermissions.forEach(requiredPermission => {
      if (userPermissions[requiredPermission.resource]) {
        if (
          requiredPermission.permission === POLICY_PERMISSION_ENTITY.CREATE &&
          userPermissions[requiredPermission.resource] !==
            POLICY_PERMISSION_ENTITY.CREATE
        ) {
          throw new WCoreError(WCORE_ERRORS.UNAUTHORIZED);
        }
      } else {
        throw new WCoreError(WCORE_ERRORS.UNAUTHORIZED);
      }
    });
    return true;
  }

  public mapUserPermission(user) {
    // Example userPermissionMap object
    //  {
    //  RESOURCE_NAME:["WRITE","READ"]
    //
    // }
    const userPermissionMap = {};
    user.roles.forEach(role => {
      role.policies.forEach(policy => {
        if (userPermissionMap[policy.resource]) {
          userPermissionMap[policy.resource] = this.mapUserPermissions(
            userPermissionMap[policy.resource],
            policy
          );
        } else {
          userPermissionMap[policy.resource] = this.mapUserPermissions(
            {},
            policy
          );
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

  public mapUserPermissions(permissions, policy) {
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

  public authenticateJWTCallback(req, res, cb) {
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
}

export class DeprecatedDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = () => {
      field.isDeprecated = true;
      throw new WCoreError(WCORE_ERRORS.API_CURRENTLY_NOT_ENABLED);
    };
  }
}
